# Tichel & Co. — MVP System Blueprint

### Luxury Modest Fashion E-Commerce · Firebase + Next.js 15 + Stripe

> **Version 1.1 · Solo Developer Edition**  
> One-person build. Frontend-first. Real backend only where unavoidable.  
> **Primary audience: Israeli users — Hebrew UI, RTL layout. Secondary: English/LTR.**

---

## Table of Contents

1. [Product Vision](#1-product-vision)
2. [Full UX Flow](#2-full-ux-flow)
3. [UI Design System](#3-ui-design-system)
4. [Internationalisation & RTL Architecture](#4-internationalisation--rtl-architecture)
5. [Technical Architecture](#5-technical-architecture)
6. [Folder Structure](#6-folder-structure)
7. [Firebase Data Design](#7-firebase-data-design)
8. [Development Phases](#8-development-phases)
9. [Testing Strategy](#9-testing-strategy)
10. [DevOps & Deployment](#10-devops--deployment)
11. [Future Mobile Strategy](#11-future-mobile-strategy)
12. [README — Setup & Workflow](#12-readme--setup--workflow)

---

## 1. Product Vision

### 1.1 Target Audience Persona

| Field                  | Detail                                                                |
| ---------------------- | --------------------------------------------------------------------- |
| **Name**               | Miriam — The Modern Observant Woman                                   |
| **Age**                | 24–45                                                                 |
| **Location**           | Israel (primary), US, UK, Canada — Jewish metropolitan areas          |
| **Primary Language**   | Hebrew — the app must feel native in Hebrew, not translated           |
| **Secondary Language** | English — for diaspora users and search engine indexing               |
| **Lifestyle**          | Observant Orthodox/Modern Orthodox, active social + professional life |
| **Pain Points**        | Existing head covering stores feel outdated, cheap, or lack curation  |
| **Desires**            | Feels fashionable and dignified simultaneously — not a compromise     |
| **Tech Comfort**       | Shops on mobile, uses Instagram, expects Apple-level polish           |
| **Spend Willingness**  | ₪180–₪900 per item (Israeli market primary). $50–$250 for diaspora.   |

### 1.2 Brand Positioning

Tichel & Co. occupies a rare whitespace: the intersection of luxury fashion and Jewish modesty. It is **not** a religious supplies store. It is a premium fashion house that happens to celebrate tzniut. The brand competes visually with Net-a-Porter and Mejuri — not with Judaica shops.

### 1.3 Emotional Tone

- Warmth without softness — confident femininity
- Reverence without severity — joyful observance
- Refinement without coldness — approachable luxury
- Heritage without nostalgia — timeless modernity

### 1.4 Visual Direction

| Element         | Direction                                                                 |
| --------------- | ------------------------------------------------------------------------- |
| **Mood**        | Warm ivory + deep navy + brushed gold — think Aesop meets The Fold London |
| **Photography** | Editorial lifestyle shots, clean studio stills, soft natural light        |
| **Typography**  | Cormorant Garamond display, Inter for UI                                  |
| **Texture**     | Linen, silk, velvet fabric texture overlays in section backgrounds        |
| **Motion**      | Slow and deliberate — no aggressive pop-ups or janky transitions          |
| **Whitespace**  | Generous — premium brands breathe                                         |

### 1.5 UX Philosophy

1. Confidence over choice paralysis — curated collections, not infinite grids
2. Show the garment in context — lifestyle photography first, product second
3. Reduce friction to purchase — guest checkout, Apple Pay, one-tap reorder
4. Emotional resonance at every touchpoint — copy, micro-interactions, packaging language
5. Mobile-first, not mobile-acceptable — designed on 375px, enhanced upward
6. **RTL-native, not RTL-adapted** — Hebrew layout is the design source of truth, English is the mirror. Never bolt RTL on after the fact.

### 1.6 What Makes This Different

Direct competitors (Wrapunzel, Tichels.com, Etsy shops) share a common flaw: none offer a cohesive luxury brand experience. The gap is wide open. The differentiator here isn't just the product — it's a technology platform as refined as the items it sells. Beautiful filtering, editorial content, custom design requests, and a post-purchase experience that makes customers feel seen.

---

## 2. Full UX Flow

### 2.1 Complete User Journey

**Discovery**

- User arrives via Instagram, Pinterest, organic search, or referral link
- Hero: editorial campaign image, headline, CTA to new collection
- Emotional hook in sub-headline: _"For women who cover with intention"_

**Browse**

- Navigation: Collections / Tichels / Scarves / Head Wraps / Accessories / Custom
- Category page: product grid, filter panel (left rail desktop / bottom sheet mobile)
- Filters: Fabric, Color, Occasion, Length, Price, New Arrivals, In Stock
- Product card: hover shows second lifestyle image (desktop), tap cycles (mobile)

**Product Detail**

- Full-bleed hero image with editorial gallery
- Fabric detail section with texture swatch and zoom
- Styling guide: 3 ways to wear (editorial shots, each linking to the look)
- Size/color selector with immediate visual update
- Sticky "Add to Bag" bar on scroll
- Social proof: star rating, review count, recent reviews, customer photos
- Cross-sell: "Complete the look" horizontal scroll

**Cart & Checkout**

- Slide-over cart drawer (desktop) / full-screen cart (mobile)
- Progress indicator: Cart → Information → Shipping → Payment
- Guest checkout available — account creation offered post-purchase
- Address autocomplete via Google Places API — Israeli addresses supported (no zip code required for IL)
- Payment: Stripe, Apple Pay, Google Pay, **bit (Israeli mobile payment)** where Stripe supports it
- Currency display: ₪ (ILS) for Israeli users, $ (USD) for international — based on locale
- Order confirmation: branded confirmation screen + email in user's language

**Post-Purchase**

- Firebase real-time order status updates visible in account dashboard
- Shipping tracking embedded in account + transactional email updates
- Review request email at day 14 (manual trigger via admin MVP-phase)

### 2.2 Page Map

```
/ ................................. Home
/collections ...................... All collections landing
/collections/[slug] ............... Category product grid (PLP)
/products/[slug] .................. Product detail (PDP)
/custom ........................... Custom design request form
/lookbook ......................... Editorial lookbook — shoppable
/cart ............................. Cart (mobile full page fallback)
/checkout ......................... Multi-step checkout
/order-confirmation/[id] .......... Post-purchase confirmation
/account .......................... Dashboard: orders, wishlist, profile
/account/orders/[id] .............. Order detail + live status
/about ............................ Brand story, founder, values
/care-guide ....................... Fabric care (SEO content)
/admin ............................ Admin dashboard (role-protected)
/admin/orders ..................... Order management
/admin/products ................... Product management
/admin/custom-requests ............ Custom design request queue
```

### 2.3 Core Interactions

**Product Gallery**

- Desktop: main image + 4-thumbnail rail left. Click to crossfade.
- Mobile: full-width swipe carousel, pinch-to-zoom supported
- Video support: fabric drape video auto-plays muted on scroll-into-view

**Filter System**

- Instant client-side filtering with URL sync (shareable filtered URLs)
- Active filter chips above grid with individual dismiss and "Clear all"
- Mobile: bottom sheet with full filter UI, sticky "Show X results" CTA
- Price: dual-handle range slider with formatted currency input fallback

**Checkout Psychology**

- Progress bar reduces abandonment by showing completion proximity
- Order summary always visible (collapsed on mobile, one tap to expand)
- Trust signals: return policy, secure payment logos
- Micro-copy: _"Free returns within 30 days"_ near the payment button

---

## 3. UI Design System

### 3.1 Typography

| Role             | Font                        | Size Range | Notes                                  |
| ---------------- | --------------------------- | ---------- | -------------------------------------- |
| Display / Hero   | Cormorant Garamond          | 48–96px    | Editorial headlines, hero moments      |
| Section Headings | Cormorant Garamond SemiBold | 28–40px    | Collection titles                      |
| UI Headings      | Inter SemiBold              | 16–24px    | Product names, nav labels              |
| Body Copy        | Inter Regular               | 14–16px    | Descriptions, reviews                  |
| UI Micro         | Inter Medium                | 11–13px    | Badges, tags, captions                 |
| Line Height      | —                           | —          | Display: 1.1 · Body: 1.65 · UI: 1.4    |
| Letter Spacing   | —                           | —          | Display: -0.02em · Caps labels: 0.08em |

### 3.2 Color Palette

| Name          | Hex       | Usage                                |
| ------------- | --------- | ------------------------------------ |
| Ivory White   | `#FAF8F4` | Primary background                   |
| Deep Navy     | `#1A2744` | Primary text, navigation             |
| Brushed Gold  | `#C9A84C` | Brand accent, CTAs, borders          |
| Warm Charcoal | `#2C2C2C` | Body text                            |
| Stone Grey    | `#F0EDE8` | Card backgrounds, section alternates |
| Blush Rose    | `#E8D5C8` | Sale/new badges, subtle warmth       |
| Success Green | `#3D7A5A` | Order confirmed, in-stock            |
| Error Red     | `#C0392B` | Form errors, out-of-stock            |

### 3.3 Spacing

Base unit: `4px`. All spacing is a multiple: `4 / 8 / 12 / 16 / 20 / 24 / 32 / 40 / 48 / 64 / 80 / 96 / 128`.

Section padding: `80px` desktop, `48px` mobile. Card padding: `24px`. Input padding: `12px 16px`.

### 3.4 Button Hierarchy

| Variant       | Style                                      | Usage                                 |
| ------------- | ------------------------------------------ | ------------------------------------- |
| Primary       | Gold fill, Navy text                       | "Add to Bag", "Complete Order"        |
| Secondary     | Navy outline, Navy text                    | "Save to Wishlist", "View Collection" |
| Ghost         | Transparent, Navy text                     | Less prominent actions                |
| Destructive   | Red outline                                | Admin delete actions                  |
| Sizes         | sm: 32px / md: 44px / lg: 56px             | —                                     |
| Loading state | Replace label with spinner, maintain width | Prevent double-submit                 |

### 3.5 Product Grid

- **Desktop 4-up**: 1440px+ — 4 columns, 24px gap
- **Tablet 2-up**: 768px–1199px — 2 columns, 20px gap
- **Mobile 2-up**: <768px — 2 columns, 12px gap (not 1-up — 2 feels premium)
- Card aspect ratio: `3:4` portrait — enforce at upload
- Lazy loading: Intersection Observer, shimmer placeholder before load
- Quick-add: long-press mobile / hover overlay desktop

### 3.6 Motion System

| Interaction       | Spec                                                                            |
| ----------------- | ------------------------------------------------------------------------------- |
| Page transitions  | Fade + slight upward drift, 300ms ease-out                                      |
| Component mount   | Fade in, 200ms ease                                                             |
| Hover states      | 150ms — only transform + opacity                                                |
| Modal/Drawer open | Slide from bottom (mobile) / right (desktop), 350ms cubic-bezier(0.32,0.72,0,1) |
| Image crossfade   | Opacity 0→1 on src swap, 250ms ease                                             |
| **Principle**     | Motion communicates state change, not decoration                                |

### 3.7 Accessibility

- WCAG 2.1 AA minimum throughout
- All interactive elements keyboard-navigable, visible Gold focus ring (3px offset)
- Form errors use color + icon + text — never color alone
- Semantic HTML always: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`
- `prefers-reduced-motion`: disable all decorative animations

---

## 4. Internationalisation & RTL Architecture

> This section is critical. Get this wrong at the start and you'll pay for it in every component. Read it before writing a single line of UI code.

### 4.1 The Mental Model

The site has **two locales**: `he` (Hebrew, RTL) and `en` (English, LTR). Hebrew is the **default locale** — it is what an unauthenticated Israeli user sees when they land. English is the secondary locale.

This means:

- Design decisions are made in Hebrew/RTL first
- The English version is the adaptation, not the other way around
- Every layout, every component, every animation must work in RTL without special-casing

### 4.2 Next.js i18n Routing

Use Next.js built-in i18n routing with `next-intl` library.

```
/           → redirects to /he (default locale)
/he         → Hebrew homepage
/en         → English homepage
/he/products/[slug]
/en/products/[slug]
```

Configuration in `next.config.ts`:

```ts
// Default locale: he
// Locales: ['he', 'en']
// Locale detection: based on Accept-Language header + stored preference
// URL strategy: always prefix locale in path — /he/... and /en/...
```

Locale preference stored in:

1. Firebase user profile (`locale` field) for logged-in users
2. `localStorage` for guests
3. `Accept-Language` header as fallback for first visit

### 4.3 RTL Layout Implementation

**The golden rule: never use `left` / `right` in CSS. Use `start` / `end` everywhere.**

```css
/* ❌ Wrong — breaks in RTL */
margin-left: 16px;
padding-right: 24px;
text-align: left;
border-left: 2px solid gold;

/* ✅ Correct — works in both directions */
margin-inline-start: 16px;
padding-inline-end: 24px;
text-align: start;
border-inline-start: 2px solid gold;
```

In Tailwind, use the logical property variants:

```
ms-4       (margin-inline-start)    instead of ml-4
me-4       (margin-inline-end)      instead of mr-4
ps-4       (padding-inline-start)   instead of pl-4
pe-4       (padding-inline-end)     instead of pr-4
start-0    (inset-inline-start)     instead of left-0
end-0      (inset-inline-end)       instead of right-0
text-start                          instead of text-left
```

Set `dir` attribute at the `<html>` level — never per-component:

```tsx
// app/layout.tsx
<html lang={locale} dir={locale === 'he' ? 'rtl' : 'ltr'}>
```

### 4.4 Typography — Hebrew Font

Hebrew requires a dedicated font. Latin fonts do not contain Hebrew glyphs — the browser will fall back to system fonts and it will look terrible.

| Role           | Hebrew Font                          | Latin Font         |
| -------------- | ------------------------------------ | ------------------ |
| Display / Hero | **Noto Serif Hebrew** (Google Fonts) | Cormorant Garamond |
| UI / Body      | **Heebo** (Google Fonts)             | Inter              |

Heebo is designed specifically for Hebrew UI — it has the same proportions and weight system as Inter, making the two fonts visually harmonious when mixed on the same page (e.g. a price in English numerals next to Hebrew text).

Font loading in `layout.tsx`:

```tsx
// Load both font pairs — Next.js font optimization handles subsetting
// Hebrew: Noto Serif Hebrew (weights 400, 600) + Heebo (weights 400, 500, 600)
// Latin: Cormorant Garamond (weights 400, 600) + Inter (weights 400, 500, 600)
// Apply via CSS custom properties: --font-display, --font-body
// Switch via [lang="he"] selector in global CSS
```

### 4.5 Translation Files Structure

```
messages/
├── he.json          # Hebrew — primary, always updated first
└── en.json          # English — secondary, translated from Hebrew
```

Translation key structure — flat namespaced keys:

```json
// he.json
{
  "nav.collections": "קולקציות",
  "nav.tichels": "מטפחות",
  "nav.scarves": "צעיפים",
  "nav.custom": "הזמנה מותאמת אישית",
  "product.addToBag": "הוסף לסל",
  "product.saveToWishlist": "שמור לרשימת המשאלות",
  "product.inStock": "במלאי",
  "product.outOfStock": "אזל מהמלאי",
  "checkout.continueToPay": "המשך לתשלום",
  "checkout.orderSummary": "סיכום הזמנה",
  "checkout.freeReturns": "החזרות חינם תוך 30 יום",
  "home.hero.headline": "מכסות בכוונה",
  "home.hero.sub": "אופנה צנועה לאישה המודרנית"
}
```

All user-facing strings — including product descriptions, collection titles, and email content — must exist in both `he.json` and `en.json`. No hardcoded strings anywhere in components.

### 4.6 Firestore — Multilingual Content Fields

All content fields in Firestore that are user-facing must be stored as locale maps:

```ts
// Products, Collections, etc.
{
  title: {
    he: "מטפחת משי שנהב",
    en: "Ivory Silk Tichel"
  },
  description: {
    he: "מטפחת יוקרתית עשויה 100% משי טבעי...",
    en: "A luxurious tichel crafted from 100% natural silk..."
  },
  slug: {
    he: "matpakhat-meshi-shenhav",   // Hebrew slug for /he/ URLs
    en: "ivory-silk-tichel"           // English slug for /en/ URLs
  }
}
```

Helper function used everywhere:

```ts
// lib/utils/locale.ts
export const t = (field: LocaleMap, locale: "he" | "en") =>
  field[locale] ?? field["he"] ?? field["en"];
```

Admin panel: product form has two tabs — Hebrew content and English content. Hebrew is required, English is optional (falls back to Hebrew if missing).

### 4.7 Algolia — Multilingual Index

Two separate Algolia indices:

- `products_he` — Hebrew content, used for RTL search UI
- `products_en` — English content, used for LTR search UI

Cloud Function syncs both on product write. Search query is always sent to the locale-appropriate index.

### 4.8 Numbers, Dates & Currency

| Data          | Israeli (he)                 | International (en)  |
| ------------- | ---------------------------- | ------------------- |
| Currency      | ₪1,250 (ILS)                 | $340 (USD)          |
| Number format | `1,250.00` (same convention) | `1,250.00`          |
| Date format   | `15.3.2025` (DD.MM.YYYY)     | `Mar 15, 2025`      |
| Phone         | `+972 50-000-0000`           | `+1 (555) 000-0000` |

Use the native `Intl.NumberFormat` and `Intl.DateTimeFormat` APIs — never a library for this:

```ts
// formatPrice.ts
export const formatPrice = (cents: number, locale: string, currency: string) =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(cents / 100);
// he locale → ₪85.00 | en locale → $23.00
```

Currency shown is based on locale, not just display — Israeli users are charged in ILS via Stripe (Stripe supports ILS natively).

### 4.9 Email Templates — Bilingual

Resend/React Email templates must be written in both languages. The Cloud Function selects the template based on the user's `locale` field in Firestore.

```
lib/email/templates/
├── OrderConfirmation.he.tsx    # Hebrew, RTL email
├── OrderConfirmation.en.tsx    # English, LTR email
├── ShippingUpdate.he.tsx
└── ShippingUpdate.en.tsx
```

Hebrew emails must set `dir="rtl"` on the root `<html>` element of the email template.

### 4.10 SEO — Multilingual

Every page that has multilingual content must include `hreflang` tags:

```html
<link
  rel="alternate"
  hreflang="he"
  href="https://tichelco.co.il/he/products/matpakhat-meshi-shenhav"
/>
<link
  rel="alternate"
  hreflang="en"
  href="https://tichelco.co.il/en/products/ivory-silk-tichel"
/>
<link
  rel="alternate"
  hreflang="x-default"
  href="https://tichelco.co.il/he/products/matpakhat-meshi-shenhav"
/>
```

`generateMetadata()` in Next.js returns locale-appropriate title, description, and OG tags. The OG image for Hebrew pages should contain Hebrew text.

Consider two domains or one with locale prefix:

- Recommended: `tichelco.co.il/he/...` and `tichelco.co.il/en/...` — single domain, simpler SSL and Firebase config
- Alternative: `tichelco.co.il` (Hebrew) + `tichelco.com` (English) — better SEO but double the deployment complexity

---

## 5. Technical Architecture

### 5.1 The Core Decision: Firebase-First

For a solo MVP developer, Firebase eliminates the entire backend layer. You write frontend code almost exclusively. Cloud Functions handle the small number of things that must run server-side (Stripe webhook, order emails). This is a deliberate, considered choice — not a shortcut.

### 5.2 Stack

| Layer                  | Technology                         | Why                                                                                                                                       | Tradeoff                                                                             |
| ---------------------- | ---------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------ |
| **i18n**               | next-intl                          | Best-in-class Next.js i18n — App Router native, RSC support, typed messages, locale routing                                               | Adds `[locale]` dynamic segment to all routes — plan this from day one               |
| **RTL**                | CSS logical properties + Tailwind  | No library needed — built into CSS. `dir` on `<html>`, logical properties everywhere                                                      | Discipline required — every developer (AI or human) must use `ms-/me-` not `ml-/mr-` |
| **Frontend Framework** | Next.js 15 (App Router)            | SEO-critical for product pages, RSC, image optimization, Vercel-native                                                                    | Adds build complexity vs plain React — worth it for SEO alone                        |
| **Styling**            | Tailwind CSS v4                    | Utility-first, zero runtime, excellent purging                                                                                            | Large class strings — acceptable                                                     |
| **State (UI)**         | Zustand                            | Lightweight cart/drawer/toast state, no boilerplate                                                                                       | None at this scale                                                                   |
| **State (Server)**     | TanStack Query                     | Cache Firestore reads, stale-while-revalidate pattern                                                                                     | Two state tools — solve different problems cleanly                                   |
| **Auth**               | Firebase Auth                      | Email/password + Google + Apple — managed, free, webhooks via Cloud Functions                                                             | None at MVP scale                                                                    |
| **Database**           | Firestore                          | Real-time, no server, free tier generous, scales automatically                                                                            | Complex queries painful — solved by Algolia for product filtering                    |
| **File Storage**       | Firebase Storage                   | Same SDK, same auth rules, simple — replaces Cloudflare R2                                                                                | Egress costs at high volume — acceptable at MVP                                      |
| **Product Search**     | Algolia (free tier)                | Solves Firestore's query limitations. Sub-50ms, typo tolerance, instant as-you-type                                                       | Cost at scale — evaluate Typesense self-hosted at 50k+ SKUs                          |
| **Payments**           | Stripe                             | Best-in-class, Apple Pay/Google Pay built-in, BNPL via Klarna. **Supports ILS natively** — Israeli users charged in ₪, international in $ | 2.9% + 30¢ — market standard                                                         |
| **Server Logic**       | Firebase Cloud Functions (Node.js) | Stripe webhook handler, order confirmation email, stock updates                                                                           | Adds Stripe-required server layer — unavoidable                                      |
| **Email**              | Resend + React Email               | Developer-first, React templates, excellent deliverability — called from Cloud Function                                                   | Newer service, solid backing                                                         |
| **Hosting**            | Vercel                             | Zero-config Next.js deploy, preview URLs per PR, global CDN                                                                               | Cost spike at high traffic — acceptable for MVP                                      |

### 5.3 Why Algolia Alongside Firestore

Firestore cannot do: "products in collection X, filtered by color AND fabric, price between $50–$150, sorted by popularity." This is your core product browsing UX. Fighting Firestore on this is painful — the right architecture is:

- **Algolia** handles all product browse, search, and filter
- **Firestore** handles orders, users, cart, custom requests, real-time status

Sync products from Firestore → Algolia via a Cloud Function triggered on product write. This runs automatically — you manage products in Firestore/admin panel and Algolia stays in sync.

### 5.4 Firebase Security Rules Strategy

Never expose admin writes to the client. Security rules pattern:

```
// Customers: read published products, write own orders/cart/profile
// Admins: write products, read all orders — via Admin SDK in Cloud Functions only
// Guests: read products, create orders with guest_email field
```

All Stripe operations and order status mutations happen inside Cloud Functions using the Firebase Admin SDK — customers cannot touch these paths from the browser.

### 5.5 Stripe Integration Flow

```
Client → Stripe.js creates PaymentMethod
Client → POST /api/checkout (Next.js route handler)
Next.js route handler → Firebase Admin SDK creates order doc (status: pending_payment)
Next.js route handler → Stripe API creates PaymentIntent
Client → Stripe.confirmPayment()
Stripe → POST webhook to Cloud Function
Cloud Function → Verifies Stripe signature
Cloud Function → Updates Firestore order (status: payment_confirmed)
Cloud Function → Sends confirmation email via Resend
Client → Firestore real-time listener shows updated order status
```

Note: The Next.js `/api/checkout` route handler is the only Route Handler you need. It runs server-side, keeps your Stripe secret key off the client, and bridges the client to both Stripe and Firebase Admin SDK.

---

## 6. Folder Structure

### 6.1 Project Root

```
tichel-co/
├── app/                        # Next.js App Router
├── components/                 # All React components
├── lib/                        # All non-component logic
├── hooks/                      # Custom React hooks
├── stores/                     # Zustand stores
├── types/                      # TypeScript types
├── messages/                   # i18n translation files
│   ├── he.json                 # Hebrew (primary — always update first)
│   └── en.json                 # English (secondary)
├── functions/                  # Firebase Cloud Functions (Node.js)
├── public/                     # Static assets
├── .env.local                  # Local environment variables
├── .env.example                # Committed env variable template
├── firebase.json               # Firebase project config
├── firestore.rules             # Firestore security rules
├── storage.rules               # Firebase Storage security rules
├── firestore.indexes.json      # Composite index definitions
├── next.config.ts
├── tailwind.config.ts
└── tsconfig.json
```

### 6.2 App Directory

```
app/
├── [locale]/                   # Dynamic locale segment — 'he' or 'en'
│   ├── (store)/                # Route group — all customer pages
│   │   ├── page.tsx            # Home
│   │   ├── collections/
│   │   │   └── [slug]/page.tsx # Collection PLP (slug is locale-specific)
│   │   ├── products/
│   │   │   └── [slug]/page.tsx # Product PDP
│   │   ├── custom/page.tsx     # Custom design request
│   │   ├── lookbook/page.tsx   # Editorial lookbook
│   │   ├── cart/page.tsx       # Cart (mobile fallback)
│   │   ├── checkout/page.tsx   # Checkout flow
│   │   └── order-confirmation/
│   │       └── [id]/page.tsx   # Post-purchase
│   ├── account/                # Auth-protected
│   │   ├── page.tsx            # Dashboard
│   │   └── orders/[id]/page.tsx
│   ├── admin/                  # Role-protected
│   │   ├── page.tsx
│   │   ├── orders/page.tsx
│   │   ├── products/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   └── custom-requests/page.tsx
│   ├── about/page.tsx
│   ├── care-guide/page.tsx
│   └── layout.tsx              # Locale layout — sets lang + dir on <html>
├── api/
│   ├── checkout/route.ts       # Stripe PaymentIntent creation
│   └── revalidate/route.ts     # On-demand ISR revalidation
├── layout.tsx                  # Root layout (no lang/dir here)
├── not-found.tsx
└── error.tsx
```

### 6.3 Components Directory

```
components/
├── ui/                         # Base design system (owned primitives)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Select.tsx
│   ├── Badge.tsx
│   ├── Card.tsx
│   ├── Modal.tsx
│   ├── Drawer.tsx
│   ├── Toast.tsx
│   ├── Skeleton.tsx
│   └── RangeSlider.tsx
├── product/                    # Product domain
│   ├── ProductCard.tsx
│   ├── ProductGrid.tsx
│   ├── ProductGallery.tsx
│   ├── ProductFilters.tsx
│   ├── QuickAdd.tsx
│   ├── StylingGuide.tsx
│   └── ReviewsSection.tsx
├── cart/
│   ├── CartDrawer.tsx
│   ├── CartItem.tsx
│   └── CartSummary.tsx
├── checkout/
│   ├── CheckoutForm.tsx
│   ├── AddressStep.tsx
│   ├── ShippingStep.tsx
│   └── PaymentStep.tsx
├── admin/
│   ├── OrdersTable.tsx
│   ├── ProductForm.tsx
│   └── CustomRequestCard.tsx
└── layout/
    ├── Header.tsx
    ├── Footer.tsx
    ├── Navigation.tsx
    └── MobileMenu.tsx
```

### 6.4 Lib Directory

```
lib/
├── firebase/
│   ├── client.ts               # Firebase client SDK init (browser)
│   ├── admin.ts                # Firebase Admin SDK init (server/functions)
│   ├── auth.ts                 # Auth helpers (signIn, signOut, getUser)
│   ├── firestore.ts            # Typed Firestore helpers
│   └── storage.ts              # Upload helpers
├── i18n/
│   ├── request.ts              # next-intl request config (locale resolution)
│   ├── routing.ts              # Locale routing config (locales, defaultLocale)
│   └── navigation.ts           # Typed Link, redirect, useRouter for locales
├── stripe/
│   ├── client.ts               # Stripe.js client init
│   └── server.ts               # Stripe Node.js server init
├── algolia/
│   ├── client.ts               # Algolia search client (locale-aware index selection)
│   └── sync.ts                 # Product sync helpers (syncs both he + en indices)
├── email/
│   ├── resend.ts               # Resend client
│   └── templates/
│       ├── OrderConfirmation.he.tsx   # Hebrew RTL email
│       ├── OrderConfirmation.en.tsx   # English LTR email
│       ├── ShippingUpdate.he.tsx
│       └── ShippingUpdate.en.tsx
├── validations/
│   ├── checkout.ts             # Zod schema for checkout form
│   ├── product.ts              # Zod schema for product admin form
│   └── customRequest.ts
└── utils/
    ├── formatPrice.ts          # Intl.NumberFormat — locale + currency aware
    ├── formatDate.ts           # Intl.DateTimeFormat — DD.MM.YYYY for he
    ├── locale.ts               # t(field, locale) helper for LocaleMap fields
    ├── slugify.ts
    └── cn.ts                   # clsx + tailwind-merge
```

### 6.5 Cloud Functions

```
functions/
├── src/
│   ├── index.ts                # Function exports
│   ├── stripe/
│   │   └── webhookHandler.ts   # Handles all Stripe webhook events
│   ├── orders/
│   │   └── onOrderCreated.ts   # Firestore trigger: send confirmation email
│   └── algolia/
│       └── syncProducts.ts     # Firestore trigger: sync product writes to Algolia
├── package.json
└── tsconfig.json
```

---

## 7. Firebase Data Design

### 7.1 Firestore Collections

**`users/{userId}`**

```
{
  email: string
  name: string
  phone?: string
  role: "customer" | "admin"
  loyaltyPoints: number
  createdAt: Timestamp
}
```

**`users/{userId}/addresses/{addressId}`**

```
{
  label: string           // "Home", "Work"
  line1: string
  line2?: string
  city: string
  country: string
  postalCode: string
  isDefault: boolean
}
```

**`products/{productId}`**

```
{
  slug: string
  title: string
  description: string
  priceCents: number
  comparePriceCents?: number
  collectionIds: string[]
  skuBase: string
  isFeatured: boolean
  publishedAt: Timestamp | null
  createdAt: Timestamp
}
```

**`products/{productId}/variants/{variantId}`**

```
{
  sku: string
  color: string
  fabric: string
  size?: string
  stockQty: number
  imageUrls: string[]
}
```

**`collections/{collectionId}`**

```
{
  slug: string
  title: string
  description: string
  imageUrl: string
  displayOrder: number
  publishedAt: Timestamp | null
}
```

**`orders/{orderId}`**

```
{
  userId?: string             // null for guest
  guestEmail?: string
  status: OrderStatus         // see enum below
  subtotalCents: number
  shippingCents: number
  taxCents: number
  totalCents: number
  currency: string            // "usd"
  stripePaymentIntentId: string
  shippingAddress: Address    // snapshot (not a reference)
  items: OrderItem[]          // snapshot — denormalized
  createdAt: Timestamp
  updatedAt: Timestamp
}
```

`OrderStatus` enum: `pending_payment` → `payment_confirmed` → `processing` → `shipped` → `delivered` → `cancelled` | `refunded`

`OrderItem` (embedded in order — snapshot, not a reference):

```
{
  variantId: string
  productId: string
  productTitle: string        // snapshot
  variantLabel: string        // "Ivory · Silk · One Size"
  imageUrl: string            // snapshot
  quantity: number
  unitPriceCents: number
}
```

> **Why denormalize order items?** Products and prices change over time. An order is a receipt — it must reflect what the customer actually purchased at the time of purchase. Never reference live product documents from an order.

**`customRequests/{requestId}`**

```
{
  userId?: string
  contactEmail: string
  type: string                // "tichel" | "scarf" | "head-wrap" | "other"
  description: string
  budgetRange: string
  referenceImageUrls: string[]
  status: string              // "submitted" | "under_review" | "quote_sent" | ...
  assignedTo?: string
  createdAt: Timestamp
}
```

**`reviews/{reviewId}`**

```
{
  productId: string
  userId: string
  orderId: string
  rating: number              // 1–5
  title: string
  body: string
  imageUrls: string[]
  verifiedPurchase: boolean
  publishedAt: Timestamp | null
}
```

**`cart/{userId}`** _(single document per user, real-time synced)_

```
{
  items: CartItem[]
  updatedAt: Timestamp
}
```

**`discountCodes/{code}`**

```
{
  type: "percent" | "fixed" | "free_shipping"
  value: number
  minOrderCents: number
  usageLimit: number
  usedCount: number
  expiresAt: Timestamp
}
```

### 7.2 Indexing Strategy

Composite indexes required (define in `firestore.indexes.json`):

| Collection       | Fields                                   | Purpose                 |
| ---------------- | ---------------------------------------- | ----------------------- |
| `products`       | `publishedAt ASC`, `isFeatured DESC`     | Featured products query |
| `products`       | `collectionIds ARRAY`, `publishedAt ASC` | Collection page         |
| `orders`         | `userId ASC`, `createdAt DESC`           | Account order history   |
| `orders`         | `status ASC`, `createdAt DESC`           | Admin order queue       |
| `customRequests` | `status ASC`, `createdAt DESC`           | Admin request queue     |
| `reviews`        | `productId ASC`, `publishedAt DESC`      | Product reviews         |

> Note: All product filtering (color, fabric, price, occasion) is handled by Algolia — these are NOT Firestore queries. Only simple, bounded queries go to Firestore directly.

### 7.3 Algolia Product Index Schema

```json
{
  "objectID": "firestore-product-id",
  "title": "Ivory Silk Square Tichel",
  "slug": "ivory-silk-square-tichel",
  "collectionIds": ["tichels", "new-arrivals"],
  "priceCents": 8500,
  "comparePriceCents": 10000,
  "colors": ["ivory", "cream"],
  "fabrics": ["silk"],
  "occasions": ["shabbat", "everyday"],
  "inStock": true,
  "isFeatured": true,
  "primaryImageUrl": "https://...",
  "publishedAt": 1718000000
}
```

Synced automatically via Cloud Function on every Firestore product write.

---

## 8. Development Phases

### Phase 0 — Environment Setup

**Goal:** Working local dev. All services connected. CI passing.

**Deliverables:**

- Git repo initialized with `main` branch
- `.env.example` documenting all required variables
- Firebase project created (Blaze plan — required for Cloud Functions)
- Stripe account created, test mode active
- Algolia app created, **two indices created: `products_he` and `products_en`**
- ESLint + Prettier + Husky pre-commit configured
- **`next-intl` installed and configured — `[locale]` routing working from day one**
- **`messages/he.json` and `messages/en.json` created with placeholder keys**
- **Tailwind configured with `ms-/me-` logical property variants as convention — no `ml-/mr-` allowed**
- `pnpm dev` runs without error, both `/he` and `/en` routes resolve

**Definition of Done:** All env vars populated, dev server starts, Firebase emulators run locally.

**Risk:** Firebase emulator setup complexity. Mitigation: use `firebase emulators:start` with the full emulator suite from day one.

---

### Phase 1 — Design System

**Goal:** All base UI components built. Typography, color, spacing implemented in Tailwind config.

**Deliverables:**

- Tailwind config with design tokens (colors, fonts, spacing)
- Google Fonts loaded: **Noto Serif Hebrew + Heebo (Hebrew)**, Cormorant Garamond + Inter (Latin)
- Font switching via `[lang="he"]` CSS selector — automatic, no JS needed
- **All components use CSS logical properties only — `ms-`, `me-`, `ps-`, `pe-`, `text-start`, `start-0`, `end-0`**
- **RTL layout verified on every component: no hardcoded `left`/`right` anywhere**
- Components: `Button`, `Input`, `Select`, `Badge`, `Card`, `Modal`, `Drawer`, `Toast`, `Skeleton`, `RangeSlider`
- All components type-safe with variant props
- **`LocaleSwitcher` component built — toggles between `/he/...` and `/en/...`**

**Definition of Done:** Every component renders correctly at 375px and 1440px. Zero TypeScript errors. All variants covered.

**Risk:** Design inconsistency creeping in. Mitigation: define all design tokens in `tailwind.config.ts` first — never hardcode color/spacing values in components.

---

### Phase 2 — Core Frontend (Mock Data)

**Goal:** All customer-facing pages built and visually complete. No real data yet.

**Deliverables:**

- Home, PLP, PDP, Cart, Checkout UI, Custom Request form, Lookbook, Account shell, Order Confirmation
- Mobile-responsive at 375px / 768px / 1440px
- All animations and transitions implemented
- Filter UI working with mock data (client-side)
- Cart drawer functional with Zustand (local state only)

**Definition of Done:** Full visual walkthrough on mobile + desktop **in both Hebrew (RTL) and English (LTR)**. No layout breakage when switching direction. Lighthouse score >90. Zero CLS issues.

**Risk:** RTL layout breaking when switching to English. Mitigation: test direction switch at the end of every component build — not at the end of the phase.

---

### Phase 3 — Firebase Integration

**Goal:** Real data flowing. Products, collections, and cart backed by Firestore.

**Deliverables:**

- Firebase client SDK integrated in `lib/firebase/client.ts`
- Firestore collections created: `products`, `collections`, `cart`
- Admin panel: product create/edit/delete with **Hebrew + English content tabs** (Hebrew required, English optional)
- **Product `title`, `description`, `slug` stored as `{ he, en }` locale maps in Firestore**
- Product sync to **both `products_he` and `products_en` Algolia indices** via Cloud Function
- Algolia search and filter wired into PLP — **query sent to locale-appropriate index**
- Cart persisted to Firestore for logged-in users, localStorage fallback for guests
- Firebase Storage: product image upload in admin panel
- Firebase Auth: email/password + Google login
- **User `locale` preference saved to Firestore on first login/registration**

**Definition of Done:** Admin can create a product, it appears on the storefront, Algolia filter works. Cart persists across sessions.

**Risk:** Algolia sync Cloud Function deploy issues. Mitigation: test Cloud Functions locally with Firebase emulators before deploying.

---

### Phase 4 — Stripe Payments

**Goal:** End-to-end checkout working in Stripe test mode.

**Deliverables:**

- `/api/checkout` Next.js Route Handler: creates Stripe PaymentIntent + Firestore order (status: `pending_payment`)
- Stripe Elements UI in checkout payment step
- Apple Pay / Google Pay via Stripe Payment Request Button
- `functions/src/stripe/webhookHandler.ts`: handles `payment_intent.succeeded` → updates order to `payment_confirmed`
- Order confirmation email via Resend (triggered by Cloud Function on order status change)
- Order confirmation page showing live Firestore order status
- Guest checkout flow (no auth required)

**Definition of Done:** Test card `4242 4242 4242 4242` completes full purchase flow. Order appears in Firestore with correct status. Confirmation email delivers.

**Risk:** Stripe webhook reliability in dev. Mitigation: use `stripe listen --forward-to localhost:3000/api/webhooks/stripe` for local testing. Use Stripe CLI.

---

### Phase 5 — Admin Panel

**Goal:** You can manage the full business from the admin panel without touching Firestore directly.

**Deliverables:**

- Firebase Auth custom claims: `admin` role set via Firebase Admin SDK
- Admin route protection: middleware checks custom claim, redirects to login if absent
- Order list: filterable by status, searchable by email/order ID
- Order detail: status update dropdown + tracking number input
- Product list: with stock level indicators
- Product create/edit form: title, description, price, variants, image upload
- Custom request queue: view submissions, update status

**Definition of Done:** Full order lifecycle manageable from admin. Products manageable without Firestore console. Custom requests assignable and trackable.

**Risk:** Admin role bypass. Mitigation: use Firebase Admin SDK custom claims — these cannot be spoofed from the client. Verify in Firestore Security Rules AND in Cloud Functions.

---

### Phase 6 — Polish & Launch Prep

**Goal:** Production-ready. Real content. SEO. Live payments.

**Deliverables:**

- Real product photography uploaded and alt-tagged **in both languages**
- All product copy finalized in Hebrew (required) and English (required for launch)
- SEO: `generateMetadata()` with locale-appropriate title/description/OG tags, JSON-LD product schema
- **`hreflang` alternate tags on all PDP + PLP pages**
- **Sitemap includes both `/he/...` and `/en/...` URLs for all products**
- Legal pages in Hebrew: Privacy Policy (מדיניות פרטיות), Terms (תנאי שימוש), Returns (מדיניות החזרות)
- Stripe live mode enabled — **ILS for Israeli users, USD for international**
- Custom domain configured on Vercel, SSL active
- Firebase Security Rules reviewed and tightened
- **Google Search Console: both Hebrew and English sitemaps submitted**

**Definition of Done:** Real payment tested end-to-end. Lighthouse >90 across all pages. Google Search Console verified. 5 test orders placed by real humans on mobile.

**Risk:** Launching without load testing. Mitigation: not critical at MVP — Vercel and Firebase both scale automatically. Monitor Vercel function logs in the first 48 hours.

---

## 9. Testing Strategy

> **Goal: full coverage on every push. No regression ships to production undetected.**  
> Every layer of the app has a corresponding test layer. CI fails hard if any layer is broken.

### 9.1 Testing Stack

| Layer       | Tool                                 | Purpose                                                                     |
| ----------- | ------------------------------------ | --------------------------------------------------------------------------- |
| Unit        | **Vitest**                           | Pure functions, utilities, Zod schemas, price calculations, locale helpers  |
| Component   | **Vitest + React Testing Library**   | UI components in isolation — renders, interactions, variants, RTL behaviour |
| Integration | **Vitest + Firebase Emulator Suite** | API route handlers, Firestore Security Rules, Cloud Functions               |
| E2E         | **Playwright**                       | Full user journeys in a real browser against a running app                  |
| Coverage    | **v8 (built into Vitest)**           | Enforced minimum thresholds — CI fails if coverage drops                    |

### 9.2 Unit Tests — What Gets Tested

**Rule: every file in `/lib/utils/`, `/lib/validations/`, `/lib/i18n/`, `/stores/` must have a corresponding `.test.ts` file.**

`lib/utils/formatPrice.test.ts`

- formats ILS correctly for `he` locale → `₪85.00`
- formats USD correctly for `en` locale → `$23.00`
- handles zero, negative, and large values
- handles missing currency gracefully

`lib/utils/locale.test.ts`

- `t({ he: "שלום", en: "Hello" }, "he")` returns Hebrew string
- `t({ he: "שלום", en: "Hello" }, "en")` returns English string
- `t({ he: "שלום" }, "en")` falls back to Hebrew when English missing
- `t({}, "he")` returns empty string — no crash

`lib/utils/formatDate.test.ts`

- `he` locale formats as `DD.MM.YYYY`
- `en` locale formats as `Mon DD, YYYY`
- handles invalid dates without throwing

`lib/utils/slugify.test.ts`

- produces URL-safe strings
- handles Hebrew characters (transliterated or stripped)
- handles special characters, spaces, mixed case

`lib/validations/checkout.test.ts`

- valid Israeli address passes (no postal code required)
- valid international address passes
- missing required fields fail with correct error messages
- invalid email format fails
- phone number validation for `+972` and `+1` formats

`lib/validations/product.test.ts`

- valid product object passes
- `priceCents` must be positive integer
- `title` must have both `he` and `en` keys
- `slug` must be unique-format string (tested via schema shape)

`stores/cartStore.test.ts`

- `addItem` adds new item
- `addItem` increments quantity if variant already exists
- `removeItem` removes correct item
- `updateQuantity` updates correctly, removes at 0
- `clearCart` empties the store
- `totalItems` computed correctly
- `totalCents` computed correctly including quantity multiplication

`stores/localeStore.test.ts`

- default locale is `he`
- `setLocale` updates locale
- locale persists to localStorage

### 9.3 Component Tests — What Gets Tested

**Rule: every component in `/components/ui/` and `/components/product/` must have a `.test.tsx` file.**

Test with React Testing Library. Test behaviour, not implementation.

`components/ui/Button.test.tsx`

- renders with correct text
- calls `onClick` when clicked
- does not call `onClick` when disabled
- shows spinner and disables interaction when `loading={true}`
- all variants render without error (`primary`, `secondary`, `ghost`, `destructive`)

`components/ui/Input.test.tsx`

- renders label correctly
- shows error message when `error` prop provided
- `dir="rtl"` is inherited correctly from parent context (RTL test)
- calls `onChange` with correct value

`components/product/ProductCard.test.tsx`

- renders product title from locale map using current locale
- renders price formatted for current locale (₪ for `he`, $ for `en`)
- "Out of stock" badge appears when `stockQty === 0`
- clicking card navigates to correct locale-prefixed URL (`/he/products/[slug]` or `/en/products/[slug]`)
- image has correct `alt` text from locale map

`components/product/ProductFilters.test.tsx`

- renders filter options
- selecting a filter calls `onFilterChange` with correct values
- "Clear all" resets all filters
- in RTL context, filter panel is positioned on the `inline-end` side

`components/cart/CartDrawer.test.tsx`

- opens when `isOpen={true}`
- renders all cart items
- quantity increment/decrement updates store
- remove item removes from store
- displays correct total in locale currency
- empty cart state renders correctly

`components/checkout/CheckoutForm.test.tsx`

- submits with valid data
- blocks submission with missing required fields
- shows field-level error messages from Zod validation
- Israeli address fields: postal code optional
- phone field accepts `+972` format

### 9.4 Integration Tests — Firebase Emulator

**Run against the Firebase Emulator Suite** — not the real Firebase project. Emulators must be running before integration tests execute (`firebase emulators:start --only firestore,auth,functions`).

`lib/firebase/firestore.rules.test.ts` — **Security Rules Tests**

```
Products collection:
  ✓ unauthenticated user can read published products
  ✓ unauthenticated user cannot read unpublished products
  ✗ unauthenticated user cannot write products
  ✗ authenticated customer cannot write products
  ✓ admin user can write products (via Admin SDK simulation)

Orders collection:
  ✓ authenticated user can read own order
  ✗ authenticated user cannot read another user's order
  ✗ unauthenticated user cannot read any order
  ✗ any client can update order status (must be Cloud Function only)

Cart collection:
  ✓ authenticated user can read/write own cart
  ✗ authenticated user cannot read another user's cart

CustomRequests collection:
  ✓ anyone can create a custom request
  ✓ creator can read own request
  ✗ unauthenticated user cannot update request status
```

`app/api/checkout/route.test.ts` — **API Route Handler Tests**

- valid checkout payload creates Firestore order with status `pending_payment`
- valid checkout payload creates Stripe PaymentIntent and returns `clientSecret`
- missing required fields returns `400` with validation errors
- invalid Stripe call returns `500` with safe error message (no Stripe internals leaked)
- guest checkout (no `userId`) creates order with `guestEmail` field

`functions/src/stripe/webhookHandler.test.ts` — **Cloud Function Tests**

- `payment_intent.succeeded` event updates order status to `payment_confirmed`
- `payment_intent.payment_failed` event updates order status to `payment_failed`
- invalid Stripe signature returns `400` — webhook rejected
- duplicate event (same `paymentIntentId`) is idempotent — no double-update
- triggers order confirmation email via Resend on success

### 9.5 E2E Tests — Playwright

Run against a locally-running Next.js dev server pointed at Firebase Emulators. Playwright configuration seeds the emulator with test data before the suite runs.

**Setup (`playwright.config.ts`):**

```ts
// webServer: starts `pnpm dev` automatically before tests
// baseURL: http://localhost:3000
// globalSetup: seeds Firebase Emulator with test products, users, orders
// retries: 2 on CI, 0 locally
// reporter: html (local) + github (CI)
```

**Test Suites:**

`e2e/browse.spec.ts`

- Home page loads, hero visible, featured products render
- Navigate to collection → products display in grid
- Apply color filter → grid updates, URL reflects filter params
- Apply price range filter → only products in range shown
- Clear all filters → full grid restored
- Search for product by name → correct results returned

`e2e/product.spec.ts`

- Product detail page loads with correct title and price
- Image gallery: clicking thumbnail swaps main image
- Color/fabric variant selector updates displayed image
- Add to bag → cart item count increments in header
- Out-of-stock variant → "Add to Bag" button disabled
- "Complete the look" cross-sell section renders

`e2e/checkout-guest.spec.ts`

- Add product → open cart drawer → proceed to checkout
- Fill address (Israeli format, no postal code) → continue
- Select shipping method → continue
- Fill Stripe test card `4242 4242 4242 4242` → complete order
- Redirect to order confirmation page with order ID
- Order exists in Firestore with status `payment_confirmed`

`e2e/checkout-auth.spec.ts`

- Log in with test account
- Saved address pre-fills correctly
- Complete checkout → order appears in account order history

`e2e/account.spec.ts`

- Login with email/password
- View order history — correct orders listed
- View order detail — correct items and status shown
- Update profile name → saved correctly
- Add new address → appears in address list

`e2e/admin.spec.ts`

- Admin login → redirects to `/admin`
- Non-admin login → redirected away from `/admin` (403 behaviour)
- Create product → appears in product list
- Edit product title (Hebrew) → updated in Firestore
- Update order status to `shipped` → status reflected in customer account view

`e2e/i18n.spec.ts`

- Navigate to `/he` → `<html dir="rtl" lang="he">` confirmed
- Navigate to `/en` → `<html dir="ltr" lang="en">` confirmed
- Hebrew product title renders on `/he/products/[slug]`
- English product title renders on `/en/products/[slug]`
- Locale switcher on `/he/products/[slug]` → navigates to `/en/products/[slug]`
- Price on `/he` shows `₪` symbol
- Price on `/en` shows `$` symbol
- Navigation items in Hebrew on `/he` route
- Filter panel is on the right side in RTL, left side in LTR

`e2e/custom-request.spec.ts`

- Fill custom request form → submits successfully
- Confirmation message shown
- Request appears in admin custom requests queue

### 9.6 Coverage Thresholds

Enforced in `vitest.config.ts` — **CI fails if any threshold is not met:**

```ts
coverage: {
  provider: 'v8',
  reporter: ['text', 'lcov', 'html'],
  thresholds: {
    lines:      85,
    functions:  85,
    branches:   80,
    statements: 85,
  },
  exclude: [
    'app/**',           // E2E covers pages
    '**/*.config.*',
    '**/types/**',
    '**/migrations/**',
  ]
}
```

Coverage HTML report uploaded as a CI artifact on every run — accessible from the GitHub Actions summary.

---

## 10. DevOps & CI/CD

### 10.1 Git Strategy

- `main` — production-ready at all times. **Direct pushes blocked via branch protection rules.**
- `feat/your-feature` — short-lived feature branches, always branched from `main`
- `fix/bug-description` — hotfix branches
- PRs required to merge to `main`. CI must be fully green. No exceptions.
- Commit style: Conventional Commits (`feat:`, `fix:`, `chore:`, `test:`, `docs:`)

### 10.2 Environments

| Environment  | Hosting               | Firebase Project   | Stripe Mode | Trigger         |
| ------------ | --------------------- | ------------------ | ----------- | --------------- |
| `local`      | localhost:3000        | Firebase Emulators | Test        | Manual          |
| `preview`    | Vercel PR preview URL | `tichel-co-dev`    | Test        | Every PR        |
| `staging`    | Vercel staging URL    | `tichel-co-dev`    | Test        | Merge to `main` |
| `production` | Vercel production     | `tichel-co-prod`   | Live        | Manual promote  |

**Two Firebase projects** — dev and prod are completely isolated. No shared data, no shared Cloud Functions, no shared API keys.

### 10.3 GitHub Repository Setup

**Branch protection rules for `main`:**

```
✓ Require a pull request before merging
✓ Require status checks to pass before merging
  - Required checks: ci / type-check
  - Required checks: ci / lint
  - Required checks: ci / unit-tests
  - Required checks: ci / integration-tests
  - Required checks: ci / build
✓ Require branches to be up to date before merging
✓ Do not allow bypassing the above settings
```

**GitHub Secrets required** (set in repo Settings → Secrets → Actions):

```
# Firebase (dev project — used in CI)
FIREBASE_PROJECT_ID_DEV
FIREBASE_TOKEN                    # from: firebase login:ci

# Firebase Admin (dev — for integration tests + Cloud Function deploy)
FIREBASE_ADMIN_PROJECT_ID_DEV
FIREBASE_ADMIN_CLIENT_EMAIL_DEV
FIREBASE_ADMIN_PRIVATE_KEY_DEV

# Firebase (prod — used only in deploy workflow)
FIREBASE_PROJECT_ID_PROD
FIREBASE_ADMIN_PROJECT_ID_PROD
FIREBASE_ADMIN_CLIENT_EMAIL_PROD
FIREBASE_ADMIN_PRIVATE_KEY_PROD

# Stripe (test keys — used in CI)
STRIPE_SECRET_KEY_TEST
STRIPE_WEBHOOK_SECRET_TEST
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST

# Stripe (live keys — used only in prod deploy)
STRIPE_SECRET_KEY_PROD
STRIPE_WEBHOOK_SECRET_PROD
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD

# Algolia (used in CI for index sync tests)
ALGOLIA_APP_ID
ALGOLIA_ADMIN_KEY
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY

# Resend (used in integration tests — test mode)
RESEND_API_KEY_TEST

# Vercel (used for deploy)
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
```

### 10.4 CI Workflow — `.github/workflows/ci.yml`

Runs on **every push to any branch** and on **every PR**.

```yaml
name: CI

on:
  push:
    branches: ["**"]
  pull_request:
    branches: [main]

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true # cancel older runs on the same branch

jobs:
  # ── Job 1: Type check ──────────────────────────────────────────────
  type-check:
    name: Type Check
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm type-check
      # Also type-check Cloud Functions
      - run: cd functions && pnpm install --frozen-lockfile && pnpm type-check

  # ── Job 2: Lint ────────────────────────────────────────────────────
  lint:
    name: Lint
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      # Check no hardcoded left/right directional CSS (RTL discipline)
      - name: RTL CSS audit
        run: |
          if grep -rn --include="*.tsx" --include="*.ts" --include="*.css" \
            -E "(margin-left|margin-right|padding-left|padding-right|text-align:\s*left|text-align:\s*right|border-left|border-right)" \
            components/ lib/ app/ ; then
            echo "❌ Found hardcoded directional CSS. Use logical properties (ms-, me-, ps-, pe-) instead."
            exit 1
          fi
          echo "✅ No hardcoded directional CSS found"

  # ── Job 3: Unit + Component Tests ──────────────────────────────────
  unit-tests:
    name: Unit & Component Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm test:unit --coverage
      # Upload coverage report as artifact
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-report
          path: coverage/
          retention-days: 14
      # Post coverage summary to PR comment
      - name: Coverage summary
        uses: davelosert/vitest-coverage-report-action@v2
        if: github.event_name == 'pull_request'

  # ── Job 4: Integration Tests (Firebase Emulator) ───────────────────
  integration-tests:
    name: Integration Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: cd functions && pnpm install --frozen-lockfile
      # Install Firebase CLI + Java (required for emulators)
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17
      - run: npm install -g firebase-tools
      # Start emulators in background, run tests, shut down
      - name: Run integration tests with emulators
        run: |
          firebase emulators:exec \
            --only firestore,auth,functions \
            --project tichel-co-dev \
            "pnpm test:integration"
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
          FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID_DEV }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY_TEST }}
          STRIPE_WEBHOOK_SECRET: ${{ secrets.STRIPE_WEBHOOK_SECRET_TEST }}

  # ── Job 5: Build ───────────────────────────────────────────────────
  build:
    name: Build
    runs-on: ubuntu-latest
    needs: [type-check, lint] # fail fast — don't build if type/lint fail
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          # Use test/dev values for build — enough to pass Next.js build
          NEXT_PUBLIC_FIREBASE_API_KEY: placeholder
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID_DEV }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST }}
          NEXT_PUBLIC_ALGOLIA_APP_ID: ${{ secrets.ALGOLIA_APP_ID }}
          NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: ${{ secrets.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY }}
          NEXT_PUBLIC_DEFAULT_LOCALE: he
      # Upload build output for E2E job to reuse
      - uses: actions/upload-artifact@v4
        with:
          name: next-build
          path: .next/
          retention-days: 1

  # ── Job 6: E2E Tests ───────────────────────────────────────────────
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: [build, integration-tests]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - uses: actions/setup-java@v4
        with:
          distribution: temurin
          java-version: 17
      - run: npm install -g firebase-tools
      # Download build artifact
      - uses: actions/download-artifact@v4
        with:
          name: next-build
          path: .next/
      # Install Playwright browsers (cached)
      - name: Cache Playwright browsers
        uses: actions/cache@v4
        with:
          path: ~/.cache/ms-playwright
          key: playwright-${{ hashFiles('pnpm-lock.yaml') }}
      - run: pnpm exec playwright install --with-deps chromium
      # Start emulators + seed data + run E2E
      - name: Run E2E tests
        run: |
          firebase emulators:exec \
            --only firestore,auth,functions \
            --project tichel-co-dev \
            "pnpm test:e2e --reporter=github"
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID_DEV }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY_TEST }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST }}
          NEXT_PUBLIC_DEFAULT_LOCALE: he
      # Always upload Playwright report (even on failure — this is how you debug)
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: playwright-report
          path: playwright-report/
          retention-days: 14
```

### 10.5 CD Workflow — `.github/workflows/deploy.yml`

Runs **only on merge to `main`** after all CI checks pass.

```yaml
name: Deploy

on:
  push:
    branches: [main]

jobs:
  # ── Deploy Cloud Functions to dev/staging ──────────────────────────
  deploy-functions-staging:
    name: Deploy Cloud Functions (Staging)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: cd functions && pnpm install --frozen-lockfile && pnpm build
      - run: npm install -g firebase-tools
      - run: firebase deploy --only functions --project tichel-co-dev --non-interactive
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}

  # ── Deploy Firestore Rules + Indexes to staging ────────────────────
  deploy-firestore-staging:
    name: Deploy Firestore Rules (Staging)
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g firebase-tools
      - run: firebase deploy --only firestore --project tichel-co-dev --non-interactive
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}

  # ── Deploy Frontend to Vercel (staging) ───────────────────────────
  deploy-frontend-staging:
    name: Deploy Frontend (Staging)
    runs-on: ubuntu-latest
    needs: [deploy-functions-staging]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY_DEV }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID_DEV }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY_TEST }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_TEST }}
          NEXT_PUBLIC_ALGOLIA_APP_ID: ${{ secrets.ALGOLIA_APP_ID }}
          NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: ${{ secrets.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY }}
          NEXT_PUBLIC_DEFAULT_LOCALE: he
      - run: npx vercel deploy --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}

  # ── Smoke test staging after deploy ───────────────────────────────
  smoke-test-staging:
    name: Smoke Test (Staging)
    runs-on: ubuntu-latest
    needs: [deploy-frontend-staging]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: pnpm exec playwright install --with-deps chromium
      - name: Smoke test against staging URL
        run: pnpm test:e2e:smoke
        env:
          BASE_URL: ${{ steps.deploy.outputs.url }} # Vercel preview URL

  # ── Production deploy — MANUAL trigger only ────────────────────────────
  deploy-production:
    name: Deploy to Production
    runs-on: ubuntu-latest
    environment: production # Requires manual approval in GitHub Environments
    needs: [smoke-test-staging]
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: 9 }
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: pnpm
      - run: pnpm install --frozen-lockfile
      - run: cd functions && pnpm install --frozen-lockfile && pnpm build
      - run: npm install -g firebase-tools
      # Deploy Functions to prod
      - run: firebase deploy --only functions,firestore --project tichel-co-prod --non-interactive
        env:
          FIREBASE_TOKEN: ${{ secrets.FIREBASE_TOKEN }}
      # Deploy frontend to Vercel production
      - run: pnpm build
        env:
          NEXT_PUBLIC_FIREBASE_API_KEY: ${{ secrets.NEXT_PUBLIC_FIREBASE_API_KEY_PROD }}
          NEXT_PUBLIC_FIREBASE_PROJECT_ID: ${{ secrets.FIREBASE_PROJECT_ID_PROD }}
          STRIPE_SECRET_KEY: ${{ secrets.STRIPE_SECRET_KEY_PROD }}
          NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: ${{ secrets.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY_PROD }}
          NEXT_PUBLIC_ALGOLIA_APP_ID: ${{ secrets.ALGOLIA_APP_ID }}
          NEXT_PUBLIC_ALGOLIA_SEARCH_KEY: ${{ secrets.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY }}
          NEXT_PUBLIC_DEFAULT_LOCALE: he
      - run: npx vercel deploy --prod --token ${{ secrets.VERCEL_TOKEN }}
        env:
          VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
          VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
```

### 10.6 Package Scripts — Full Test Commands

These scripts must be defined in `package.json` exactly as referenced by the CI:

```json
{
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "type-check": "tsc --noEmit",
    "lint": "eslint . --max-warnings 0",
    "test": "pnpm test:unit && pnpm test:integration",
    "test:unit": "vitest run --coverage",
    "test:unit:watch": "vitest",
    "test:integration": "vitest run --config vitest.integration.config.ts",
    "test:e2e": "playwright test",
    "test:e2e:ui": "playwright test --ui",
    "test:e2e:smoke": "playwright test --grep @smoke",
    "test:e2e:debug": "playwright test --debug"
  }
}
```

Smoke tests are E2E tests tagged with `@smoke` in the test title — a minimal subset (home loads, checkout starts, login works) that runs post-deploy to verify the live environment.

### 10.7 Vitest Configuration

Two Vitest config files — one for unit/component, one for integration:

**`vitest.config.ts`** (unit + component):

```ts
// environment: 'jsdom'           — for React Testing Library
// include: ['**/*.test.tsx', '**/*.test.ts']
// exclude: ['**/*.integration.test.ts', 'e2e/**']
// setupFiles: ['./vitest.setup.ts']    — imports @testing-library/jest-dom matchers
// coverage.provider: 'v8'
// coverage.thresholds: lines 85, functions 85, branches 80
```

**`vitest.integration.config.ts`**:

```ts
// environment: 'node'            — no DOM needed for API/Firestore tests
// include: ['**/*.integration.test.ts']
// testTimeout: 15000             — emulator calls are slower than pure unit tests
// globalSetup: './vitest.integration.setup.ts'  — starts emulator seed
```

### 10.8 What the Full CI Run Looks Like

On a PR, the developer sees these checks in GitHub:

```
✅ ci / type-check           ~30s
✅ ci / lint                 ~45s   (includes RTL CSS audit)
✅ ci / unit-tests           ~60s   (with coverage report posted to PR)
✅ ci / integration-tests    ~90s   (Firebase emulator boots, tests run)
✅ ci / build                ~90s
✅ ci / e2e                  ~3min  (Playwright against emulator + dev server)
```

**Total wall time: ~4–5 minutes** (jobs run in parallel where dependencies allow).

A PR cannot be merged unless all 6 checks are green. Coverage dropping below threshold fails `unit-tests`. A broken Firestore security rule fails `integration-tests`. A broken checkout flow fails `e2e`. Nothing slips through.

### 10.9 Environment Variables — Vercel Dashboard

Set all production env vars in Vercel dashboard (never commit them):

```
# Firebase (client — safe to expose, set per environment)
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID

# Firebase Admin (server only — never expose)
FIREBASE_ADMIN_PROJECT_ID
FIREBASE_ADMIN_CLIENT_EMAIL
FIREBASE_ADMIN_PRIVATE_KEY

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET

# Algolia
NEXT_PUBLIC_ALGOLIA_APP_ID
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
ALGOLIA_ADMIN_KEY                   # server/functions only

# Email
RESEND_API_KEY
RESEND_FROM_EMAIL

# App
NEXT_PUBLIC_APP_URL
NEXT_PUBLIC_DEFAULT_LOCALE=he       # Hebrew is the default locale
```

---

## 11. Future Mobile Strategy

### 11.1 Why This Architecture Supports Mobile

All business logic lives in Firebase (Firestore, Auth, Storage) and Cloud Functions — not in Next.js. Firebase has first-class React Native SDKs. Your mobile app would connect to the exact same Firebase project and the same Stripe backend with zero duplication.

### 11.2 React Native Path (Recommended)

When you're ready (6–12 months post web launch):

1. Init Expo project with Expo Router (file-based routing — mirrors Next.js mental model)
2. Install `@react-native-firebase/app`, `@react-native-firebase/auth`, `@react-native-firebase/firestore`
3. Move shared TypeScript types into a `/packages/types` Turborepo package
4. Mobile app consumes the same Firestore collections, same Cloud Functions, same Stripe webhook flow
5. Stripe React Native SDK handles Apple Pay natively (no Payment Request Button needed)

**Code reuse you get for free:** all Zod validation schemas, all utility functions (`formatPrice`, `slugify`), all Firebase data types, all Algolia query logic.

**Code that needs rewriting:** all UI components, routing logic, Tailwind → StyleSheet or NativeWind.

### 11.3 Migration Path to Turborepo (When Needed)

```
tichel-co/               # current repo becomes:
apps/
  web/                   # current Next.js app
  mobile/                # new Expo app
packages/
  types/                 # shared TypeScript interfaces
  firebase/              # shared Firebase helpers
  utils/                 # shared utility functions
functions/               # stays at root — shared backend
```

---

## 12. README — Setup & Workflow

### Project Overview

Tichel & Co. is a luxury modest fashion e-commerce store for the Israeli market. Hebrew/RTL first, English/LTR second.

Stack: Next.js 15 + Firebase (auth, database, storage, functions) + Stripe + Algolia + Resend + next-intl.

```
[![CI](https://github.com/your-org/tichel-co/actions/workflows/ci.yml/badge.svg)](https://github.com/your-org/tichel-co/actions/workflows/ci.yml)
[![Deploy](https://github.com/your-org/tichel-co/actions/workflows/deploy.yml/badge.svg)](https://github.com/your-org/tichel-co/actions/workflows/deploy.yml)
```

### Prerequisites

- Node.js >= 20
- pnpm >= 9
- Firebase CLI: `npm install -g firebase-tools`
- Stripe CLI: `brew install stripe/stripe-cli/stripe`
- Accounts created: Firebase, Stripe, Algolia, Resend, Vercel

### Local Setup

```bash
# 1. Clone
git clone https://github.com/your-org/tichel-co.git
cd tichel-co

# 2. Install dependencies
pnpm install

# 3. Install Cloud Functions dependencies
cd functions && pnpm install && cd ..

# 4. Configure environment
cp .env.example .env.local
# Fill in all values — see Environment Variables section above

# 5. Login to Firebase
firebase login
firebase use tichel-co-dev

# 6. Start Firebase emulators (Auth + Firestore + Storage + Functions)
firebase emulators:start

# 7. In a new terminal, start Stripe webhook forwarding
stripe listen --forward-to localhost:3000/api/checkout/webhook

# 8. Start Next.js dev server
pnpm dev
# → http://localhost:3000
```

### Package Scripts

| Script                             | What it does                                          |
| ---------------------------------- | ----------------------------------------------------- |
| `pnpm dev`                         | Next.js dev server with Turbopack                     |
| `pnpm build`                       | Production build                                      |
| `pnpm type-check`                  | TypeScript strict check                               |
| `pnpm lint`                        | ESLint + RTL CSS audit                                |
| `pnpm test`                        | Unit + integration tests (full suite)                 |
| `pnpm test:unit`                   | Unit + component tests with coverage report           |
| `pnpm test:unit:watch`             | Unit tests in watch mode (for development)            |
| `pnpm test:integration`            | Integration tests against Firebase Emulators          |
| `pnpm test:e2e`                    | Playwright E2E tests (full suite)                     |
| `pnpm test:e2e:ui`                 | Playwright with interactive UI mode                   |
| `pnpm test:e2e:smoke`              | Smoke tests only (`@smoke` tagged) — used post-deploy |
| `pnpm test:e2e:debug`              | Playwright debug mode — step through failing tests    |
| `firebase emulators:start`         | Start Auth + Firestore + Functions emulators          |
| `firebase deploy --only functions` | Deploy Cloud Functions                                |
| `firebase deploy --only firestore` | Deploy Security Rules + Indexes                       |
| `vercel --prod`                    | Deploy frontend to production                         |

### Development Workflow

```bash
# 1. Create feature branch
git checkout -b feat/product-gallery

# 2. Develop (emulators + stripe CLI running)
pnpm dev

# 3. Run tests
pnpm test

# 4. Commit with conventional commits
git commit -m "feat: add product image gallery with swipe support"

# 5. Push and open PR
git push origin feat/product-gallery

# 6. CI runs automatically (type-check, lint, test, build)
# 7. Merge when green
```

### Seeding Development Data

```bash
# Run the seed script against local emulators
pnpm db:seed

# This creates:
# - 5 collections (Tichels, Scarves, Head Wraps, Accessories, New Arrivals)
# - 20 products with variants
# - 1 admin user (admin@tichelco.dev / password: Admin1234!)
# - 3 sample orders in various statuses
```

### Firestore Security Rules — Key Patterns

```javascript
// firestore.rules — summarized logic

// Products: anyone can read published products
// Only admin Cloud Functions can write

// Orders: owner can read own order, guests match by sessionId
// Only Cloud Functions can write/update order status

// Cart: owner can read/write own cart document only

// CustomRequests: anyone can create, owner can read own
// Only admin can update status

// Admin operations NEVER come from the client browser.
// All admin mutations go through Cloud Functions using Admin SDK.
```

### Deployment Checklist

Before going live:

- [ ] Stripe live mode keys set in Vercel production env vars
- [ ] Firebase production project (`tichel-co-prod`) configured
- [ ] Firestore Security Rules deployed to production project
- [ ] Cloud Functions deployed to production project
- [ ] Stripe webhook endpoint registered: `https://yourdomain.com/api/checkout/webhook`
- [ ] Algolia `products_he` and `products_en` indices populated with real products
- [ ] Custom domain configured in Vercel
- [ ] SSL certificate active
- [ ] `NEXT_PUBLIC_APP_URL` set to production domain
- [ ] Test purchase with real card completed — **once in Hebrew (ILS), once in English (USD)**
- [ ] All pages Lighthouse >90 — **test both `/he/` and `/en/` routes**
- [ ] **`hreflang` tags verified in page source for all PDP pages**
- [ ] **Hebrew legal pages live: Privacy, Terms, Returns**
- [ ] **`dir="rtl"` confirmed on `<html>` for Hebrew routes in production**
- [ ] **Google Search Console: Hebrew sitemap + English sitemap submitted**

### Roadmap

| Phase       | Status | Description                               |
| ----------- | ------ | ----------------------------------------- |
| Phase 0     | ⬜     | Environment setup                         |
| Phase 1     | ⬜     | Design system                             |
| Phase 2     | ⬜     | Core frontend (mock data)                 |
| Phase 3     | ⬜     | Firebase integration                      |
| Phase 4     | ⬜     | Stripe payments                           |
| Phase 5     | ⬜     | Admin panel                               |
| Phase 6     | ⬜     | Polish + launch prep                      |
| Post-Launch | ⬜     | React Native mobile app                   |
| Post-Launch | ⬜     | Loyalty program                           |
| Post-Launch | ⬜     | International shipping + multi-currency   |
| Post-Launch | ⬜     | Sentry error tracking + PostHog analytics |

---

## 13. Future Scale-Up Services

> **MVP uses 4 services: Firebase, Vercel, Stripe, Resend.**
> The services below are intentionally deferred. They add complexity and cost that is not justified at 10–25 products and early-stage traffic. When the business grows, adopt them incrementally:

| Service           | When to Adopt                                                                      | What It Replaces                                              |
| ----------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------- |
| **Algolia**       | 200+ products — client-side filtering becomes slow                                 | Client-side `.filter()` / `.sort()` on Firestore product list |
| **Clerk**         | 10K+ users — need advanced auth features (MFA, org management, user impersonation) | Firebase Auth                                                 |
| **Sentry**        | Post-launch — need production error tracking with source maps                      | `console.error` + Vercel function logs                        |
| **PostHog**       | Post-launch — need funnel analysis, session replay, A/B testing                    | Vercel Analytics (basic)                                      |
| **Upstash Redis** | High traffic — need rate limiting on auth/checkout endpoints                       | Firebase Security Rules (basic)                               |
| **Cloudflare R2** | High storage/egress — need zero-egress image hosting                               | Firebase Storage                                              |

**Guiding principle:** add services only when the current solution measurably fails. Never pre-optimize for scale you haven't reached.

---

_✦ Built with intention, for women who cover with intention ✦_
