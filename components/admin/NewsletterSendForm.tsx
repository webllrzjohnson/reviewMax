"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { sendNewsletterAction } from "@/actions/newsletter-send";

export function NewsletterSendForm({
  subscriberCount,
  resendConfigured,
}: {
  subscriberCount: number;
  resendConfigured: boolean;
}) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setResult(null);
    const fd = new FormData(e.currentTarget);
    const res = await sendNewsletterAction({
      subject: fd.get("subject"),
      html: fd.get("html"),
    });
    setPending(false);
    setResult({ ok: res.ok, message: res.message ?? "" });
    if (res.ok) {
      toast.success(res.message ?? "Sent.");
      (e.target as HTMLFormElement).reset();
    } else {
      toast.error(res.message ?? "Failed.");
    }
  }

  if (!resendConfigured) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-5 text-sm dark:border-amber-800/40 dark:bg-amber-950/30">
        <p className="font-semibold text-amber-700 dark:text-amber-400">
          Resend not configured
        </p>
        <p className="mt-1 text-amber-600 dark:text-amber-500">
          Add <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">RESEND_API_KEY</code> and{" "}
          <code className="rounded bg-amber-100 px-1 dark:bg-amber-900/50">RESEND_FROM_EMAIL</code> to your
          environment variables to enable sending.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="subject">Subject</Label>
        <Input
          id="subject"
          name="subject"
          required
          placeholder="New reviews this week: headphones, blenders, and more"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="html">
          Body{" "}
          <span className="text-xs font-normal text-muted-foreground">(HTML)</span>
        </Label>
        <Textarea
          id="html"
          name="html"
          required
          rows={12}
          className="font-mono text-xs"
          placeholder={`<p>Hi there,</p>\n<p>Here's what's new on Verdict this week…</p>`}
        />
        <p className="text-xs text-muted-foreground">
          Use standard HTML. A plain paragraph is fine. Will be sent to{" "}
          <strong>{subscriberCount}</strong> subscriber{subscriberCount === 1 ? "" : "s"}.
        </p>
      </div>
      {result && (
        <p
          className={`rounded-md px-3 py-2 text-sm ${
            result.ok
              ? "bg-green-50 text-green-700 dark:bg-green-950/30 dark:text-green-400"
              : "bg-destructive/10 text-destructive"
          }`}
        >
          {result.message}
        </p>
      )}
      <Button type="submit" disabled={pending || subscriberCount === 0}>
        {pending ? "Sending…" : `Send to ${subscriberCount} subscriber${subscriberCount === 1 ? "" : "s"}`}
      </Button>
    </form>
  );
}
