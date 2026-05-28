# n8n workflow setup (start here)

Import the ready-made workflow into your VPS n8n, then connect it to ReviewMax.

## What you get

```
ReviewMax admin form
    → n8n Webhook
    → Claude writes review
    → ReviewMax /api/webhook/n8n
    → live blog post
```

Workflow file: **`reviewmax-generate-review.workflow.json`**

---

## Step 1 — Import the workflow

1. Open your n8n instance in the browser.
2. **Workflows** → **Add workflow** → menu **⋯** → **Import from File**.
3. Choose `n8n/reviewmax-generate-review.workflow.json` from this repo.
4. You should see 5 nodes + a yellow setup note.

---

## Step 2 — Configure the workflow

### A. Claude API node

1. Open the **Claude API** node.
2. **Credential for Header Auth** → **Create new** → **Header Auth**:
   - **Name:** `x-api-key`
   - **Value:** your [Anthropic API key](https://console.anthropic.com/)
3. Save the credential.

### B. Publish to ReviewMax node

1. Open **Publish to ReviewMax**.
2. **URL:** your public ReviewMax URL + `/api/webhook/n8n`  
   - Production: `https://your-domain.com/api/webhook/n8n`  
   - Local dev via tunnel: `https://your-tunnel.ngrok.io/api/webhook/n8n`  
   - **Do not use** `http://localhost:3000` — n8n on your VPS cannot reach your PC.
3. Header **X-Webhook-Secret:** must match `WEBHOOK_SECRET` in ReviewMax `.env.local`  
   (default in repo: `reviewmax-local-webhook-secret-change-me`)

### C. Activate

1. Toggle **Active** (top right).
2. Open the **Webhook** node → copy the **Production URL**  
   Example: `https://n8n.yourdomain.com/webhook/review-request`

---

## Step 3 — Configure ReviewMax

Edit `.env.local`:

```env
WEBHOOK_SECRET=reviewmax-local-webhook-secret-change-me
N8N_REVIEW_WEBHOOK_URL=https://n8n.yOUR_DOMAIN.com/webhook/review-request
```

Restart the app:

```powershell
npm run dev
```

---

## Step 4 — Test

### Option A — Test publish only (no Claude, no n8n)

Confirms ReviewMax accepts posts:

```powershell
npm run test:webhook
```

Then open the URL printed in the terminal.

### Option B — Test n8n webhook only

In n8n, open the **Webhook** node → **Listen for test event**, or send:

```powershell
curl -X POST "https://n8n.YOUR_DOMAIN.com/webhook/review-request" `
  -H "Content-Type: application/json" `
  -H "X-Webhook-Secret: reviewmax-local-webhook-secret-change-me" `
  -d '{"product_name":"Test Blender","category":"kitchen-gadgets","category_id":"11111111-1111-1111-1111-111111111101","amazon_url":"https://www.amazon.com/dp/B0TEST","notes":"n8n test"}'
```

Watch the execution in n8n **Executions**.

### Option C — Full end-to-end

1. Sign in at `/login`
2. `/dashboard/new-review` → submit a real product
3. Check n8n execution succeeded
4. Open `/blog/<slug>`

---

## Category IDs

| Slug | UUID |
|------|------|
| `kitchen-gadgets` | `11111111-1111-1111-1111-111111111101` |
| `home-tech` | `11111111-1111-1111-1111-111111111102` |
| `fitness-gear` | `11111111-1111-1111-1111-111111111103` |

See also `category-ids.json`.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Workflow import fails | Update n8n to a recent version, or build nodes manually from `docs/N8N.md` |
| Claude API 401 | Check Anthropic API key credential on **Claude API** node |
| Publish 401 | `X-Webhook-Secret` must match ReviewMax exactly |
| Publish connection error | Use a public URL or tunnel, not localhost |
| Admin form says n8n failed | Wrong `N8N_REVIEW_WEBHOOK_URL` or workflow not Active |

---

## Regenerate workflow JSON

After editing Code node files:

```powershell
npx tsx scripts/build-n8n-workflow.ts
```

More detail: **docs/N8N.md**
