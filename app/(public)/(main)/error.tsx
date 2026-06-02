"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function MainBrowseError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="mx-auto flex max-w-lg flex-col items-center gap-4 rounded-2xl border bg-card p-8 text-center">
      <p className="text-sm font-semibold uppercase text-muted-foreground">
        Something went wrong
      </p>
      <h1 className="font-heading text-2xl font-bold">Could not load this page</h1>
      <p className="text-muted-foreground">
        An unexpected error occurred. You can try again or return to browsing
        reviews.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        <Button type="button" onClick={reset}>
          Try again
        </Button>
        <Button variant="outline" asChild>
          <Link href="/blog">Browse reviews</Link>
        </Button>
      </div>
    </div>
  );
}
