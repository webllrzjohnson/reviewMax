"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { ReviewRequestSchema } from "@/lib/validations";

export type ReviewRequestState = {
  ok: boolean;
  message?: string;
};

export async function submitReviewRequest(
  _prev: ReviewRequestState,
  formData: FormData,
): Promise<ReviewRequestState> {
  const parsed = ReviewRequestSchema.safeParse({
    product_name: formData.get("product_name"),
    category: formData.get("category"),
    amazon_url: formData.get("amazon_url"),
    notes: formData.get("notes") || undefined,
  });

  if (!parsed.success) {
    const first =
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
      "Check your inputs";
    return { ok: false, message: first };
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { ok: false, message: "You must be signed in." };
    }

    const { error } = await supabase.from("review_requests").insert({
      product_name: parsed.data.product_name,
      category_slug: parsed.data.category,
      amazon_url: parsed.data.amazon_url,
      notes: parsed.data.notes ?? null,
      created_by: user.id,
    });

    if (error) {
      console.error("review_requests insert", error);
      return { ok: false, message: "Could not save request." };
    }

    const webhookUrl = process.env.N8N_REVIEW_WEBHOOK_URL;
    const secret = process.env.WEBHOOK_SECRET;
    if (webhookUrl) {
      try {
        await fetch(webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(secret ? { "X-Webhook-Secret": secret } : {}),
          },
          body: JSON.stringify({
            product_name: parsed.data.product_name,
            category_slug: parsed.data.category,
            amazon_url: parsed.data.amazon_url,
            notes: parsed.data.notes ?? null,
            requested_by: user.email,
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
        "Request queued. n8n will generate and publish the review automatically.",
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong." };
  }
}
