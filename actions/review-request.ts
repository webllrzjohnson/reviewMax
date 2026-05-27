"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reviewRequests } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
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

    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Webhook-Secret": process.env.WEBHOOK_SECRET ?? "",
          },
          body: JSON.stringify({
            product_name: parsed.data.product_name,
            category: parsed.data.category,
            amazon_url: parsed.data.amazon_url,
            notes:
              parsed.data.notes != null && parsed.data.notes.trim() !== ""
                ? parsed.data.notes.trim()
                : null,
          }),
        });
      } catch (e) {
        console.error("n8n webhook", e);
      }
    }

    revalidatePath("/dashboard");
    return {
      ok: true,
      message:
        "Request saved. n8n will pick up the webhook and can publish via your API route when ready.",
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong." };
  }
}
