import type { PostWithCategory } from "@/types";
import { ReviewCardImage } from "@/components/review/ReviewCardImage";
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
        <ReviewCardImage
          src={post.image_url}
          alt={post.title}
          sizes="(max-width: 768px) 100vw, min(1152px, 100vw)"
          priority
        />
      </div>

      <header className="space-y-4">
        {post.category ? (
          <Badge variant="secondary">{post.category.name}</Badge>
        ) : null}
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {post.title}
        </h1>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {post.published_at ? (
            <time dateTime={post.published_at}>
              Published {formatDate(post.published_at)}
            </time>
          ) : null}
          {post.amazon_url ? (
            <span>
              Contains{" "}
              <a href="/affiliate-disclosure" className="underline hover:text-foreground">
                affiliate links
              </a>
            </span>
          ) : null}
        </div>
        <StarRating rating={post.rating} className="pt-2" />
      </header>

      <aside
        className="rounded-xl border border-[#16A34A]/25 bg-[#16A34A]/5 p-5 dark:border-[#22C55E]/20 dark:bg-[#22C55E]/8"
        aria-labelledby="quick-verdict-heading"
      >
        <div className="flex items-center gap-2">
          <p
            id="quick-verdict-heading"
            className="text-sm font-semibold uppercase tracking-wide text-[#16A34A] dark:text-[#22C55E]"
          >
            Verdict
          </p>
          <span className="inline-flex items-center gap-1 rounded-full bg-[#16A34A] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
            <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none" aria-hidden>
              <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Verified
          </span>
        </div>
        <p className="mt-3 text-base font-medium leading-relaxed">
          {post.verdict}
        </p>
      </aside>

      <ProsConsList pros={post.pros} cons={post.cons} />

      <PostBody body={post.body} />

      {post.gallery_urls && post.gallery_urls.length > 0 ? (
        <section className="space-y-4" aria-labelledby="gallery-heading">
          <h2 id="gallery-heading" className="text-xl font-bold">
            More photos
          </h2>
          <div className="grid gap-4 sm:grid-cols-2">
            {post.gallery_urls.map((url) => (
              <div
                key={url}
                className="relative aspect-[4/3] overflow-hidden rounded-lg border bg-muted"
              >
                <Image
                  src={url}
                  alt=""
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ))}
          </div>
        </section>
      ) : null}

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
    author: { "@type": "Organization", name: "Verdict" },
    reviewBody: post.verdict,
  };

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at ?? undefined,
    image: post.image_url ? [post.image_url] : [fallbackImage],
    author: { "@type": "Organization", name: "Verdict" },
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
