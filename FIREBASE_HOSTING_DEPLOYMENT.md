# Firebase Hosting Deployment Guide

This guide deploys only the Bacolod eGov React frontend. It intentionally avoids deploying Cloud
Functions, Firestore rules, or Firestore indexes owned by the backend team.

## Important safety rule

Always deploy this portal with a dedicated Hosting target:

```powershell
npx firebase deploy --only hosting:egov-web --project dev
```

Do not use the following command for a frontend-only release:

```powershell
npx firebase deploy --project dev
```

The unrestricted command also deploys every configured Firebase resource in `firebase.json`,
including the repository's Functions and Firestore configuration.

## Information required from the Firebase owner

Obtain these values before configuring deployment:

```text
Development Firebase project ID:
Development Hosting site ID:

Production Firebase project ID:
Production Hosting site ID:
```

The Hosting sites must be dedicated to the public Bacolod eGov portal. Do not select an existing
admin or citizen-app Hosting site.

The Hosting site ID is the part before `.web.app`. For example, the site ID for
`https://bacolod-egov-dev.web.app` is `bacolod-egov-dev`.

## First-time workstation setup

### 1. Install dependencies

From the project root:

```powershell
npm install
```

### 2. Sign in to Firebase

```powershell
npx firebase login
npx firebase login:list
npx firebase projects:list
```

Sign in with the Google account that has permission to deploy to both Firebase projects. If a
project is missing from `projects:list`, ask the Firebase owner to grant the required access.

### 3. Confirm the Hosting sites

Use the actual project IDs supplied by the Firebase owner:

```powershell
npx firebase hosting:sites:list --project YOUR_DEV_PROJECT_ID
npx firebase hosting:sites:list --project YOUR_PROD_PROJECT_ID
```

Stop if the intended public-portal site is not listed. The Firebase owner should create a separate
Hosting site before deployment continues.

### 4. Configure project aliases

Run this command and select the development project, assigning it the alias `dev`:

```powershell
npx firebase use --add
```

Run it again, select the production project, and assign it the alias `prod`.

Verify the aliases:

```powershell
npx firebase use
```

The `.firebaserc` project mapping should resemble:

```json
{
  "projects": {
    "default": "YOUR_DEV_PROJECT_ID",
    "dev": "YOUR_DEV_PROJECT_ID",
    "prod": "YOUR_PROD_PROJECT_ID"
  }
}
```

### 5. Assign the dedicated Hosting target

Map the logical target `egov-web` to the correct site in each Firebase project:

```powershell
npx firebase target:apply hosting egov-web YOUR_DEV_HOSTING_SITE_ID --project dev
npx firebase target:apply hosting egov-web YOUR_PROD_HOSTING_SITE_ID --project prod
```

The mapping is stored in `.firebaserc`. Confirm that the development and production projects each
map `egov-web` to their own public-portal site.

The `hosting` configuration in `firebase.json` must include:

```json
{
  "hosting": {
    "target": "egov-web",
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [{ "source": "**", "destination": "/index.html" }]
  }
}
```

Do not run `firebase init` over the existing configuration. Update the existing files carefully or
ask the frontend maintainer to add the confirmed target.

## Environment configuration

Obtain the correct Firebase Web App configuration and reCAPTCHA/App Check site key from the
Firebase owner. Store them in an ignored local environment file; never commit real environment
values or App Check debug tokens.

Required variables are documented in `.env.example`.

Confirm that local environment files are ignored:

```powershell
git check-ignore .env .env.production
```

Before a production build, confirm that the environment values point to the intended Firebase Web
App and project.

## Local validation

Run the checks before every deployment:

```powershell
npm run check:firebase-config
npm run format:check
npx tsc --noEmit
npm run build
npm run preview
```

The production files are generated in `dist`. Verify routing, images, Firebase content, App Check,
external links, and responsive layouts in the local preview.

For the local Firebase Hosting emulator instead of Vite preview:

```powershell
npm run build
npx firebase emulators:start --only hosting:egov-web --project dev
```

## Development preview deployment

Create a temporary preview URL before updating the live development site:

```powershell
npm run build
npx firebase hosting:channel:deploy ervin-test --only egov-web --project dev
```

Firebase prints a temporary preview URL. Send that URL to the assigned reviewers. A preview channel
does not replace the live Hosting channel.

## Live development deployment

After the preview is approved:

```powershell
npm run build
npx firebase deploy --only hosting:egov-web --project dev
```

Open the development URL and perform a smoke test:

- Home page and navigation
- Tourism, destinations, calendar, jobs, bids, resources, and businesses
- Firebase content and fallback behavior
- Business details and Google Maps links
- App Check and browser console errors
- Terms, Privacy Policy, and Contact pages
- Mobile navigation and responsive layouts

## Production deployment

Production deployment requires approval from the designated project owner or release reviewer.

Confirm the active account, target mapping, production environment values, and clean build. Then
run:

```powershell
npm run build
npx firebase deploy --only hosting:egov-web --project prod
```

Record the deployment time, Git commit, deployed site, reviewer, and Firebase release URL.

## Rollback

If a live deployment causes a problem:

1. Open Firebase Console.
2. Select the correct project and Hosting site.
3. Open the Hosting release history.
4. Locate the last known-good release.
5. Choose **Rollback** and verify the restored site.

Do not attempt to repair an urgent production incident by deploying Functions or Firestore rules
from this frontend repository.

## Troubleshooting

### `Failed to authenticate`

```powershell
npx firebase login
```

### Project alias `dev` or `prod` is not recognized

```powershell
npx firebase use --add
```

### Hosting target `egov-web` is not configured

Re-run the appropriate target mapping with the confirmed Hosting site ID:

```powershell
npx firebase target:apply hosting egov-web SITE_ID --project dev
```

### Permission denied

Ask the Firebase project owner to grant the signed-in Google account permission to view and deploy
the intended Hosting site.

### Wrong site would be replaced

Stop the deployment. Confirm the site ID with:

```powershell
npx firebase hosting:sites:list --project PROJECT_ID
```

Then inspect `.firebaserc` and ensure `hosting:egov-web` maps only to the dedicated public-portal
site.
