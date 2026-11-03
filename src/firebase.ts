import { initializeApp } from 'firebase/app'
import { initializeAppCheck, ReCaptchaEnterpriseProvider } from 'firebase/app-check'
import { getFunctions, httpsCallable } from 'firebase/functions'
import type {
  BidItem,
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

const functions = app
  ? getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'asia-southeast1')
  : null

type LatestNewsResponse = { items: NewsItem[] }
export type NewsFeedResult = { items: NewsItem[]; isLive: boolean }
export type TourismFeedResult<T> = { items: T[]; isLive: boolean }

export async function loadLatestNews(fallback: NewsItem[]): Promise<NewsFeedResult> {
  if (!functions) return { items: fallback, isLive: false }
  try {
    const callable = httpsCallable<void, LatestNewsResponse>(functions, 'getLatestNews')
    const { data } = await callable()
    return Array.isArray(data.items) && data.items.length > 0
      ? { items: data.items, isLive: true }
      : { items: fallback, isLive: false }
  } catch (error) {
    console.warn('Using local news data because the production feed is unavailable.', error)
    return { items: fallback, isLive: false }
  }
}

async function loadPublicCollection<T>(
  functionName:
    | 'getTopDestinations'
    | 'getTopRestaurants'
    | 'getLatestJobs'
    | 'getJobDepartments'
    | 'getCalendarEvents'
    | 'getBids',
  fallback: T[],
): Promise<TourismFeedResult<T>> {
  if (!functions) return { items: fallback, isLive: false }

  try {
    const callable = httpsCallable<void, { items: T[] }>(functions, functionName)
    const { data } = await callable()
    return Array.isArray(data.items) && data.items.length > 0
      ? { items: data.items, isLive: true }
      : { items: fallback, isLive: false }
  } catch (error) {
    console.warn(`Using local data because ${functionName} is unavailable.`, error)
    return { items: fallback, isLive: false }
  }
}

export const loadTopDestinations = (fallback: DestinationItem[]) =>
  loadPublicCollection<DestinationItem>('getTopDestinations', fallback)

export const loadTopRestaurants = (fallback: RestaurantItem[]) =>
  loadPublicCollection<RestaurantItem>('getTopRestaurants', fallback)

export const loadLatestJobs = (fallback: JobItem[]) =>
  loadPublicCollection<JobItem>('getLatestJobs', fallback)

export const loadJobDepartments = (fallback: string[]) =>
  loadPublicCollection<string>('getJobDepartments', fallback)

export const loadCalendarEvents = (fallback: CalendarEventItem[]) =>
  loadPublicCollection<CalendarEventItem>('getCalendarEvents', fallback)

export const loadBids = (fallback: BidItem[]) => loadPublicCollection<BidItem>('getBids', fallback)

export type LocalBusinessPage = {
  items: LocalBusinessItem[]
  nextCursor: string | null
  total: number
  categories: string[]
  isLive: boolean
}

export async function loadLocalBusinesses(
  params: { cursor?: string | null; query?: string; category?: string },
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

  if (!functions) return filterFallback()
  try {
    const callable = httpsCallable<
      { cursor?: string | null; query?: string; category?: string },
      Omit<LocalBusinessPage, 'isLive'>
    >(functions, 'getLocalBusinesses')
    const { data } = await callable(params)
    return { ...data, isLive: true }
  } catch (error) {
    console.warn('Using local businesses because getLocalBusinesses is unavailable.', error)
    return filterFallback()
  }
}
