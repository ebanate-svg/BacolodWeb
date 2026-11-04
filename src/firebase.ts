import { initializeApp } from 'firebase/app'
import { getToken, initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import {
  collection,
  getCountFromServer,
  getDocs,
  getFirestore,
  limit,
  orderBy,
  query,
  where,
  type DocumentData,
  type Firestore,
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

const appCheck =
  app && appCheckSiteKey
    ? initializeAppCheck(app, {
        provider: new ReCaptchaEnterpriseProvider(appCheckSiteKey),
        isTokenAutoRefreshEnabled: true,
      })
    : null

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

// Business and job documents also hold private owner data, and the Firestore web SDK always
// downloads whole documents. These reads use the REST API instead, which returns only the
// fields listed here. Do not add a private field to these lists.
const publicBusinessFields = [
  'name',
  'normalizedName',
  'category',
  'description',
  'location',
  'address',
  'website',
  'photoUrl',
  'images',
  'businessHours',
]
const publicJobFields = [
  'title',
  'businessName',
  'employmentType',
  'salaryType',
  'salaryMin',
  'salaryMax',
  'salaryVisible',
  'locationText',
  'vacancies',
  'hiredCount',
  'applicationInstructions',
  'createdAt',
]

type FieldFilter = [field: string, operator: '==' | 'in' | '>=' | '<=', value: string | string[]]

// The security rules refuse any business or job query without both of these filters.
const approvedAndPublic: FieldFilter[] = [
  ['approvalStatus', '==', 'approved'],
  ['visibility', '==', 'public'],
]

type RestValue = {
  stringValue?: string
  integerValue?: string
  doubleValue?: number
  booleanValue?: boolean
  timestampValue?: string
  arrayValue?: { values?: RestValue[] }
  mapValue?: { fields?: Record<string, RestValue> }
}

const fromRestValue = (value: RestValue): unknown => {
  if (value.stringValue !== undefined) return value.stringValue
  if (value.integerValue !== undefined) return Number(value.integerValue)
  if (value.doubleValue !== undefined) return value.doubleValue
  if (value.booleanValue !== undefined) return value.booleanValue
  if (value.timestampValue !== undefined) {
    const date = new Date(value.timestampValue)
    return { toDate: () => date }
  }
  if (value.arrayValue) return (value.arrayValue.values ?? []).map(fromRestValue)
  if (value.mapValue) return fromRestFields(value.mapValue.fields)
  return null
}

const fromRestFields = (fields: Record<string, RestValue> = {}) =>
  Object.fromEntries(
    Object.entries(fields).map(([name, value]) => [name, fromRestValue(value)]),
  ) as DocumentData

const toRestValue = (value: string | string[]): RestValue =>
  Array.isArray(value)
    ? { arrayValue: { values: value.map((item) => ({ stringValue: item })) } }
    : { stringValue: value }

const restOperators = {
  '==': 'EQUAL',
  in: 'IN',
  '>=': 'GREATER_THAN_OR_EQUAL',
  '<=': 'LESS_THAN_OR_EQUAL',
}

type PublicFieldsRead = {
  collectionId: string
  fields: string[]
  filters: FieldFilter[]
  sortBy?: { field: string; direction: 'ASCENDING' | 'DESCENDING' }[]
  startAfter?: [sortValue: string, documentId: string]
  limit: number
}

async function readPublicFields(read: PublicFieldsRead): Promise<DocumentData[]> {
  const documents = `projects/${config.projectId}/databases/(default)/documents`
  const structuredQuery = {
    select: { fields: read.fields.map((fieldPath) => ({ fieldPath })) },
    from: [{ collectionId: read.collectionId }],
    where: {
      compositeFilter: {
        op: 'AND',
        filters: read.filters.map(([fieldPath, operator, value]) => ({
          fieldFilter: {
            field: { fieldPath },
            op: restOperators[operator],
            value: toRestValue(value),
          },
        })),
      },
    },
    orderBy: read.sortBy?.map(({ field, direction }) => ({
      field: { fieldPath: field },
      direction,
    })),
    startAt: read.startAfter && {
      values: [
        { stringValue: read.startAfter[0] },
        { referenceValue: `${documents}/${read.collectionId}/${read.startAfter[1]}` },
      ],
      before: false,
    },
    limit: read.limit,
  }

  const headers: Record<string, string> = { 'Content-Type': 'application/json' }
  if (appCheck) headers['X-Firebase-AppCheck'] = (await getToken(appCheck)).token

  const response = await fetch(
    `https://firestore.googleapis.com/v1/${documents}:runQuery?key=${config.apiKey}`,
    { method: 'POST', headers, body: JSON.stringify({ structuredQuery }) },
  )
  if (!response.ok) throw new Error(`Firestore returned HTTP ${response.status}.`)

  const rows = (await response.json()) as {
    document?: { name: string; fields?: Record<string, RestValue> }
  }[]
  return rows.flatMap(({ document }) =>
    document
      ? [{ ...fromRestFields(document.fields), id: document.name.split('/').pop() ?? '' }]
      : [],
  )
}

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
    async () => {
      // No sort order, so this works with the existing indexes.
      const businesses = await readPublicFields({
        collectionId: 'local_businesses',
        fields: publicBusinessFields,
        filters: [
          ...approvedAndPublic,
          ['category', 'in', ['restaurant', 'cafe', 'bakery', 'bar']],
        ],
        limit: 20,
      })
      return businesses
        .map((business) => {
          const open = asText(business.businessHours?.open, 30)
          const close = asText(business.businessHours?.close, 30)
          return {
            id: business.id,
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
const readPublicJobs = () => {
  jobsRequest ??= readPublicFields({
    collectionId: 'job_listings',
    fields: publicJobFields,
    filters: approvedAndPublic,
    sortBy: [{ field: 'createdAt', direction: 'DESCENDING' }],
    limit: 20,
  })
    .then((jobs) =>
      jobs
        .map((job) => {
          const vacancies = typeof job.vacancies === 'number' ? job.vacancies : 1
          const hired = typeof job.hiredCount === 'number' ? job.hiredCount : 0
          return {
            id: job.id,
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
    async () => {
      const jobs = await readPublicJobs()
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

let categoryRequest: Promise<Map<string, string[]>> | null = null

// The filter lists the categories public businesses really use, read once per page load
// (category field only). Each label maps to every stored spelling of it, such as "cafe" and
// "Cafe", because the stored values are not all written the same way.
const readBusinessCategories = () => {
  categoryRequest ??= readPublicFields({
    collectionId: 'local_businesses',
    fields: ['category'],
    filters: approvedAndPublic,
    limit: 1000,
  })
    .then((rows) => {
      const categories = new Map<string, string[]>()
      for (const row of rows) {
        const stored = asText(row.category, 160)
        if (!stored) continue
        const label = capitalize(stored)
        categories.set(label, [...new Set([...(categories.get(label) ?? []), stored])])
      }
      return categories
    })
    .catch((error) => {
      categoryRequest = null
      throw error
    })
  return categoryRequest
}

const toLocalBusiness = (business: DocumentData): LocalBusinessItem => {
  return {
    id: business.id,
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
  const search = params.query?.trim().toLowerCase() || ''
  const category = params.category && params.category !== 'All Categories' ? params.category : ''
  const categoryMap = await readBusinessCategories()
  const businessCategories = [...categoryMap.keys()].sort((a, b) => a.localeCompare(b))
  const categoryValues = (categoryMap.get(category) ?? [category]).slice(0, 30)
  const sortField = search ? 'normalizedName' : 'name'
  const filters: FieldFilter[] = [...approvedAndPublic]
  if (search) {
    filters.push(['normalizedName', '>=', search], ['normalizedName', '<=', `${search}\uf8ff`])
  } else if (category) {
    filters.push(['category', 'in', categoryValues])
  }
  const businesses = { collectionId: 'local_businesses', fields: publicBusinessFields, filters }
  const sortBy = [
    { field: sortField, direction: 'ASCENDING' as const },
    { field: '__name__', direction: 'ASCENDING' as const },
  ]

  // Search plus category has no index, so the category is filtered here on the search results.
  if (search && category) {
    const results = await readPublicFields({ ...businesses, sortBy, limit: 200 })
    const matches = results.filter((business) =>
      categoryValues.includes(asText(business.category, 160)),
    )
    const cursorId = params.cursor ? (JSON.parse(params.cursor) as string[])[1] : ''
    const start = matches.findIndex((business) => business.id === cursorId) + 1
    const page = matches.slice(start, start + businessPageSize)
    const last = page.at(-1)
    return {
      items: page.map(toLocalBusiness),
      nextCursor:
        last && start + businessPageSize < matches.length
          ? JSON.stringify([last[sortField], last.id])
          : null,
      total: matches.length,
      categories: businessCategories,
    }
  }

  // The count returns only a number, so the SDK is safe here.
  const [results, count] = await Promise.all([
    readPublicFields({
      ...businesses,
      sortBy,
      startAfter: params.cursor ? (JSON.parse(params.cursor) as [string, string]) : undefined,
      limit: businessPageSize + 1,
    }),
    getCountFromServer(
      query(
        collection(database, 'local_businesses'),
        ...filters.map(([field, operator, value]) => where(field, operator, value)),
      ),
    ),
  ])
  const page = results.slice(0, businessPageSize)
  const last = page.at(-1)
  return {
    items: page.map(toLocalBusiness),
    // The cursor stays a string (sort value + id) because the page keeps a cursor history.
    nextCursor:
      last && results.length > businessPageSize ? JSON.stringify([last[sortField], last.id]) : null,
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
