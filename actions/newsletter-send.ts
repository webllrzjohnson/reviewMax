"use server";

import { z } from "zod";
import { db } from "@/lib/db";
import { newsletterSubscribers } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { getResendClient, resendFromAddress } from "@/lib/resend";

const SendSchema = z.object({
  subject: z.string().min(1, "Subject is required").max(200),
  html: z.string().min(1, "Body is required"),
});

export type SendNewsletterState = {
  ok: boolean;
  message?: string;
  sent?: number;
  failed?: number;
};

export async function sendNewsletterAction(
  input: unknown,
): Promise<SendNewsletterState> {
  const parsed = SendSchema.safeParse(input);
  if (!parsed.success) {
    const first = Object.values(parsed.error.flatten().fieldErrors).flat()[0];
    return { ok: false, message: first ?? "Check your inputs." };
  }

  try {
    await requireAdmin();

    const resend = getResendClient();
    if (!resend) {
      return {
        ok: false,
        message: "RESEND_API_KEY is not configured. Add it to your environment variables.",
      };
    }

    const rows = await db.select({ email: newsletterSubscribers.email }).from(newsletterSubscribers);
    if (rows.length === 0) {
      return { ok: false, message: "No subscribers yet." };
    }

    const from = resendFromAddress();
    const { subject, html } = parsed.data;

    // Send in batches of 50 (Resend batch limit)
    const BATCH = 50;
    let sent = 0;
    let failed = 0;

    for (let i = 0; i < rows.length; i += BATCH) {
      const batch = rows.slice(i, i + BATCH);
      const results = await resend.batch.send(
        batch.map((r) => ({ from, to: r.email, subject, html })),
      );
      sent += results.data?.data.length ?? 0;
      failed += batch.length - (results.data?.data.length ?? 0);
    }

    return {
      ok: true,
      message: `Sent to ${sent} subscriber${sent === 1 ? "" : "s"}${failed > 0 ? ` (${failed} failed)` : ""}.`,
      sent,
      failed,
    };
  } catch (e) {
    console.error(e);
    return { ok: false, message: "Something went wrong." };
  }
}
