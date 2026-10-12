import { initializeApp } from 'firebase/app'
import { getFunctions, httpsCallable } from 'firebase/functions'
import type { NewsItem } from './data'

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
const functions = app ? getFunctions(app, import.meta.env.VITE_FIREBASE_FUNCTIONS_REGION || 'asia-southeast1') : null

type LatestNewsResponse = { items: NewsItem[] }

export async function loadLatestNews(fallback: NewsItem[]): Promise<NewsItem[]> {
  if (!functions) return fallback
  try {
    const callable = httpsCallable<void, LatestNewsResponse>(functions, 'getLatestNews')
    const { data } = await callable()
    return Array.isArray(data.items) && data.items.length > 0 ? data.items : fallback
  } catch (error) {
    console.warn('Using local news data because the production feed is unavailable.', error)
    return fallback
  }
}

export async function submitRequest(payload: Record<string, string>): Promise<{ reference: string; demo?: boolean }> {
  if (!functions) {
    await new Promise((resolve) => setTimeout(resolve, 550))
    return { reference: `DEMO-${Date.now().toString().slice(-7)}`, demo: true }
  }
  const callable = httpsCallable<Record<string, string>, { reference: string }>(functions, 'submitServiceRequest')
  return (await callable(payload)).data
}
