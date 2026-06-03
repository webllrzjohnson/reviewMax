"use client";

import { useEffect } from "react";

export function RecentlyViewedRecorder({
  slug,
  title,
  category,
  imageUrl,
}: {
  slug: string;
  title: string;
  category: string | null;
  imageUrl: string | null;
}) {
  useEffect(() => {
    try {
      const key = "verdict_recently_viewed";
      const raw = localStorage.getItem(key);
      const existing: Array<{ slug: string; title: string; category: string | null; imageUrl: string | null }> =
        raw ? JSON.parse(raw) : [];
      const filtered = existing.filter((p) => p.slug !== slug);
      const updated = [{ slug, title, category, imageUrl }, ...filtered].slice(0, 6);
      localStorage.setItem(key, JSON.stringify(updated));
    } catch {
      // ignore storage errors
    }
  }, [slug, title, category, imageUrl]);

  return null;
}
