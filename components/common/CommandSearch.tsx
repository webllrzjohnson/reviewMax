"use client";

import { useEffect, useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from "@/components/ui/command";

type SearchResult = {
  slug: string;
  title: string;
  excerpt: string;
  rating: number | null;
  category: string | null;
};

export function CommandSearch() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, startTransition] = useTransition();
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const search = useCallback((q: string) => {
    setQuery(q);
    if (q.trim().length < 2) {
      setResults([]);
      return;
    }
    startTransition(async () => {
      try {
        const res = await fetch(
          `/api/search?q=${encodeURIComponent(q.trim())}`,
          { signal: AbortSignal.timeout(5000) },
        );
        if (res.ok) setResults(await res.json());
      } catch {
        // silently ignore network errors
      }
    });
  }, []);

  function navigate(slug: string) {
    setOpen(false);
    setQuery("");
    setResults([]);
    router.push(`/blog/${slug}`);
  }

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setOpen(true)}
        className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
        aria-label="Search reviews (Ctrl+K)"
      >
        <Search className="h-5 w-5" />
      </Button>

      <CommandDialog
        open={open}
        onOpenChange={(v: boolean) => {
          setOpen(v);
          if (!v) {
            setQuery("");
            setResults([]);
          }
        }}
        shouldFilter={false}
        title="Search reviews"
        description="Type to search Verdict reviews"
      >
        <CommandInput
          placeholder="Search reviews…"
          value={query}
          onValueChange={search}
        />
        <CommandList>
          {loading ? (
            <div className="flex items-center justify-center py-6 text-sm text-muted-foreground gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              Searching…
            </div>
          ) : query.trim().length >= 2 && results.length === 0 ? (
            <CommandEmpty>No reviews found for &quot;{query}&quot;</CommandEmpty>
          ) : results.length > 0 ? (
            <CommandGroup heading="Reviews">
              {results.map((r) => (
                <CommandItem
                  key={r.slug}
                  value={r.slug}
                  onSelect={() => navigate(r.slug)}
                  className="flex flex-col items-start gap-0.5 py-2"
                >
                  <div className="flex w-full items-center justify-between gap-2">
                    <span className="font-medium line-clamp-1">{r.title}</span>
                    {r.rating != null && (
                      <span className="flex shrink-0 items-center gap-0.5 text-xs text-muted-foreground">
                        <Star className="h-3 w-3 fill-[#C98B1A] text-[#C98B1A]" />
                        {Number(r.rating).toFixed(1)}
                      </span>
                    )}
                  </div>
                  {r.category && (
                    <span className="text-xs text-muted-foreground">
                      {r.category}
                    </span>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ) : (
            <div className="py-6 text-center text-sm text-muted-foreground">
              Type at least 2 characters to search…
            </div>
          )}
        </CommandList>
        <div className="border-t px-3 py-2 text-xs text-muted-foreground flex items-center gap-3">
          <span><kbd className="rounded border px-1 font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="rounded border px-1 font-mono">↵</kbd> open</span>
          <span><kbd className="rounded border px-1 font-mono">Esc</kbd> close</span>
          <span className="ml-auto">
            <kbd className="rounded border px-1 font-mono">⌘K</kbd> / <kbd className="rounded border px-1 font-mono">Ctrl+K</kbd>
          </span>
        </div>
      </CommandDialog>
    </>
  );
}
