"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useDebouncedValue } from "@/hooks/useSearch";

export function SearchBar() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [q, setQ] = useState(() => searchParams.get("q") ?? "");
  const debounced = useDebouncedValue(q, 350);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());
    const current = params.get("q") ?? "";
    if (debounced.trim() === current.trim()) return;
    const next = debounced.trim();
    if (next) params.set("q", next);
    else params.delete("q");
    params.delete("page");
    const qs = params.toString();
    startTransition(() => {
      router.push(qs ? `/blog?${qs}` : "/blog");
    });
  }, [debounced, router, searchParams]);

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search by title…"
        className="pl-9"
        aria-busy={isPending}
      />
    </div>
  );
}
