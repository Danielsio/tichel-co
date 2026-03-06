# Audit: Production 500 — Firestore Missing Composite Indexes

**Date**: 2026-03-06
**Severity**: Critical (site completely down)
**Status**: Fixed

---

## Symptom

Every page on `tichel-co.vercel.app` returns **500 Internal Server Error** and renders the error boundary ("משהו השתבש").

Console shows:

```
Error: The query requires an index.
```

Two distinct index errors repeat on every request:

| #   | Collection    | Required Index Fields (from error)                    | Query Function              |
| --- | ------------- | ----------------------------------------------------- | --------------------------- |
| 1   | `products`    | `isFeatured ASC`, `publishedAt ASC`, `__name__ ASC`   | `getFeaturedProducts()`     |
| 2   | `collections` | `displayOrder ASC`, `publishedAt ASC`, `__name__ ASC` | `getPublishedCollections()` |

---

## Root Causes

### 1. Composite indexes were never deployed to production

The file `firestore.indexes.json` exists in the repo but was **never deployed** to the production Firestore database.

### 2. Index field order was wrong in `firestore.indexes.json`

Equality-filter fields must come **before** inequality/range fields in composite indexes. The fields were reversed.

### 3. Database ID mismatch: `default` vs `(default)`

Two databases existed — `(default)` in `nam5` (US) and `default` in `me-west1` (Tel Aviv). Code targeted `default`, CLI operations targeted `(default)`.

### 4. `icon-192.png` and `icon-512.png` return 404

PWA manifest references icons that don't exist in `public/`, triggering cascading Firestore errors via the `[locale]` catch-all.

---

## Resolution

### Consolidated to a single named database: `tichel-co-db`

Created a new database `tichel-co-db` in **`me-west1` (Tel Aviv)** for lowest latency to Israeli customers.

- **Code**: `getFirestore(app, "tichel-co-db")` in both Admin SDK (`admin.ts`) and Client SDK (`client.ts`)
- **CLI**: `firebase.json` specifies `"database": "tichel-co-db"` so all CLI operations target it
- **Indexes**: Fixed field order and deployed to `tichel-co-db`
- **Rules**: Deployed to `tichel-co-db`
- **Data**: Seeded 5 collections and 12 products into `tichel-co-db`

### Manual cleanup required

Delete these unused databases from Firebase Console:

- `(default)` — US, unused
- `default` — Tel Aviv, superseded by `tichel-co-db`
