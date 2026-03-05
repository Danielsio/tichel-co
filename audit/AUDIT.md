# Tichel & Co. — Full Repository Audit

_Generated: 2026-03-05_

## Legend

| Status          | Meaning              |
| --------------- | -------------------- |
| :red_circle:    | Not started          |
| :yellow_circle: | In progress          |
| :green_circle:  | Fixed                |
| :white_circle:  | Won't fix / Deferred |

---

## P0 — Critical / Security

| #   | Issue                                                                                                                                                                                                                     | File(s)                           | Status         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------- | -------------- |
| 1   | **Checkout price manipulation** — `unitPriceCents` comes from client; server trusts it. Attacker can send $0 prices.                                                                                                      | `app/api/checkout/route.ts`       | :green_circle: |
| 2   | **Admin secret bypass** — If `ADMIN_SECRET` env var is unset, `undefined !== undefined` is `false`, so auth check passes. Anyone can set roles.                                                                           | `app/api/admin/set-role/route.ts` | :green_circle: |
| 3   | **Firestore rules block admin operations** — Rules only allow reading orders/customRequests for `userId == auth.uid`. Admin panel can't read all orders. Products have `allow write: if false`; admin product edits fail. | `firestore.rules`                 | :white_circle: |

## P1 — High / Bugs

| #   | Issue                                                                                                                                | File(s)                                             | Status         |
| --- | ------------------------------------------------------------------------------------------------------------------------------------ | --------------------------------------------------- | -------------- |
| 4   | **Broken link `/account/orders/latest`** — "latest" is not a valid order ID. Links to a stub page.                                   | `app/[locale]/(store)/account/page.tsx`             | :green_circle: |
| 5   | **Order detail page is a stub** — Shows "Phase 4/5" placeholder text.                                                                | `app/[locale]/(store)/account/orders/[id]/page.tsx` | :white_circle: |
| 6   | **Order confirmation email never sent** — Stripe webhook handles `payment_intent.succeeded` but never calls `sendOrderConfirmation`. | `app/api/webhooks/stripe/route.ts`                  | :green_circle: |
| 7   | **Checkout input not validated** — Request body is not validated with `createOrderSchema` or any schema.                             | `app/api/checkout/route.ts`                         | :green_circle: |
| 8   | **Set-role missing role validation** — Arbitrary role values accepted (e.g. `"superadmin"`).                                         | `app/api/admin/set-role/route.ts`                   | :green_circle: |
| 9   | **Footer missing Terms/Returns/Privacy links** — Translation keys exist but footer only renders About and Care Guide.                | `components/layout/footer.tsx`                      | :green_circle: |
| 10  | **Store pages use mock data** — Home, products, collections, and lookbook use `lib/mock-data.ts` instead of Firestore.               | Multiple store pages                                | :white_circle: |

## P2 — Medium / UX & i18n

| #   | Issue                                                                                                                                                           | File(s)                                                   | Status         |
| --- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------- | -------------- |
| 11  | **Hardcoded Hebrew in ProductCard** — Badges and quickAdd text not translated.                                                                                  | `components/product/product-card.tsx`                     | :green_circle: |
| 12  | **Hardcoded Hebrew aria-labels** — Toast close button, pagination nav use Hebrew instead of `t()`.                                                              | `components/ui/toast.tsx`, `components/ui/pagination.tsx` | :green_circle: |
| 13  | **Checkout form has hardcoded English labels** — "Email", "First Name", "Address", etc. not translated.                                                         | `app/[locale]/(store)/checkout/page.tsx`                  | :red_circle:   |
| 14  | **Admin panel fully hardcoded in Hebrew** — All labels, headings, form fields are inline Hebrew.                                                                | `app/[locale]/admin/**`                                   | :white_circle: |
| 15  | **Missing metadata/SEO** — Products, collections, cart, checkout, login, register, account, lookbook, custom, order-confirmation pages lack `generateMetadata`. | Multiple pages                                            | :red_circle:   |
| 16  | **Error/404 pages use hardcoded English** — `app/error.tsx` and `app/not-found.tsx` are not localized.                                                          | `app/error.tsx`, `app/not-found.tsx`                      | :red_circle:   |
| 17  | **Order confirmation page has hardcoded strings** — Mix of Hebrew and English inline.                                                                           | `app/[locale]/(store)/order-confirmation/[id]/page.tsx`   | :red_circle:   |
| 18  | **Missing image error handlers** — ProductCard, ProductGallery, CartDrawer have no `onError` fallback.                                                          | Multiple components                                       | :green_circle: |
| 19  | **No cart sync debouncing** — Every item change triggers a Firestore `setDoc`; rapid changes cause many writes.                                                 | `hooks/use-cart-sync.ts`                                  | :green_circle: |
| 20  | **Drawer missing focus trap** — Focus can escape the drawer/modal when open.                                                                                    | `components/ui/drawer.tsx`                                | :green_circle: |
| 21  | **Select error not linked via aria-describedby** — Error message has `role="alert"` but `select` element doesn't reference it.                                  | `components/ui/select.tsx`                                | :green_circle: |
| 22  | **Newsletter form does nothing** — `onSubmit` only calls `e.preventDefault()`; no functionality.                                                                | `components/layout/footer.tsx`                            | :white_circle: |
| 23  | **Missing Content-Security-Policy header**                                                                                                                      | `next.config.ts`                                          | :green_circle: |
| 24  | **No idempotency in Stripe webhook** — Duplicate events can double-update orders.                                                                               | `app/api/webhooks/stripe/route.ts`                        | :green_circle: |
| 25  | **Revalidate API accepts arbitrary tags** — No whitelist; any tag can be purged.                                                                                | `app/api/revalidate/route.ts`                             | :green_circle: |
| 26  | **Locale prefix /he shown for default locale** — Hebrew users see unnecessary /he in all URLs.                                                                  | `lib/i18n/routing.ts`                                     | :green_circle: |

## P3 — Low / Code Quality

| #   | Issue                                                                                                          | File(s)                                                                  | Status         |
| --- | -------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------ | -------------- |
| 27  | **Missing `React.memo`** — `CartItemRow` and `ProductCard` re-render unnecessarily in lists.                   | `components/cart/cart-drawer.tsx`, `components/product/product-card.tsx` | :red_circle:   |
| 28  | **Inline event handlers in JSX** — Pagination, Modal, ProductGallery, Footer create new functions each render. | Multiple components                                                      | :red_circle:   |
| 29  | **Type assertions** — `useLocale() as Locale` in locale-switcher and footer.                                   | `components/layout/locale-switcher.tsx`, `components/layout/footer.tsx`  | :red_circle:   |
| 30  | **Non-standard Tailwind `duration-400`** — Used in drawer, product-card; not a default Tailwind value.         | `components/ui/drawer.tsx`, `components/product/product-card.tsx`        | :white_circle: |
| 31  | **Inconsistent opacity scale** — Announcement bar uses `text-ivory/70`, footer uses `/40`, `/50`; no standard. | `components/layout/header.tsx`, `components/layout/footer.tsx`           | :white_circle: |
| 32  | **Card semantic HTML** — `Card` uses `div`; `article` or `section` may be more appropriate.                    | `components/ui/card.tsx`                                                 | :white_circle: |
| 33  | **RangeSlider missing keyboard support** — Thumbs can't be adjusted with arrow keys.                           | `components/ui/range-slider.tsx`                                         | :green_circle: |
| 34  | **ProductGallery missing keyboard nav** — Thumbnails lack arrow-key navigation between images.                 | `components/product/product-gallery.tsx`                                 | :red_circle:   |
| 35  | **`service-account.json` in project root** — Ensure it stays in `.gitignore` and is never committed.           | `service-account.json`                                                   | :green_circle: |

---

## Summary

| Priority    | Total  | Fixed  | Remaining |
| ----------- | ------ | ------ | --------- |
| P0 Critical | 3      | 2      | 1         |
| P1 High     | 7      | 5      | 2         |
| P2 Medium   | 16     | 11     | 5         |
| P3 Low      | 9      | 2      | 7         |
| **Total**   | **35** | **20** | **15**    |
