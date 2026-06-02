"use client";

import { useEffect, useState } from "react";
import { AffiliateButton } from "@/components/review/AffiliateButton";

export function StickyBuyBar({
  postSlug,
  amazonUrl,
  title,
  observeTargetId,
}: {
  postSlug: string;
  amazonUrl: string;
  title: string;
  observeTargetId: string;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const target = document.getElementById(observeTargetId);
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry) setVisible(!entry.isIntersecting);
      },
      { threshold: 0, rootMargin: "-64px 0px 0px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [observeTargetId]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-3 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:p-4"
      role="region"
      aria-label="Buy this product"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 sm:gap-4">
        <p className="min-w-0 flex-1 truncate text-sm font-medium sm:text-base">
          {title}
        </p>
        <AffiliateButton
          href_raw={amazonUrl}
          postSlug={postSlug}
          label="Buy on Amazon"
          className="shrink-0 px-4 text-sm sm:px-6 sm:text-base"
        />
      </div>
    </div>
  );
}
