"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reviewRequests } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { getCategoryBySlug } from "@/lib/data";
import {
  ReviewRequestSchema,
  type ReviewRequestInput,
} from "@/lib/validations";

export type ReviewRequestState = {
  ok: boolean;
  message?: string;
};

/**
 * Validates with ReviewRequestSchema, inserts into `review_requests`,
 * then POSTs to n8n with JSON body
 * `{ product_name, category, amazon_url, notes }` and header
 * `X-Webhook-Secret: process.env.WEBHOOK_SECRET` (empty string if unset).
 */
export async function submitReviewRequestAction(
  input: ReviewRequestInput,
): Promise<ReviewRequestState> {
  const parsed = ReviewRequestSchema.safeParse(input);
  if (!parsed.success) {
    const first =
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
      "Check your inputs";
    return { ok: false, message: first };
  }

  try {
    const session = await requireAdmin();

    await db.insert(reviewRequests).values({
      productName: parsed.data.product_name,
      categorySlug: parsed.data.category,
      amazonUrl: parsed.data.amazon_url,
      notes:
        parsed.data.notes != null && parsed.data.notes.trim() !== ""
          ? parsed.data.notes.trim()
          : null,
      createdBy: session.user.id,
    });

    const webhookUrl = process.env.N8N_REVIEW_WEBHOOK_URL;
    let n8nOk = true;

    if (webhookUrl) {
      const category = await getCategoryBySlug(parsed.data.category);

      try {
        const response = await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": process.env.WEBHOOK_SECRET ?? "",
          },
          body: JSON.stringify({
            product_name: parsed.data.product_name,
            category: parsed.data.category,
            category_id: category?.id ?? null,
            amazon_url: parsed.data.amazon_url,
            notes:
              parsed.data.notes != null && parsed.data.notes.trim() !== ""
                ? parsed.data.notes.trim()
                : null,
          }),
        });

        if (!response.ok) {
          n8nOk = false;
          console.error("n8n webhook", response.status, await response.text());
        }
      } catch (e) {
        n8nOk = false;
        console.error("n8n webhook", e);
      }
    }

    revalidatePath("/dashboard");
    return {
      ok: true,
      message: webhookUrl
        ? n8nOk
          ? "Request saved and sent to n8n for generation."
          : "Request saved, but n8n did not accept the webhook. Check your n8n URL and workflow."
        : "Request saved. Set N8N_REVIEW_WEBHOOK_URL in .env.local to trigger automation.",
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong." };
  }
}
