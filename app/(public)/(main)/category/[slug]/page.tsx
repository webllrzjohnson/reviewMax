import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  getCategoryBySlug,
  getPostsByCategorySlug,
} from "@/lib/data";
import { PostList } from "@/components/blog/PostList";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

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
      title: `${category.name} | ReviewMax`,
      description: category.description ?? undefined,
      url: `${siteUrl()}/category/${category.slug}`,
    },
  };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const posts = await getPostsByCategorySlug(category.slug);

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
      <PostList posts={posts} />
    </div>
  );
}
