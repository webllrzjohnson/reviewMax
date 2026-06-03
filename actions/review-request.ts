"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reviewRequests } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { expandAmazonProductUrl } from "@/lib/amazon-image";
import { triggerReviewRequestN8n } from "@/lib/review-request-n8n";
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
    const amazonUrl = await expandAmazonProductUrl(parsed.data.amazon_url);
    const notes =
      parsed.data.notes != null && parsed.data.notes.trim() !== ""
        ? parsed.data.notes.trim()
        : null;

    const [inserted] = await db
      .insert(reviewRequests)
      .values({
        productName: parsed.data.product_name,
        categorySlug: parsed.data.category,
        amazonUrl,
        notes,
        createdBy: session.user.id,
      })
      .returning({ id: reviewRequests.id });

    if (!inserted) {
      return { ok: false, message: "Something went wrong." };
    }

    const n8n = await triggerReviewRequestN8n({
      product_name: parsed.data.product_name,
      category_slug: parsed.data.category,
      amazon_url: amazonUrl,
      notes,
    });

    if (n8n.skipped) {
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/review-requests");
      return {
        ok: true,
        message: n8n.message ?? "Request saved.",
      };
    }

    if (n8n.ok) {
      await db
        .update(reviewRequests)
        .set({
          processedAt: new Date().toISOString(),
          processedBy: session.user.id,
          processError: null,
        })
        .where(eq(reviewRequests.id, inserted.id));

      revalidatePath("/dashboard");
      revalidatePath("/dashboard/review-requests");
      return {
        ok: true,
        message: "Request saved and sent to n8n for generation.",
      };
    }

    await db
      .update(reviewRequests)
      .set({ processError: n8n.message ?? "Webhook failed." })
      .where(eq(reviewRequests.id, inserted.id));

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/review-requests");
    return {
      ok: true,
      message:
        "Request saved, but n8n did not accept the webhook. Use Process on the queue to retry.",
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong." };
  }
}
