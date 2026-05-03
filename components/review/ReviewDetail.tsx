import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { PostWithCategory } from "@/types";
import { StarRating } from "@/components/review/StarRating";
import { ProsConsList } from "@/components/review/ProsConsList";
import { AffiliateButton } from "@/components/review/AffiliateButton";
import { Badge } from "@/components/ui/badge";
import { RelatedPosts } from "@/components/review/RelatedPosts";
import { formatDate, siteUrl } from "@/lib/utils";
import { BreadcrumbNav } from "@/components/common/BreadcrumbNav";

const PLACEHOLDER =
  "https://placehold.co/1200x630/e2e8f0/64748b?text=Product";

export function ReviewDetail({
  post,
}: {
  post: PostWithCategory;
}) {
  const src = post.image_url || PLACEHOLDER;

  return (
    <article className="space-y-8">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Reviews", href: "/blog" },
          ...(post.category
            ? [
                {
                  label: post.category.name,
                  href: `/category/${post.category.slug}`,
                },
              ]
            : []),
          { label: post.title, href: `/blog/${post.slug}` },
        ]}
      />
      <header className="space-y-4">
        {post.category ? (
          <Badge variant="secondary">{post.category.name}</Badge>
        ) : null}
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          {post.published_at ? (
            <time dateTime={post.published_at}>
              Updated {formatDate(post.published_at)}
            </time>
          ) : null}
        </div>
        <StarRating rating={post.rating} className="pt-2" />
      </header>

      <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl bg-muted">
        <Image
          src={src}
          alt={post.title}
          priority
          fill
          className="object-cover"
          sizes="(max-width:768px) 100vw, 720px"
        />
      </div>

      <div className="rounded-lg border bg-amber-50/60 p-4 dark:bg-amber-950/30">
        <p className="text-sm font-semibold uppercase text-amber-900 dark:text-amber-100">
          Quick verdict
        </p>
        <p className="mt-2 text-base">{post.verdict}</p>
      </div>

      <ProsConsList pros={post.pros} cons={post.cons} />

      <div className="prose prose-neutral dark:prose-invert max-w-none">
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body}</ReactMarkdown>
      </div>

      <div className="rounded-xl border bg-muted/50 p-6">
        <h2 className="text-lg font-semibold">Where to buy</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We may earn a commission from qualifying purchases. See our{" "}
          <a href="/affiliate-disclosure" className="underline">
            affiliate disclosure
          </a>
          .
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <AffiliateButton
            href_raw={post.amazon_url}
            postSlug={post.slug}
          />
        </div>
      </div>

      <RelatedPosts
        categoryId={post.category_id}
        excludeSlug={post.slug}
      />

      <JsonLd post={post} />
    </article>
  );
}

function JsonLd({ post }: { post: PostWithCategory }) {
  const url = `${siteUrl()}/blog/${post.slug}`;
  const fallbackImage =
    "https://placehold.co/1200x630/e2e8f0/64748b?text=Product";

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: post.title,
    image: post.image_url ? [post.image_url] : [fallbackImage],
    description: post.excerpt,
    offers: {
      "@type": "Offer",
      url: post.amazon_url,
      availability: "https://schema.org/InStock",
    },
  };

  const reviewLd = {
    "@context": "https://schema.org",
    "@type": "Review",
    itemReviewed: { "@type": "Product", name: post.title },
    reviewRating: {
      "@type": "Rating",
      ratingValue: post.rating ?? undefined,
      bestRating: 5,
    },
    author: { "@type": "Organization", name: "ReviewMax" },
    reviewBody: post.verdict,
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at ?? undefined,
    image: post.image_url ? [post.image_url] : [fallbackImage],
    author: { "@type": "Organization", name: "ReviewMax" },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(reviewLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }}
      />
    </>
  );
}
