import type { PostWithCategory } from "@/types";
import { ReviewCardImage } from "@/components/review/ReviewCardImage";
import { AnimatedRating } from "@/components/review/AnimatedRating";
import { ProsConsList } from "@/components/review/ProsConsList";
import { AffiliateButton } from "@/components/review/AffiliateButton";
import { StickyBuyBar } from "@/components/review/StickyBuyBar";
import { Badge } from "@/components/ui/badge";
import { RelatedPosts } from "@/components/review/RelatedPosts";
import { CompareWithLinks } from "@/components/review/CompareWithLinks";
import { PostBody } from "@/components/review/PostBody";
import { formatDate, siteUrl, wasUpdatedAfterPublish, cn } from "@/lib/utils";
import { categoryAccentForSlug } from "@/lib/category-colors";
import { getRelatedPosts } from "@/lib/data";
import { BreadcrumbNav } from "@/components/common/BreadcrumbNav";
import { ShareBar } from "@/components/common/ShareBar";
import { TableOfContents } from "@/components/review/TableOfContents";
import { extractHeadings } from "@/lib/extract-headings";
import { PostBadgeTag } from "@/components/review/PostBadge";
import { HelpfulFeedback } from "@/components/review/HelpfulFeedback";
import { FaqAccordion } from "@/components/review/FaqAccordion";
import { GalleryLightbox } from "@/components/review/GalleryLightbox";

/** Breaks out of main horizontal padding so the hero reads as full-width within the column. */
function heroBleedClassName() {
  return "-mx-4 w-[calc(100%+2rem)] sm:-mx-6 sm:w-[calc(100%+3rem)]";
}

export async function ReviewDetail({
  post,
}: {
  post: PostWithCategory;
}) {
  const related = await getRelatedPosts(post.category_id, post.slug, 8);
  const showUpdated = wasUpdatedAfterPublish(post.published_at, post.updated_at);
  const headings = extractHeadings(post.body);
  const accent = categoryAccentForSlug(post.category?.slug ?? "");

  return (
    <article className={cn("space-y-8", post.amazon_url ? "pb-24 sm:pb-28" : undefined)}>
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
          <Badge className={cn("border shadow-sm", accent.badge)}>
            {post.category.name}
          </Badge>
        ) : null}
        <div className="flex flex-wrap items-center gap-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
            {post.title}
          </h1>
          <PostBadgeTag badge={post.badge} size="md" />
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
          {post.published_at ? (
            <time dateTime={post.published_at}>
              Published {formatDate(post.published_at)}
            </time>
          ) : null}
          {showUpdated ? (
            <time dateTime={post.updated_at!}>
              Updated {formatDate(post.updated_at)}
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
        <AnimatedRating rating={post.rating} className="pt-2" />
      </header>

      <aside
        id="review-verdict"
        className="rounded-xl border border-[#16A34A]/25 bg-[#16A34A]/5 p-5 dark:border-[#22C55E]/20 dark:bg-[#22C55E]/8"
        aria-labelledby="quick-verdict-heading"
      >
        <p
          id="quick-verdict-heading"
          className="text-sm font-semibold uppercase tracking-wide text-[#16A34A] dark:text-[#22C55E]"
        >
          Verdict
        </p>
        <p className="mt-3 text-base font-medium leading-relaxed">
          {post.verdict}
        </p>
        {post.amazon_url ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <AffiliateButton
              href_raw={post.amazon_url}
              postSlug={post.slug}
              label="Check price on Amazon"
              className="w-full sm:w-auto"
            />
            {post.price_at_review ? (
              <p className="text-xs text-muted-foreground">
                Price at review:{" "}
                <span className="font-semibold text-foreground">
                  {post.price_at_review}
                </span>
              </p>
            ) : null}
          </div>
        ) : null}
      </aside>

      <ShareBar
        url={`${siteUrl()}/blog/${post.slug}`}
        title={`${post.title} — Verdict`}
        className="border-t pt-6"
      />

      <TableOfContents headings={headings} />

      <ProsConsList pros={post.pros} cons={post.cons} />

      <PostBody body={post.body} />

      <FaqAccordion faqs={post.faqs} />

      <GalleryLightbox images={post.gallery_urls ?? []} title={post.title} />

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

      <HelpfulFeedback postSlug={post.slug} />

      {post.category && related.length > 0 ? (
        <div className="flex items-center justify-between rounded-xl border bg-muted/30 px-5 py-4">
          <div>
            <p className="text-sm font-semibold">
              See the best {post.category.name} picks
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Top-rated {post.category.name.toLowerCase()} ranked by our
              editorial team
            </p>
          </div>
          <a
            href={`/best/${post.category.slug}`}
            className="shrink-0 ml-4 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            View roundup →
          </a>
        </div>
      ) : null}

      <CompareWithLinks post={post} related={related} />

      <RelatedPosts posts={related.slice(0, 3)} />

      <JsonLd post={post} />

      {post.amazon_url ? (
        <StickyBuyBar
          postSlug={post.slug}
          amazonUrl={post.amazon_url}
          title={post.title}
          observeTargetId="review-verdict"
        />
      ) : null}
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
    ...(post.amazon_url
      ? {
          offers: {
            "@type": "Offer",
            url: post.amazon_url,
            availability: "https://schema.org/InStock",
          },
        }
      : {}),
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
    dateModified: post.updated_at ?? post.published_at ?? undefined,
    image: post.image_url ? [post.image_url] : [fallbackImage],
    author: { "@type": "Organization", name: "Verdict" },
    mainEntityOfPage: url,
  };

  const faqLd =
    post.faqs && post.faqs.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: post.faqs.map((f) => ({
            "@type": "Question",
            name: f.q,
            acceptedAnswer: { "@type": "Answer", text: f.a },
          })),
        }
      : null;

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
      {faqLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }}
        />
      )}
    </>
  );
}
