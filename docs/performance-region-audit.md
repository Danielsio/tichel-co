# Performance & Region Audit: Tel Aviv DB vs Europe DB

> **Date:** 2026-03-08
> **Goal:** Determine the optimal region for Firestore (and other backend services) given that Firebase App Hosting runs in `europe-west4` (Netherlands).

---

## Current Architecture

```
Israeli User ──[~40ms]──► Firebase Hosting (europe-west4, Netherlands)
                              │
                              │  SSR: Server Component renders HTML
                              │  Needs data from Firestore...
                              │
                              ▼
                   ──[~30-50ms]──► Firestore (me-west1, Tel Aviv)
                                       │
                              ◄──[~30-50ms]──┘  response
                              │
                              │  Render HTML with data
                              ▼
Israeli User ◄──[~40ms]── Firebase Hosting (europe-west4, Netherlands)
```

**Total network path for one SSR page:** ~160-220ms in network latency alone (4 cross-region hops).

### The Real Problem: Multiple Queries Per Page

SSR pages don't make just one Firestore call. Here's what each critical page does:

| Page           | Firestore Queries                                                                                                    | Cross-Region Round Trips |
| -------------- | -------------------------------------------------------------------------------------------------------------------- | ------------------------ |
| **Home**       | `getFeaturedProducts()` + `getPublishedCollections()` + N × `fetchVariants()`                                        | 2 + N                    |
| **Collection** | `getCollectionBySlug()` + `getProductsByCollection()` + N × `fetchVariants()`                                        | 2 + N                    |
| **Product**    | `getProductBySlug()` + `getRelatedProducts()` (fetches ALL products) + N × `fetchVariants()` + `getCollectionById()` | 3 + N                    |

With 10 products, the Home page makes **~12 round trips** to Firestore. At 60-100ms per round trip (Netherlands ↔ Tel Aviv), that's **720-1200ms** of pure network latency before any rendering begins.

---

## Proposed Architecture (Co-located in Europe)

```
Israeli User ──[~40ms]──► Firebase Hosting (europe-west4, Netherlands)
                              │
                              │  SSR: Server Component renders HTML
                              │  Needs data from Firestore...
                              │
                              ▼
                   ──[~1-3ms]──► Firestore (europe-west4, Netherlands)  ← SAME REGION
                                       │
                              ◄──[~1-3ms]──┘  response
                              │
                              │  Render HTML with data
                              ▼
Israeli User ◄──[~40ms]── Firebase Hosting (europe-west4, Netherlands)
```

**Total network path for one SSR page:** ~80-86ms (2 cross-region hops + local DB calls).

### Impact on Multi-Query Pages

| Page                        | Queries | Current Latency (DB) | Co-located Latency (DB) | Saved           |
| --------------------------- | ------- | -------------------- | ----------------------- | --------------- |
| **Home** (10 products)      | 12      | 720-1200ms           | 12-36ms                 | **~700-1160ms** |
| **Collection** (8 products) | 10      | 600-1000ms           | 10-30ms                 | **~590-970ms**  |
| **Product** (4 related)     | ~8      | 480-800ms            | 8-24ms                  | **~470-776ms**  |

---

## Web Vitals Comparison (Measured 2026-03-08)

These measurements compare Vercel (Frankfurt) vs Firebase Hosting (Netherlands), both hitting Firestore in Tel Aviv.

| Metric    | Vercel (Frankfurt) | Firebase (Netherlands) | Rating                  |
| --------- | ------------------ | ---------------------- | ----------------------- |
| **TTFB**  | 287ms              | 171ms                  | Firebase 40% faster     |
| **FCP**   | 2836ms             | 248ms                  | Firebase **11x faster** |
| DNS       | 69ms               | 0ms                    | Firebase                |
| TCP       | 145ms              | 0ms                    | Firebase                |
| TLS       | 134ms              | 0ms                    | Firebase                |
| Server    | 71ms               | 169ms                  | Vercel                  |
| Download  | 4231ms             | 795ms                  | Firebase 5x faster      |
| DOM Ready | 4521ms             | 967ms                  | Firebase 4.7x faster    |
| Full Load | 4563ms             | 1637ms                 | Firebase 2.8x faster    |
| Transfer  | 17.9 KB            | 20.8 KB                | Vercel (smaller)        |

**Note:** Firebase's 0ms DNS/TCP/TLS indicates a warm connection or HTTP/2 reuse. Real-world first-visit numbers would be higher but still significantly better than Vercel.

**Key insight:** Firebase Hosting already wins by a huge margin. Co-locating Firestore in the same region would make it even faster by eliminating 700-1200ms of cross-region DB latency from SSR.

---

## Impact on Client-Side Queries

Some features use the Firebase Client SDK directly from the user's browser:

| Feature                  | Current (Israel → Tel Aviv) | Proposed (Israel → Netherlands) | Impact                               |
| ------------------------ | --------------------------- | ------------------------------- | ------------------------------------ |
| Cart sync (`onSnapshot`) | ~5-10ms                     | ~30-50ms                        | Slightly slower, still imperceptible |
| Order history            | ~5-10ms                     | ~30-50ms                        | Slightly slower, still fast          |
| Admin panel              | ~5-10ms                     | ~30-50ms                        | Slightly slower, acceptable          |
| Auth operations          | No change                   | No change                       | Auth is global                       |

**Verdict:** Client-side queries get ~20-40ms slower, which is imperceptible to users. SSR queries get **700-1200ms faster**, which is a dramatic improvement.

---

## Current Monitoring Gaps

| What We Have                                                           | What's Missing                                |
| ---------------------------------------------------------------------- | --------------------------------------------- |
| `WebVitalsReporter` — logs TTFB, FCP, LCP, INP, CLS to browser console | No server-side query timing in production     |
| `timed()` helper — logs Firestore query duration in dev only           | No persistent metrics storage or dashboards   |
| Manual browser DevTools testing                                        | No automated performance regression detection |
| No RUM (Real User Monitoring)                                          | No geographic performance breakdown           |

### Recommended Monitoring Stack

1. **Firebase Performance Monitoring** — free, captures network latency, custom traces, integrates with Firebase console
2. **Server Timing headers** — expose Firestore query durations in the `Server-Timing` HTTP header (visible in DevTools Network tab)
3. **Custom `perf` traces in production** — extend the existing `timed()` helper to log to Firebase Performance in production
4. **Lighthouse CI** — automated Lighthouse runs in GitHub Actions on every PR

---

## Recommendation

**Co-locate Firestore in `europe-west4` (Netherlands)** alongside Firebase App Hosting.

| Factor                 | Tel Aviv (me-west1)           | Netherlands (europe-west4) |
| ---------------------- | ----------------------------- | -------------------------- |
| SSR performance        | Slow (cross-region)           | **Fast (co-located)**      |
| Client-side queries    | 5-10ms                        | 30-50ms (still fast)       |
| SEO-critical pages     | Penalized by slow FCP         | **Optimized**              |
| Google Core Web Vitals | At risk                       | **Comfortably passing**    |
| Industry best practice | Against (DB far from compute) | **Aligned**                |

### Why This Is the Right Call

1. **SSR is the critical path.** Home, Collection, and Product pages are server-rendered — these are the pages Google indexes and users see first.
2. **The latency savings are massive.** 700-1200ms saved per page load dwarfs the 20-40ms increase on client-side queries.
3. **Every major cloud provider recommends co-locating DB with compute.** AWS, GCP, Azure, Vercel — all say put your database in the same region as your server.
4. **Client-side query impact is negligible.** 30-50ms is below human perception threshold (~100ms).

---

## Experiment Results (2026-03-08)

Tested from Israel with identical transfer sizes (21.0 KB).

| Metric       | IL DB (me-west1) | EU DB (europe-west4) | Improvement     |
| ------------ | ---------------- | -------------------- | --------------- |
| **TTFB**     | 318ms            | 172ms                | **46% faster**  |
| **FCP**      | 512ms            | 236ms                | **54% faster**  |
| Server       | 179ms            | 170ms                | ~same           |
| **Download** | **1064ms**       | **103ms**            | **10x faster**  |
| DOM Ready    | 1385ms           | 278ms                | **5x faster**   |
| Full Load    | 1492ms           | 467ms                | **3.2x faster** |

**Key finding:** Co-locating Firestore with App Hosting saved **961ms** of SSR response time — matching the predicted 700-1200ms from cross-region round trips.

**Decision:** Migrate production to `tichel-co-db-eu` (europe-west4).

---

## Post-Migration Checklist

- [x] Create `tichel-co-db-eu` in europe-west4
- [x] Deploy rules and indexes
- [x] Seed with production data
- [x] Validate performance improvement
- [ ] Merge PR and deploy to production
- [ ] Delete test backend `tichel-co-eu-test`
- [ ] Keep `tichel-co-db` (Tel Aviv) as backup for 2 weeks, then delete
- [ ] Storage bucket stays in me-west1 (not actively used; cannot be moved)
