# Bacolod eGov Web

Bacolod eGov Web is a responsive public portal for Bacolod City. It brings city services, tourism information, employment opportunities, procurement notices, local businesses, events, and citizen resources into one accessible web experience.

## Features

- City service directory and mobile-app links
- Tourism destinations and dining establishments
- Tourism events calendar
- Job listings and department filters
- Bids and procurement opportunities
- Paginated local-business directory
- News and public-resource sections
- Responsive desktop and mobile navigation
- Firebase App Check and callable Cloud Functions
- Local placeholder data when Firebase is unavailable, returns no records, or times out

## Technology

- React 19 and TypeScript
- Vite
- Tailwind CSS
- React Router
- Firebase Hosting, Firestore, Cloud Functions, and App Check
- Lucide React icons

## Requirements

- Node.js 22
- npm
- Firebase CLI for emulator and deployment commands

## Local development

1. Install the frontend dependencies:

   ```bash
   npm install
   ```

2. Copy `.env.example` to `.env` and provide the Firebase Web App configuration:

   ```env
   VITE_FIREBASE_API_KEY=
   VITE_FIREBASE_AUTH_DOMAIN=
   VITE_FIREBASE_PROJECT_ID=
   VITE_FIREBASE_STORAGE_BUCKET=
   VITE_FIREBASE_MESSAGING_SENDER_ID=
   VITE_FIREBASE_APP_ID=
   VITE_FIREBASE_FUNCTIONS_REGION=asia-southeast1
   VITE_FIREBASE_APPCHECK_SITE_KEY=
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

The application uses the placeholder records in `src/data.ts` when Firebase is not configured or a callable function is unavailable. A callable request also falls back after 12 seconds without a response.

## Firebase Functions

Install the backend dependencies before using the Functions emulator or deploying functions:

```bash
cd functions
npm install
cd ..
```

The frontend currently consumes these callable functions:

- `getLatestNews`
- `getTopDestinations`
- `getTopRestaurants`
- `getLatestJobs`
- `getJobDepartments`
- `getCalendarEvents`
- `getLocalBusinesses`
- `getBids`

The production functions use the `asia-southeast1` region and require Firebase App Check.

## Available commands

| Command                         | Purpose                                                 |
| ------------------------------- | ------------------------------------------------------- |
| `npm run dev`                   | Start the Vite development server                       |
| `npm run build`                 | Create the production build in `dist`                   |
| `npm run preview`               | Preview the production build locally                    |
| `npm run format`                | Format the project with Prettier                        |
| `npm run format:check`          | Check formatting without changing files                 |
| `npm run check:firebase-config` | Validate the production Firebase variables              |
| `npm run firebase:emulators`    | Start the configured Firebase emulators                 |
| `npm run firebase:deploy`       | Deploy Hosting, Functions, Firestore rules, and indexes |

## Firebase setup

1. Copy `.firebaserc.example` to `.firebaserc` if a local Firebase project mapping is not already present.
2. Set the project ID to the intended Firebase project.
3. Add the deployed domain and local development domains to the reCAPTCHA/App Check configuration.
4. Build and deploy:

   ```bash
   npm run build
   npm run firebase:deploy
   ```

Firebase Hosting serves the `dist` directory and rewrites unknown routes to `index.html` for client-side routing.

## Project structure

```text
src/components/   Shared interface components
src/pages/        Route-level page components
src/data.ts       Local placeholder and fallback records
src/firebase.ts   Firebase setup and callable-function clients
functions/        Firebase Cloud Functions
public/images/    Static image assets
```

## Environment and security notes

- Do not commit `.env` files or service-account credentials.
- Firebase Web App configuration is visible in the browser by design; access control must be enforced with Firestore rules, callable-function validation, App Check, and authentication where required.
- Placeholder data is frontend-only and does not write to Firestore.
- Configure billing budgets, alerts, and appropriate Cloud Function instance limits before production deployment.

## Repository

GitLab: [bacolod-app/bacolod-egov-web](https://gitlab.com/bacolod-app/bacolod-egov-web)
