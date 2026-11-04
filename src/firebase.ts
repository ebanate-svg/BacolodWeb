import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import {
  collection,
  documentId,
  getCountFromServer,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  startAfter,
  where,
  type DocumentData,
  type Firestore,
  type QueryConstraint,
  type QueryDocumentSnapshot,
} from 'firebase/firestore'
import type {
  CalendarEventItem,
  DestinationItem,
  JobItem,
  LocalBusinessItem,
  NewsItem,
  RestaurantItem,
} from './data'

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

export const firebaseReady = Boolean(config.apiKey && config.projectId && config.appId)
const app = firebaseReady ? initializeApp(config) : null
const appCheckSiteKey = import.meta.env.VITE_FIREBASE_APPCHECK_SITE_KEY

if (app && appCheckSiteKey) {
  initializeAppCheck(app, {
    provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
    isTokenAutoRefreshEnabled: true,
  })
}

const db = app ? getFirestore(app) : null

export type NewsFeedResult = { items: NewsItem[]; isLive: boolean }
export type TourismFeedResult<T> = { items: T[]; isLive: boolean }

const requestTimeoutMs = 12_000

async function withTimeout<T>(request: Promise<T>, requestName: string): Promise<T> {
  let timeoutId: ReturnType<typeof setTimeout> | undefined
  const timeout = new Promise<never>((_, reject) => {
    timeoutId = setTimeout(
      () => reject(new Error(`${requestName} did not respond within ${requestTimeoutMs}ms.`)),
      requestTimeoutMs,
    )
  })

  try {
    return await Promise.race([request, timeout])
  } finally {
    if (timeoutId) clearTimeout(timeoutId)
  }
}

const asText = (value: unknown, maxLength: number) =>
  typeof value === 'string' ? value.trim().slice(0, maxLength) : ''

const asIsoDate = (value: unknown) =>
  (value as { toDate?: () => Date } | null | undefined)?.toDate?.().toISOString() ?? ''

// Website fields can be written by business owners, so only real web links get through.
const asWebUrl = (value: unknown) => {
  const url = asText(value, 2000)
  return /^https?:\/\//i.test(url) ? url : ''
}

// Categories are stored in lowercase, for example "restaurant".
const capitalize = (value: string) => value.charAt(0).toUpperCase() + value.slice(1)

const firstImageUrl = (record: DocumentData) => {
  const images = Array.isArray(record.images) ? record.images : []
  return asText(record.photoUrl || images[0]?.url, 2000)
}

// The security rules refuse any business or job query without both of these filters.
const approvedAndPublic = [
  where('approvalStatus', '==', 'approved'),
  where('visibility', '==', 'public'),
]

async function loadPublicCollection<T>(
  requestName: string,
  read: (database: Firestore) => Promise<T[]>,
  fallback: T[],
): Promise<TourismFeedResult<T>> {
  if (!db) return { items: fallback, isLive: false }

  try {
    const items = await withTimeout(read(db), requestName)
    return items.length > 0 ? { items, isLive: true } : { items: fallback, isLive: false }
  } catch (error) {
    console.warn(`Using local data because ${requestName} is unavailable.`, error)
    return { items: fallback, isLive: false }
  }
}

export const loadLatestNews = (fallback: NewsItem[]): Promise<NewsFeedResult> =>
  loadPublicCollection(
    'getLatestNews',
    async (database) => {
      const snapshot = await getDocs(
        query(
          collection(database, 'news'),
          where('status', '==', 'published'),
          where('visibility', '==', 'public'),
          orderBy('createdAt', 'desc'),
          limit(3),
        ),
      )
      return snapshot.docs
        .map((document) => {
          const news = document.data()
          return {
            id: document.id,
            category: capitalize(asText(news.category, 60)) || 'News',
            date: asIsoDate(news.publishedAt) || asIsoDate(news.createdAt),
            title: asText(news.title, 180),
            copy: asText(news.body, 360),
            image: asText(news.photoUrl, 2000),
          }
        })
        .filter((item) => item.title)
    },
    fallback,
  )

export const loadTopDestinations = (fallback: DestinationItem[]) =>
  loadPublicCollection(
    'getTopDestinations',
    async (database) => {
      // Sorted here, like the mobile app: sorting on both fields in the query needs a
      // composite index that does not exist.
      const snapshot = await getDocs(
        query(collection(database, 'tourist_spots'), orderBy('dateAdded', 'desc'), limit(50)),
      )
      return snapshot.docs
        .map((document) => {
          const spot = document.data()
          return {
            id: document.id,
            title: asText(spot.name, 160),
            type: capitalize(asText(spot.category, 80)) || 'Destination',
            image: firstImageUrl(spot),
            description: asText(spot.description, 360),
            url: asWebUrl(spot.website),
            sortValue: typeof spot.sortValue === 'number' ? spot.sortValue : 5,
          }
        })
        .filter((item) => item.title && item.image)
        .sort((a, b) => b.sortValue - a.sortValue)
        .slice(0, 7)
        .map(({ sortValue, ...item }) => item)
    },
    fallback,
  )

export const loadTopRestaurants = (fallback: RestaurantItem[]) =>
  loadPublicCollection<RestaurantItem>(
    'getTopRestaurants',
    async (database) => {
      // No orderBy, so this works with the existing indexes.
      const snapshot = await getDocs(
        query(
          collection(database, 'local_businesses'),
          ...approvedAndPublic,
          where('category', 'in', ['restaurant', 'cafe', 'bakery', 'bar']),
          limit(20),
        ),
      )
      return snapshot.docs
        .map((document) => {
          const business = document.data()
          const open = asText(business.businessHours?.open, 30)
          const close = asText(business.businessHours?.close, 30)
          return {
            id: document.id,
            name: asText(business.name, 160),
            type: capitalize(asText(business.category, 100)) || 'Restaurant',
            image: firstImageUrl(business),
            location: asText(business.location || business.address, 240) || 'Bacolod City',
            hours: open && close ? `${open} – ${close}` : 'Hours not listed',
            url: asWebUrl(business.website),
          }
        })
        .filter((item) => item.name && item.image)
        .slice(0, 5)
    },
    fallback,
  )

const employmentTypes: Record<string, string> = {
  full_time: 'Full-time',
  part_time: 'Part-time',
  contract: 'Contract',
  temporary: 'Temporary',
  internship: 'Internship',
}
const salaryPeriods: Record<string, string> = { monthly: 'month', daily: 'day', hourly: 'hour' }

const formatSalary = (job: DocumentData) => {
  if (!job.salaryVisible) return 'Salary not disclosed'
  if (job.salaryType === 'negotiable') return 'Negotiable'
  const amounts = [job.salaryMin, job.salaryMax].filter(
    (amount, index, all) =>
      typeof amount === 'number' && amount > 0 && all.indexOf(amount) === index,
  )
  if (amounts.length === 0) return 'Salary not disclosed'
  const range = amounts.map((amount) => `₱${amount.toLocaleString('en-PH')}`).join(' – ')
  const period = salaryPeriods[job.salaryType]
  return period ? `${range} / ${period}` : range
}

let jobsRequest: Promise<JobItem[]> | null = null

// The jobs page asks for jobs and departments at the same moment; both share one read.
const readPublicJobs = (database: Firestore) => {
  jobsRequest ??= getDocs(
    query(
      collection(database, 'job_listings'),
      ...approvedAndPublic,
      orderBy('createdAt', 'desc'),
      limit(20),
    ),
  )
    .then((snapshot) =>
      snapshot.docs
        .map((document) => {
          const job = document.data()
          const vacancies = typeof job.vacancies === 'number' ? job.vacancies : 1
          const hired = typeof job.hiredCount === 'number' ? job.hiredCount : 0
          return {
            id: document.id,
            title: asText(job.title, 180),
            department: asText(job.businessName, 160) || 'Local Business',
            salary: formatSalary(job),
            type: employmentTypes[job.employmentType] || 'Open position',
            location: asText(job.locationText, 180) || 'Bacolod City',
            openings: vacancies - hired,
            postedAt: asIsoDate(job.createdAt),
            applicationInstructions: asText(job.applicationInstructions, 500),
          }
        })
        // Same as the mobile app: a listing with no slots left is not shown.
        .filter((job) => job.title && job.openings > 0)
        .slice(0, 9),
    )
    .finally(() => {
      jobsRequest = null
    })
  return jobsRequest
}

export const loadLatestJobs = (fallback: JobItem[]) =>
  loadPublicCollection('getLatestJobs', readPublicJobs, fallback)

export const loadJobDepartments = (fallback: string[]) =>
  loadPublicCollection(
    'getJobDepartments',
    async (database) => {
      const jobs = await readPublicJobs(database)
      return [...new Set(jobs.map((job) => job.department))].sort((a, b) => a.localeCompare(b))
    },
    fallback,
  )

export const loadCalendarEvents = (fallback: CalendarEventItem[]) =>
  loadPublicCollection(
    'getCalendarEvents',
    async (database) => {
      // Newest first so the limit drops the oldest events, then back to date order.
      const snapshot = await getDocs(
        query(
          collection(database, 'events'),
          where('visibility', '==', 'public'),
          orderBy('startAt', 'desc'),
          limit(100),
        ),
      )
      return snapshot.docs
        .map((document) => {
          const event = document.data()
          const startAt = asIsoDate(event.startAt)
          return {
            id: document.id,
            title: asText(event.title, 180),
            startAt,
            endAt: asIsoDate(event.endAt) || startAt,
            isAllDay: Boolean(event.isAllDay),
            category: capitalize(asText(event.category, 80)) || 'City Event',
            venue: asText(event.venue, 180),
            description: asText(event.description, 500),
            image: asText(event.photoUrl, 2000),
            url: asWebUrl(event.registrationUrl),
          }
        })
        .filter((event) => event.title && event.startAt)
        .reverse()
    },
    fallback,
  )

export type LocalBusinessPage = {
  items: LocalBusinessItem[]
  nextCursor: string | null
  total: number
  categories: string[]
  isLive: boolean
}

type LocalBusinessParams = { cursor?: string | null; query?: string; category?: string }

const businessPageSize = 9

// The allowed business types. Reading every business to build this list would cost far more.
const businessCategories = [
  'accommodation',
  'automotive',
  'bakery',
  'bar',
  'cafe',
  'education',
  'entertainment',
  'fitness',
  'grocery',
  'hardware',
  'healthcare',
  'other',
  'pharmacy',
  'restaurant',
  'retail',
  'salon',
  'services',
].map(capitalize)

const toLocalBusiness = (document: QueryDocumentSnapshot): LocalBusinessItem => {
  const business = document.data()
  return {
    id: document.id,
    name: asText(business.name, 160),
    category: capitalize(asText(business.category, 160)) || 'Local Business',
    image: firstImageUrl(business),
    location: asText(business.location || business.address, 240) || 'Bacolod City',
    description: asText(business.description, 500),
    website: asWebUrl(business.website),
  }
}

async function readBusinessPage(
  database: Firestore,
  params: LocalBusinessParams,
): Promise<Omit<LocalBusinessPage, 'isLive'>> {
  const businesses = collection(database, 'local_businesses')
  const search = params.query?.trim().toLowerCase() || ''
  const category =
    params.category && params.category !== 'All Categories' ? params.category.toLowerCase() : ''
  // Stored categories are not all lowercase yet, for example "cafe" and "Restaurant".
  const categoryValues = [category, capitalize(category)]
  const sortField = search ? 'normalizedName' : 'name'
  const filters: QueryConstraint[] = [...approvedAndPublic]
  if (search) {
    filters.push(
      where('normalizedName', '>=', search),
      where('normalizedName', '<=', `${search}\uf8ff`),
    )
  } else if (category) {
    filters.push(where('category', 'in', categoryValues))
  }

  // Search plus category has no index, so the category is filtered here on the search results.
  if (search && category) {
    const snapshot = await getDocs(query(businesses, ...filters, orderBy(sortField), limit(200)))
    const matches = snapshot.docs.filter((document) =>
      categoryValues.includes(document.get('category')),
    )
    const cursorId = params.cursor ? (JSON.parse(params.cursor) as string[])[1] : ''
    const start = matches.findIndex((document) => document.id === cursorId) + 1
    const page = matches.slice(start, start + businessPageSize)
    const last = page.at(-1)
    return {
      items: page.map(toLocalBusiness),
      nextCursor:
        last && start + businessPageSize < matches.length
          ? JSON.stringify([last.get(sortField), last.id])
          : null,
      total: matches.length,
      categories: businessCategories,
    }
  }

  const ordered = query(businesses, ...filters, orderBy(sortField), orderBy(documentId()))
  const pageQuery = params.cursor
    ? query(
        ordered,
        startAfter(...(JSON.parse(params.cursor) as string[])),
        limit(businessPageSize + 1),
      )
    : query(ordered, limit(businessPageSize + 1))
  const [snapshot, count] = await Promise.all([
    getDocs(pageQuery),
    getCountFromServer(query(businesses, ...filters)),
  ])
  const page = snapshot.docs.slice(0, businessPageSize)
  const last = page.at(-1)
  return {
    items: page.map(toLocalBusiness),
    // The cursor stays a string (sort value + id) because the page keeps a cursor history.
    nextCursor:
      last && snapshot.size > businessPageSize
        ? JSON.stringify([last.get(sortField), last.id])
        : null,
    total: count.data().count,
    categories: businessCategories,
  }
}

export async function loadLocalBusinesses(
  params: LocalBusinessParams,
  fallback: LocalBusinessItem[],
): Promise<LocalBusinessPage> {
  const filterFallback = () => {
    const query = params.query?.trim().toLowerCase() || ''
    const category = params.category || 'All Categories'
    const filtered = fallback.filter(
      (business) =>
        (!query || `${business.name} ${business.category}`.toLowerCase().includes(query)) &&
        (category === 'All Categories' || business.category === category),
    )
    const start = params.cursor
      ? Math.max(0, filtered.findIndex((business) => business.id === params.cursor) + 1)
      : 0
    const items = filtered.slice(start, start + 9)
    return {
      items,
      nextCursor: start + 9 < filtered.length ? items.at(-1)?.id || null : null,
      total: filtered.length,
      categories: [...new Set(fallback.map((business) => business.category))].sort(),
      isLive: false,
    }
  }

  if (!db) return filterFallback()
  try {
    const data = await withTimeout(readBusinessPage(db, params), 'getLocalBusinesses')
    return { ...data, isLive: true }
  } catch (error) {
    console.warn('Using local businesses because getLocalBusinesses is unavailable.', error)
    return filterFallback()
  }
}
