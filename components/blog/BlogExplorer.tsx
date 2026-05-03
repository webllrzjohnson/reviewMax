"use client";

import { Suspense } from "react";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { SearchBar } from "@/components/blog/SearchBar";
import type { Category } from "@/types";

function ToolbarInner({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-col gap-6">
      <div className="space-y-2">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Category
        </p>
        <CategoryFilter categories={categories} />
      </div>
      <div className="w-full max-w-md">
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
          Search by title
        </p>
        <SearchBar />
      </div>
    </div>
  );
}

/** Client toolbar — Suspense required for `useSearchParams` children in App Router. */
export function BlogExplorer({ categories }: { categories: Category[] }) {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <div className="h-10 w-full animate-pulse rounded-lg bg-muted" />
          <div className="h-10 max-w-md animate-pulse rounded-lg bg-muted" />
        </div>
      }
    >
      <ToolbarInner categories={categories} />
    </Suspense>
  );
}
