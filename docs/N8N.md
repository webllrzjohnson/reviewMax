# n8n automation for ReviewMax

Connect your VPS n8n instance to generate reviews with Claude and publish them back to ReviewMax.

## Quick start — import the workflow

**Start here:** [`n8n/SETUP.md`](../n8n/SETUP.md)

1. Import `n8n/reviewmax-generate-review.workflow.json` into n8n.
2. Add your Anthropic API key on the **Claude API** node.
3. Set **Publish to ReviewMax** URL and `X-Webhook-Secret`.
4. Activate the workflow and copy the Webhook Production URL into ReviewMax `N8N_REVIEW_WEBHOOK_URL`.

---

## Flow

```
Admin form (/dashboard/new-review)
    │  POST + X-Webhook-Secret
    ▼
n8n Webhook (/webhook/review-request)
    │  Claude API
    ▼
n8n HTTP Request
    │  POST + X-Webhook-Secret
    ▼
ReviewMax /api/webhook/n8n  →  PostgreSQL posts table  →  /blog/[slug]
```

## Important: URLs must be reachable

Your n8n runs on a **VPS**. It cannot call `http://localhost:3000` on your PC.

| ReviewMax runs on | n8n should publish to |
|-------------------|------------------------|
| Local dev (`npm run dev`) | Use a tunnel (Cloudflare Tunnel, ngrok) **or** test only after deploy |
| VPS / Coolify (production) | `https://your-domain.com/api/webhook/n8n` |

---

## Step 1 — Configure ReviewMax (`.env.local`)

```env
WEBHOOK_SECRET=reviewmax-local-webhook-secret-change-me

# Your n8n webhook URL (from Step 2)
N8N_REVIEW_WEBHOOK_URL=https://n8n.YOUR_DOMAIN.com/webhook/review-request
```

Restart the dev server after changing env vars.

---

## Step 2 — Create the n8n workflow

In n8n, create a new workflow named **ReviewMax — Generate Review**.

### Node 1: Webhook (trigger)

| Setting | Value |
|---------|-------|
| HTTP Method | POST |
| Path | `review-request` |
| Authentication | None (secret is in header) |
| Response | Immediately |

Copy the **Production URL** (e.g. `https://n8n.example.com/webhook/review-request`) into `N8N_REVIEW_WEBHOOK_URL`.

Optional: add an **IF** node after the webhook to verify  
`{{ $json.headers["x-webhook-secret"] }}` equals your `WEBHOOK_SECRET`.

### Node 2: Code — “Build Claude prompt”

Paste code from `n8n/code/01-build-claude-prompt.js`.

### Node 3: HTTP Request — Claude (Anthropic)

| Setting | Value |
|---------|-------|
| Method | POST |
| URL | `https://api.anthropic.com/v1/messages` |
| Authentication | Header Auth credential |

Headers:

| Name | Value |
|------|-------|
| `anthropic-version` | `2023-06-01` |
| `content-type` | `application/json` |
| `x-api-key` | Your Anthropic API key (use n8n credential) |

Body (JSON):

```json
{
  "model": "claude-sonnet-4-20250514",
  "max_tokens": 4096,
  "system": "={{ $json.claude_system }}",
  "messages": [
    {
      "role": "user",
      "content": "={{ $json.claude_user }}"
    }
  ]
}
```

### Node 4: Code — “Parse Claude response”

Paste code from `n8n/code/02-parse-claude-response.js`.

Rename node 2 to **Build Claude prompt** (the parse script references that name).

### Node 5: HTTP Request — Publish to ReviewMax

| Setting | Value |
|---------|-------|
| Method | POST |
| URL | `https://YOUR_REVIEWMAX_DOMAIN/api/webhook/n8n` |
| Body | JSON from previous node |

Headers:

| Name | Value |
|------|-------|
| `Content-Type` | `application/json` |
| `X-Webhook-Secret` | Same as `WEBHOOK_SECRET` in ReviewMax |

**Activate the workflow** in n8n.

---

## Step 3 — Category IDs

The webhook payload requires `category_id` (UUID). Seeded categories:

| Slug | UUID |
|------|------|
| `kitchen-gadgets` | `11111111-1111-1111-1111-111111111101` |
| `home-tech` | `11111111-1111-1111-1111-111111111102` |
| `fitness-gear` | `11111111-1111-1111-1111-111111111103` |

The admin form now sends `category_id` automatically when n8n is triggered.

Reference: `n8n/category-ids.json`

---

## Step 4 — Test

### Test publish webhook directly (skip Claude)

```powershell
npm run test:webhook
```

### End-to-end test

1. Sign in at `/login`
2. Go to `/dashboard/new-review`
3. Submit a product
4. Watch execution in n8n
5. Open `/blog/<slug>` on ReviewMax

---

## Payload reference

### ReviewMax → n8n (admin form)

```json
{
  "product_name": "Example Blender",
  "category": "kitchen-gadgets",
  "category_id": "11111111-1111-1111-1111-111111111101",
  "amazon_url": "https://www.amazon.com/dp/B0EXAMPLE",
  "notes": "Optional editor notes"
}
```

Header: `X-Webhook-Secret: <WEBHOOK_SECRET>`

### n8n → ReviewMax (`POST /api/webhook/n8n`)

```json
{
  "title": "Example Blender Review: ...",
  "slug": "example-blender-review",
  "excerpt": "Short summary.",
  "body": "Full markdown/HTML body.",
  "category_id": "11111111-1111-1111-1111-111111111101",
  "rating": 4.5,
  "pros": ["Pro one", "Pro two"],
  "cons": ["Con one"],
  "verdict": "Bottom line recommendation.",
  "amazon_url": "https://www.amazon.com/dp/B0EXAMPLE",
  "image_url": null
}
```

Header: `X-Webhook-Secret: <WEBHOOK_SECRET>`

Validated by `WebhookPayloadSchema` in `lib/validations.ts`.

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| Request saved but n8n not triggered | Set `N8N_REVIEW_WEBHOOK_URL`, restart `npm run dev` |
| n8n can't reach ReviewMax | Use public URL or tunnel, not localhost |
| 401 from `/api/webhook/n8n` | Match `X-Webhook-Secret` exactly |
| 400 validation failed | Check slug format (lowercase kebab), rating 0–5, pros/cons arrays |
| 400 slug already exists | Change slug or delete existing post |
| 400 invalid category_id | Use UUID from category table above |

---

## Production checklist

- [ ] `WEBHOOK_SECRET` is a long random string in ReviewMax and n8n
- [ ] n8n workflow is **Active**
- [ ] Anthropic API key stored as n8n credential (not hardcoded)
- [ ] Publish URL points to production domain
- [ ] Test one review end-to-end before going live
