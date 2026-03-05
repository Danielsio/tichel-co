# E2E Testing with Firebase Emulator — Migration Audit

## Current State

- **Unit tests**: 250 tests via Vitest, 87%+ coverage, all Firebase mocked — solid
- **E2E tests**: 2 smoke tests (page loads with header), no Firebase data, no real user flows
- **CI E2E**: Runs against app with placeholder Firebase config, no data, no emulator
- **Emulator support**: Already exists in `firebase.json` (auth:9099, firestore:8080, storage:9199) and `lib/firebase/client.ts` (checks `NEXT_PUBLIC_USE_FIREBASE_EMULATORS`)
- **Seed script**: Already supports emulator mode (default, no `SEED_PRODUCTION` needed)
- **Admin SDK issue**: `lib/firebase/admin.ts` does NOT support emulator — needs `FIRESTORE_EMULATOR_HOST` env var for Admin SDK to connect to emulator

---

## Changes Required

### 1. Admin SDK Emulator Support

**File**: `lib/firebase/admin.ts`

**Problem**: The Admin SDK always tries to authenticate with real credentials. When running against the emulator, it should skip credential validation and connect to the local emulator.

**Fix**: Detect `FIRESTORE_EMULATOR_HOST` env var. When set, initialize the Admin app without credentials and connect to the emulator. The Firebase Admin SDK automatically uses the emulator when `FIRESTORE_EMULATOR_HOST` is set, but still requires a valid app initialization.

```typescript
function getAdminApp(): App {
  if (_app) return _app;
  if (getApps().length) {
    _app = getApps()[0]!;
    return _app;
  }

  // Emulator mode: no real credentials needed
  if (process.env.FIRESTORE_EMULATOR_HOST) {
    _app = initializeApp({ projectId: "demo-tichel-co" });
    return _app;
  }

  _app = initializeApp({ credential: getCredential() });
  return _app;
}
```

---

### 2. Playwright Config for Emulator

**File**: `playwright.config.ts`

**Problem**: Currently runs `pnpm build && pnpm start` with no emulator, no env vars for emulator mode.

**Fix**: Update the webServer command to:

1. Start Firebase emulators
2. Seed the emulator with test data
3. Build and start the Next.js app with emulator env vars

Since Playwright only supports a single `webServer` (or array), we need a script that orchestrates emulator + seed + app startup.

**New file**: `scripts/e2e-setup.sh` (bash for CI, also works locally)

```bash
#!/usr/bin/env bash
set -e

# Start Firebase emulators in background
npx firebase emulators:start --only auth,firestore,storage &
EMULATOR_PID=$!

# Wait for Firestore emulator to be ready
until curl -s http://127.0.0.1:8080 > /dev/null 2>&1; do
  sleep 1
done

# Seed the emulator
npx tsx scripts/seed-firestore.ts

# Build and start Next.js
pnpm build
pnpm start &
NEXT_PID=$!

# Wait for Next.js to be ready
until curl -s http://localhost:3000 > /dev/null 2>&1; do
  sleep 1
done

# Keep running until interrupted
wait $NEXT_PID
```

**Updated `playwright.config.ts`**:

```typescript
export default defineConfig({
  webServer: [
    {
      command: "npx firebase emulators:start --only auth,firestore,storage",
      port: 8080,
      reuseExistingServer: !process.env.CI,
      timeout: 30000,
    },
    {
      command: "npx tsx scripts/seed-firestore.ts && pnpm build && pnpm start",
      port: 3000,
      reuseExistingServer: !process.env.CI,
      timeout: 120000,
      env: {
        NEXT_PUBLIC_USE_FIREBASE_EMULATORS: "true",
        FIRESTORE_EMULATOR_HOST: "127.0.0.1:8080",
        FIREBASE_AUTH_EMULATOR_HOST: "127.0.0.1:9099",
        NEXT_PUBLIC_FIREBASE_API_KEY: "demo-key",
        NEXT_PUBLIC_FIREBASE_PROJECT_ID: "demo-tichel-co",
        NEXT_PUBLIC_DEFAULT_LOCALE: "he",
      },
    },
  ],
});
```

---

### 3. CI Workflow Update

**File**: `.github/workflows/ci.yml`

**Problem**: E2E job uses placeholder Firebase config, no emulator, no data.

**Fix**: Install Java (required by Firebase emulators), install Firebase CLI, and let Playwright handle emulator + app startup via the updated config.

```yaml
e2e:
  name: E2E Tests
  runs-on: ubuntu-latest
  needs: [build]
  steps:
    - uses: actions/checkout@v4
    - uses: actions/setup-java@v4
      with:
        distribution: temurin
        java-version: 21
    - uses: pnpm/action-setup@v3
      with: { version: 9 }
    - uses: actions/setup-node@v4
      with:
        node-version: 20
        cache: pnpm
    - run: pnpm install --frozen-lockfile
    - run: npx firebase setup:emulators:firestore
    - run: npx firebase setup:emulators:storage
    - run: pnpm exec playwright install --with-deps chromium
    - run: pnpm test:e2e
    - uses: actions/upload-artifact@v4
      if: always()
      with:
        name: playwright-report
        path: playwright-report/
        retention-days: 14
```

---

### 4. E2E Test Suite — Comprehensive Tests

**Directory**: `e2e/`

All tests run against the emulator with seeded data (5 collections, 12 products).

#### 4a. `e2e/home.test.ts` — Home Page

| Test                                      | What it verifies                                             |
| ----------------------------------------- | ------------------------------------------------------------ |
| Loads in Hebrew with RTL                  | `lang="he"`, `dir="rtl"`, no `/he` prefix                    |
| Displays all 5 collections                | Collection titles from seed data visible                     |
| Displays featured products                | At least 1 featured product card with Hebrew title and price |
| Collection links navigate correctly       | Click collection -> `/collections/{slug}` page loads         |
| Featured product links navigate correctly | Click product -> `/products/{slug}` page loads               |
| CTA buttons are visible and functional    | "לקולקציה" and "עיצוב מותאם אישית" buttons work              |

#### 4b. `e2e/collections.test.ts` — Collection Pages

| Test                                       | What it verifies                                                          |
| ------------------------------------------ | ------------------------------------------------------------------------- |
| Collection page shows correct title        | Navigate to `/collections/signature-collection`, verify title             |
| Products are displayed in collection       | Products belonging to the collection are rendered                         |
| Product cards show price in ILS            | Formatted price (e.g., "₪289.00") visible                                 |
| "New" badge appears on new products        | Products with `isNew: true` show badge                                    |
| Sale badge on discounted products          | Products with `comparePriceCents` show original/sale price                |
| Empty collection shows appropriate message | Navigate to a collection with 0 products (none in seed — skip or add one) |
| Collection sidebar shows all collections   | All 5 collection links visible                                            |
| Navigate between collections               | Click different collection in sidebar -> page updates                     |

#### 4c. `e2e/product.test.ts` — Product Detail Page

| Test                                     | What it verifies                                                    |
| ---------------------------------------- | ------------------------------------------------------------------- |
| Product page shows title and description | Hebrew title and description from seed data                         |
| Product page shows price                 | Correctly formatted ILS price                                       |
| Variant selector works                   | Click different variant -> image changes                            |
| Image gallery navigation                 | Click thumbnail -> main image updates                               |
| Keyboard gallery navigation              | ArrowLeft/ArrowRight navigates images                               |
| Add to cart button works                 | Click "Add to Cart" -> cart drawer opens with item                  |
| Related products are shown               | Products from same collection appear in "related" section           |
| Breadcrumb navigation works              | Breadcrumb shows collection -> product, links work                  |
| Out-of-stock variant is disabled         | Variant with `stockQty: 0` (prod-011 lavender) shows disabled state |
| Product page has correct meta title      | `document.title` includes product name                              |

#### 4d. `e2e/cart.test.ts` — Cart & Cart Drawer

| Test                                  | What it verifies                                 |
| ------------------------------------- | ------------------------------------------------ |
| Cart drawer opens on add-to-cart      | Adding product opens drawer with correct item    |
| Cart shows correct quantity and price | Quantity, unit price, and line total are correct |
| Increment/decrement quantity          | +/- buttons update quantity and total            |
| Remove item from cart                 | Remove button removes the item                   |
| Cart persists across navigation       | Add item, navigate away, cart icon shows count   |
| Multiple products in cart             | Add 2 different products, both appear in cart    |
| Cart total is calculated correctly    | Sum of all line totals matches displayed total   |
| Empty cart shows empty state          | Open cart with no items -> empty message visible |
| Cart link navigates to cart page      | "View Cart" or similar navigates to `/cart`      |

#### 4e. `e2e/auth.test.ts` — Authentication (Emulator)

| Test                            | What it verifies                                                      |
| ------------------------------- | --------------------------------------------------------------------- |
| Register with email/password    | Fill form -> account created in auth emulator                         |
| Login with email/password       | Login with registered user -> redirected to account                   |
| Account page shows user info    | Email displayed on account page                                       |
| Logout works                    | Click logout -> redirected to home, no user state                     |
| Login required for account page | Navigate to `/account` while logged out -> redirected to `/login`     |
| Cart syncs after login          | Add items to cart, login -> cart persists (Firestore `cart/{userId}`) |

#### 4f. `e2e/admin.test.ts` — Admin Panel (Emulator)

| Test                                      | What it verifies                                          |
| ----------------------------------------- | --------------------------------------------------------- |
| Admin panel requires admin role           | Regular user cannot access `/admin`                       |
| Admin dashboard shows stats               | Product count, order count visible                        |
| Admin products list shows seeded products | 12 products listed                                        |
| Admin can edit product                    | Change title, save, verify update persists                |
| Admin can create new product              | Fill form, save, product appears in list                  |
| Admin orders page loads                   | Orders table renders (may be empty without checkout test) |
| Admin custom requests page loads          | Custom requests table renders                             |

#### 4g. `e2e/navigation.test.ts` — Navigation & Layout

| Test                                   | What it verifies                                                     |
| -------------------------------------- | -------------------------------------------------------------------- |
| Header renders with logo and nav links | Logo, navigation items visible                                       |
| Mobile menu opens and closes           | Hamburger menu on mobile viewport                                    |
| Footer renders with links              | Footer sections and links visible                                    |
| 404 page for invalid routes            | Navigate to `/products/nonexistent` -> 404 page                      |
| Error boundary catches errors          | Verify error page renders gracefully                                 |
| Static pages load                      | `/about`, `/terms`, `/returns`, `/privacy`, `/care-guide` all render |

#### 4h. `e2e/custom-request.test.ts` — Custom Request Form

| Test                         | What it verifies                              |
| ---------------------------- | --------------------------------------------- |
| Form renders with all fields | Name, email, description, file upload visible |
| Form validation works        | Submit empty form -> validation errors shown  |
| Form submits successfully    | Fill all fields, submit -> success message    |

---

### 5. Seed Script Updates

**File**: `scripts/seed-firestore.ts`

**Additional seed data needed for E2E**:

- None for products/collections — existing seed data is sufficient
- Auth emulator users will be created by E2E tests at runtime using the Auth Emulator REST API
- Admin claims will be set via `POST /api/admin/set-role` or directly via Auth Emulator Admin API

**E2E test helper** (`e2e/helpers.ts`):

```typescript
// Create user in Auth emulator
async function createEmulatorUser(email: string, password: string) { ... }

// Set admin claims via Auth Emulator REST API
async function setAdminClaims(uid: string) { ... }

// Login helper (fills login form)
async function loginAs(page: Page, email: string, password: string) { ... }

// Add product to cart helper
async function addProductToCart(page: Page, productSlug: string) { ... }
```

---

### 6. Admin SDK Emulator Connection for Server Components

**Problem**: The storefront pages use `lib/firebase/admin-queries.ts` -> `lib/firebase/admin.ts` (Admin SDK) for server-side rendering. When running against the emulator, the Admin SDK needs to know about the emulator via `FIRESTORE_EMULATOR_HOST`.

**Fix**: Already handled in change #1 — when `FIRESTORE_EMULATOR_HOST` is set, `admin.ts` initializes without credentials and the Admin SDK automatically routes Firestore calls to the emulator. The Playwright config sets this env var for the Next.js server.

---

### 7. `package.json` Scripts

Add convenience scripts:

```json
{
  "test:e2e:emulator": "firebase emulators:exec --only auth,firestore,storage 'npx tsx scripts/seed-firestore.ts && pnpm test:e2e'",
  "test:e2e:local": "pnpm test:e2e"
}
```

`firebase emulators:exec` starts emulators, runs the command, then shuts everything down cleanly.

---

## Implementation Priority

| #   | Task                                        | Effort | Impact                                  |
| --- | ------------------------------------------- | ------ | --------------------------------------- |
| 1   | Admin SDK emulator support (`admin.ts`)     | Small  | Critical — everything depends on this   |
| 2   | Playwright config with emulator web servers | Medium | Critical — test infrastructure          |
| 3   | E2E helpers (user creation, login, cart)    | Medium | Critical — shared across all test files |
| 4   | Home page tests                             | Small  | High — validates core storefront        |
| 5   | Product detail tests                        | Medium | High — most complex user flow           |
| 6   | Cart tests                                  | Medium | High — core commerce functionality      |
| 7   | Collection page tests                       | Small  | Medium — catalog browsing               |
| 8   | Auth tests (emulator)                       | Medium | High — login/register/sync              |
| 9   | Navigation & static page tests              | Small  | Medium — coverage                       |
| 10  | Admin panel tests                           | Medium | Medium — admin workflows                |
| 11  | Custom request form tests                   | Small  | Low — simple form                       |
| 12  | CI workflow update                          | Medium | Critical — makes it all work in CI      |

**Total new E2E tests: ~50-60 test cases across 8 test files**

---

## Risks & Considerations

1. **Java requirement**: Firebase emulators need Java. CI needs `actions/setup-java`. Adds ~20s to CI.
2. **Build time**: E2E in CI must build the app inside the emulator env. Consider caching the build artifact from the `build` job.
3. **Flakiness**: Emulator startup can be slow. Use generous timeouts and health checks.
4. **Stripe checkout**: Cannot fully test checkout without Stripe test mode. E2E should test up to the point of Stripe redirect, not the actual payment.
5. **Firebase CLI**: Must be available in CI. Already a devDependency (`firebase-tools` or installed globally via npm).
6. **Port conflicts**: Emulator ports (8080, 9099, 9199) must be free. Playwright spins up webServers that bind these ports.
7. **WebKit**: Firebase Auth emulator may have CORS issues with WebKit. Consider running E2E on Chromium only to reduce flakiness.
