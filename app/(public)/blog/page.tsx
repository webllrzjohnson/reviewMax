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

type SearchParams = Record<string, string | string[] | undefined>;

export default async function BlogIndexPage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const searchParams = await props.searchParams;

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

  const categories = await getCategories();
  const { posts, total } = await getPublishedPostsPage({
    page,
    pageSize: 12,
    q: qRaw,
    categorySlug: catRaw,
  });

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

      <PostList posts={posts} />

      <Suspense fallback={<Skeleton className="mx-auto h-10 w-64" />}>
        <BlogPagination page={page} pageSize={12} total={total} />
      </Suspense>
    </div>
  );
}
