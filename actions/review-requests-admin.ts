"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reviewRequests } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { expandAmazonProductUrl } from "@/lib/amazon-image";
import { triggerReviewRequestN8n } from "@/lib/review-request-n8n";

export type RequestActionState = { ok: boolean; message?: string };

export async function deleteReviewRequestAction(
  id: string,
): Promise<RequestActionState> {
  try {
    await requireAdmin();
    await db.delete(reviewRequests).where(eq(reviewRequests.id, id));
    revalidatePath("/dashboard/review-requests");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not delete request." };
  }
}

export async function processReviewRequestAction(
  id: string,
): Promise<RequestActionState> {
  try {
    const session = await requireAdmin();

    const [row] = await db
      .select()
      .from(reviewRequests)
      .where(eq(reviewRequests.id, id))
      .limit(1);

    if (!row) {
      return { ok: false, message: "Request not found." };
    }

    if (row.processedAt) {
      return { ok: false, message: "This request was already processed." };
    }

    const amazonUrl = await expandAmazonProductUrl(row.amazonUrl);
    const notes =
      row.notes != null && row.notes.trim() !== "" ? row.notes.trim() : null;

    const n8n = await triggerReviewRequestN8n({
      product_name: row.productName,
      category_slug: row.categorySlug,
      amazon_url: amazonUrl,
      notes,
    });

    if (!n8n.ok) {
      await db
        .update(reviewRequests)
        .set({ processError: n8n.message ?? "Webhook failed." })
        .where(eq(reviewRequests.id, id));

      revalidatePath("/dashboard/review-requests");
      revalidatePath("/dashboard");
      return { ok: false, message: n8n.message };
    }

    await db
      .update(reviewRequests)
      .set({
        amazonUrl,
        processedAt: new Date().toISOString(),
        processedBy: session.user.id,
        processError: null,
      })
      .where(eq(reviewRequests.id, id));

    revalidatePath("/dashboard/review-requests");
    revalidatePath("/dashboard");
    return {
      ok: true,
      message: "Sent to n8n for review generation.",
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong." };
  }
}
