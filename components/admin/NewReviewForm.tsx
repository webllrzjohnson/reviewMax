"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { submitReviewRequest } from "@/actions/review-request";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const initial = { ok: false, message: "" as string | undefined };

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" disabled={pending} className="w-full sm:w-auto">
      {pending ? "Submitting…" : "Submit & trigger n8n"}
    </Button>
  );
}

export function NewReviewForm({ categories }: { categories: Category[] }) {
  const [state, formAction] = useActionState(submitReviewRequest, initial);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Review request</CardTitle>
        <CardDescription>
          Provide the product and Amazon URL. This saves a row in{" "}
          <code>review_requests</code> and POSTs to your n8n webhook (if{" "}
          <code>N8N_REVIEW_WEBHOOK_URL</code> is configured).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form action={formAction} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="product_name">Product name</Label>
            <Input
              id="product_name"
              name="product_name"
              required
              placeholder="e.g. AeroPress XL"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <select
              id="category"
              name="category"
              required
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              defaultValue={categories[0]?.slug}
            >
              {categories.map((c) => (
                <option key={c.id} value={c.slug}>
                  {c.name}
                </option>
              ))}
            </select>
            <p className="text-xs text-muted-foreground">
              Uses the category slug (matches Supabase{" "}
              <code>categories.slug</code>).
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="amazon_url">Amazon product URL</Label>
            <Input
              id="amazon_url"
              name="amazon_url"
              type="url"
              required
              placeholder="https://www.amazon.com/dp/..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Audience, comparisons, tone…"
              rows={4}
            />
          </div>
          <SubmitButton />
          {state.message ? (
            <p
              className={cn(
                "text-sm",
                state.ok ? "text-emerald-600" : "text-destructive",
              )}
            >
              {state.message}
            </p>
          ) : null}
        </form>
      </CardContent>
    </Card>
  );
}
