import { Award, TrendingUp, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import type { PostBadge } from "@/types";

const BADGE_CONFIG: Record<
  NonNullable<PostBadge>,
  { label: string; icon: React.ElementType; className: string }
> = {
  "editors-choice": {
    label: "Editor's Choice",
    icon: Award,
    className:
      "border-violet-400/60 bg-violet-50 text-violet-700 dark:border-violet-500/40 dark:bg-violet-950/40 dark:text-violet-300",
  },
  "best-value": {
    label: "Best Value",
    icon: TrendingUp,
    className:
      "border-emerald-400/60 bg-emerald-50 text-emerald-700 dark:border-emerald-500/40 dark:bg-emerald-950/40 dark:text-emerald-300",
  },
  "top-pick": {
    label: "Top Pick",
    icon: Star,
    className:
      "border-blue-400/60 bg-blue-50 text-blue-700 dark:border-blue-500/40 dark:bg-blue-950/40 dark:text-blue-300",
  },
};

export function PostBadgeTag({
  badge,
  size = "sm",
}: {
  badge: PostBadge | null | undefined;
  size?: "sm" | "md";
}) {
  if (!badge) return null;
  const config = BADGE_CONFIG[badge];
  if (!config) return null;
  const Icon = config.icon;

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border font-semibold",
        size === "sm" && "px-2 py-0.5 text-xs",
        size === "md" && "px-3 py-1 text-sm",
        config.className,
      )}
    >
      <Icon className={cn(size === "sm" ? "h-3 w-3" : "h-4 w-4")} aria-hidden />
      {config.label}
    </span>
  );
}
