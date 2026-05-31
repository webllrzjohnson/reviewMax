import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  rating,
  className,
}: {
  rating: number | null;
  className?: string;
}) {
  const value = Number(rating ?? 0);
  const full = Math.floor(value);
  const half = value - full >= 0.5;

  return (
    <div
      className={cn("flex items-center gap-0.5", className)}
      aria-label={`Rating ${value} out of 5`}
    >
      {Array.from({ length: 5 }).map((_, i) => {
        const filled = i < full || (i === full && half);
        return (
          <Star
            key={i}
            className={cn(
              "h-4 w-4",
              filled
                ? "fill-[#C98B1A] text-[#C98B1A]"
                : "text-muted-foreground/30",
            )}
          />
        );
      })}
      <span className="ml-2 text-sm text-muted-foreground">
        {value.toFixed(1)} / 5
      </span>
    </div>
  );
}
