# Experiment Plan: European Firestore Region

> **Date:** 2026-03-08
> **Goal:** Create a Firestore database in `europe-west4`, seed it, deploy a preview build pointing to it, and measure the performance difference vs the current `me-west1` (Tel Aviv) database.

---

## Overview

Firebase supports **multiple named databases** per project. We'll create a second database (`tichel-co-db-eu`) in `europe-west4` alongside the existing `tichel-co-db` in `me-west1`. This lets us A/B test without touching production data.

```
┌─────────────────────────────────────────────────────┐
│              Firebase Project: tichel-co             │
│                                                      │
│  ┌──────────────────┐    ┌──────────────────────┐   │
│  │  tichel-co-db    │    │  tichel-co-db-eu     │   │
│  │  Region: me-west1│    │  Region: europe-west4│   │
│  │  (Tel Aviv)      │    │  (Netherlands)       │   │
│  │  ← PRODUCTION    │    │  ← EXPERIMENT        │   │
│  └──────────────────┘    └──────────────────────┘   │
│                                                      │
│  Firebase App Hosting: europe-west4 (Netherlands)    │
└─────────────────────────────────────────────────────┘
```

---

## Step-by-Step Plan

### Phase 1: Create the European Database

#### 1.1 Create Firestore database in `europe-west4`

```bash
gcloud firestore databases create \
  --database=tichel-co-db-eu \
  --location=europe-west4 \
  --type=firestore-native \
  --project=tichel-co
```

#### 1.2 Deploy Firestore rules and indexes to the new database

```bash
firebase deploy --only firestore:rules,firestore:indexes \
  --project tichel-co \
  --database tichel-co-db-eu
```

#### 1.3 Create a Storage bucket in `europe-west4` (if needed)

```bash
gcloud storage buckets create gs://tichel-co-eu-assets \
  --location=europe-west4 \
  --project=tichel-co \
  --default-storage-class=standard \
  --uniform-bucket-level-access
```

> **Note:** Product images currently use Unsplash URLs, so Storage region is not critical yet. This step is for future-proofing.

---

### Phase 2: Make Database Name Configurable

#### 2.1 Add environment variable for database name

Add to `.env.local` and `apphosting.yaml`:

```
FIRESTORE_DATABASE_ID=tichel-co-db
```

#### 2.2 Update `lib/firebase/admin.ts`

```typescript
const DB_ID = process.env.FIRESTORE_DATABASE_ID ?? "tichel-co-db";

export function getAdminDb(): Firestore {
  if (!_db) {
    const db = getFirestore(getAdminApp(), DB_ID);
    db.settings({ preferRest: true });
    _db = db;
  }
  return _db;
}
```

#### 2.3 Update `lib/firebase/client.ts`

```typescript
const DB_ID = process.env.NEXT_PUBLIC_FIRESTORE_DATABASE_ID ?? "tichel-co-db";
export const db = getFirestore(app, DB_ID);
```

#### 2.4 Update `firebase.json` (optional for local dev)

Add a comment or second config entry for the EU database.

---

### Phase 3: Seed the European Database

#### 3.1 Create a cross-region seed script

Create `scripts/seed-eu-db.ts` that:

1. Reads all data from `tichel-co-db` (me-west1) using Admin SDK
2. Writes it to `tichel-co-db-eu` (europe-west4)
3. Copies all collections: `products`, `products/*/variants`, `collections`, `discountCodes`
4. Preserves document IDs and all fields

```typescript
// Pseudocode
const sourceDb = getFirestore(app, "tichel-co-db");
const targetDb = getFirestore(app, "tichel-co-db-eu");

for (const collection of ["products", "collections", "discountCodes"]) {
  const snap = await sourceDb.collection(collection).get();
  for (const doc of snap.docs) {
    await targetDb.collection(collection).doc(doc.id).set(doc.data());
    // Handle subcollections (variants)
  }
}
```

#### 3.2 Alternatively: run existing seed script against the EU database

If there's an existing seed script, just set `FIRESTORE_DATABASE_ID=tichel-co-db-eu` and run it.

---

### Phase 4: Create a PR with EU Database Config

#### 4.1 Create a feature branch

```bash
git checkout -b experiment/eu-region-firestore
```

#### 4.2 Code changes

- `lib/firebase/admin.ts` — use `FIRESTORE_DATABASE_ID` env var
- `lib/firebase/client.ts` — use `NEXT_PUBLIC_FIRESTORE_DATABASE_ID` env var
- `apphosting.yaml` — add the new env vars pointing to `tichel-co-db-eu`
- `.env.example` — document the new env vars

#### 4.3 Enhanced performance logging

Update `WebVitalsReporter` to also display the database region (can be a simple env var `NEXT_PUBLIC_DB_REGION`).

Update `admin-queries.ts` `timed()` to log in production (to Firebase Performance or console).

#### 4.4 Push and create PR

```bash
git push -u origin experiment/eu-region-firestore
gh pr create --title "experiment: test EU-region Firestore for performance" \
  --body "..."
```

The Firebase App Hosting preview deployment will automatically use the EU database.

---

### Phase 5: Performance Testing

#### 5.1 Test both deployments from Israel

Run the following tests from an Israeli network connection:

| Test              | Tool                                        | What It Measures           |
| ----------------- | ------------------------------------------- | -------------------------- |
| Web Vitals        | Browser DevTools console                    | TTFB, FCP, LCP, INP, CLS   |
| Network waterfall | DevTools Network tab                        | Per-request timing         |
| Server Timing     | DevTools Network → response headers         | Firestore query durations  |
| Lighthouse        | Chrome Lighthouse                           | Overall performance score  |
| WebPageTest       | webpagetest.org (Israel agent if available) | Filmstrip, waterfall, TTFB |

#### 5.2 Metrics to compare

| Metric                         | Current (Tel Aviv DB) | EU DB | Δ   |
| ------------------------------ | --------------------- | ----- | --- |
| TTFB                           |                       |       |     |
| FCP                            |                       |       |     |
| LCP                            |                       |       |     |
| Server processing time         |                       |       |     |
| Firestore query total (server) |                       |       |     |
| DOM Ready                      |                       |       |     |
| Full Load                      |                       |       |     |

#### 5.3 Run multiple tests

- Run each test **at least 5 times** per deployment
- Test at different times of day (morning, evening)
- Test on mobile (throttled) and desktop
- Record median values

---

### Phase 6: Decision & Rollout

#### If EU is faster (expected):

1. Make `tichel-co-db-eu` the production database
2. Update `apphosting.yaml` to point to `tichel-co-db-eu`
3. Migrate any new production data written since the seed
4. Update Firestore rules deployment to target the EU database
5. Keep `tichel-co-db` (Tel Aviv) as a backup/archive
6. Update `firebase.json` default database

#### If EU is NOT faster:

1. Investigate why (cold starts? caching? other bottleneck?)
2. Consider hybrid approach with multi-region database
3. Document findings and close the experiment

---

## Monitoring Improvements (Implement Regardless of Outcome)

### 1. Firebase Performance Monitoring

```bash
pnpm add firebase
# Already installed — just initialize the Performance module
```

```typescript
// lib/firebase/client.ts
import { getPerformance } from "firebase/performance";
export const perf = typeof window !== "undefined" ? getPerformance(app) : null;
```

### 2. Server-Side Query Timing in Production

Update `timed()` in `admin-queries.ts` to always log and expose via `Server-Timing` header:

```typescript
async function timed<T>(label: string, fn: () => Promise<T>): Promise<T> {
  const start = performance.now();
  const result = await fn();
  const ms = performance.now() - start;
  // Log in all environments
  console.log(`[perf] ${label}: ${ms.toFixed(1)}ms`);
  return result;
}
```

### 3. Lighthouse CI in GitHub Actions

Add a Lighthouse CI step to the PR workflow that runs against the preview deployment and fails if performance scores drop below thresholds.

### 4. Real User Monitoring (RUM)

Extend `WebVitalsReporter` to send metrics to an endpoint (Firebase Analytics, PostHog, or a simple Cloud Function) for aggregation and dashboarding.

---

## Risk Assessment

| Risk                                                   | Likelihood | Impact                       | Mitigation                         |
| ------------------------------------------------------ | ---------- | ---------------------------- | ---------------------------------- |
| EU database has higher latency for client-side queries | High       | Low (30-50ms, imperceptible) | Accept the trade-off               |
| Seed script misses data                                | Low        | Medium                       | Verify counts after seeding        |
| Firestore rules not deployed to EU DB                  | Low        | High (security)              | Include in deployment script       |
| Cold start on new DB instance                          | Medium     | Low (one-time)               | Warm up with test queries          |
| Cost of running two databases                          | Low        | Low (free tier covers it)    | Delete Tel Aviv DB after migration |

---

## Timeline

| Phase                         | Estimated Time |
| ----------------------------- | -------------- |
| Phase 1: Create EU database   | 15 minutes     |
| Phase 2: Make DB configurable | 30 minutes     |
| Phase 3: Seed data            | 30 minutes     |
| Phase 4: Create PR            | 15 minutes     |
| Phase 5: Performance testing  | 1-2 hours      |
| Phase 6: Decision & rollout   | 30 minutes     |
| **Total**                     | **~3-4 hours** |
