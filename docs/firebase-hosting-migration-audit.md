# Firebase Hosting Migration Audit

> **Goal:** Fully migrate frontend hosting from Vercel to Firebase Hosting (Blaze plan, staying within free quotas).
>
> **Date:** 2026-03-07

---

## Compute Resources Comparison

| Resource                             | **Vercel Hobby (Free)** | **Firebase Hosting + Cloud Run (Blaze free quota)**   |
| ------------------------------------ | ----------------------- | ----------------------------------------------------- |
| **CPU per function/request**         | 1 vCPU (shared)         | 1 vCPU (default, configurable up to 8)                |
| **Memory per function**              | 1024 MB (max on Hobby)  | 512 MB default (configurable: 128 MB – 32 GB)         |
| **Function timeout**                 | 10 seconds              | 60s (Cloud Functions 1st gen) / 3,600s (Cloud Run)    |
| **Cold start**                       | ~250–500ms (Node.js)    | ~500–1500ms (Cloud Run), ~300–800ms (Cloud Functions) |
| **Concurrent requests per instance** | 1 (serverless)          | Up to 80 (Cloud Run), 1 (Cloud Functions)             |
| **Max instances**                    | Unspecified             | 100 (Cloud Run free), 1000 (Cloud Functions)          |
| **Free CPU allocation**              | Included in 100 GB-hrs  | 180,000 vCPU-seconds/month (~50 vCPU-hours)           |
| **Free memory allocation**           | Included in 100 GB-hrs  | 360,000 GiB-seconds/month (~100 GiB-hours)            |
| **Free requests**                    | 100,000/month           | 2,000,000/month (Cloud Run)                           |
| **Free egress (bandwidth)**          | 100 GB/month            | 360 GB/month (hosting) + 1 GB/month (Cloud Run)       |
| **Region**                           | Frankfurt (fra1)        | europe-west1 (Belgium) — configurable                 |

### Key takeaway

Cloud Run gives you **20x more free requests** and **configurable memory/CPU** (scale down to 128 MB for lightweight routes, scale up for heavy ones). Vercel locks you at 1024 MB whether you need it or not.

---

## Migration Checklist

### Phase 1: Remove Vercel Dependencies

- [ ] **Remove `@vercel/analytics` package**
  - File: `package.json` (line 33)
  - Run: `pnpm remove @vercel/analytics`

- [ ] **Remove `@vercel/speed-insights` package**
  - File: `package.json` (line 34)
  - Run: `pnpm remove @vercel/speed-insights`

- [ ] **Remove Vercel components from layout**
  - File: `app/layout.tsx` (lines 4–5, 71–72)
  - Remove `import { SpeedInsights }` and `import { Analytics }`
  - Remove `<SpeedInsights />` and `<Analytics />` from JSX

- [ ] **Delete `vercel.json`**
  - File: `vercel.json`

- [ ] **Clean up `.gitignore`**
  - File: `.gitignore` (lines 31–32) — remove `# Vercel` / `.vercel`

- [ ] **Clean up middleware matcher**
  - File: `middleware.ts` (line 7) — remove `_vercel` from the matcher pattern

### Phase 2: Configure Firebase Hosting

- [ ] **Add `hosting` section to `firebase.json`**
  - Point to Next.js output or configure Firebase Frameworks
  - Example config for Firebase Frameworks (auto-detects Next.js):
    ```json
    {
      "hosting": {
        "source": ".",
        "frameworksBackend": {
          "region": "europe-west1",
          "memory": "512MiB",
          "minInstances": 0,
          "maxInstances": 5
        }
      }
    }
    ```

- [ ] **Create `.firebaserc`**
  - Currently missing — needed for project alias
    ```json
    {
      "projects": {
        "default": "<your-firebase-project-id>"
      }
    }
    ```

- [ ] **Enable Firebase Frameworks (web frameworks) experiment**
  - Run: `firebase experiments:enable webframeworks`
  - This lets Firebase auto-detect Next.js and deploy SSR to Cloud Run

- [ ] **Decide on architecture** (see Architecture Options below)

### Phase 3: Migrate API Routes

The following API routes run on Vercel's serverless runtime and must be handled:

| Route                              | Purpose                     | Migration path                                                 |
| ---------------------------------- | --------------------------- | -------------------------------------------------------------- |
| `app/api/webhooks/stripe/route.ts` | Stripe webhooks             | Keep in Next.js (runs on Cloud Run) OR move to Cloud Functions |
| `app/api/checkout/route.ts`        | Stripe checkout session     | Keep in Next.js (runs on Cloud Run)                            |
| `app/api/admin/set-role/route.ts`  | Firebase Auth custom claims | Keep in Next.js (runs on Cloud Run)                            |
| `app/api/revalidate/route.ts`      | On-demand ISR revalidation  | Remove or rework (ISR not supported on Firebase)               |

**Recommended:** Keep API routes in Next.js — Firebase Frameworks deploys the full Next.js app (including API routes) to Cloud Run automatically. No manual migration needed except for ISR.

### Phase 4: Handle ISR / Revalidation

- [ ] **Remove or rework `app/api/revalidate/route.ts`**
  - ISR is Vercel-specific; Firebase Hosting + Cloud Run doesn't support it natively
  - Options:
    1. Use standard SSR with short cache headers (e.g., `Cache-Control: s-maxage=300`)
    2. Use Firestore-triggered Cloud Function to clear CDN cache on data change
    3. Accept slightly stale data with `stale-while-revalidate` caching

### Phase 5: Replace Analytics

- [ ] **Add Firebase Analytics (or GA4) to replace Vercel Analytics**
  - Option A: Firebase Analytics via `firebase/analytics` SDK (already in the `firebase` package)
  - Option B: Google Analytics 4 via `gtag.js`
  - Option C: PostHog / Plausible / Umami for privacy-focused alternative

### Phase 6: Update CI/CD Pipeline

- [ ] **Update `.github/workflows/deploy.yml`**
  - Replace `deploy-frontend-staging` job:
    - Remove: `npx vercel deploy` and all `VERCEL_*` secrets
    - Add: `firebase deploy --only hosting --project ${{ secrets.FIREBASE_PROJECT_ID_DEV }}`
    - Or if using Firebase Frameworks: `firebase deploy --only hosting`

- [ ] **Remove Vercel secrets from GitHub repo settings**
  - `VERCEL_TOKEN`
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`

- [ ] **Add/verify Firebase CI secrets**
  - `FIREBASE_TOKEN` (already exists)
  - `FIREBASE_PROJECT_ID_DEV` (already exists)

### Phase 7: Testing & Validation

- [ ] **Test locally with Firebase emulators**
  - `firebase emulators:start --only hosting`
  - Verify SSR, API routes, middleware, i18n all work

- [ ] **Test Cloud Run deployment**
  - Verify cold start times are acceptable
  - Verify Stripe webhooks reach the correct endpoint
  - Update Stripe webhook URL from Vercel domain to Firebase domain

- [ ] **Update DNS / custom domain**
  - Add custom domain in Firebase Hosting console
  - Update DNS records (A / CNAME) to point to Firebase
  - Remove custom domain from Vercel

- [ ] **Update Stripe webhook endpoint URL**
  - Stripe Dashboard → Webhooks → update endpoint to new Firebase Hosting domain

---

## Architecture Options

### Option A: Firebase Frameworks (Recommended)

```
User → Firebase Hosting CDN → Cloud Run (Next.js SSR)
                             → Static assets served from CDN
```

- Firebase auto-detects Next.js and deploys SSR to Cloud Run
- Static assets are served directly from the CDN
- API routes, middleware, and SSR all work
- **Simplest migration path** — minimal code changes
- Run: `firebase experiments:enable webframeworks` then `firebase deploy`

### Option B: Static Export + Cloud Functions

```
User → Firebase Hosting CDN → Static HTML/JS/CSS
                             → Cloud Functions (API routes only)
```

- Set `output: 'export'` in `next.config.ts`
- Middleware won't run (i18n must be client-side)
- API routes must move to Cloud Functions
- More work, but lowest compute cost

### Option C: Dockerized Next.js on Cloud Run (manual)

```
User → Firebase Hosting CDN → Cloud Run (Docker container)
```

- Full control over the runtime
- Requires Dockerfile and Cloud Run configuration
- Most complex but most flexible

**Recommendation:** Go with **Option A** (Firebase Frameworks). It requires the least code changes, keeps all your API routes and middleware working, and is the officially supported path.

---

## What You Lose (and Workarounds)

| Vercel Feature                             | Lost?   | Workaround                                                                                         |
| ------------------------------------------ | ------- | -------------------------------------------------------------------------------------------------- |
| ISR (Incremental Static Regeneration)      | Yes     | Use SSR with `Cache-Control` headers                                                               |
| Preview Deployments (per PR)               | Yes     | Use Firebase Hosting preview channels: `firebase hosting:channel:deploy pr-123`                    |
| Image Optimization (`next/image` built-in) | Yes     | Not currently used (using `<img>`); if needed, use Cloudinary or `next/image` with a custom loader |
| Vercel Analytics                           | Yes     | Firebase Analytics / GA4                                                                           |
| Speed Insights                             | Yes     | Lighthouse CI / Web Vitals reporting                                                               |
| Edge Middleware                            | Partial | Middleware runs on Cloud Run (Node.js, not edge) — still works, just not at the edge               |
| Automatic HTTPS                            | No      | Firebase Hosting provides auto SSL                                                                 |
| Global CDN                                 | No      | Firebase Hosting uses Google's global CDN                                                          |

---

## Estimated Free Tier Usage (Tichel & Co.)

Assuming ~10,000 monthly visitors, ~5 pages/visit, ~2 MB average page weight:

| Metric                      | Estimated Usage         | Free Quota               | Status |
| --------------------------- | ----------------------- | ------------------------ | ------ |
| Hosting bandwidth           | ~100 GB/month           | 360 GB/month             | Safe   |
| Cloud Run requests          | ~50,000/month           | 2,000,000/month          | Safe   |
| Cloud Run CPU               | ~5,000 vCPU-seconds     | 180,000 vCPU-seconds     | Safe   |
| Cloud Run memory            | ~10,000 GiB-seconds     | 360,000 GiB-seconds      | Safe   |
| Cloud Functions invocations | ~2,000/month (webhooks) | 2,000,000/month          | Safe   |
| Firestore reads             | ~100,000/month          | 50,000/day (~1.5M/month) | Safe   |
| Firestore writes            | ~1,000/month            | 20,000/day (~600K/month) | Safe   |
| Firebase Auth               | ~500 MAU                | 50,000 MAU               | Safe   |
| Firebase Storage            | ~2 GB                   | 5 GB                     | Safe   |

You have significant headroom on the Blaze free quotas.

---

## Files Affected (Summary)

| File                           | Action                                               |
| ------------------------------ | ---------------------------------------------------- |
| `package.json`                 | Remove `@vercel/analytics`, `@vercel/speed-insights` |
| `app/layout.tsx`               | Remove Vercel component imports and JSX              |
| `vercel.json`                  | Delete                                               |
| `firebase.json`                | Add `hosting` section                                |
| `.firebaserc`                  | Create                                               |
| `middleware.ts`                | Remove `_vercel` from matcher (optional)             |
| `app/api/revalidate/route.ts`  | Remove or rework                                     |
| `.github/workflows/deploy.yml` | Replace Vercel deploy with Firebase deploy           |
| `.gitignore`                   | Remove `.vercel`, add `.firebase` if not present     |
