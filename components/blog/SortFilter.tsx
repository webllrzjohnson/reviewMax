"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import type { BlogSort } from "@/lib/data";

const SORT_OPTIONS: { value: BlogSort | ""; label: string }[] = [
  { value: "", label: "Newest" },
  { value: "highest-rated", label: "Highest rated" },
  { value: "recently-updated", label: "Recently updated" },
];

const RATING_OPTIONS: { value: number; label: string }[] = [
  { value: 0, label: "Any rating" },
  { value: 3, label: "3+ stars" },
  { value: 4, label: "4+ stars" },
  { value: 4.5, label: "4.5+ stars" },
];

export function SortFilter() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const activeSort = searchParams.get("sort") ?? "";
  const activeMin = Number(searchParams.get("minRating")) || 0;

  function update(key: string, value: string) {
    const p = new URLSearchParams(searchParams.toString());
    if (value) {
      p.set(key, value);
    } else {
      p.delete(key);
    }
    p.delete("page");
    router.push(`${pathname}?${p.toString()}`);
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap">
          Sort
        </span>
        <div className="flex flex-wrap gap-1.5">
          {SORT_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update("sort", o.value)}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                activeSort === o.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-transparent bg-muted hover:bg-muted/80",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground whitespace-nowrap">
          Rating
        </span>
        <div className="flex flex-wrap gap-1.5">
          {RATING_OPTIONS.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => update("minRating", o.value ? String(o.value) : "")}
              className={cn(
                "rounded-full border px-3 py-1 text-sm transition-colors",
                activeMin === o.value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-transparent bg-muted hover:bg-muted/80",
              )}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
