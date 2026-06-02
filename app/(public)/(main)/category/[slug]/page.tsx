import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategoryBySlug, getPublishedPostsPage } from "@/lib/data";
import { ComparePostGrid } from "@/components/review/ComparePostGrid";
import { CategoryPagination } from "@/components/category/CategoryPagination";
import { siteUrl } from "@/lib/utils";

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
  return {
    title: `${category.name} reviews`,
    description:
      category.description ??
      `Product reviews and guides in the ${category.name} category.`,
    openGraph: {
      title: `${category.name} | Verdict`,
      description: category.description ?? undefined,
      url: `${siteUrl()}/category/${category.slug}`,
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

  const { posts, total } = await getPublishedPostsPage({
    categorySlug: slug,
    page,
    pageSize: PAGE_SIZE,
  });

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase text-muted-foreground">
          Category
        </p>
        <h1 className="mt-1 text-3xl font-bold tracking-tight">
          {category.name}
        </h1>
        {category.description ? (
          <p className="mt-3 max-w-2xl text-muted-foreground">
            {category.description}
          </p>
        ) : null}
      </header>
      <ComparePostGrid posts={posts} />
      <CategoryPagination
        slug={slug}
        page={page}
        pageSize={PAGE_SIZE}
        total={total}
      />
    </div>
  );
}
