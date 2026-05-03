# Deploying ReviewMax

This guide assumes a Supabase project, a Vercel account, and (optionally) a self-hosted n8n instance.

## 1. Supabase

1. Create a project at [https://supabase.com](https://supabase.com).
2. Open **SQL Editor** and run the full script in `supabase/schema.sql` (tables, RLS, indexes, seed).
3. Under **Authentication → Users**, create an admin user (or sign up once via Supabase Auth and edit the `profiles` row).
4. Set that user’s `profiles.role` to `admin` (Table Editor → `profiles`).
5. Copy **Project URL** and **anon** / **service_role** keys from **Project Settings → API**.

## 2. Environment variables (Vercel)

In the Vercel project, add every variable from `.env.example`:

- `NEXT_PUBLIC_*` and `NEXT_PUBLIC_SUPABASE_*` are safe for the browser.
- `SUPABASE_SERVICE_ROLE_KEY`, `WEBHOOK_SECRET`, and `SENTRY_DSN` must stay server-only.

Set `NEXT_PUBLIC_SITE_URL` to your production URL (e.g. `https://reviews.yourdomain.com`).

## 3. Deploy to Vercel

1. Push this repo to GitHub (or import locally).
2. **New Project** in Vercel → import the repo; framework preset **Next.js**.
3. Paste environment variables.
4. Deploy. After the first deploy, confirm **Build** succeeds.

## 4. n8n automation

1. Admin form posts to `N8N_REVIEW_WEBHOOK_URL` (optional) after inserting into `review_requests`.
2. Workflow steps (your implementation): receive payload → Claude API → image upload to Google Drive → **HTTP Request** to  
   `https://YOUR_DOMAIN/api/webhook/n8n` with:
   - Header `X-Webhook-Secret: <same as WEBHOOK_SECRET>`
   - JSON body matching `WebhookPayloadSchema` in `lib/validations.ts` (`category_slug` must exist in `categories`).
3. The webhook uses the **service role** key to insert into `posts` and triggers `revalidatePath` for ISR.

## 5. Supabase + Vercel integration

- Add your Vercel deployment URL to **Authentication → URL Configuration** (redirect URLs / site URL) if you use magic links later.
- No change needed for anon data reads: public pages use the anon key with RLS.

## 6. Post-deploy checklist

- [ ] Open `/` and `/blog`; confirm posts load from Supabase.
- [ ] Sign in at `/login` as admin; open `/dashboard` and submit a test review request.
- [ ] Call `POST /api/webhook/n8n` with a valid payload and `X-Webhook-Secret`; confirm a new row in `posts` and `/blog/<slug>` works.
- [ ] Confirm Amazon links include `tag=` when `NEXT_PUBLIC_AMAZON_TRACKING_ID` is set.
- [ ] Fetch `https://YOUR_DOMAIN/sitemap.xml` and `https://YOUR_DOMAIN/robots.txt`.

## 7. Custom domain (optional)

In Vercel → **Domains**, connect your domain and set `NEXT_PUBLIC_SITE_URL` to match.
