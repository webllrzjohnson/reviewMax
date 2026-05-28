// Paste into an n8n Code node after the Anthropic HTTP Request node.
// Expects Claude response in $json.content[0].text or $json.text

const prev = $("Build Claude prompt").first().json;
const raw =
  $json.content?.[0]?.text ??
  $json.text ??
  (typeof $json.body === "string" ? $json.body : JSON.stringify($json));

let draft;
try {
  draft = JSON.parse(raw);
} catch {
  const match = String(raw).match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Claude did not return JSON");
  draft = JSON.parse(match[0]);
}

const CATEGORY_IDS = {
  "kitchen-gadgets": "11111111-1111-1111-1111-111111111101",
  "home-tech": "11111111-1111-1111-1111-111111111102",
  "fitness-gear": "11111111-1111-1111-1111-111111111103",
};

const categoryId =
  prev.category_id ?? CATEGORY_IDS[prev.category] ?? null;

if (!categoryId) {
  throw new Error(`Unknown category slug: ${prev.category}`);
}

const slug = String(draft.slug ?? "")
  .toLowerCase()
  .replace(/[^a-z0-9-]/g, "")
  .replace(/^-+|-+$/g, "");

if (!slug) throw new Error("Draft missing slug");

return [
  {
    json: {
      title: String(draft.title ?? prev.product_name).slice(0, 500),
      slug,
      excerpt: String(draft.excerpt ?? "").slice(0, 2000),
      body: String(draft.body ?? ""),
      category_id: categoryId,
      rating: Number(draft.rating ?? 4),
      pros: Array.isArray(draft.pros) ? draft.pros.map(String) : [],
      cons: Array.isArray(draft.cons) ? draft.cons.map(String) : [],
      verdict: String(draft.verdict ?? "").slice(0, 2000),
      amazon_url: prev.amazon_url,
      image_url: draft.image_url ?? null,
    },
  },
];
