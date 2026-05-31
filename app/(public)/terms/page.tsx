import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { siteUrl } from "@/lib/utils";

const path = "/terms";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${siteUrl()}${path}`;
  const title = "Terms of use";
  const description = "Terms governing your use of Verdict.";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: `${title} | Verdict`,
      description,
      url,
      type: "website",
    },
    twitter: {
      card: "summary",
      title: `${title} | Verdict`,
      description,
    },
  };
}

export const revalidate = 3600;

export default function TermsPage() {
  return (
    <PublicShell>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Terms of use</h1>
      <p className="lead">
        <strong>Last updated:</strong> May 3, 2026.
      </p>
      <h2>Acceptance</h2>
      <p>
        By accessing Verdict (&quot;Site&quot;) you agree to these Terms of use (&quot;Terms&quot;)
        and our{" "}
        <Link href="/privacy-policy">Privacy Policy</Link>. Monetised storefront links disclose
        programme commitments in our{" "}
        <Link href="/affiliate-disclosure">Affiliate disclosure</Link>. Operators may revise these Terms
        by posting updates with a refreshed effective date. Continuing to browse after updates ordinarily
        signals renewed acceptance unless your jurisdiction requires a stronger ritual. Stop using Verdict if
        you disagree.
      </p>
      <h2>Conduct</h2>
      <ul>
        <li>Do not misuse the Site or probe admin routes webhook integrations datastore layers without authorization.</li>
        <li>Do not degrade infrastructure spoof secrets brute force dashboards knowingly upload malware or circumvent crawler rules absent consent.</li>
        <li>Do not impersonate sponsorship claims inconsistent with the Affiliate disclosure.</li>
      </ul>
      <h2>Not professional advice</h2>
      <p>
        Content is for informational purposes only. Always verify product
        details, recalls or safety notices on the retailer or manufacturer site
        before purchasing.
      </p>
      <h2>Affiliate relationships</h2>
      <p>
        Some links are monetized. See our{" "}
        <Link href="/affiliate-disclosure">Affiliate disclosure</Link>.
      </p>
      <h2>Availability</h2>
      <p>
        We may change or discontinue any part of the service at any time.
        Listings, prices, and availability on third-party sites are not under
        our control.
      </p>
      <h2>Limitation of liability</h2>
      <p>
        To the fullest extent permitted by law, Verdict is not liable for indirect or consequential damages
        arising from your use of the Site even if foreseeable. Total cumulative liability for claims tied to these
        Terms or the browsing experience described here shall not exceed USD $150 except where mandatory law
        requires otherwise.
      </p>
      <h2>Governing law</h2>
      <p>
        Operators designate substantive Delaware law without conflict doctrines that unintentionally waive mandatory
        consumer protections you retain. Venue defaults to Wilmington, Delaware courts except where narrower statutes
        direct consumers to local tribunals. Arbitration applies only if a separate signed contract explicitly mandates
        it beyond this webpage.
      </p>
      <h2>Miscellaneous</h2>
      <p>
        Incorporated hyperlinked policies should be interpreted together with these Terms. Operators may assign the
        agreement alongside mergers or asset deals; assignment by readers requires counterpart written approvals except for
        corporate reorganisations judged good faith under Delaware law. Courts may narrow overbroad provisions while preserving
        the remainder. Legal notices should flow through whichever contact channels operators publish publicly for enforcement.
      </p>
    </article>
    </PublicShell>
  );
}
