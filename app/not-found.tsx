import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { siteUrl } from "@/lib/utils";

export async function generateMetadata(): Promise<Metadata> {
  const url = `${siteUrl()}/not-found`;
  return {
    title: "Page not found",
    description:
      "The page you requested is missing. Return to ReviewMax home or browse published reviews.",
    robots: { index: false, follow: true },
    alternates: { canonical: url },
  };
}

export default function NotFoundPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4 py-20">
      <p className="text-sm font-semibold uppercase text-muted-foreground">
        404
      </p>
      <h1 className="text-3xl font-bold">Page not found</h1>
      <p className="max-w-md text-center text-muted-foreground">
        The page you requested does not exist or was moved.
      </p>
      <Button asChild>
        <Link href="/">Back to home</Link>
      </Button>
    </div>
  );
}
