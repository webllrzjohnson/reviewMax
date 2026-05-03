import Image from "next/image";
import type { PostWithCategory } from "@/types";
import { StarRating } from "@/components/review/StarRating";
import { ProsConsList } from "@/components/review/ProsConsList";
import { AffiliateButton } from "@/components/review/AffiliateButton";
import { Badge } from "@/components/ui/badge";
import { RelatedPosts } from "@/components/review/RelatedPosts";
import { PostBody } from "@/components/review/PostBody";
import { formatDate, siteUrl } from "@/lib/utils";
import { BreadcrumbNav } from "@/components/common/BreadcrumbNav";

const PLACEHOLDER =
  "https://placehold.co/1200x630/e2e8f0/64748b?text=Product";

/** Breaks out of main horizontal padding so the hero reads as full-width within the column. */
function heroBleedClassName() {
  return "-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)]";
}

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

      <div
        className={`relative aspect-[21/9] max-h-[min(70vh,520px)] min-h-[200px] w-full overflow-hidden rounded-none bg-muted sm:rounded-xl ${heroBleedClassName()}`}
      >
        <Image
          src={src}
          alt={post.title}
          priority
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, min(1152px, 100vw)"
        />
      </div>

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
              Published {formatDate(post.published_at)}
            </time>
          ) : null}
        </div>
        <StarRating rating={post.rating} className="pt-2" />
      </header>

      <aside
        className="rounded-xl border-2 border-amber-200/90 bg-gradient-to-br from-amber-50 via-amber-50/80 to-background p-5 shadow-sm dark:border-amber-900/60 dark:from-amber-950/40 dark:via-amber-950/25 dark:to-background"
        aria-labelledby="quick-verdict-heading"
      >
        <p
          id="quick-verdict-heading"
          className="text-sm font-semibold uppercase tracking-wide text-amber-900 dark:text-amber-100"
        >
          Quick verdict
        </p>
        <p className="mt-3 text-base font-medium leading-relaxed">
          {post.verdict}
        </p>
      </aside>

      <ProsConsList pros={post.pros} cons={post.cons} />

      <PostBody body={post.body} />

      <section
        className="rounded-xl border-2 border-[#FF9900]/35 bg-gradient-to-br from-[#FF9900]/18 via-background to-background p-6 shadow-md dark:from-[#FF9900]/10"
        aria-labelledby="where-to-buy-heading"
      >
        <h2 id="where-to-buy-heading" className="text-xl font-bold">
          Where to buy
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          We may earn a commission from qualifying purchases. See our{" "}
          <a href="/affiliate-disclosure" className="font-medium underline">
            affiliate disclosure
          </a>
          .
        </p>
        <div className="mt-5 flex flex-wrap gap-3">
          <AffiliateButton
            href_raw={post.amazon_url}
            postSlug={post.slug}
            className="min-h-12 min-w-[220px] px-10 text-base shadow-md"
          />
        </div>
      </section>

      <RelatedPosts
        categoryId={post.category_id}
        excludeSlug={post.slug}
        limit={3}
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
