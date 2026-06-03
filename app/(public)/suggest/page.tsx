import type { Metadata } from "next";
import Link from "next/link";
import { Lightbulb } from "lucide-react";
import { PublicShell } from "@/components/layout/PublicShell";
import { SuggestForm } from "@/components/common/SuggestForm";
import { getCategoriesWithPublishedPosts } from "@/lib/data";
import { siteUrl } from "@/lib/utils";

const path = "/suggest";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${siteUrl()}${path}`;
  const title = "Suggest a Review — Verdict";
  const description =
    "Have a product you'd like us to review? Submit it here and we'll add it to our research queue.";
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export const revalidate = 3600;

export default async function SuggestPage() {
  const categories = await getCategoriesWithPublishedPosts();

  return (
    <PublicShell>
      <div className="mx-auto max-w-xl space-y-8">
        <header className="space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Lightbulb className="h-5 w-5" aria-hidden />
            <p className="text-sm font-semibold uppercase tracking-wide">
              Suggest a review
            </p>
          </div>
          <h1 className="font-heading text-3xl font-bold tracking-tight">
            What should we review next?
          </h1>
          <p className="text-muted-foreground">
            We read every suggestion. If a product fits our coverage and has
            sufficient Amazon data, we&apos;ll add it to the research queue.
            Submissions don&apos;t guarantee a positive review—every verdict is
            independent.
          </p>
        </header>

        <div className="rounded-xl border bg-card p-6 shadow-sm">
          <SuggestForm categories={categories} />
        </div>

        <p className="text-center text-sm text-muted-foreground">
          Spotted an error in an existing review?{" "}
          <Link href="/contact" className="font-medium text-primary hover:underline">
            Contact us
          </Link>{" "}
          instead.
        </p>
      </div>
    </PublicShell>
  );
}
