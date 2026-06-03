"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock } from "lucide-react";
import { ReviewCardImage } from "@/components/review/ReviewCardImage";

type RecentItem = {
  slug: string;
  title: string;
  category: string | null;
  imageUrl: string | null;
};

export function RecentlyViewed() {
  const [items, setItems] = useState<RecentItem[]>([]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("verdict_recently_viewed");
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  if (items.length === 0) return null;

  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        <Clock className="h-4 w-4 text-muted-foreground" aria-hidden />
        <h2 className="text-base font-semibold">Recently viewed</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
        {items.map((item) => (
          <Link
            key={item.slug}
            href={`/blog/${item.slug}`}
            className="group shrink-0 w-36 sm:w-40 rounded-lg border bg-card overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="relative aspect-[4/3] w-full bg-muted">
              <ReviewCardImage
                src={item.imageUrl}
                alt={item.title}
                sizes="160px"
              />
            </div>
            <div className="p-2">
              {item.category && (
                <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground mb-0.5">
                  {item.category}
                </p>
              )}
              <p className="line-clamp-2 text-xs font-medium leading-snug group-hover:text-primary transition-colors">
                {item.title}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
