"use client";

import { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Vote = "helpful" | "unhelpful" | null;

function getFingerprint(): string {
  const key = "verdict_fp";
  let fp = localStorage.getItem(key);
  if (!fp) {
    fp = crypto.randomUUID();
    localStorage.setItem(key, fp);
  }
  return fp;
}

function getStoredVote(slug: string): Vote {
  try {
    const raw = localStorage.getItem(`verdict_vote_${slug}`);
    if (raw === "helpful" || raw === "unhelpful") return raw;
  } catch {
    // ignore
  }
  return null;
}

function storeVote(slug: string, vote: Vote) {
  try {
    if (vote) localStorage.setItem(`verdict_vote_${slug}`, vote);
  } catch {
    // ignore
  }
}

export function HelpfulFeedback({ postSlug }: { postSlug: string }) {
  const [counts, setCounts] = useState<{ helpful: number; unhelpful: number } | null>(null);
  const [vote, setVote] = useState<Vote>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setVote(getStoredVote(postSlug));
    fetch(`/api/feedback?slug=${encodeURIComponent(postSlug)}`)
      .then((r) => r.json())
      .then(setCounts)
      .catch(() => {});
  }, [postSlug]);

  async function handleVote(v: "helpful" | "unhelpful") {
    if (loading) return;
    const next = vote === v ? null : v;
    setVote(next);
    storeVote(postSlug, next);
    setLoading(true);
    try {
      const fp = getFingerprint();
      const res = await fetch("/api/feedback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug: postSlug, helpful: next === "helpful", fingerprint: fp }),
      });
      if (res.ok) setCounts(await res.json());
    } catch {
      // optimistic update stays
    } finally {
      setLoading(false);
    }
  }

  const total = (counts?.helpful ?? 0) + (counts?.unhelpful ?? 0);

  return (
    <div className="flex flex-col items-center gap-3 rounded-xl border bg-muted/30 px-6 py-5 text-center">
      <p className="text-sm font-medium text-muted-foreground">
        Was this review helpful?
      </p>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleVote("helpful")}
          disabled={loading}
          className={cn(
            "gap-1.5 transition-colors",
            vote === "helpful" && "border-green-500 bg-green-50 text-green-700 dark:bg-green-950/40 dark:text-green-400",
          )}
          aria-pressed={vote === "helpful"}
        >
          <ThumbsUp className="h-4 w-4" />
          Yes
          {counts != null && counts.helpful > 0 && (
            <span className="ml-0.5 text-xs tabular-nums opacity-70">
              ({counts.helpful})
            </span>
          )}
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => handleVote("unhelpful")}
          disabled={loading}
          className={cn(
            "gap-1.5 transition-colors",
            vote === "unhelpful" && "border-red-500 bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-400",
          )}
          aria-pressed={vote === "unhelpful"}
        >
          <ThumbsDown className="h-4 w-4" />
          No
          {counts != null && counts.unhelpful > 0 && (
            <span className="ml-0.5 text-xs tabular-nums opacity-70">
              ({counts.unhelpful})
            </span>
          )}
        </Button>
      </div>
      {total > 0 && (
        <p className="text-xs text-muted-foreground">
          {counts!.helpful} of {total} reader{total === 1 ? "" : "s"} found this helpful
        </p>
      )}
    </div>
  );
}
