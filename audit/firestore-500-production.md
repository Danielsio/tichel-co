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

The file `firestore.indexes.json` exists in the repo but was **never deployed** to the production Firestore database. Without running `firebase deploy --only firestore:indexes`, the indexes only exist on paper.

### 2. Index field order is wrong in `firestore.indexes.json`

Even if deployed, the current index definitions have the **fields in the wrong order**:

| Collection    | Current (wrong)                     | Required (correct)                  |
| ------------- | ----------------------------------- | ----------------------------------- |
| `collections` | `publishedAt ASC, displayOrder ASC` | `displayOrder ASC, publishedAt ASC` |
| `products`    | `publishedAt ASC, isFeatured ASC`   | `isFeatured ASC, publishedAt ASC`   |

Firestore composite index rules require equality-filter fields **before** inequality/range fields. Our queries use `where("publishedAt", "!=", null)` (inequality) combined with either `where("isFeatured", "==", true)` (equality) or `orderBy("displayOrder")`. The equality field must come first.

### 3. Database ID mismatch: `default` vs `(default)`

Firebase's standard database is named `(default)` (with parentheses). Our code explicitly targets a database named `default` (without parentheses):

```typescript
// lib/firebase/admin.ts line 56
const db = getFirestore(getAdminApp(), "default");
```

This was done in a previous fix to resolve a `5 NOT_FOUND` seeding error. However, this means:

- **Our data lives in a database named `default`** (a separate named database).
- **`firebase deploy --only firestore:indexes` deploys to `(default)` by default** — the wrong database.
- **`firebase.json` does not specify `"database": "default"`**, so all Firebase CLI operations (rules, indexes) target `(default)`.

If the user indeed has **two databases** (`default` and `(default)`), this confirms the mismatch: data + queries target `default`, but CLI deployments and console defaults target `(default)`.

### 4. `icon-192.png` and `icon-512.png` return 404

PWA manifest references `/icon-192.png` and `/icon-512.png` which don't exist in `public/`. These 404 requests also pass through the `[locale]` catch-all, triggering the same Firestore index errors (cascading failures).

---

## Fix Plan

### Step 1: Fix `firestore.indexes.json` field order

Swap the field order for `collections` and `products` indexes to match what Firestore requires.

### Step 2: Add `"database": "default"` to `firebase.json`

Ensure the Firebase CLI targets the correct database:

```json
{
  "firestore": {
    "database": "default",
    "rules": "firestore.rules",
    "indexes": "firestore.indexes.json"
  }
}
```

### Step 3: Deploy indexes to production

```bash
firebase deploy --only firestore:indexes
```

This will create the composite indexes on the `default` database where our data lives.

### Step 4: Verify (or clean up) dual databases

Go to the Firebase Console → Firestore Database and check if both `(default)` and `default` databases exist. If so:

- Confirm all data is in `default`
- Consider deleting the empty `(default)` database (or vice versa — migrate to `(default)` and remove the explicit `"default"` argument from the code)

### Step 5: Add missing PWA icons

Add `icon-192.png` and `icon-512.png` to the `public/` directory, or update `manifest.webmanifest` to remove references to them.

---

## Long-term Recommendation

Consider migrating back to the standard `(default)` database to avoid confusion. The explicit `"default"` database ID was a workaround for a seeding issue but creates an ongoing maintenance burden where every Firebase CLI command must specify `--database default`.
