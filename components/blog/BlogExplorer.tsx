"use client";

import { Suspense } from "react";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { SearchBar } from "@/components/blog/SearchBar";
import { SortFilter } from "@/components/blog/SortFilter";
import type { Category } from "@/types";

function ToolbarInner({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Category
          </p>
          <CategoryFilter categories={categories} />
        </div>
        <div className="w-full max-w-xs">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
            Search
          </p>
          <SearchBar />
        </div>
      </div>
      <SortFilter />
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
