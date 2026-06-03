import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug } from "@/lib/data";
import { ReviewDetail } from "@/components/review/ReviewDetail";
import { ReadingProgressBar } from "@/components/common/ReadingProgressBar";
import { RecentlyViewedRecorder } from "@/components/common/RecentlyViewedRecorder";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) {
    return { title: "Review not found" };
  }
  const url = `${siteUrl()}/blog/${post.slug}`;
  const images = post.image_url ? [post.image_url] : undefined;
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      title: post.title,
      description: post.excerpt,
      url,
      type: "article",
      publishedTime: post.published_at ?? undefined,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images,
    },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();
  return (
    <>
      <ReadingProgressBar />
      <RecentlyViewedRecorder
        slug={post.slug}
        title={post.title}
        category={post.category?.name ?? null}
        imageUrl={post.image_url}
      />
      <ReviewDetail post={post} />
    </>
  );
}
