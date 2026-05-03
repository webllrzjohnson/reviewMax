"use client";

import { Suspense } from "react";
import { CategoryFilter } from "@/components/blog/CategoryFilter";
import { SearchBar } from "@/components/blog/SearchBar";
import type { Category } from "@/types";

function ToolbarInner({ categories }: { categories: Category[] }) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="w-full max-w-md flex-1">
        <SearchBar />
      </div>
      <CategoryFilter categories={categories} />
    </div>
  );
}

/** Client toolbar — Suspense required for `useSearchParams` children in App Router. */
export function BlogExplorer({ categories }: { categories: Category[] }) {
  return (
    <Suspense
      fallback={<div className="h-20 animate-pulse rounded-lg bg-muted" />}
    >
      <ToolbarInner categories={categories} />
    </Suspense>
  );
}
