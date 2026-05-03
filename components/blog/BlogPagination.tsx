"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";

export function BlogPagination({
  page,
  pageSize,
  total,
}: {
  page: number;
  pageSize: number;
  total: number;
}) {
  const searchParams = useSearchParams();
  const pages = Math.max(1, Math.ceil(total / pageSize));

  function hrefFor(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    if (p <= 1) params.delete("page");
    else params.set("page", String(p));
    const qs = params.toString();
    return qs ? `/blog?${qs}` : "/blog";
  }

  if (pages <= 1) return null;

  return (
    <div className="mt-10 flex items-center justify-center gap-2">
      {page <= 1 ? (
        <Button variant="outline" size="sm" disabled>
          Previous
        </Button>
      ) : (
        <Button variant="outline" size="sm" asChild>
          <Link href={hrefFor(page - 1)}>Previous</Link>
        </Button>
      )}
      <span className="text-sm text-muted-foreground">
        Page {page} of {pages}
      </span>
      {page >= pages ? (
        <Button variant="outline" size="sm" disabled>
          Next
        </Button>
      ) : (
        <Button variant="outline" size="sm" asChild>
          <Link href={hrefFor(page + 1)}>Next</Link>
        </Button>
      )}
    </div>
  );
}
