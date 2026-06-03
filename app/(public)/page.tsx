import Link from "next/link";
import { GitCompare, Search, Trophy } from "lucide-react";
import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/PublicShell";
import { siteUrl } from "@/lib/utils";
import {
  getCategoriesWithPublishedPosts,
  getPopularPosts,
  getPublishedPosts,
} from "@/lib/data";
import { ReviewCard } from "@/components/review/ReviewCard";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { RecentlyViewed } from "@/components/common/RecentlyViewed";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { categoryIconForSlug } from "@/lib/category-icons";
import {
  categoryAccentForSlug,
  formatCategoryList,
} from "@/lib/category-colors";
import { cn } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const categories = await getCategoriesWithPublishedPosts();
  const categoryNames = categories.map((c) => c.name);
  const topics = formatCategoryList(categoryNames);

  const title = "Verdict — Unbiased Product Reviews & Buying Guides";
  const description =
    categoryNames.length > 0
      ? `Clear pros, cons, star ratings, and verdicts across ${topics}. Smarter buying decisions, without the fluff.`
      : "Clear pros, cons, star ratings, and verdicts to help you buy smarter—without the fluff.";
  const url = siteUrl();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export const revalidate = 3600;

export default async function HomePage() {
  const [orderedPosts, activeCategories, popularPosts] = await Promise.all([
    getPublishedPosts(10),
    getCategoriesWithPublishedPosts(),
    getPopularPosts(8),
  ]);

  const homepagePosts = orderedPosts.slice(0, 10);
  const homepageIds = new Set(homepagePosts.map((p) => p.id));
  const topRatedDeduped = popularPosts.filter((p) => !homepageIds.has(p.id));
  const topRated =
    topRatedDeduped.length > 0
      ? topRatedDeduped.slice(0, 4)
      : popularPosts.slice(0, 4);

  const categoryTopics = formatCategoryList(
    activeCategories.map((c) => c.name),
  );

  return (
    <PublicShell>
      <div className="space-y-12 sm:space-y-16">
        <section className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 via-card to-card px-5 py-14 sm:px-10 sm:py-20">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-amber-500/10 blur-3xl" />
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
              Verdict
            </span>
            <h1 className="mt-5 font-heading text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Unbiased reviews for smarter buying decisions
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Clear pros, cons, star ratings, and verdicts across{" "}
              <span className="font-medium text-foreground">{categoryTopics}</span>
              —without the fluff.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/blog">
                  <Search className="h-4 w-4" aria-hidden />
                  Search reviews
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full border-primary/30 sm:w-auto hover:bg-primary/5"
              >
                <Link href="/compare">
                  <GitCompare className="h-4 w-4" aria-hidden />
                  Compare products
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {topRated.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <Trophy
                    className="h-5 w-5 text-amber-500"
                    aria-hidden
                  />
                  <h2 className="font-heading text-2xl font-bold tracking-tight">
                    Top rated
                  </h2>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Highest-scoring reviews across every category
                </p>
              </div>
              <Link
                href="/blog"
                className="text-sm font-medium text-primary hover:underline"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {topRated.map((post) => (
                <ReviewCard
                  key={post.id}
                  post={post}
                  highlight="top-rated"
                  imageSizes="(max-width:768px) 100vw, 25vw"
                />
              ))}
            </div>
          </section>
        )}

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight">
                Latest reviews
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Our newest picks, updated as we publish
              </p>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          {homepagePosts.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {homepagePosts.map((post) => (
                <ReviewCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed bg-muted/30 p-12 text-center">
              <p className="font-medium">No reviews published yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">
                Check back soon for new product guides.
              </p>
            </div>
          )}
        </section>

        {activeCategories.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight">
                  Shop by category
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Browse every topic we cover — pick two products to compare
                </p>
              </div>
              {activeCategories.some((c) => c.post_count >= 2) ? (
                <Link
                  href="/best"
                  className="text-sm font-medium text-primary hover:underline"
                >
                  View best-of guides
                </Link>
              ) : null}
            </div>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {activeCategories.map((c) => {
                const Icon = categoryIconForSlug(c.slug);
                const accent = categoryAccentForSlug(c.slug);
                return (
                  <Link
                    key={c.id}
                    href={`/category/${c.slug}`}
                    className={cn(
                      "group flex flex-col items-center gap-3 rounded-2xl border bg-card px-4 py-7 text-center transition-colors",
                      accent.tile,
                    )}
                  >
                    <span
                      className={cn(
                        "flex h-14 w-14 items-center justify-center rounded-2xl transition-colors",
                        accent.tileIcon,
                      )}
                    >
                      <Icon className="h-7 w-7" aria-hidden />
                    </span>
                    <span className="font-semibold leading-snug">{c.name}</span>
                    <Badge variant="secondary" className="text-xs">
                      {c.post_count} review{c.post_count === 1 ? "" : "s"}
                    </Badge>
                    {c.description ? (
                      <span className="line-clamp-2 text-sm text-muted-foreground">
                        {c.description}
                      </span>
                    ) : null}
                    <span className="mt-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                      Browse &rarr;
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        <RecentlyViewed />

        <section aria-labelledby="newsletter-heading">
          <h2 id="newsletter-heading" className="sr-only">
            Newsletter signup
          </h2>
          <NewsletterSignup variant="section" />
        </section>
      </div>
    </PublicShell>
  );
}
