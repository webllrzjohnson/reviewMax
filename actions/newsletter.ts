"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { NewsletterSchema } from "@/lib/validations";
import { getResendClient, resendFromAddress } from "@/lib/resend";
import { siteUrl } from "@/lib/utils";

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

    // Send welcome email if Resend is configured
    const resend = getResendClient();
    if (resend) {
      const base = siteUrl();
      await resend.emails.send({
        from: resendFromAddress(),
        to: email,
        subject: "Welcome to Verdict",
        html: `<div style="font-family:sans-serif;max-width:560px;margin:0 auto;padding:32px 24px">
  <h1 style="font-size:24px;font-weight:700;color:#18181b;margin:0 0 8px">
    You're subscribed to Verdict
  </h1>
  <p style="color:#52525b;font-size:16px;line-height:1.6;margin:0 0 24px">
    You'll get new reviews and short buying guides — no spam, no filler.
    Unsubscribe at any time.
  </p>
  <a href="${base}/blog" style="display:inline-block;background:#C98B1A;color:#fff;font-weight:600;padding:12px 24px;border-radius:8px;text-decoration:none;font-size:15px">
    Browse latest reviews
  </a>
  <p style="margin:32px 0 0;font-size:13px;color:#a1a1aa">
    Verdict · <a href="${base}" style="color:#a1a1aa">${base}</a>
  </p>
</div>`,
      }).catch(console.warn);
    }

    return { ok: true, message: "Thanks — you are subscribed." };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong." };
  }
}
