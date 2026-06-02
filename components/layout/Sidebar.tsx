import Link from "next/link";
import { GitCompare } from "lucide-react";
import { getCategories, getPopularPosts } from "@/lib/data";
import { Separator } from "@/components/ui/separator";
import { categoryIconForSlug } from "@/lib/category-icons";

export async function Sidebar() {
  const [categories, popular] = await Promise.all([
    getCategories(),
    getPopularPosts(5),
  ]);

  return (
    <div className="space-y-8 rounded-lg border bg-card p-4 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Popular reviews
        </h2>
        <ul className="mt-3 space-y-3">
          {popular.map((p) => (
            <li key={p.id}>
              <Link
                href={`/blog/${p.slug}`}
                className="line-clamp-2 text-sm font-medium hover:underline"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div>
        <Link
          href="/compare"
          className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          <GitCompare className="h-4 w-4 shrink-0 text-primary" aria-hidden />
          Compare two products
        </Link>
        <p className="mt-2 text-xs text-muted-foreground">
          Pick two reviews in the same category for a side-by-side breakdown.
        </p>
      </div>
      <Separator />
      <div>
        <Link
          href="/best"
          className="flex items-center gap-2 rounded-lg border bg-muted/40 px-3 py-2.5 text-sm font-medium transition-colors hover:border-primary/30 hover:bg-primary/5"
        >
          <span aria-hidden>🏆</span>
          Best-of guides
        </Link>
        <p className="mt-2 text-xs text-muted-foreground">
          Top-rated products ranked in each category.
        </p>
      </div>
      <Separator />
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Categories
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {categories.map((c) => {
            const Icon = categoryIconForSlug(c.slug);
            return (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:underline"
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <span>{c.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
