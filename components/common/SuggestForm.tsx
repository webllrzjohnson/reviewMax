"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { submitPublicSuggestAction } from "@/actions/public-review-request";
import type { Category } from "@/types";

export function SuggestForm({ categories }: { categories: Category[] }) {
  const [pending, setPending] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; message: string } | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setResult(null);

    const fd = new FormData(e.currentTarget);
    const res = await submitPublicSuggestAction({
      product_name: fd.get("product_name"),
      category_slug: fd.get("category_slug"),
      amazon_url: fd.get("amazon_url"),
      notes: fd.get("notes"),
    });

    setResult({ ok: res.ok, message: res.message ?? "" });
    setPending(false);
    if (res.ok) (e.target as HTMLFormElement).reset();
  }

  if (result?.ok) {
    return (
      <div className="rounded-xl border border-green-200 bg-green-50 px-6 py-8 text-center dark:border-green-800/40 dark:bg-green-950/30">
        <p className="text-lg font-semibold text-green-700 dark:text-green-400">
          Suggestion received!
        </p>
        <p className="mt-2 text-sm text-green-600 dark:text-green-500">
          {result.message}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="mt-4"
          onClick={() => setResult(null)}
        >
          Suggest another
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="product_name">Product name *</Label>
        <Input
          id="product_name"
          name="product_name"
          placeholder="e.g. Sony WH-1000XM5 headphones"
          required
          maxLength={200}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="category_slug">Category *</Label>
        <select
          id="category_slug"
          name="category_slug"
          required
          className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <option value="">Select a category…</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="amazon_url">Amazon product URL *</Label>
        <Input
          id="amazon_url"
          name="amazon_url"
          type="url"
          placeholder="https://www.amazon.com/dp/…"
          required
        />
        <p className="text-xs text-muted-foreground">
          Paste the full Amazon product page URL.
        </p>
      </div>

      <div className="space-y-2">
        <Label htmlFor="notes">Why should we review this? (optional)</Label>
        <Textarea
          id="notes"
          name="notes"
          rows={3}
          placeholder="Anything that would help us understand why this product is worth reviewing…"
          maxLength={1000}
        />
      </div>

      {result && !result.ok && (
        <p className="rounded-md bg-destructive/10 px-3 py-2 text-sm text-destructive">
          {result.message}
        </p>
      )}

      <Button type="submit" disabled={pending} className="w-full sm:w-auto">
        {pending ? "Submitting…" : "Submit suggestion"}
      </Button>
    </form>
  );
}
