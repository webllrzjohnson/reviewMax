"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { NewsletterSchema } from "@/lib/validations";

export type NewsletterState = {
  ok: boolean;
  message?: string;
};

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

  try {
    const supabase = await createClient();
    const { error } = await supabase
      .from("newsletter_subscribers")
      .insert({ email: parsed.data.email });

    if (error) {
      if (error.code === "23505") {
        return { ok: true, message: "You are already subscribed. Thank you!" };
      }
      console.error("newsletter insert", error);
      return { ok: false, message: "Could not subscribe. Try again later." };
    }

    revalidatePath("/");
    return { ok: true, message: "Thanks — you are subscribed." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong." };
  }
}
