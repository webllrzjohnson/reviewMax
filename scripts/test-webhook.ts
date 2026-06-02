/**
 * Sends a sample payload to POST /api/webhook/n8n (tests publish path without Claude/n8n).
 *
 * Usage: npm run test:webhook
 */
async function main() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const secret = process.env.WEBHOOK_SECRET;

  if (!secret) {
    throw new Error("WEBHOOK_SECRET is required in .env.local");
  }

  const slug = `test-webhook-${Date.now()}`;

  const payload = {
    title: "Test Webhook Post from ReviewMax",
    slug,
    excerpt: "This is a test post created by scripts/test-webhook.ts.",
    body: "<p>If you see this on the blog, the publish webhook works.</p>",
    category_id: "11111111-1111-1111-1111-111111111101",
    rating: 4.5,
    pros: ["Webhook works", "Easy to test"],
    cons: ["Delete this test post after verifying"],
    verdict: "Use this script to verify n8n can publish to ReviewMax.",
    amazon_url: "https://www.amazon.com/dp/B0TESTWEBHOOK",
    image_url: null,
  };

  const url = `${baseUrl.replace(/\/$/, "")}/api/webhook/n8n`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Webhook-Secret": secret,
    },
    body: JSON.stringify(payload),
  });

  const body = await response.text();
  console.log("Status:", response.status);
  console.log("Response:", body);
  console.log(
    "Draft should appear in admin:",
    `${baseUrl.replace(/\/$/, "")}/dashboard/posts`,
  );

  if (!response.ok) {
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
