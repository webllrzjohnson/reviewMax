import type { Metadata } from "next";
import Link from "next/link";
import { PublicShell } from "@/components/layout/PublicShell";
import { contactEmail, siteUrl } from "@/lib/utils";

const path = "/contact";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${siteUrl()}${path}`;
  const title = "Contact Verdict";
  const description =
    "Get in touch with Verdict about review requests, corrections, business and affiliate inquiries, or privacy questions.";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const revalidate = 3600;

const TOPICS = [
  {
    heading: "Review requests",
    body: "Want us to review a specific product or category? Send the product name and a link, and we'll add it to our research queue.",
  },
  {
    heading: "Corrections",
    body: "Spotted an error in a review—an outdated spec, price, or broken link? Let us know the page and what needs fixing.",
  },
  {
    heading: "Business & affiliate",
    body: "Partnership, sponsorship, or affiliate program inquiries are welcome. Note that paid placement never changes our verdicts.",
  },
  {
    heading: "Privacy",
    body: "Questions about your data or our analytics? See our Privacy Policy, or email us and we'll respond.",
  },
];

export default function ContactPage() {
  const email = contactEmail();

  return (
    <PublicShell>
      <article className="prose prose-neutral dark:prose-invert max-w-none">
        <h1>Contact Verdict</h1>
        <p>
          We read every message. The fastest way to reach us is by email—use
          the address below and we&apos;ll get back to you as soon as we can.
        </p>

        <p>
          <a
            href={`mailto:${email}`}
            className="font-semibold no-underline hover:underline"
          >
            {email}
          </a>
        </p>

        <h2>What to reach out about</h2>
        <ul>
          {TOPICS.map((topic) => (
            <li key={topic.heading}>
              <strong>{topic.heading}:</strong> {topic.body}
            </li>
          ))}
        </ul>

        <p>
          Looking for how we work or how affiliate links fund the site? Read{" "}
          <Link href="/about">About Verdict</Link> and our{" "}
          <Link href="/affiliate-disclosure">affiliate disclosure</Link>.
        </p>
      </article>
    </PublicShell>
  );
}
