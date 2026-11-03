# Bacolod public data functions

These Firebase callable functions provide sanitized, read-only data to the React portal. They use
the Admin SDK on the server, so the browser never receives privileged Firestore credentials or
unfiltered documents.

## Public portal functions

| Function             | Source collection                     | Response                                                |
| -------------------- | ------------------------------------- | ------------------------------------------------------- |
| `getTopDestinations` | `tourist_spots`                       | Up to 7 public destinations                             |
| `getTopRestaurants`  | `local_businesses`                    | Up to 5 public dining businesses                        |
| `getLatestJobs`      | All collections named `job_listings`  | Up to 9 current jobs                                    |
| `getJobDepartments`  | All collections named `job_listings`  | Unique department names                                 |
| `getCalendarEvents`  | `events`                              | Public calendar events                                  |
| `getLocalBusinesses` | `local_businesses`                    | 9 businesses per page, categories, and optional ratings |
| `getLatestNews`      | `news`                                | Up to 3 latest public news items                        |
| `getBids`            | Official Bacolod Bids and Awards page | Up to 100 normalized bid documents                      |

`getLocalBusinesses` accepts this callable payload:

```json
{
  "cursor": "last-document-id-from-the-previous-page",
  "query": "optional search text",
  "category": "optional category"
}
```

It returns `items`, `nextCursor`, `total`, and `categories`. A rating is returned only when an
aggregate rating exists or readable public reviews are present; otherwise the rating fields are
omitted.

## Deploy

From the repository root:

```powershell
firebase login
firebase use bacolod-g-app
npm --prefix functions install
firebase deploy --only functions:getTopDestinations,functions:getTopRestaurants,functions:getLatestJobs,functions:getJobDepartments,functions:getCalendarEvents,functions:getLocalBusinesses
```

To deploy the official bids feed by itself:

```powershell
firebase deploy --only functions:getBids
```

To deploy every function in `index.js`:

```powershell
firebase deploy --only functions
```

The functions deploy to `asia-southeast1`, matching `src/firebase.ts`.

## Security notes

- These endpoints return only explicitly selected display fields. Owner IDs, contact information,
  permit data, and internal moderation fields are never returned.
- Draft, pending, rejected, private, hidden, deleted, closed, expired, archived, and non-approved
  records are filtered out.
- Reads are bounded and callable payload text is length-limited.
- Public website data is intentionally readable without Firebase Authentication. Authentication
  would not make public data secret. Firebase App Check is initialized by the React client when
  the reCAPTCHA v3 `VITE_FIREBASE_APPCHECK_SITE_KEY` is configured, and every public callable uses
  `enforceAppCheck: true` to reject requests without a valid token.
- Public responses are cached in warm function instances to reduce repeated Firestore reads. The
  bids feed keeps its separate 15-minute source cache.
- Keep all write operations in separate authenticated callable functions with role checks. Never
  add writes to these public feed functions.
