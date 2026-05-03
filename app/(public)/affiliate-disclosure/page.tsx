import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Affiliate disclosure",
  description:
    "How ReviewMax uses Amazon Associates links and how that affects our content.",
};

export default function AffiliateDisclosurePage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Affiliate disclosure</h1>
      <p>
        ReviewMax participates in the Amazon Associates program (and may
        participate in similar programs in the future). When you click an
        Amazon link on this site and make a qualifying purchase, we may earn a
        commission at no additional cost to you.
      </p>
      <p>
        Compensation does not determine our editorial templates: we publish
        pros, cons, ratings, and verdicts for every featured product. AI tools
        assist with drafting and research; the admin team controls what topics
        are requested and published.
      </p>
      <p>
        For privacy practices, see our{" "}
        <a href="/privacy-policy">Privacy Policy</a>.
      </p>
    </article>
  );
}
