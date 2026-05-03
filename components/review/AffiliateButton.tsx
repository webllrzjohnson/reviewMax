"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { withAmazonAffiliateTag } from "@/lib/utils";

const trackingId = process.env.NEXT_PUBLIC_AMAZON_TRACKING_ID;

export function AffiliateButton({
  href_raw,
  label = "Buy on Amazon",
  postSlug,
}: {
  href_raw: string;
  label?: string;
  postSlug?: string;
}) {
  const href = withAmazonAffiliateTag(href_raw, trackingId);

  function onClick() {
    if (typeof window !== "undefined" && process.env.NEXT_PUBLIC_POSTHOG_KEY) {
      posthog.capture("affiliate_click", {
        slug: postSlug,
        destination: "amazon",
      });
    }
  }

  return (
    <Button variant="amazon" size="lg" className="w-full sm:w-auto" asChild>
      <Link
        href={href}
        target="_blank"
        rel="nofollow sponsored noopener noreferrer"
        onClick={onClick}
      >
        {label}
        <ExternalLink className="ml-2 h-4 w-4" />
      </Link>
    </Button>
  );
}
