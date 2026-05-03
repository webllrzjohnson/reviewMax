import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of use",
  description: "Terms governing your use of ReviewMax.",
};

export default function TermsPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Terms of use</h1>
      <p className="lead">Last updated: May 3, 2026.</p>
      <h2>Acceptance</h2>
      <p>
        By accessing ReviewMax, you agree to these terms. If you disagree,
        please do not use the site.
      </p>
      <h2>Not professional advice</h2>
      <p>
        Content is for informational purposes only. Always verify product
        details on the retailer site before purchasing.
      </p>
      <h2>Affiliate relationships</h2>
      <p>
        Some links are monetized. See our{" "}
        <a href="/affiliate-disclosure">Affiliate disclosure</a>.
      </p>
      <h2>Availability</h2>
      <p>
        We may change or discontinue any part of the service at any time.
        Listings, prices, and availability on third-party sites are not under
        our control.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, ReviewMax is not liable for
        indirect or consequential damages arising from your use of the site.
      </p>
    </article>
  );
}
