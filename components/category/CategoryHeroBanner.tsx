import { categoryAccentForSlug } from "@/lib/category-colors";
import { categoryIconForSlug } from "@/lib/category-icons";
import { cn } from "@/lib/utils";
import type { Category } from "@/types";

/**
 * Colored hero banner for category pages. Uses the same accent system as
 * review cards so the category color is consistent across the site.
 */
export function CategoryHeroBanner({
  category,
  postCount,
}: {
  category: Category;
  postCount?: number;
}) {
  const accent = categoryAccentForSlug(category.slug);
  const Icon = categoryIconForSlug(category.slug);

  return (
    <div
      className={cn(
        "flex items-center gap-5 rounded-2xl border bg-card px-6 py-8 sm:px-10",
        accent.tile,
      )}
    >
      <span
        className={cn(
          "flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl",
          accent.tileIcon,
        )}
      >
        <Icon className="h-8 w-8" aria-hidden />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Category
        </p>
        <h1 className="mt-1 font-heading text-2xl font-bold tracking-tight sm:text-3xl">
          {category.name}
        </h1>
        {category.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
            {category.description}
          </p>
        )}
        {postCount != null && postCount > 0 && (
          <p className="mt-1 text-xs text-muted-foreground">
            {postCount} review{postCount === 1 ? "" : "s"}
          </p>
        )}
      </div>
    </div>
  );
}
