/** Client-safe image URL helpers (no Node fetch). */

const AMAZON_IMAGE_HOST =
  /^https:\/\/(?:m\.media-amazon\.com|images(?:-na)?\.ssl-images-amazon\.com)\//i;

const AMAZON_PAGE_HOST =
  /^(?:https?:\/\/)?(?:[a-z0-9-]+\.)*amazon\.|a\.co|amzn\.(?:to|com|asia|eu)/i;

const SHORT_LINK_HOST =
  /^(?:https?:\/\/)?(?:a\.co|amzn\.to|amzn\.com|amzn\.asia|amzn\.eu)\//i;

/** True when the URL is an Amazon product/listing page, not a direct image file. */
export function isAmazonProductPageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http")) return false;
  if (AMAZON_IMAGE_HOST.test(trimmed)) return false;
  if (SHORT_LINK_HOST.test(trimmed)) return true;
  if (!AMAZON_PAGE_HOST.test(trimmed)) return false;
  return (
    /\/dp\//i.test(trimmed) ||
    /\/gp\/product\//i.test(trimmed) ||
    /[?&]asin=/i.test(trimmed)
  );
}

/** True when the URL points at a real image asset (not an HTML product page). */
export function isDirectImageUrl(url: string): boolean {
  const trimmed = url.trim();
  if (!trimmed.startsWith("http")) return false;
  if (isAmazonProductPageUrl(trimmed)) return false;

  if (AMAZON_IMAGE_HOST.test(trimmed)) {
    if (/\/images\/P\//i.test(trimmed)) return false;
    if (/\._[A-Za-z0-9]+_\._[A-Za-z0-9]+_\./.test(trimmed)) return false;
    return true;
  }

  try {
    const { pathname } = new URL(trimmed);
    return /\.(jpe?g|png|webp|gif|avif)$/i.test(pathname);
  } catch {
    return false;
  }
}

/**
 * Normalizes a stored image URL from forms/webhooks.
 * Returns null for empty values, Amazon product pages, and invalid URLs.
 */
export function coerceProductImageUrl(
  value: string | undefined | null,
): string | null {
  const trimmed = value?.trim();
  if (!trimmed) return null;
  return isDirectImageUrl(trimmed) ? trimmed : null;
}
