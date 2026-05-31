import Link from "next/link";
import { Search } from "lucide-react";
import type { Metadata } from "next";
import { PublicShell } from "@/components/layout/PublicShell";
import { siteUrl } from "@/lib/utils";
import { getCategories, getPublishedPosts } from "@/lib/data";
import { ReviewCard } from "@/components/review/ReviewCard";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { Button } from "@/components/ui/button";
import { categoryIconForSlug } from "@/lib/category-icons";

export async function generateMetadata(): Promise<Metadata> {
  const title =
    "Verdict — Unbiased Product Reviews for Kitchen, Tech & Fitness Gear";
  const description =
    "Clear pros, cons, star ratings, and verdicts across kitchen gadgets, home tech, and fitness gear. Smarter buying decisions, without the fluff.";
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
  const [orderedPosts, categories] = await Promise.all([
    getPublishedPosts(12),
    getCategories(),
  ]);

  const featured = orderedPosts.slice(0, 3);
  const latest = orderedPosts.slice(3, 9);

  // Only surface categories that actually have published posts
  const categoryIdsWithPosts = new Set(orderedPosts.map((p) => p.category_id));
  const activeCategories = categories.filter((c) =>
    categoryIdsWithPosts.has(c.id),
  );

  return (
    <PublicShell>
      <div className="space-y-12 sm:space-y-16">
        <section className="relative overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/8 via-card to-card px-5 py-14 sm:px-10 sm:py-20">
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <span className="inline-block rounded-full bg-primary px-4 py-1 text-xs font-semibold uppercase tracking-widest text-primary-foreground">
              Verdict
            </span>
            <h1 className="mt-5 font-heading text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              Unbiased reviews for smarter buying decisions
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-pretty text-base text-muted-foreground sm:text-lg">
              Clear pros, cons, star ratings, and verdicts across kitchen,
              tech, fitness, and home—without the fluff.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link href="/blog">
                  <Search className="h-4 w-4" aria-hidden />
                  Search reviews
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="w-full border-primary/30 sm:w-auto hover:bg-primary/5">
                <Link href="/blog">Browse all</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="font-heading text-2xl font-bold tracking-tight">
                Featured reviews
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Our newest top picks by publish date
              </p>
            </div>
            <Link
              href="/blog"
              className="text-sm font-medium text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {featured.map((post) => (
              <ReviewCard key={post.id} post={post} />
            ))}
          </div>
        </section>

        <section className="space-y-6">
          <div>
            <h2 className="font-heading text-2xl font-bold tracking-tight">Shop by category</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump into the topics we cover most
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {activeCategories.map((c) => {
              const Icon = categoryIconForSlug(c.slug);
              return (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="group flex flex-col items-center gap-3 rounded-2xl border bg-card px-4 py-7 text-center transition-colors hover:border-primary/40 hover:bg-primary/5"
                >
                  <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
                    <Icon className="h-7 w-7" aria-hidden />
                  </span>
                  <span className="font-semibold leading-snug">{c.name}</span>
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

        {latest.length > 0 && (
          <section className="space-y-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h2 className="font-heading text-2xl font-bold tracking-tight">
                  Latest reviews
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Fresh posts after the featured picks
                </p>
              </div>
              <Link
                href="/blog"
                className="text-sm font-medium text-primary hover:underline"
              >
                Open blog
              </Link>
            </div>
            <div className="-mx-4 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:grid sm:grid-cols-2 sm:gap-6 sm:overflow-visible sm:px-0 sm:pb-0 lg:grid-cols-3">
              {latest.map((post) => (
                <div
                  key={post.id}
                  className="min-w-[min(100%,340px)] shrink-0 snap-start sm:min-w-0 sm:shrink"
                >
                  <ReviewCard
                    post={post}
                    imageSizes="(max-width:768px) 90vw, 33vw"
                  />
                </div>
              ))}
            </div>
          </section>
        )}

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
