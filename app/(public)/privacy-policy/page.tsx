import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { siteUrl } from "@/lib/utils";

const path = "/privacy-policy";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${siteUrl()}${path}`;
  const title = "Privacy policy";
  const description =
    "Verdict privacy practices: newsletter data, authentication, cookies, analytics, subprocessors, and your choices.";
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

export default function PrivacyPolicyPage() {
  return (
    <PublicShell>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Privacy policy</h1>
        <p className="lead">
          <strong>Last updated:</strong> May 3, 2026. This Privacy Policy explains
          how Verdict collects, uses, stores, and protects information when you
          use this website (“Site”). For general rules of using the Site, see our{" "}
          <Link href="/terms">Terms of use</Link>.
        </p>

        <h2>Who we are</h2>
        <p>
          Verdict is a product-review website. The app and database are
          self-hosted (for example on a VPS via Coolify); optional analytics use
          PostHog after you consent; error monitoring may use Sentry when
          configured. Those vendors process data under their respective terms as
          subprocessors assisting us.
        </p>

        <h2>What we collect</h2>
        <ul>
          <li>
            <strong>Newsletter:</strong> If you subscribe, we store your email
            address in our PostgreSQL database to send updates you opted into.
            Unsubscribe flows
            are provided in outbound messages whenever the newsletter is active.
          </li>
          <li>
            <strong>Analytics (optional):</strong> After you accept non-essential
            cookies via the banner, PostHog may record page views, UI interactions,
            and (only if explicitly enabled for your deployment) session replays—
            used in aggregate to understand how readers use the Site.
          </li>
          <li>
            <strong>Administrators:</strong> If you sign into the dashboard, Auth.js
            handles credentials. We associate your account with a user record so
            server actions can authorize admin-only routes.
          </li>
          <li>
            <strong>Server and security logs:</strong> Like most hosted sites,
            infrastructure providers may log IP addresses, timestamps, and request
            metadata for reliability and abuse prevention according to vendor
            retention schedules.
          </li>
          <li>
            <strong>Review requests (admins):</strong> Operators may submit product
            names, categories, Amazon URLs, and notes; those submissions are stored
            to power the editorial queue.
          </li>
        </ul>

        <h2>Cookies and similar tech</h2>
        <p>
          Essential cookies/local storage may preserve session state for admins
          and remember your cookie consent choice. Analytics cookies initialize
          only after you opt in via the CookieBanner.
        </p>

        <h2>How we use information</h2>
        <p>
          We use the data described above to operate and secure the Site, deliver
          the newsletter service, prioritize review topics, troubleshoot technical
          issues, and obey applicable law or enforceable governmental requests.
        </p>

        <h2>Sharing</h2>
        <p>
          We do not sell subscriber email lists for unrelated marketing. We share
          data with service providers strictly as needed for the functions listed
          (hosting, database, analytics, monitoring). Affiliate retailers may assign
          their own cookies after you leave for Amazon; refer to Amazon’s notices
          and our{" "}
          <Link href="/affiliate-disclosure">Affiliate disclosure</Link>.
        </p>

        <h2>Retention</h2>
        <p>
          Newsletter addresses remain until deletion is requested or the list is
          retired by the operator; infrastructure logs expire per vendor defaults
          unless a longer retention is contractually justified (for example fraud
          investigation). Administrators should apply appropriate retention policies
          for historical tables in the database.
        </p>

        <h2>Security</h2>
        <p>
          We transmit data using HTTPS where the platform provides it and enforce
          admin-only access in application code and authenticated server actions for
          sensitive operations. Protect webhook secrets and database credentials—they
          grant full database access—and rotate them according to your security plan.
        </p>

        <h2>Your choices and rights</h2>
        <p>
          Depending on where you live, privacy laws such as GDPR, UK GDPR,
          CPRA/CCPA or similar statutes may grant you rights to access, correct,
          export, restrict, object to processing, or delete certain personal data,
          subject to exceptions. Affiliate programs and storefronts operate under
          their own policies once you navigate away.
        </p>

        <h2>Children</h2>
        <p>
          Verdict does not knowingly collect personal information from children
          under 13 where U.S. Children’s Online Privacy Protection Act rules apply,
          or under higher age thresholds where local law mandates. If you believe a
          child provided data, notify the Site operator so records can be removed.
        </p>

        <h2>International transfers</h2>

        <p>
          Servers for your hosting provider, PostHog, and Sentry may be located outside
          your country. Providers may rely on contractual safeguards acceptable
          under applicable regulations.
        </p>

        <h2>Changes</h2>
        <p>
          We may update this policy as the Site evolves. Continuing to read after we
          post an updated revision with a new effective date signifies your
          awareness of substantive changes consistent with jurisdictional norms.
        </p>

        <h2>Contact</h2>
        <p>
          For privacy questions or requests exercising legal rights, contact the
          legally designated operator administering this Verdict deployment.
          Operational contact surfaces (email, ticket system, postal address where
          required) belong to your organization and should be published where end
          users expect regulatory correspondence.
        </p>
      </article>
    </PublicShell>
  );
}
