<<<<<<< HEAD
# Bacolod eGov Portal

A responsive React implementation based on the supplied PNG designs. It includes service discovery, tourism, waste schedules, job and bid listings, local businesses, civic engagement, Firestore reads, and request submission through a callable Firebase Cloud Function.

## Run locally

1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env` and add Firebase web app settings.
3. Start the frontend: `npm run dev`

Without an `.env`, the interface runs in demo mode and returns a local demo reference when a request is submitted.

## Connect Firebase

1. Create a Firebase project and enable Firestore.
2. Add a Web App in Firebase Project Settings and copy its values into `.env`.
3. Copy `.firebaserc.example` to `.firebaserc` and replace the project ID.
4. Install dependencies in both the root and `functions` folders.
5. Run `npm run build`, then `npm run firebase:deploy`.

The callable function `submitServiceRequest` validates requests and writes them to the private `serviceRequests` collection. Public site content can be managed in the `announcements`, `services`, and `destinations` collections.
=======
# BacolodWeb
>>>>>>> origin/main
