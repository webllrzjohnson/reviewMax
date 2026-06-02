import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import {
  getCategoriesWithPublishedPosts,
  getCategoryBySlug,
  getTopRatedPostsByCategorySlug,
} from "@/lib/data";
import { RoundupList } from "@/components/review/RoundupList";
import { BreadcrumbNav } from "@/components/common/BreadcrumbNav";
import { Button } from "@/components/ui/button";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

const MIN_ROUNDUP_POSTS = 2;
const ROUNDUP_LIMIT = 10;

type Props = { params: Promise<{ slug: string }> };

function roundupTitle(categoryName: string, year: number): string {
  return `Best ${categoryName} ${year}`;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Roundup not found" };

  const year = new Date().getFullYear();
  const title = roundupTitle(category.name, year);
  const description = `Our top ${category.name.toLowerCase()} picks ranked by rating, with pros, cons, and direct links to full reviews. Updated for ${year}.`;
  const url = `${siteUrl()}/best/${category.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Verdict`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Verdict`,
      description,
    },
  };
}

export default async function CategoryRoundupPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = await getTopRatedPostsByCategorySlug(slug, ROUNDUP_LIMIT);
  if (posts.length < MIN_ROUNDUP_POSTS) notFound();

  const year = new Date().getFullYear();
  const title = roundupTitle(category.name, year);
  const topPick = posts[0]!;

  return (
    <div className="space-y-8">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Best picks", href: "/best" },
          { label: category.name, href: `/best/${category.slug}` },
        ]}
      />

      <header className="space-y-4">
        <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400">
          <Trophy className="h-5 w-5" aria-hidden />
          <p className="text-sm font-semibold uppercase tracking-wide">
            Best-of roundup
          </p>
        </div>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {title}
        </h1>
        <p className="max-w-2xl text-muted-foreground">
          We ranked the highest-rated {category.name.toLowerCase()} reviews on
          Verdict by star rating, then editorial quality.{" "}
          <strong className="font-medium text-foreground">{topPick.title}</strong>{" "}
          is our top pick for {year}.
          {category.description ? ` ${category.description}` : ""}
        </p>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/category/${category.slug}`}>
              All {category.name} reviews
            </Link>
          </Button>
          {posts.length >= 2 ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/compare?left=${encodeURIComponent(posts[0]!.slug)}&right=${encodeURIComponent(posts[1]!.slug)}`}
              >
                Compare #1 vs #2
              </Link>
            </Button>
          ) : null}
        </div>
      </header>

      <RoundupList posts={posts} categoryName={category.name} />

      <aside className="rounded-xl border bg-muted/30 p-5 text-sm text-muted-foreground">
        <p>
          Rankings reflect our published star ratings and editorial verdicts.
          Prices and availability change on Amazon — always verify on the
          product page before you buy. We may earn a commission from qualifying
          purchases.{" "}
          <Link href="/affiliate-disclosure" className="font-medium underline">
            Affiliate disclosure
          </Link>
          .
        </p>
      </aside>

      <RoundupJsonLd
        title={title}
        categorySlug={category.slug}
        posts={posts}
      />
    </div>
  );
}

function RoundupJsonLd({
  title,
  categorySlug,
  posts,
}: {
  title: string;
  categorySlug: string;
  posts: Awaited<ReturnType<typeof getTopRatedPostsByCategorySlug>>;
}) {
  const base = siteUrl();
  const ld = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: title,
    url: `${base}/best/${categorySlug}`,
    numberOfItems: posts.length,
    itemListElement: posts.map((post, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: post.title,
      url: `${base}/blog/${post.slug}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
