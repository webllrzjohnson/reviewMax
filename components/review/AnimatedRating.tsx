"use client";

import { useEffect, useRef, useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function AnimatedRating({
  rating,
  className,
}: {
  rating: number | null;
  className?: string;
}) {
  const value = Number(rating ?? 0);
  const full = Math.floor(value);
  const half = value - full >= 0.5;

  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`Rating ${value} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        const delay = `${i * 80}ms`;
        return (
          <Star
            key={i}
            style={{
              transitionDelay: visible ? delay : "0ms",
            }}
            className={cn(
              "h-5 w-5 transition-all duration-300",
              filled
                ? visible
                  ? "fill-[#C98B1A] text-[#C98B1A] scale-100 opacity-100"
                  : "fill-[#C98B1A] text-[#C98B1A] scale-50 opacity-0"
                : "text-muted-foreground/30",
            )}
          />
        );
      })}
      <span
        className={cn(
          "ml-2 text-base font-bold transition-all duration-500",
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-1",
        )}
        style={{ transitionDelay: visible ? "400ms" : "0ms" }}
      >
        {value.toFixed(1)}
        <span className="ml-1 text-sm font-normal text-muted-foreground">
          / 5
        </span>
      </span>
    </div>
  );
}
