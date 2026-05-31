# Deploying ReviewMax (VPS + Coolify + PostgreSQL)

This guide assumes a VPS with [Coolify](https://coolify.io), a PostgreSQL database, and (optionally) a self-hosted n8n instance.

## 1. PostgreSQL

### Local development (native PostgreSQL on Windows)

1. Install PostgreSQL from [postgresql.org](https://www.postgresql.org/download/windows/) if needed.
2. Copy env file and set your **postgres superuser password**:
   ```powershell
   cp .env.example .env.local
   ```
   Edit `.env.local` → replace `YOUR_POSTGRES_PASSWORD` in `POSTGRES_ADMIN_URL`.
3. Create database, migrate, and seed:
   ```powershell
   npm run db:setup
   npm run dev
   ```
4. Sign in at `/login` with `ADMIN_EMAIL` / `ADMIN_INITIAL_PASSWORD`.

### Production (Coolify)

1. In Coolify, create a **PostgreSQL** service in the same project as the app.
2. Copy the internal connection string into the app env as `DATABASE_URL`.
3. On first deploy, run migrations and seed from the app container or a one-off command:
   - `npm run db:migrate`
   - `npm run db:seed` (requires `ADMIN_INITIAL_PASSWORD`)

## 2. Environment variables

Add every variable from `.env.example` to Coolify:

| Variable | Notes |
|----------|-------|
| `DATABASE_URL` | Internal Postgres URL from Coolify |
| `AUTH_SECRET` | Long random string (`openssl rand -base64 32`) |
| `AUTH_URL` | Public site URL, e.g. `https://reviews.yourdomain.com` |
| `ADMIN_EMAIL` | Seeded admin login email |
| `ADMIN_INITIAL_PASSWORD` | One-time seed password; rotate after first login |
| `WEBHOOK_SECRET` | Shared with n8n |
| `NEXT_PUBLIC_SITE_URL` | Same as public URL |

Server-only (never expose to browser): `DATABASE_URL`, `AUTH_SECRET`, `WEBHOOK_SECRET`, `SENTRY_DSN`.

## 3. Deploy to Coolify

1. Push this repo to GitHub.
2. Create a **Next.js** application in Coolify and connect the repo.
3. Set build/start commands (Coolify defaults usually work):
   - Build: `npm run build`
   - Start: `npm run start` (uses Next.js standalone output)
4. Paste environment variables.
5. Attach your domain in Coolify (HTTPS handled by the reverse proxy).

After the first deploy:

```bash
npm run db:migrate
npm run db:seed
```

Re-run `npm run db:migrate` after pulling updates that add SQL files under `drizzle/` (e.g. `0001_post_gallery.sql`). Uses `DATABASE_URL` from Coolify env (no `.env.local` in production).

## 4. n8n automation

Full step-by-step guide: **docs/N8N.md**

Summary:

1. Create an n8n workflow with Webhook path `review-request`.
2. Set `N8N_REVIEW_WEBHOOK_URL` in ReviewMax to the n8n production webhook URL.
3. Workflow: Webhook → Claude (Anthropic) → `POST /api/webhook/n8n` on ReviewMax.
4. Use the same `WEBHOOK_SECRET` in ReviewMax and both n8n HTTP headers.
5. n8n must call a **public** ReviewMax URL (not `localhost` from your PC).

Code snippets for n8n Code nodes: `n8n/code/`

Test publish webhook locally:

```powershell
npm run test:webhook
```

## 5. Post-deploy checklist

- [ ] Open `/` and `/blog`; confirm posts load from PostgreSQL.
- [ ] Sign in at `/login` as admin; open `/dashboard` and submit a test review request.
- [ ] Call `POST /api/webhook/n8n` with a valid payload and `X-Webhook-Secret`; confirm a new row in `posts` and `/blog/<slug>` works.
- [ ] Confirm Amazon links include `tag=` when `NEXT_PUBLIC_AMAZON_TRACKING_ID` is set.
- [ ] Fetch `https://YOUR_DOMAIN/sitemap.xml` and `https://YOUR_DOMAIN/robots.txt`.

## 6. Custom domain (optional)

In Coolify → **Domains**, connect your domain and set `NEXT_PUBLIC_SITE_URL` and `AUTH_URL` to match.
