/**
 * Algolia search — deferred to post-MVP.
 *
 * At 10–25 products, all filtering is done client-side:
 *   const filtered = products.filter(p => p.color === "ivory" && p.priceCents <= 50000);
 *
 * When the catalog grows to 200+ products, add Algolia:
 *   1. pnpm add algoliasearch
 *   2. Set NEXT_PUBLIC_ALGOLIA_APP_ID, NEXT_PUBLIC_ALGOLIA_SEARCH_KEY, ALGOLIA_ADMIN_KEY
 *   3. Create two indices: products_he and products_en
 *   4. Add a Cloud Function to sync Firestore → Algolia on product writes
 */

export {};
