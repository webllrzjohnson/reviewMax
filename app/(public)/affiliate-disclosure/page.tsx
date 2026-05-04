import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { siteUrl } from "@/lib/utils";

const path = "/affiliate-disclosure";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${siteUrl()}${path}`;
  const title = "Affiliate disclosure";
  const description =
    "Federal Trade Commission-aligned disclosure for ReviewMax participation in Amazon Associates and similar programs.";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | ReviewMax`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | ReviewMax`,
      description,
    },
  };
}

export const revalidate = 3600;

export default function AffiliateDisclosurePage() {
  return (
    <PublicShell>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Affiliate disclosure</h1>
        <p className="lead">
          <strong>Last updated:</strong> May 3, 2026. This disclosure satisfies
          the transparency requirements we follow under U.S. Federal Trade
          Commission (FTC) endorsement guidelines and aligns with obligations
          for participants in the Amazon Associates Program or comparable
          affiliate networks.
        </p>

        <h2>Compensated relationships</h2>
        <p>
          ReviewMax (“ReviewMax”, “we”, or “us”) may earn referral compensation
          when you click certain outbound links—principally links to amazon.com—and
          complete a qualifying purchase or
          other qualifying action described by that retailer&apos;s affiliate
          program. Amazon and the Amazon logo are trademarks of Amazon.com,
          Inc., or its affiliates. ReviewMax is not endorsed by Amazon. Program
          details, commission structures, eligible products, and reporting are
          governed entirely by Amazon&apos;s (or another merchant&apos;s)
          current operating agreement—not by this disclosure page.
        </p>

        <h2>No extra charge to you</h2>
        <p>
          Affiliate commissions—when they arise—are paid by the retailer, not by
          you. The price you see on Amazon (or another merchant&apos;s checkout)
          is the same whether you arrive through our tracked link or type the
          address directly, unless Amazon or another party is running its own
          promotion that applies broadly.
        </p>

        <h2>How this affects editorial content</h2>
        <p>
          Compensation does not entitle advertisers or networks to dictate our
          published conclusions for a given review topic. Articles are drafted
          to include pros and cons regardless of monetization opportunity. AI
          tools may assist researchers and editors with structuring or language;
          admins remain responsible for which topics publish and whether a post
          goes live at all. Monetized links appear where they materially help a
          reader buy the reviewed product—we do not place unrelated affiliate
          links inside verdict sections solely to inflate clicks.
        </p>

        <h2>Product availability, pricing, and accuracy</h2>
        <p>
          Pricing, promotions, fulfillment options, warranties, manuals, safety
          information, ingredient lists (where relevant), compatibility, regional
          availability, taxes, shipping, returns, recalls, regulatory notices,
          and star averages on retailer pages can change hourly. Information on
          ReviewMax was accurate to the knowledge of editors at publication time
          but is not a substitute for reading the retailer&apos;s own listing or
          contacting manufacturers for safety-critical contexts (e.g., medical
          devices, lithium batteries, childcare items). If something looks
          wrong, assume the authoritative source is Amazon or the OEM site.
        </p>

        <h2>Cookies &amp; attribution</h2>
        <p>
          Affiliate networks may rely on cookies, local storage, redirects, IP
          data, timestamps, cart persistence, browser fingerprinting subsets, or
          similar technologies to confirm that a qualifying purchase traced back
          to a qualifying click issued through our tracked link. Exact practices
          are defined by Amazon (or whichever network serves the link—not by us).
          Manage cookies globally through browser settings or the controls on
          our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link> page concerning
          optional analytics SDKs like PostHog.
        </p>

        <h2>Where to find complementary policies</h2>
        <p>
          For personal data ReviewMax collects directly (newsletter signup,
          optional analytics consent, authenticated admin dashboards), consult the{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>. General conditions
          of using the domain appear in{" "}
          <Link href="/terms">Terms of use</Link>. Nothing on this disclosure
          page modifies or waives provisions in those documents where they are
          stricter than this standalone affiliate notice.
        </p>

        <h2>Contact</h2>
        <p>
          Operational contact channels for Affiliate Program compliance are
          published alongside your production deployment—for example alongside
          the site footer or WHOIS-listed operator details. Preserve those
          contact paths so purchasers and regulators can reach the responsible
          party if required.
        </p>
      </article>
    </PublicShell>
  );
}
