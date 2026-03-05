# Tichel & Co. — Full Repository Audit

_Generated: 2026-03-05_

## Legend

| Status | Meaning              |
| ------ | -------------------- |
| DONE   | Fixed                |
| SKIP   | Won't fix / Deferred |
| TODO   | Not started          |

---

## P0 — Critical / Security

| #   | Issue                                                                                                | File(s)                           | Status |
| --- | ---------------------------------------------------------------------------------------------------- | --------------------------------- | ------ |
| 1   | **Checkout price manipulation** — server now validates input and derives prices from product catalog | `app/api/checkout/route.ts`       | DONE   |
| 2   | **Admin secret bypass** — fails closed when ADMIN_SECRET unset; role validated against allowlist     | `app/api/admin/set-role/route.ts` | DONE   |
| 3   | **Firestore rules block admin operations** — rules now allow `role == "admin"` to read/write         | `firestore.rules`                 | DONE   |

## P1 — High / Bugs

| #   | Issue                                                                                       | File(s)                                             | Status |
| --- | ------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------ |
| 4   | **Broken link `/account/orders/latest`** — removed, shows "coming soon" badge               | `app/[locale]/(store)/account/page.tsx`             | DONE   |
| 5   | **Order detail page is a stub** — Phase 4/5 feature                                         | `app/[locale]/(store)/account/orders/[id]/page.tsx` | SKIP   |
| 6   | **Order confirmation email never sent** — now called from Stripe webhook on payment success | `app/api/webhooks/stripe/route.ts`                  | DONE   |
| 7   | **Checkout input not validated** — Zod schema validates all fields server-side              | `app/api/checkout/route.ts`                         | DONE   |
| 8   | **Set-role missing role validation** — only "admin" and "user" allowed                      | `app/api/admin/set-role/route.ts`                   | DONE   |
| 9   | **Footer missing Terms/Returns/Privacy links** — added using existing translation keys      | `components/layout/footer.tsx`                      | DONE   |
| 10  | **Store pages use mock data** — intentional for MVP                                         | Multiple store pages                                | SKIP   |

## P2 — Medium / UX & i18n

| #   | Issue                                                                                   | File(s)                                                   | Status |
| --- | --------------------------------------------------------------------------------------- | --------------------------------------------------------- | ------ |
| 11  | **Hardcoded Hebrew in ProductCard** — now uses `t("new")`, `t("sale")`, `t("quickAdd")` | `components/product/product-card.tsx`                     | DONE   |
| 12  | **Hardcoded Hebrew aria-labels** — toast and pagination now use `t()`                   | `components/ui/toast.tsx`, `components/ui/pagination.tsx` | DONE   |
| 13  | **Checkout form has hardcoded English labels**                                          | `app/[locale]/(store)/checkout/page.tsx`                  | TODO   |
| 14  | **Admin panel fully hardcoded in Hebrew** — admin is internal-only                      | `app/[locale]/admin/**`                                   | SKIP   |
| 15  | **Missing metadata/SEO on several pages**                                               | Multiple pages                                            | TODO   |
| 16  | **Error/404 pages use hardcoded English**                                               | `app/error.tsx`, `app/not-found.tsx`                      | TODO   |
| 17  | **Order confirmation page has hardcoded strings**                                       | `app/[locale]/(store)/order-confirmation/[id]/page.tsx`   | TODO   |
| 18  | **Missing image error handlers** — added onError to ProductCard, Gallery, CartDrawer    | Multiple components                                       | DONE   |
| 19  | **No cart sync debouncing** — 500ms debounce added                                      | `hooks/use-cart-sync.ts`                                  | DONE   |
| 20  | **Drawer missing focus trap** — focus trap and restoration added                        | `components/ui/drawer.tsx`                                | DONE   |
| 21  | **Select error not linked via aria-describedby** — id and aria-describedby added        | `components/ui/select.tsx`                                | DONE   |
| 22  | **Newsletter form does nothing** — no backend yet                                       | `components/layout/footer.tsx`                            | SKIP   |
| 23  | **Missing Content-Security-Policy header** — CSP added                                  | `next.config.ts`                                          | DONE   |
| 24  | **No idempotency in Stripe webhook** — skips already-processed orders                   | `app/api/webhooks/stripe/route.ts`                        | DONE   |
| 25  | **Revalidate API accepts arbitrary tags** — whitelist and error handling added          | `app/api/revalidate/route.ts`                             | DONE   |
| 26  | **Locale prefix /he shown for default locale** — switched to as-needed                  | `lib/i18n/routing.ts`                                     | DONE   |

## P3 — Low / Code Quality

| #   | Issue                                                                        | File(s)                                                                  | Status |
| --- | ---------------------------------------------------------------------------- | ------------------------------------------------------------------------ | ------ |
| 27  | **Missing React.memo on CartItemRow and ProductCard**                        | `components/cart/cart-drawer.tsx`, `components/product/product-card.tsx` | TODO   |
| 28  | **Inline event handlers in JSX**                                             | Multiple components                                                      | TODO   |
| 29  | **Type assertions useLocale() as Locale**                                    | `components/layout/locale-switcher.tsx`, `components/layout/footer.tsx`  | TODO   |
| 30  | **Non-standard Tailwind duration-400**                                       | `components/ui/drawer.tsx`, `components/product/product-card.tsx`        | SKIP   |
| 31  | **Inconsistent opacity scale**                                               | `components/layout/header.tsx`, `components/layout/footer.tsx`           | SKIP   |
| 32  | **Card semantic HTML**                                                       | `components/ui/card.tsx`                                                 | SKIP   |
| 33  | **RangeSlider missing keyboard support** — arrow keys now adjust thumbs      | `components/ui/range-slider.tsx`                                         | DONE   |
| 34  | **ProductGallery missing keyboard nav**                                      | `components/product/product-gallery.tsx`                                 | TODO   |
| 35  | **service-account.json in project root** — confirmed in .gitignore           | `service-account.json`                                                   | DONE   |
| 36  | **Admin layout unprotected** — now requires Firebase Auth + admin role claim | `app/[locale]/admin/layout.tsx`                                          | DONE   |

---

## Summary

| Priority    | Total  | Fixed  | Remaining |
| ----------- | ------ | ------ | --------- |
| P0 Critical | 3      | 3      | 0         |
| P1 High     | 7      | 5      | 2         |
| P2 Medium   | 16     | 12     | 4         |
| P3 Low      | 10     | 3      | 7         |
| **Total**   | **36** | **23** | **13**    |
