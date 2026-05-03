import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata: Metadata = {
  title: "About ReviewMax",
  description:
    "How we use AI and editorial standards to ship trustworthy affiliate reviews.",
};

export default function AboutPage() {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <h1>About ReviewMax</h1>
      <p>
        ReviewMax publishes buying guides and product reviews aimed at busy
        readers who want a clear recommendation—not a wall of specs. Topics
        are proposed by our admin team, then researched and drafted with Claude
        in an automated pipeline, reviewed for structure, and published to this
        site without a manual copy/paste step.
      </p>
      <p>
        We earn commissions through Amazon Associates when you purchase using
        our links. That does not change our verdict format: every review still
        includes pros, cons, and an explicit recommendation.
      </p>
      <Button asChild variant="outline">
        <Link href="/affiliate-disclosure">Read affiliate disclosure</Link>
      </Button>
    </article>
  );
}
