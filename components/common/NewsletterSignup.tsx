"use client";

import { useFormState, useFormStatus } from "react-dom";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const initial = { ok: false, message: "" as string | undefined };

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full">
      {pending ? "…" : label}
    </Button>
  );
}

export function NewsletterSignup({ compact }: { compact?: boolean }) {
  const [state, formAction] = useFormState(subscribeToNewsletter, initial);

  return (
    <div className={cn(compact ? "space-y-2" : "space-y-3")}>
      <div>
        <h2
          className={cn(
            "font-semibold",
            compact ? "text-sm" : "text-base",
          )}
        >
          Newsletter
        </h2>
        <p className="text-xs text-muted-foreground">
          Occasional picks and new reviews. No spam.
        </p>
      </div>
      <form action={formAction} className="space-y-2">
        <div className="space-y-1">
          <Label htmlFor="newsletter-email" className="sr-only">
            Email
          </Label>
          <Input
            id="newsletter-email"
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
          />
        </div>
        <SubmitButton label="Subscribe" />
        {state.message ? (
          <p
            className={cn(
              "text-xs",
              state.ok ? "text-emerald-600" : "text-destructive",
            )}
          >
            {state.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
