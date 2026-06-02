import type { Metadata } from "next";
import Link from "next/link";
import { Trophy } from "lucide-react";
import { getCategoriesWithPublishedPosts } from "@/lib/data";
import { BreadcrumbNav } from "@/components/common/BreadcrumbNav";
import { Badge } from "@/components/ui/badge";
import { categoryIconForSlug } from "@/lib/category-icons";
import { categoryAccentForSlug } from "@/lib/category-colors";
import { cn, siteUrl } from "@/lib/utils";

export const revalidate = 3600;

const MIN_ROUNDUP_POSTS = 2;

export async function generateMetadata(): Promise<Metadata> {
  const year = new Date().getFullYear();
  const title = `Best product picks ${year}`;
  const description =
    "Browse Verdict's best-of roundups by category — top-rated products ranked with pros, cons, and full review links.";
  const url = `${siteUrl()}/best`;
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title: `${title} | Verdict`, description, url, type: "website" },
    twitter: { card: "summary_large_image", title: `${title} | Verdict`, description },
  };
}

export default async function BestIndexPage() {
  const categories = await getCategoriesWithPublishedPosts();
  const roundupCategories = categories.filter(
    (c) => c.post_count >= MIN_ROUNDUP_POSTS,
  );
  const year = new Date().getFullYear();

  return (
    <div className="space-y-8">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Best picks", href: "/best" },
        ]}
      />

      <header className="space-y-3">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <Trophy className="h-5 w-5" aria-hidden />
          <p className="text-sm font-semibold uppercase tracking-wide">
            Best-of guides
          </p>
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          Best product picks {year}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          Top-rated products in each category, ranked by our star ratings and
          editorial verdicts. Start here when you want the short list.
        </p>
      </header>

      {roundupCategories.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-muted/30 p-12 text-center">
          <p className="font-medium">Roundups coming soon.</p>
          <p className="mt-2 text-sm text-muted-foreground">
            We need at least two reviews per category to publish a best-of
            guide.
          </p>
          <Link
            href="/blog"
            className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
          >
            Browse all reviews
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {roundupCategories.map((c) => {
            const Icon = categoryIconForSlug(c.slug);
            const accent = categoryAccentForSlug(c.slug);
            return (
              <Link
                key={c.id}
                href={`/best/${c.slug}`}
                className={cn(
                  "group flex flex-col gap-3 rounded-2xl border bg-card p-5 transition-colors",
                  accent.tile,
                )}
              >
                <span
                  className={cn(
                    "flex h-12 w-12 items-center justify-center rounded-xl",
                    accent.tileIcon,
                  )}
                >
                  <Icon className="h-6 w-6" aria-hidden />
                </span>
                <div>
                  <h2 className="font-heading text-lg font-bold leading-snug">
                    Best {c.name} {year}
                  </h2>
                  {c.description ? (
                    <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">
                      {c.description}
                    </p>
                  ) : null}
                </div>
                <Badge variant="secondary" className="w-fit">
                  {c.post_count} reviews ranked
                </Badge>
                <span className="text-sm font-medium text-primary group-hover:underline">
                  View roundup →
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
