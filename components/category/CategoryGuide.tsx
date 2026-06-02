import Link from "next/link";
import { GitCompare, Trophy } from "lucide-react";
import type { Category, PostWithCategory } from "@/types";
import { getCategoryGuideContent } from "@/lib/category-guides";
import { Button } from "@/components/ui/button";

export function CategoryGuide({
  category,
  topPicks,
  hasRoundup,
}: {
  category: Category;
  topPicks: PostWithCategory[];
  hasRoundup: boolean;
}) {
  const guide = getCategoryGuideContent(category);

  return (
    <div className="space-y-8">
      <section
        className="rounded-2xl border bg-muted/30 p-6 sm:p-8"
        aria-labelledby="buying-guide-heading"
      >
        <h2
          id="buying-guide-heading"
          className="font-heading text-xl font-bold tracking-tight sm:text-2xl"
        >
          {category.name} buying guide
        </h2>
        <div className="mt-4 space-y-3 text-muted-foreground">
          {guide.intro.map((paragraph) => (
            <p key={paragraph} className="leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-6">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
            What we look for
          </h3>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {guide.tips.map((tip) => (
              <li key={tip} className="flex gap-2">
                <span className="text-primary" aria-hidden>
                  •
                </span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>

        {topPicks.length > 0 ? (
          <div className="mt-6">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-foreground">
              Top picks in this category
            </h3>
            <ul className="mt-3 space-y-2">
              {topPicks.map((post, index) => (
                <li key={post.id}>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    #{index + 1}: {post.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        <div className="mt-6 flex flex-wrap gap-2">
          {hasRoundup ? (
            <Button variant="outline" size="sm" asChild>
              <Link href={`/best/${category.slug}`}>
                <Trophy className="h-4 w-4" aria-hidden />
                See full best-of roundup
              </Link>
            </Button>
          ) : null}
          {topPicks.length >= 2 ? (
            <Button variant="outline" size="sm" asChild>
              <Link
                href={`/compare?left=${encodeURIComponent(topPicks[0]!.slug)}&right=${encodeURIComponent(topPicks[1]!.slug)}`}
              >
                <GitCompare className="h-4 w-4" aria-hidden />
                Compare top two
              </Link>
            </Button>
          ) : null}
        </div>
      </section>

      <section aria-labelledby="category-faq-heading">
        <h2
          id="category-faq-heading"
          className="font-heading text-xl font-bold tracking-tight sm:text-2xl"
        >
          Frequently asked questions
        </h2>
        <div className="mt-4 divide-y rounded-2xl border bg-card">
          {guide.faqs.map((faq) => (
            <details key={faq.question} className="group px-5 py-4">
              <summary className="cursor-pointer list-none font-medium marker:content-none [&::-webkit-details-marker]:hidden">
                <span className="flex items-center justify-between gap-4">
                  {faq.question}
                  <span
                    className="shrink-0 text-muted-foreground transition-transform group-open:rotate-45"
                    aria-hidden
                  >
                    +
                  </span>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}

export function CategoryGuideJsonLd({
  category,
}: {
  category: Category;
}) {
  const guide = getCategoryGuideContent(category);
  const ld = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: guide.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(ld) }}
    />
  );
}
