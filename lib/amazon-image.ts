const ASIN_PATTERNS = [
  /\/dp\/([A-Z0-9]{10})/i,
  /\/gp\/product\/([A-Z0-9]{10})/i,
  /\/product\/([A-Z0-9]{10})/i,
  /[?&]asin=([A-Z0-9]{10})/i,
];

const AMAZON_IMAGE_HOST =
  /^https:\/\/(?:m\.media-amazon\.com|images(?:-na)?\.ssl-images-amazon\.com)\//i;

const SHORT_LINK_HOST =
  /^(?:https?:\/\/)?(?:a\.co|amzn\.to|amzn\.com|amzn\.asia|amzn\.eu)\//i;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
  "Accept-Encoding": "gzip, deflate, br",
  "Cache-Control": "no-cache",
  Pragma: "no-cache",
  "Sec-Fetch-Dest": "document",
  "Sec-Fetch-Mode": "navigate",
  "Sec-Fetch-Site": "none",
  "Upgrade-Insecure-Requests": "1",
};

/** Extract a 10-character ASIN from common Amazon product URLs. */
export function extractAsinFromAmazonUrl(url: string): string | null {
  for (const pattern of ASIN_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1].toUpperCase();
  }
  return null;
}

/**
 * Follows Amazon short links (a.co, amzn.to) and returns the final product URL.
 * If the URL already contains an ASIN, returns it unchanged (without query string).
 */
export async function expandAmazonProductUrl(url: string): Promise<string> {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  if (extractAsinFromAmazonUrl(trimmed)) {
    return trimmed.split("?")[0];
  }

  if (!SHORT_LINK_HOST.test(trimmed)) {
    return trimmed;
  }

  try {
    const response = await fetch(trimmed, {
      method: "GET",
      redirect: "follow",
      headers: BROWSER_HEADERS,
      signal: AbortSignal.timeout(15_000),
    });

    const finalUrl = response.url || trimmed;
    if (extractAsinFromAmazonUrl(finalUrl)) {
      return finalUrl.split("?")[0];
    }
  } catch {
    // keep original
  }

  return trimmed;
}

function normalizeAmazonImageUrl(raw: string): string | null {
  const decoded = raw
    .replace(/&amp;/g, "&")
    .replace(/\\u002F/g, "/")
    .replace(/\\\//g, "/")
    .trim();
  if (!decoded.startsWith("http")) return null;
  if (!AMAZON_IMAGE_HOST.test(decoded)) return null;
  // Strip query strings and resize suffixes to get the highest-res version
  const clean = decoded.replace(/\._[A-Z]{2}\d+_/, "._SL1500_");
  return clean;
}

function parseImageFromHtml(html: string): string | null {
  // 1. og:image meta tag
  const ogPatterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
    /<meta[^>]+property=["']og:image:secure_url["'][^>]+content=["']([^"']+)["']/i,
  ];
  for (const pattern of ogPatterns) {
    const match = html.match(pattern);
    const url = match?.[1] ? normalizeAmazonImageUrl(match[1]) : null;
    if (url) return url;
  }

  // 2. JavaScript image data — hiRes
  const hiRes = html.match(/"hiRes"\s*:\s*"(https:\/\/[^"]+)"/);
  if (hiRes?.[1]) {
    const url = normalizeAmazonImageUrl(hiRes[1]);
    if (url) return url;
  }

  // 3. JavaScript image data — large
  const large = html.match(/"large"\s*:\s*"(https:\/\/[^"]+)"/);
  if (large?.[1]) {
    const url = normalizeAmazonImageUrl(large[1]);
    if (url) return url;
  }

  // 4. colorImages or imageGalleryData blocks
  const colorImages = html.match(
    /"colorImages"[^}]*"large"\s*:\s*"(https:\/\/m\.media-amazon\.com\/images\/I\/[^"]+)"/,
  );
  if (colorImages?.[1]) {
    const url = normalizeAmazonImageUrl(colorImages[1]);
    if (url) return url;
  }

  // 5. data-old-hires attribute (common in product image tags)
  const oldHires = html.match(
    /data-old-hires=["'](https:\/\/m\.media-amazon\.com\/images\/I\/[^"']+)["']/i,
  );
  if (oldHires?.[1]) {
    const url = normalizeAmazonImageUrl(oldHires[1]);
    if (url) return url;
  }

  // 6. data-src or src on landingImage
  const landingImage = html.match(
    /id=["']landingImage["'][^>]+(?:data-old-hires|src)=["'](https:\/\/m\.media-amazon\.com\/images\/I\/[^"']+)["']/i,
  );
  if (landingImage?.[1]) {
    const url = normalizeAmazonImageUrl(landingImage[1]);
    if (url) return url;
  }

  // 7. Any m.media-amazon.com image URL — prefer larger ones
  const allMedia = [
    ...html.matchAll(
      /https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+._%-]+\.(?:jpg|jpeg|png|webp)/gi,
    ),
  ].map((m) => m[0]);

  // Filter out small/thumbnail images (those with dimension markers like _SX38_ or _US40_)
  const fullSize = allMedia.filter(
    (u) => !/\._(?:SS|SX|SY|US|SR|CR|AC)\d{1,3}_/.test(u),
  );
  const candidate = fullSize[0] ?? allMedia[0];
  if (candidate) {
    const url = normalizeAmazonImageUrl(candidate);
    if (url) return url;
  }

  return null;
}

/** CDN patterns to try as fallback when page scraping fails. */
function legacyImageCandidates(asin: string): string[] {
  return [
    // Modern product image path
    `https://m.media-amazon.com/images/P/${asin}.01._SL1500_.jpg`,
    `https://m.media-amazon.com/images/P/${asin}.01.LZZZZZZZ.jpg`,
    // Legacy CDN
    `https://images-na.ssl-images-amazon.com/images/P/${asin}.01._SL1500_.jpg`,
    `https://images-na.ssl-images-amazon.com/images/P/${asin}.01.L.jpg`,
  ];
}

async function bestReachableImageUrl(urls: string[]): Promise<string | null> {
  let best: { url: string; length: number } | null = null;

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        method: "HEAD",
        redirect: "follow",
        signal: AbortSignal.timeout(8_000),
      });
      const type = response.headers.get("content-type") ?? "";
      const length = Number(response.headers.get("content-length") ?? "0");
      if (
        !response.ok ||
        !type.startsWith("image/") ||
        (length > 0 && length <= 500)
      ) {
        continue;
      }
      const score = length > 0 ? length : 1;
      if (!best || score > best.length) {
        best = { url, length: score };
      }
    } catch {
      continue;
    }
  }

  return best?.url ?? null;
}

async function fetchAmazonPage(productUrl: string): Promise<string | null> {
  const urls = [
    productUrl,
    // If the URL is .ca or .co.uk etc., also try .com
    productUrl.replace(/amazon\.[a-z.]+\/dp\//, "amazon.com/dp/"),
  ].filter((u, i, arr) => arr.indexOf(u) === i); // deduplicate

  for (const url of urls) {
    try {
      const response = await fetch(url, {
        headers: BROWSER_HEADERS,
        redirect: "follow",
        signal: AbortSignal.timeout(15_000),
        cache: "no-store",
      });

      if (!response.ok) continue;

      const html = await response.text();
      // If Amazon returned a CAPTCHA/robot check page, skip it
      if (
        html.includes("Type the characters you see in this image") ||
        html.includes("Enter the characters you see below") ||
        html.includes("api-services-support@amazon.com") && html.length < 5000
      ) {
        continue;
      }

      return html;
    } catch {
      continue;
    }
  }

  return null;
}

/**
 * Resolves a product hero image from an Amazon URL: page scrape first, then ASIN CDN fallbacks.
 */
export async function resolveAmazonProductImageUrl(
  amazonUrl: string,
): Promise<string | null> {
  const expanded = await expandAmazonProductUrl(amazonUrl);
  const asin = extractAsinFromAmazonUrl(expanded);
  if (!asin) return null;

  const productUrl = expanded.includes("/dp/")
    ? expanded.split("?")[0]
    : `https://www.amazon.com/dp/${asin}`;

  const html = await fetchAmazonPage(productUrl);
  if (html) {
    const fromPage = parseImageFromHtml(html);
    if (fromPage) return fromPage;
  }

  // Fall back to known CDN URL patterns
  return bestReachableImageUrl(legacyImageCandidates(asin));
}
