import Link from "next/link";
import { getCategories, getPublishedPosts, getPopularPosts } from "@/lib/data";
import { ReviewCard } from "@/components/review/ReviewCard";
import { Button } from "@/components/ui/button";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";

export const revalidate = 3600;

export default async function HomePage() {
  const [allPosts, categories, popular] = await Promise.all([
    getPublishedPosts(12),
    getCategories(),
    getPopularPosts(3),
  ]);

  const featured = allPosts.slice(0, 3);
  const latest = allPosts.slice(0, 8);

  return (
    <div className="space-y-14">
      <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-background to-background px-6 py-12 sm:px-10">
        <p className="text-sm font-semibold uppercase tracking-wide text-primary">
          AI-researched reviews
        </p>
        <h1 className="mt-3 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
          Smarter buying decisions — without the fluff.
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          ReviewMax publishes clear pros, cons, and verdicts for kitchen, tech,
          fitness, and home gear. Start with a featured pick or browse by
          category.
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Button asChild size="lg">
            <Link href="/blog">Browse all reviews</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/category/kitchen-gadgets">Kitchen gadgets</Link>
          </Button>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-2xl font-bold">Featured reviews</h2>
          <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {(featured.length > 0 ? featured : popular).map((post) => (
            <ReviewCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Shop by category</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="rounded-xl border bg-card p-5 transition-shadow hover:shadow-md"
            >
              <p className="font-semibold">{c.name}</p>
              {c.description ? (
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {c.description}
                </p>
              ) : null}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-2xl font-bold">Latest on the blog</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {latest.map((post) => (
            <ReviewCard key={post.id} post={post} />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border bg-muted/40 p-8 lg:hidden">
        <NewsletterSignup />
      </section>
    </div>
  );
}
