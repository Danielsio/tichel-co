# Tichel & Co. — אופנה צנועה יוקרתית

A premium, mobile-first e-commerce platform for Jewish modest fashion, targeting the Israeli market. Hebrew UI (RTL), ILS currency.

## Stack

| Layer         | Technology                                | Cost                 |
| ------------- | ----------------------------------------- | -------------------- |
| **Framework** | Next.js 15 (App Router, SSR)              | —                    |
| **Hosting**   | Firebase App Hosting (Cloud Run) + Vercel | $0                   |
| **Database**  | Cloud Firestore                           | $0 (Blaze free tier) |
| **Auth**      | Firebase Authentication                   | $0                   |
| **Storage**   | Firebase Cloud Storage                    | $0                   |
| **Payments**  | Stripe (deferred)                         | pay-per-transaction  |
| **Email**     | Resend (deferred)                         | $0 (3k/month free)   |
| **CI/CD**     | GitHub Actions                            | $0 (2k min/month)    |

**Also uses:** Tailwind CSS v4, Zustand, Zod, next-intl, React Hook Form, web-vitals, TypeScript.

**Deferred (post-MVP):** Sentry, PostHog, Algolia.

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Firebase CLI (`npm i -g firebase-tools`)

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Create env file with Firebase config
cp .env.example .env.local

# 3. Seed Firestore with sample data
pnpm seed

# 4. Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command              | Description                                         |
| -------------------- | --------------------------------------------------- |
| `pnpm dev`           | Start Next.js dev server with Turbopack             |
| `pnpm build`         | Production build                                    |
| `pnpm start`         | Start production server                             |
| `pnpm test`          | Run unit tests (Vitest)                             |
| `pnpm test:e2e`      | Run E2E tests (Playwright)                          |
| `pnpm lint`          | ESLint check                                        |
| `pnpm format`        | Prettier format                                     |
| `pnpm type-check`    | TypeScript strict check                             |
| `pnpm seed`          | Seed Firestore with sample data                     |
| `pnpm emulators`     | Start Firebase emulators (auth, firestore, storage) |
| `pnpm benchmark`     | Compare hosting performance (Vercel vs Firebase)    |
| `pnpm release`       | Bump version and generate changelog (auto-detect)   |
| `pnpm release:patch` | Force patch version bump                            |
| `pnpm release:minor` | Force minor version bump                            |
| `pnpm release:major` | Force major version bump                            |

## Deployment

**Firebase App Hosting** auto-deploys from `master` via GitHub integration. Environment variables are stored in Google Cloud Secret Manager and referenced in `apphosting.yaml`.

**Vercel** also auto-deploys from `master` via its own GitHub integration.

### Setting secrets

```bash
firebase apphosting:secrets:set <SECRET_NAME> --project tichel-co
```

## Releasing

Versioning uses [commit-and-tag-version](https://github.com/absolute-version/commit-and-tag-version) with conventional commits. Two options:

**Local:** Run `pnpm release` then `git push --follow-tags origin master`.

**GitHub Actions:** Go to Actions > Release > Run workflow and select bump type (auto/patch/minor/major). The workflow bumps the version, pushes the tag, and creates a GitHub Release.

## Localization

- **Primary market:** Israel
- **UI language:** Hebrew (`lang="he"`, `dir="rtl"`) with English fallback
- **Body font:** Heebo (Google Fonts, Hebrew-native)
- **Display font:** Cormorant Garamond (brand/editorial headings)
- **Currency:** ILS (₪) by default

## Development Workflow

1. Create feature branch from `master`: `git checkout -b feat/your-feature`
2. Develop with `pnpm dev` — hot reload via Turbopack
3. Run `pnpm test` for fast feedback on logic changes
4. Commit with [Conventional Commits](https://www.conventionalcommits.org/): `git commit -m 'feat: add wishlist'`
5. Push and open PR — CI runs lint, type-check, unit tests, build, and E2E tests

---

_נבנה בכוונה, לנשים שמכסות בכוונה._
