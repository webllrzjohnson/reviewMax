"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { isDirectImageUrl } from "@/lib/image-url";

const PLACEHOLDER =
  "https://placehold.co/800x500/e2e8f0/64748b?text=Product";

type Props = {
  src: string | null;
  alt: string;
  sizes: string;
  priority?: boolean;
};

function resolveDisplaySrc(src: string | null): string {
  return src && isDirectImageUrl(src) ? src : PLACEHOLDER;
}

export function ReviewCardImage({ src, alt, sizes, priority }: Props) {
  const [current, setCurrent] = useState(() => resolveDisplaySrc(src));

  useEffect(() => {
    setCurrent(resolveDisplaySrc(src));
  }, [src]);

  return (
    <Image
      src={current}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      priority={priority}
      onError={() => setCurrent(PLACEHOLDER)}
    />
  );
}
