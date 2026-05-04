"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { NewsletterSchema } from "@/lib/validations";

export type NewsletterState = {
  ok: boolean;
  message?: string;
};

/**
 * Validates email with NewsletterSchema and upserts into `newsletter_subscribers`
 * (idempotent for existing addresses via `ignoreDuplicates`).
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
    const supabase = await createClient();
    const { error } = await supabase.from("newsletter_subscribers").upsert(
      { email },
      { onConflict: "email", ignoreDuplicates: true },
    );

    if (error) {
      console.error("newsletter upsert", error);
      return { ok: false, message: "Could not subscribe. Try again later." };
    }

    revalidatePath("/");
    revalidatePath("/dashboard");
    return { ok: true, message: "Thanks — you are subscribed." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong." };
  }
}
