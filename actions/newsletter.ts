"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { NewsletterSchema } from "@/lib/validations";

export type NewsletterState = {
  ok: boolean;
  message?: string;
};

/**
 * Validates email with NewsletterSchema and upserts into `newsletter_subscribers`.
 */
export async function subscribeToNewsletter(
  _prev: NewsletterState,
  formData: FormData,
): Promise<NewsletterState> {
  const raw = formData.get("email");
  const parsed = NewsletterSchema.safeParse({ email: raw });
  if (!parsed.success) {
    const err = parsed.error.flatten().fieldErrors.email?.[0];
    return { ok: false, message: err ?? "Invalid email" };
  }

  const email = parsed.data.email.trim().toLowerCase();

  try {
    await db
      .insert(newsletterSubscribers)
      .values({ email })
      .onConflictDoNothing({ target: newsletterSubscribers.email });

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { ok: true, message: "Thanks — you are subscribed." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong." };
  }
}
