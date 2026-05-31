const ASIN_PATTERNS = [
  /\/dp\/([A-Z0-9]{10})/i,
  /\/gp\/product\/([A-Z0-9]{10})/i,
  /\/product\/([A-Z0-9]{10})/i,
  /[?&]asin=([A-Z0-9]{10})/i,
];

const AMAZON_IMAGE_HOST = /^https:\/\/(?:m\.media-amazon\.com|images(?:-na)?\.ssl-images-amazon\.com)\//i;

/** Extract a 10-character ASIN from common Amazon product URLs. */
export function extractAsinFromAmazonUrl(url: string): string | null {
  for (const pattern of ASIN_PATTERNS) {
    const match = url.match(pattern);
    if (match?.[1]) return match[1].toUpperCase();
  }
  return null;
}

function normalizeAmazonImageUrl(raw: string): string | null {
  const decoded = raw
    .replace(/&amp;/g, "&")
    .replace(/\\u002F/g, "/")
    .trim();
  if (!decoded.startsWith("http")) return null;
  if (!AMAZON_IMAGE_HOST.test(decoded)) return null;
  return decoded;
}

function parseImageFromHtml(html: string): string | null {
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

  const hiRes = html.match(/"hiRes"\s*:\s*"(https:\/\/[^"]+)"/);
  if (hiRes?.[1]) {
    const url = normalizeAmazonImageUrl(hiRes[1]);
    if (url) return url;
  }

  const large = html.match(/"large"\s*:\s*"(https:\/\/[^"]+)"/);
  if (large?.[1]) {
    const url = normalizeAmazonImageUrl(large[1]);
    if (url) return url;
  }

  const media = html.match(
    /(https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+._%-]+\.(?:jpg|jpeg|png|webp))/i,
  );
  if (media?.[1]) return normalizeAmazonImageUrl(media[1]);

  return null;
}

function legacyImageCandidates(asin: string): string[] {
  return [
    `https://m.media-amazon.com/images/P/${asin}.01._SL1500_.jpg`,
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

/**
 * Resolves a product hero image from an Amazon URL: page scrape first, then ASIN CDN fallbacks.
 */
export async function resolveAmazonProductImageUrl(
  amazonUrl: string,
): Promise<string | null> {
  const asin = extractAsinFromAmazonUrl(amazonUrl);
  if (!asin) return null;

  const productUrl = amazonUrl.includes("/dp/")
    ? amazonUrl.split("?")[0]
    : `https://www.amazon.com/dp/${asin}`;

  try {
    const response = await fetch(productUrl, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36",
        Accept:
          "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
        "Accept-Language": "en-US,en;q=0.9",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(15_000),
      cache: "no-store",
    });

    if (response.ok) {
      const html = await response.text();
      const fromPage = parseImageFromHtml(html);
      if (fromPage) return fromPage;
    }
  } catch {
    // fall through to CDN pattern
  }

  return bestReachableImageUrl(legacyImageCandidates(asin));
}
