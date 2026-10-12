import { loadEnv } from 'vite'

const config = { ...loadEnv('production', process.cwd(), ''), ...process.env }

const required = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_MESSAGING_SENDER_ID',
  'VITE_FIREBASE_APP_ID',
]

const missing = required.filter((name) => !config[name]?.trim())

if (missing.length) {
  console.error(`Missing GitHub Actions Firebase configuration: ${missing.join(', ')}`)
  process.exit(1)
}

if (config.VITE_FIREBASE_PROJECT_ID !== 'bacolod-g-app') {
  console.error('VITE_FIREBASE_PROJECT_ID must target the production bacolod-g-app project.')
  process.exit(1)
}

console.log('Production Firebase configuration is available for the GitHub Pages build.')
