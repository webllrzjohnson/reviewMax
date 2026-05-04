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
  const title = "Honest product reviews";
  const description =
    "Featured and latest AI-researched reviews, categories, and newsletter—smarter buying without the fluff.";
  const url = siteUrl();
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ReviewMax`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ReviewMax`,
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

  return (
    <PublicShell>
      <div className="space-y-12 sm:space-y-16">
        <section className="relative overflow-hidden rounded-2xl border bg-gradient-to-br from-primary/12 via-background to-background px-5 py-12 shadow-sm sm:px-10 sm:py-14">
          <div className="relative z-10 mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-primary">
              ReviewMax
            </p>
            <h1 className="mt-4 text-balance text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
              AI-researched reviews for smarter buying decisions
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
              <Button asChild size="lg" variant="outline" className="w-full sm:w-auto">
                <Link href="/blog">Browse all</Link>
              </Button>
            </div>
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
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
            <h2 className="text-2xl font-bold tracking-tight">Shop by category</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Jump into the topics we cover most
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
            {categories.map((c) => {
              const Icon = categoryIconForSlug(c.slug);
              return (
                <Link
                  key={c.id}
                  href={`/category/${c.slug}`}
                  className="group flex items-start gap-4 rounded-xl border bg-card p-5 shadow-sm transition-all hover:border-primary/25 hover:shadow-md"
                >
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                    <Icon className="h-6 w-6" aria-hidden />
                  </span>
                  <span className="min-w-0">
                    <span className="block font-semibold leading-snug">
                      {c.name}
                    </span>
                    {c.description ? (
                      <span className="mt-1 line-clamp-2 block text-sm text-muted-foreground">
                        {c.description}
                      </span>
                    ) : null}
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="space-y-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">Latest reviews</h2>
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

          {latest.length > 0 ? (
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
          ) : (
            <p className="text-sm text-muted-foreground">
              More reviews are on the way. Browse the{" "}
              <Link href="/blog" className="font-medium text-primary underline">
                full archive
              </Link>
              .
            </p>
          )}
        </section>

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
