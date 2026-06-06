"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isDirectImageUrl } from "@/lib/image-url";
import { cn } from "@/lib/utils";

const PLACEHOLDER =
  "https://placehold.co/800x500/e2e8f0/64748b?text=Product";

type Props = {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
  /** cover = fill frame (cards); contain = show full product (inline detail) */
  fit?: "cover" | "contain";
};

function resolveDisplaySrc(src: string | null): string {
  return src && isDirectImageUrl(src) ? src : PLACEHOLDER;
}

export function ReviewCardImage({
  src,
  alt,
  sizes,
  priority,
  fit = "cover",
}: Props) {
  const [current, setCurrent] = useState(() => resolveDisplaySrc(src));

  useEffect(() => {
    setCurrent(resolveDisplaySrc(src));
  }, [src]);

  return (
    <Image
      src={current}
      alt={alt}
      fill
      className={cn(
        fit === "contain" ? "object-contain p-3" : "object-cover",
      )}
      sizes={sizes}
      priority={priority}
      onError={() => setCurrent(PLACEHOLDER)}
    />
  );
}
