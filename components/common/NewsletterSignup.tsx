"use client";

import { useActionState, useId } from "react";
import { useFormStatus } from "react-dom";
import { subscribeToNewsletter } from "@/actions/newsletter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const initial = { ok: false, message: "" as string | undefined };

function SubmitButton({
  label,
  className,
}: {
  label: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className={className}>
      {pending ? "…" : label}
    </Button>
  );
}

export function NewsletterSignup({
  compact,
  variant = "default",
}: {
  compact?: boolean;
  variant?: "default" | "section";
}) {
  const [state, formAction] = useActionState(subscribeToNewsletter, initial);
  const uid = useId();
  const emailId = `${uid}-newsletter-email`;

  const form = (
    <form action={formAction} className="space-y-3">
      <div className="space-y-2">
        <Label
          htmlFor={emailId}
          className={compact || variant === "section" ? "sr-only" : undefined}
        >
          Email
        </Label>
        <div
          className={cn(
            "flex flex-col gap-2",
            variant === "section" ? "sm:flex-row sm:items-stretch" : "",
            compact ? "" : "",
          )}
        >
          <Input
            id={emailId}
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            className={cn(
              variant === "section" ? "sm:min-w-0 sm:flex-1" : "",
              compact ? "h-9" : "",
            )}
          />
          <SubmitButton
            label="Subscribe"
            className={cn(
              variant === "section" ? "sm:h-auto sm:px-8" : "",
              compact ? "w-full" : "",
            )}
          />
        </div>
      </div>
      {state.message ? (
        <p
          className={cn(
            compact ? "text-xs" : "text-sm",
            state.ok ? "text-emerald-600" : "text-destructive",
          )}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );

  if (variant === "section") {
    return (
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 via-background to-background">
        <CardHeader className="space-y-2 pb-4">
          <CardTitle className="text-2xl">Stay in the loop</CardTitle>
          <CardDescription className="text-base">
            Get new reviews and short buying tips. No spam, unsubscribe anytime.
          </CardDescription>
        </CardHeader>
        <CardContent>{form}</CardContent>
      </Card>
    );
  }

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
        <p
          className={cn(
            "text-muted-foreground",
            compact ? "text-xs" : "text-sm",
          )}
        >
          Occasional picks and new reviews.{compact ? " No spam." : ""}
        </p>
      </div>
      {compact ? <div className="space-y-2">{form}</div> : form}
    </div>
  );
}
