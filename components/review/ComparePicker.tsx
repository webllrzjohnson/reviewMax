"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { GitCompare } from "lucide-react";
import type { CategoryWithPostCount } from "@/types";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const selectClassName = cn(
  "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm",
  "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
);

type ComparePostOption = {
  id: string;
  slug: string;
  title: string;
};

export function ComparePicker({
  categories,
}: {
  categories: CategoryWithPostCount[];
}) {
  const router = useRouter();
  const [categoryId, setCategoryId] = useState("");
  const [leftSlug, setLeftSlug] = useState("");
  const [rightSlug, setRightSlug] = useState("");
  const [categoryPosts, setCategoryPosts] = useState<ComparePostOption[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!categoryId) {
      setCategoryPosts([]);
      setLoadError(null);
      return;
    }

    const controller = new AbortController();
    setLoadingPosts(true);
    setLoadError(null);

    fetch(`/api/compare/posts?categoryId=${encodeURIComponent(categoryId)}`, {
      signal: controller.signal,
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error("Failed to load reviews");
        }
        return res.json() as Promise<ComparePostOption[]>;
      })
      .then((posts) => {
        setCategoryPosts(posts);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") {
          return;
        }
        setCategoryPosts([]);
        setLoadError("Could not load reviews for this category. Try again.");
      })
      .finally(() => {
        setLoadingPosts(false);
      });

    return () => controller.abort();
  }, [categoryId]);

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

  if (categories.length === 0) {
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

        {loadError ? (
          <p className="text-sm text-destructive" role="alert">
            {loadError}
          </p>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="compare-left">First product</Label>
          <select
            id="compare-left"
            value={leftSlug}
            onChange={(e) => setLeftSlug(e.target.value)}
            disabled={!categoryId || loadingPosts}
            className={selectClassName}
          >
            <option value="">
              {loadingPosts ? "Loading reviews…" : "Select a review…"}
            </option>
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
            disabled={!categoryId || loadingPosts}
            className={selectClassName}
          >
            <option value="">
              {loadingPosts ? "Loading reviews…" : "Select a review…"}
            </option>
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
        disabled={!canCompare() || loadingPosts}
        onClick={handleCompare}
      >
        <GitCompare className="h-4 w-4" aria-hidden />
        Compare now
      </Button>
    </div>
  );
}
