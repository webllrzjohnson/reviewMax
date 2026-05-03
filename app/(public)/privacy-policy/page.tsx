import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy policy",
  description:
    "What data ReviewMax collects, how newsletters and analytics work, and your choices.",
};

export default function PrivacyPolicyPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>Privacy policy</h1>
      <p className="lead">
        Last updated: May 3, 2026. This policy describes how ReviewMax
        (&quot;we&quot;, &quot;us&quot;) handles information when you use our
        website.
      </p>
      <h2>Information we collect</h2>
      <ul>
        <li>
          <strong>Newsletter:</strong> If you subscribe, we store your email
          address in Supabase to send occasional updates. We do not sell your
          email.
        </li>
        <li>
          <strong>Analytics:</strong> With your cookie consent, we may use
          PostHog to understand page views and affiliate button clicks in
          aggregate.
        </li>
        <li>
          <strong>Auth (admins):</strong> Admin accounts use Supabase
          authentication. Access to the dashboard requires the{" "}
          <code>admin</code> role on your profile.
        </li>
      </ul>
      <h2>Cookies</h2>
      <p>
        We use a small cookie/localStorage flag to remember your cookie consent
        choice. Optional analytics cookies are only initialized after you accept.
      </p>
      <h2>Third parties</h2>
      <p>
        We rely on Vercel for hosting, Supabase for data storage, PostHog for
        optional analytics, and Sentry for error monitoring. Those vendors
        process data under their own terms.
      </p>
      <h2>Contact</h2>
      <p>
        For privacy questions, contact the site operator at the support address
        listed on your deployment (replace this sentence with your real
        contact).
      </p>
    </article>
  );
}
