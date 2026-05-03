import type { Metadata } from "next";
import { Suspense } from "react";
import { getCategories, getPublishedPostsPage } from "@/lib/data";
import { PostList } from "@/components/blog/PostList";
import { BlogExplorer } from "@/components/blog/BlogExplorer";
import { BlogPagination } from "@/components/blog/BlogPagination";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Reviews & buying guides",
  description:
    "Search and filter AI-written product reviews across kitchen, tech, fitness, and home categories.",
};

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
  const page =
    Number(
      Array.isArray(searchParams.page)
        ? searchParams.page[0]
        : searchParams.page,
    ) || 1;
  const qRaw = Array.isArray(searchParams.q)
    ? searchParams.q[0]
    : searchParams.q;
  const catRaw = Array.isArray(searchParams.category)
    ? searchParams.category[0]
    : searchParams.category;

  const { posts, total } = await getPublishedPostsPage({
    page,
    pageSize: PAGE_SIZE,
    q: qRaw,
    categorySlug: catRaw,
  });

  return (
    <>
      <PostList posts={posts} />
      <BlogPagination page={page} pageSize={PAGE_SIZE} total={total} />
    </>
  );
}

export default async function BlogIndexPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;
  const categories = await getCategories();

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Reviews & blog</h1>
        <p className="mt-2 max-w-2xl text-muted-foreground">
          Honest breakdowns with pros, cons, ratings, and a clear verdict—then
          buy on Amazon if it fits your needs.
        </p>
      </header>

      <BlogExplorer categories={categories} />

      <Suspense fallback={<BlogPostsSkeleton />}>
        <BlogPostsSection searchParams={searchParams} />
      </Suspense>
    </div>
  );
}
