"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

export function CategoryFilter({ categories }: { categories: Category[] }) {
  const searchParams = useSearchParams();
  const active = searchParams.get("category");
  const q = searchParams.get("q");

  function hrefFor(slug: string | null) {
    const p = new URLSearchParams();
    if (slug) p.set("category", slug);
    if (q) p.set("q", q);
    const qs = p.toString();
    return qs ? `/blog?${qs}` : "/blog";
  }

  return (
    <div className="flex flex-wrap gap-2">
      <Link
        href={hrefFor(null)}
        className={cn(
          "rounded-full border px-3 py-1 text-sm transition-colors",
          !active
            ? "border-primary bg-primary text-primary-foreground"
            : "border-transparent bg-muted hover:bg-muted/80",
        )}
      >
        All
      </Link>
      {categories.map((c) => (
        <Link
          key={c.id}
          href={hrefFor(c.slug)}
          className={cn(
            "rounded-full border px-3 py-1 text-sm transition-colors",
            active === c.slug
              ? "border-primary bg-primary text-primary-foreground"
              : "border-transparent bg-muted hover:bg-muted/80",
          )}
        >
          {c.name}
        </Link>
      ))}
    </div>
  );
}
