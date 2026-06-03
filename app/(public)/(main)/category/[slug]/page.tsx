import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Trophy } from "lucide-react";
import {
  getCategoryBySlug,
  getPublishedPostsPage,
  getTopRatedPostsByCategorySlug,
} from "@/lib/data";
import { ComparePostGrid } from "@/components/review/ComparePostGrid";
import { CategoryPagination } from "@/components/category/CategoryPagination";
import {
  CategoryGuide,
  CategoryGuideJsonLd,
} from "@/components/category/CategoryGuide";
import { Button } from "@/components/ui/button";
import { siteUrl } from "@/lib/utils";
import { getCategoryGuideContent } from "@/lib/category-guides";
import { CategoryHeroBanner } from "@/components/category/CategoryHeroBanner";

export const revalidate = 3600;

const PAGE_SIZE = 9;

type Props = {
  params: Promise<{ slug: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category not found" };

  const guide = getCategoryGuideContent(category);
  const url = `${siteUrl()}/category/${category.slug}`;
  const description =
    guide.intro[0] ??
    `Product reviews and buying guides in the ${category.name} category.`;

  return {
    title: `${category.name} reviews & buying guide`,
    description,
    alternates: {
      canonical: url,
      types: {
        "application/rss+xml": `${siteUrl()}/category/${category.slug}/feed.xml`,
      },
    },
    openGraph: {
      title: `${category.name} | Verdict`,
      description,
      url,
    },
  };
}

export default async function CategoryPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const sp = await searchParams;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const page =
    Number(Array.isArray(sp.page) ? sp.page[0] : sp.page) || 1;

  const [{ posts, total }, topPicks] = await Promise.all([
    getPublishedPostsPage({
      categorySlug: slug,
      page,
      pageSize: PAGE_SIZE,
    }),
    getTopRatedPostsByCategorySlug(slug, 3),
  ]);

  const hasRoundup = topPicks.length >= 2;

  return (
    <div className="space-y-10">
      <header className="space-y-4">
        <CategoryHeroBanner category={category} postCount={total} />
        {hasRoundup ? (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/best/${category.slug}`}>
              <Trophy className="h-4 w-4" aria-hidden />
              Best {category.name} picks
            </Link>
          </Button>
        ) : null}
      </header>

      <CategoryGuide
        category={category}
        topPicks={topPicks}
        hasRoundup={hasRoundup}
      />

      <section className="space-y-4" aria-labelledby="category-reviews-heading">
        <h2
          id="category-reviews-heading"
          className="font-heading text-2xl font-bold tracking-tight"
        >
          All {category.name} reviews
        </h2>
        <ComparePostGrid posts={posts} />
        <CategoryPagination
          slug={slug}
          page={page}
          pageSize={PAGE_SIZE}
          total={total}
        />
      </section>

      <CategoryGuideJsonLd category={category} />
    </div>
  );
}
