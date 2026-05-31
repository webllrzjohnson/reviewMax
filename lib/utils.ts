import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Appends Amazon Associates tracking ID to product URLs when missing.
 */
export function withAmazonAffiliateTag(
  productUrl: string,
  trackingId: string | undefined,
): string {
  if (!trackingId?.trim()) return productUrl;
  try {
    const u = new URL(productUrl);
    if (!u.hostname.includes("amazon.")) return productUrl;
    if (!u.searchParams.get("tag")) {
      u.searchParams.set("tag", trackingId.trim());
    }
    return u.toString();
  } catch {
    return productUrl;
  }
}

export function siteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
    "http://localhost:3000"
  );
}

export function slugifyTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 200);
}

export function formatDate(iso: string | null | undefined): string {
  if (!iso) return "";
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(iso));
}
