"use client";

import Image from "next/image";
import { useState } from "react";

const PLACEHOLDER =
  "https://placehold.co/800x500/e2e8f0/64748b?text=Product";

type Props = {
  src: string | null;
  alt: string;
  sizes: string;
};

export function ReviewCardImage({ src, alt, sizes }: Props) {
  const initial = src && src.trim().length > 0 ? src : PLACEHOLDER;
  const [current, setCurrent] = useState(initial);

  return (
    <Image
      src={current}
      alt={alt}
      fill
      className="object-cover"
      sizes={sizes}
      onError={() => setCurrent(PLACEHOLDER)}
    />
  );
}
