import type { Metadata } from "next";
import Link from "next/link";
import {
  getCategoriesWithPublishedPosts,
  getPostsForComparison,
  getPublishedPosts,
} from "@/lib/data";
import { CompareView } from "@/components/review/CompareView";
import { ComparePicker } from "@/components/review/ComparePicker";
import { Button } from "@/components/ui/button";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

type SearchParams = { left?: string; right?: string };

export async function generateMetadata(props: {
  searchParams: Promise<SearchParams>;
}): Promise<Metadata> {
  const { left, right } = await props.searchParams;
  if (!left || !right) {
    return {
      title: "Compare products",
      description: "Side-by-side product comparisons within the same category.",
    };
  }

  const result = await getPostsForComparison(left, right);
  if (!result.ok) {
    return { title: "Compare products" };
  }

  const [a, b] = result.posts;
  const title = `${a.title} vs ${b.title}`;
  return {
    title,
    description: `Compare ratings, pros, cons, and verdicts for ${a.title} and ${b.title}.`,
    alternates: {
      canonical: `${siteUrl()}/compare?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}`,
    },
    openGraph: {
      title: `${title} | Verdict`,
      description: `Side-by-side comparison in ${a.category?.name ?? "the same category"}.`,
      url: `${siteUrl()}/compare?left=${encodeURIComponent(left)}&right=${encodeURIComponent(right)}`,
      type: "website",
    },
  };
}

const ERROR_COPY = {
  not_found: {
    title: "Reviews not found",
    body: "One or both products could not be found, or they may not be published yet.",
  },
  same_slug: {
    title: "Pick two different products",
    body: "You selected the same review twice. Choose two different products to compare.",
  },
  different_category: {
    title: "Different categories",
    body: "Comparisons only work for products in the same category—for example, two watches or two blenders.",
  },
} as const;

export default async function ComparePage(props: {
  searchParams: Promise<SearchParams>;
}) {
  const { left, right } = await props.searchParams;

  if (!left?.trim() || !right?.trim()) {
    const [categories, posts] = await Promise.all([
      getCategoriesWithPublishedPosts(),
      getPublishedPosts(500),
    ]);
    return <ComparePicker categories={categories} posts={posts} />;
  }

  const result = await getPostsForComparison(left.trim(), right.trim());

  if (!result.ok) {
    const copy = ERROR_COPY[result.reason];
    return (
      <div className="mx-auto max-w-lg space-y-4 rounded-2xl border bg-card p-8 text-center">
        <h1 className="font-heading text-2xl font-bold">{copy.title}</h1>
        <p className="text-muted-foreground">{copy.body}</p>
        <div className="flex flex-wrap justify-center gap-2">
          <Button asChild variant="outline">
            <Link href="/compare">Try again</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/blog">Browse reviews</Link>
          </Button>
          <Button asChild>
            <Link href="/">Back to home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const [leftPost, rightPost] = result.posts;
  return <CompareView left={leftPost} right={rightPost} />;
}
