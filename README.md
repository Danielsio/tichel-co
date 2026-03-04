# Tichel & Co. — אופנה צנועה יוקרתית

A premium, mobile-first e-commerce platform for Jewish modest fashion, targeting the Israeli market. Hebrew UI (RTL), ILS currency.

## Stack

| Layer         | Dev                     | Production                    | Cost |
| ------------- | ----------------------- | ----------------------------- | ---- |
| **Framework** | Next.js 15 (App Router) | Vercel hobby                  | $0   |
| **Database**  | Postgres 16 (Docker)    | Supabase free (500 MB)        | $0   |
| **Cache**     | Redis 7 (Docker)        | In-memory fallback            | $0   |
| **Auth**      | Clerk (test)            | Clerk free tier (10k MAU)     | $0   |
| **Payments**  | Stripe (test mode)      | Stripe (pay-per-transaction)  | $0   |
| **Email**     | Resend (test)           | Resend free tier (3k/month)   | $0   |
| **CI/CD**     | —                       | GitHub Actions (2k min/month) | $0   |

**Also uses:** Tailwind CSS v4, Drizzle ORM, Zustand, TanStack Query, Zod, TypeScript.

**Deferred (post-MVP):** Sentry, PostHog, Algolia, Cloudflare R2, Upstash.

## Prerequisites

- Node.js >= 20
- pnpm >= 9
- Docker Desktop (local Postgres + Redis)

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Create env file and fill in Clerk + Stripe keys
cp .env.example .env.local

# 3. Start local database and cache
docker-compose up -d

# 4. Push schema and seed sample data
pnpm db:push
pnpm db:seed

# 5. Start dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command            | Description                             |
| ------------------ | --------------------------------------- |
| `pnpm dev`         | Start Next.js dev server with Turbopack |
| `pnpm build`       | Production build                        |
| `pnpm start`       | Start production server                 |
| `pnpm test`        | Run unit tests (Vitest)                 |
| `pnpm test:e2e`    | Run E2E tests (Playwright)              |
| `pnpm lint`        | ESLint check                            |
| `pnpm format`      | Prettier format                         |
| `pnpm type-check`  | TypeScript strict check                 |
| `pnpm db:generate` | Generate Drizzle migrations             |
| `pnpm db:push`     | Push schema to database                 |
| `pnpm db:seed`     | Seed database with sample data          |
| `pnpm db:studio`   | Open Drizzle Studio GUI                 |

## Deploy to Production

1. Create a free [Supabase](https://supabase.com) project — copy the connection string
2. Create free [Clerk](https://clerk.com) and [Stripe](https://stripe.com) accounts — copy API keys
3. Create free [Resend](https://resend.com) account — copy API key
4. Deploy to [Vercel](https://vercel.com) and set environment variables from `.env.example`

## Localization

- **Primary market:** Israel
- **UI language:** Hebrew (`lang="he"`, `dir="rtl"`)
- **Body font:** Heebo (Google Fonts, Hebrew-native)
- **Display font:** Cormorant Garamond (brand/editorial headings)
- **Currency:** ILS (₪) by default
- **Admin panel:** English (internal tool)

## Development Workflow

1. Create feature branch from `main`: `git checkout -b feat/your-feature`
2. Develop with `pnpm dev` — hot reload via Turbopack
3. Run `pnpm db:studio` to inspect database visually
4. Run `pnpm test` for fast feedback on logic changes
5. Commit with Conventional Commits: `git commit -m 'feat: add wishlist persistence'`
6. Push and open PR — CI runs automatically

---

_נבנה בכוונה, לנשים שמכסות בכוונה._
