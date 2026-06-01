"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { GitCompare } from "lucide-react";
import type { CategoryWithPostCount, PostWithCategory } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const selectClassName = cn(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
  "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

export function ComparePicker({
  categories,
  posts,
}: {
  categories: CategoryWithPostCount[];
  posts: PostWithCategory[];
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState("");
  const [leftSlug, setLeftSlug] = useState("");
  const [rightSlug, setRightSlug] = useState("");

  const categoryPosts = useMemo(
    () =>
      categoryId
        ? posts.filter((p) => p.category_id === categoryId)
        : [],
    [categoryId, posts],
  );

  function onCategoryChange(id: string) {
    setCategoryId(id);
    setLeftSlug("");
    setRightSlug("");
  }

  function canCompare() {
    return (
      leftSlug.length > 0 &&
      rightSlug.length > 0 &&
      leftSlug !== rightSlug
    );
  }

  function handleCompare() {
    if (!canCompare()) return;
    router.push(
      `/compare?left=${encodeURIComponent(leftSlug)}&right=${encodeURIComponent(rightSlug)}`,
    );
  }

  if (categories.length === 0 || posts.length === 0) {
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-2xl border bg-card p-8 text-center">
        <h1 className="font-heading text-2xl font-bold">Compare products</h1>
        <p className="text-muted-foreground">
          Publish at least two reviews in the same category to start comparing.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl space-y-6 rounded-2xl border bg-card p-6 sm:p-8">
      <div className="space-y-2 text-center sm:text-left">
        <h1 className="font-heading text-2xl font-bold tracking-tight">
          Compare products
        </h1>
        <p className="text-sm text-muted-foreground">
          Pick a category, then choose two reviews to compare side by side.
        </p>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="compare-category">Category</Label>
          <select
            id="compare-category"
            value={categoryId}
            onChange={(e) => onCategoryChange(e.target.value)}
            className={selectClassName}
          >
            <option value="">Select a category…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.post_count})
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="compare-left">First product</Label>
          <select
            id="compare-left"
            value={leftSlug}
            onChange={(e) => setLeftSlug(e.target.value)}
            disabled={!categoryId}
            className={selectClassName}
          >
            <option value="">Select a review…</option>
            {categoryPosts.map((p) => (
              <option key={p.id} value={p.slug} disabled={p.slug === rightSlug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="compare-right">Second product</Label>
          <select
            id="compare-right"
            value={rightSlug}
            onChange={(e) => setRightSlug(e.target.value)}
            disabled={!categoryId}
            className={selectClassName}
          >
            <option value="">Select a review…</option>
            {categoryPosts.map((p) => (
              <option key={p.id} value={p.slug} disabled={p.slug === leftSlug}>
                {p.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      <Button
        type="button"
        className="w-full sm:w-auto"
        disabled={!canCompare()}
        onClick={handleCompare}
      >
        <GitCompare className="h-4 w-4" aria-hidden />
        Compare now
      </Button>
    </div>
  );
}
