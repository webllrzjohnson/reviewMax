"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { reviewRequests } from "@/lib/db/schema";

const PublicSuggestSchema = z.object({
  product_name: z
    .string()
    .min(2, "Product name is required")
    .max(200, "Product name is too long"),
  category_slug: z.string().min(1, "Category is required").max(100),
  amazon_url: z.string().url("Enter a valid Amazon product URL"),
  notes: z.string().max(1000).optional(),
});

export type PublicSuggestState = { ok: boolean; message?: string };

export async function submitPublicSuggestAction(
  input: unknown,
): Promise<PublicSuggestState> {
  const parsed = PublicSuggestSchema.safeParse(input);
  if (!parsed.success) {
    const first =
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
      "Check your inputs.";
    return { ok: false, message: first };
  }

  try {
    await db.insert(reviewRequests).values({
      productName: parsed.data.product_name,
      categorySlug: parsed.data.category_slug,
      amazonUrl: parsed.data.amazon_url,
      notes: parsed.data.notes?.trim() || null,
      createdBy: null,
    });

    return {
      ok: true,
      message:
        "Thank you! Your suggestion has been added to our review queue.",
    };
  } catch {
    return { ok: false, message: "Something went wrong. Please try again." };
  }
}
