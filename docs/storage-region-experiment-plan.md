# Experiment Plan: Storage Region & Image Performance

> **Date:** 2026-03-08
> **Goal:** Determine if migrating product images from Unsplash URLs to Firebase Storage improves LCP, and which storage region is optimal.

---

## Why This Matters

This project uses `next/image` for all product images. Unlike plain `<img>` tags, `next/image` routes image requests through the Next.js server for optimization:

```
User (Israel)
   │
   ▼
App Hosting (europe-west4) ──► /_next/image?url=<source>&w=640&q=75
   │
   │  1. Fetch original image from source
   │  2. Resize + convert to WebP/AVIF
   │  3. Cache the result
   │  4. Return optimized image
   │
   ▼
User (Israel)
```

The Next.js server (Netherlands) must fetch the original image from the source. This means image source location affects performance the same way Firestore location did.

### Key Difference from Firestore Test

`next/image` **caches optimized images**. So the source location only affects:

1. **First request** for each image × size combination (cold cache)
2. **New/updated images** after cache invalidation (deploy, new products)
3. **LCP on first visit** after a deployment or cold start

After the cache is warm, images are served from the Next.js cache regardless of source. This means the impact is **real but less dramatic** than the Firestore improvement.

---

## Current State

| Element           | Source                          | Location                   |
| ----------------- | ------------------------------- | -------------------------- |
| Product images    | Unsplash URLs                   | Global CDN (edge unknown)  |
| Collection images | Unsplash URLs                   | Global CDN (edge unknown)  |
| Lookbook images   | Unsplash URLs (hardcoded)       | Global CDN (edge unknown)  |
| Storage bucket    | `tichel-co.firebasestorage.app` | me-west1 (Tel Aviv)        |
| App Hosting       | Cloud Run                       | europe-west4 (Netherlands) |

### LCP Elements by Page

| Page       | Likely LCP Element          | Has `priority`? |
| ---------- | --------------------------- | --------------- |
| Home       | First collection grid image | No (should add) |
| Product    | Product gallery main image  | Yes             |
| Collection | First product card image    | No              |

---

## What We're Testing

Three image source scenarios, all measured from Israel:

| Scenario    | Image Source              | Server Fetch Path                                 |
| ----------- | ------------------------- | ------------------------------------------------- |
| A (current) | Unsplash CDN              | Netherlands → Unsplash edge → Netherlands         |
| B           | Firebase Storage Tel Aviv | Netherlands → Tel Aviv (~50ms RT) → Netherlands   |
| C           | Firebase Storage Europe   | Netherlands → Netherlands (~1ms RT) → Netherlands |

---

## Test Plan

### Phase 1: Prepare Images

#### 1.1 Download Unsplash images used in seed data

Create a script (`scripts/download-seed-images.ts`) that:

1. Reads all image URLs from the seed data (products + collections + variants)
2. Downloads each image to a local `tmp/seed-images/` folder
3. Names them by product/variant ID for easy mapping

#### 1.2 Upload to Firebase Storage Tel Aviv

Upload downloaded images to the existing `tichel-co.firebasestorage.app` bucket:

```
products/{productId}/{variantId}/{index}.jpg
collections/{collectionId}/cover.jpg
```

#### 1.3 Create European Storage bucket + upload

```bash
gcloud storage buckets create gs://tichel-co-eu-images \
  --location=europe-west4 \
  --project=tichel-co \
  --default-storage-class=standard \
  --uniform-bucket-level-access
```

Upload the same images to the EU bucket with identical paths.

#### 1.4 Make bucket URLs publicly readable

Set IAM for both buckets to allow public read (or use Firebase Storage download URLs).

---

### Phase 2: Create Test Variants

#### 2.1 Make image source configurable

Add env var `IMAGE_SOURCE` with values: `unsplash` | `storage-il` | `storage-eu`

Create a helper function:

```typescript
function getStorageBaseUrl(): string {
  const source = process.env.NEXT_PUBLIC_IMAGE_SOURCE ?? "unsplash";
  if (source === "storage-eu")
    return "https://firebasestorage.googleapis.com/v0/b/tichel-co-eu-images/o/";
  if (source === "storage-il")
    return "https://firebasestorage.googleapis.com/v0/b/tichel-co.firebasestorage.app/o/";
  return null; // use original Unsplash URLs
}
```

#### 2.2 Create 3 seed data variants

Modify the seed script to accept `IMAGE_SOURCE` and write the appropriate URLs to Firestore.

#### 2.3 Update next.config.ts

Add the EU storage bucket hostname to `remotePatterns` (already has the default bucket).

---

### Phase 3: Deploy & Measure

#### 3.1 Test methodology

For each scenario (A, B, C):

1. Seed the EU Firestore database with the appropriate image URLs
2. Deploy/redeploy to clear the Next.js image cache
3. Wait 2 minutes for cold start to settle
4. Run **5 page loads** from Israel with cache cleared (hard refresh)
5. Record: **LCP**, FCP, TTFB, full load time
6. Also record from Chrome DevTools Network tab: image request timing

#### 3.2 Pages to test

| Page                                                | Why                                 | LCP Element              |
| --------------------------------------------------- | ----------------------------------- | ------------------------ |
| Home (`/he`)                                        | Most visited, multiple images       | First collection image   |
| Product (`/he/products/ivory-silk-square-tichel`)   | Key conversion page                 | Gallery main image       |
| Collection (`/he/collections/signature-collection`) | Browse page, multiple product cards | First product card image |

#### 3.3 Metrics to record

| Metric                        | Scenario A (Unsplash) | Scenario B (Storage IL) | Scenario C (Storage EU) |
| ----------------------------- | --------------------- | ----------------------- | ----------------------- |
| LCP (home)                    |                       |                         |                         |
| LCP (product)                 |                       |                         |                         |
| LCP (collection)              |                       |                         |                         |
| Image load time (first, cold) |                       |                         |                         |
| Image load time (warm cache)  |                       |                         |                         |
| Total page weight             |                       |                         |                         |
| Image format served           |                       |                         |                         |

---

### Phase 4: Additional Optimizations to Test

While we're testing image performance, also evaluate:

#### 4.1 Add `priority` to above-the-fold images

Currently only the product gallery has `priority`. Add to:

- Home page: first 2-3 collection images
- Collection page: first 2-4 product card images

This tells Next.js to preload these images, significantly improving LCP regardless of source.

#### 4.2 Image format comparison

Check what format `next/image` serves:

- WebP (default)
- AVIF (if browser supports, much smaller)

Add to `next.config.ts`:

```typescript
images: {
  formats: ['image/avif', 'image/webp'],
}
```

#### 4.3 Responsive sizing audit

Verify `sizes` props are accurate for actual rendered sizes. Oversized images waste bandwidth.

---

## Expected Outcomes

### Scenario A (Unsplash CDN) — current

- Pro: Unsplash has a strong global CDN, likely fast from Europe
- Con: No control over availability, rate limits, external dependency
- Con: URL structure adds query params (`?w=800&q=80`) which Next.js re-optimizes anyway

### Scenario B (Firebase Storage Tel Aviv)

- Pro: We control the images
- Con: Cross-region fetch from Netherlands (same issue as Firestore)
- Expected: Slower than Unsplash for cold cache

### Scenario C (Firebase Storage Europe)

- Pro: Co-located with App Hosting, fastest server fetch
- Pro: We control the images
- Expected: Fastest cold-cache performance

### Overall prediction

The difference between scenarios will be **smaller than the Firestore test** because:

1. `next/image` caching means only cold requests are affected
2. Images are fetched in parallel (not sequential like Firestore queries)
3. Image optimization time dominates over fetch time for large images

The bigger wins will likely come from **optimization fixes** (adding `priority`, AVIF format, correct `sizes`) rather than source location.

---

## Decision Framework

After testing, decide based on:

| If...                                                       | Then...                                                |
| ----------------------------------------------------------- | ------------------------------------------------------ |
| EU Storage is significantly faster (>200ms LCP improvement) | Migrate images to EU Storage                           |
| Difference is marginal (<100ms)                             | Stay on Unsplash for now, focus on `priority` and AVIF |
| Storage IL is slowest                                       | Confirms cross-region penalty, avoid for images        |

---

## Risk Assessment

| Risk                                  | Impact                             | Mitigation                                             |
| ------------------------------------- | ---------------------------------- | ------------------------------------------------------ |
| Firebase Storage costs (bandwidth)    | Low — images are cached by Next.js | Monitor billing                                        |
| Losing Unsplash CDN edge performance  | Medium                             | Test first, don't migrate blindly                      |
| Storage bucket public access security | Low                                | Read-only public access is standard for product images |
| Image management complexity           | Medium                             | Will need admin UI for image uploads later anyway      |

---

## Timeline

| Phase                         | Estimated Time |
| ----------------------------- | -------------- |
| Phase 1: Prepare images       | 1 hour         |
| Phase 2: Create test variants | 1 hour         |
| Phase 3: Deploy & measure     | 2 hours        |
| Phase 4: Optimization fixes   | 1 hour         |
| **Total**                     | **~5 hours**   |
