import type { Metadata } from "next";
import { siteUrl } from "@/lib/utils";
import { Suspense } from "react";
import {
  getCategories,
  getCategoriesWithPublishedPosts,
  getPublishedPostsPage,
  type BlogSort,
} from "@/lib/data";
import { ComparePostGrid } from "@/components/review/ComparePostGrid";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCategoryList } from "@/lib/category-colors";

export async function generateMetadata(): Promise<Metadata> {
  const categories = await getCategoriesWithPublishedPosts();
  const topics = formatCategoryList(categories.map((c) => c.name));
  const title = "Reviews & buying guides";
  const description =
    categories.length > 0
      ? `Search and filter product reviews across ${topics}. Honest pros, cons, and verdicts.`
      : "Search and filter honest product reviews with pros, cons, and clear verdicts.";
  const url = `${siteUrl()}/blog`;
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

export const revalidate = 3600;

const PAGE_SIZE = 9;

type SearchParams = Record<string, string | string[] | undefined>;

function BlogPostsSkeleton() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: PAGE_SIZE }).map((_, i) => (
          <Skeleton key={i} className="h-96 rounded-lg" />
        ))}
      </div>
      <Skeleton className="mx-auto h-10 w-72" />
    </div>
  );
}

async function BlogPostsSection({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  function first(v: string | string[] | undefined) {
    return Array.isArray(v) ? v[0] : v;
  }

  const page = Number(first(searchParams.page)) || 1;
  const qRaw = first(searchParams.q);
  const catRaw = first(searchParams.category);
  const minRatingRaw = Number(first(searchParams.minRating)) || 0;
  const sortRaw = first(searchParams.sort) as BlogSort | undefined;

  const { posts, total } = await getPublishedPostsPage({
    page,
    pageSize: PAGE_SIZE,
    q: qRaw,
    categorySlug: catRaw,
    minRating: minRatingRaw,
    sort: sortRaw,
  });

  return (
    <>
      <ComparePostGrid
        posts={posts}
        emptyTitle="No reviews match your filters."
        emptyBody="Try a different search or category."
      />
      <BlogPagination page={page} pageSize={PAGE_SIZE} total={total} />
    </>
  );
}

export default async function BlogIndexPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const [categories, activeCategories] = await Promise.all([
    getCategories(),
    getCategoriesWithPublishedPosts(),
  ]);
  const topics = formatCategoryList(activeCategories.map((c) => c.name));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Reviews & blog</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Honest breakdowns with pros, cons, ratings, and a clear verdict
          {activeCategories.length > 0 ? (
            <>
              {" "}
              across{" "}
              <span className="font-medium text-foreground">{topics}</span>
            </>
          ) : null}
          . Select two products to compare side by side.
        </p>
      </header>

      <BlogExplorer categories={categories} />

      <Suspense fallback={<BlogPostsSkeleton />}>
        <BlogPostsSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
