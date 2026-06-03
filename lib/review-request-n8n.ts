import { getCategoryBySlug } from "@/lib/data";

export type N8nTriggerResult = {
  ok: boolean;
  skipped: boolean;
  message?: string;
};

export async function triggerReviewRequestN8n(params: {
  product_name: string;
  category_slug: string;
  amazon_url: string;
  notes: string | null;
}): Promise<N8nTriggerResult> {
  const webhookUrl = process.env.N8N_REVIEW_WEBHOOK_URL;
  if (!webhookUrl) {
    return {
      ok: false,
      skipped: true,
      message:
        "Set N8N_REVIEW_WEBHOOK_URL in .env.local to trigger automation.",
    };
  }

  const category = await getCategoryBySlug(params.category_slug);

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Webhook-Secret": process.env.WEBHOOK_SECRET ?? "",
      },
      body: JSON.stringify({
        product_name: params.product_name,
        category: params.category_slug,
        category_id: category?.id ?? null,
        amazon_url: params.amazon_url,
        notes: params.notes,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error("n8n webhook", response.status, text);
      return {
        ok: false,
        skipped: false,
        message: `n8n returned ${response.status}. Check your workflow.`,
      };
    }

    return { ok: true, skipped: false };
  } catch (e) {
    console.error("n8n webhook", e);
    return {
      ok: false,
      skipped: false,
      message: "Could not reach n8n. Check N8N_REVIEW_WEBHOOK_URL.",
    };
  }
}
