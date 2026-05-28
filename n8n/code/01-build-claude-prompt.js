// Paste into an n8n Code node after the Webhook trigger.
// Input: $json.body from POST /webhook/review-request

const input = $json.body ?? $json;

const productName = String(input.product_name ?? "").trim();
const categorySlug = String(input.category ?? "").trim();
const categoryId = input.category_id ?? null;
const amazonUrl = String(input.amazon_url ?? "").trim();
const notes = input.notes ? String(input.notes).trim() : "";

if (!productName || !categorySlug || !amazonUrl) {
  throw new Error("Missing product_name, category, or amazon_url");
}

const slugBase = productName
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "")
  .slice(0, 80);

const system = `You write honest Amazon affiliate product reviews for ReviewMax.
Return ONLY valid JSON (no markdown fences) matching this schema:
{
  "title": "string",
  "slug": "lowercase-kebab-case",
  "excerpt": "1-2 sentences",
  "body": "markdown article, 400-800 words",
  "rating": 0-5 number with one decimal,
  "pros": ["string", ...],
  "cons": ["string", ...],
  "verdict": "2-4 sentence summary",
  "image_url": null or https URL
}
Use slug starting with: ${slugBase}-review
Do not invent fake test results; write plausible editorial tone.`;

const user = `Product: ${productName}
Category slug: ${categorySlug}
Amazon URL: ${amazonUrl}
${notes ? `Editor notes: ${notes}` : ""}`;

return [
  {
    json: {
      product_name: productName,
      category: categorySlug,
      category_id: categoryId,
      amazon_url: amazonUrl,
      notes,
      claude_system: system,
      claude_user: user,
    },
  },
];
