const ASIN_PATTERNS = [
  /\/dp\/([A-Z0-9]{10})/i,
  /\/gp\/product\/([A-Z0-9]{10})/i,
  /\/product\/([A-Z0-9]{10})/i,
  /[?&]asin=([A-Z0-9]{10})/i,
];

export {
  coerceProductImageUrl,
  isAmazonProductPageUrl,
  isDirectImageUrl,
} from "@/lib/image-url";

const AMAZON_IMAGE_HOST =
  /^https:\/\/(?:m\.media-amazon\.com|images(?:-na)?\.ssl-images-amazon\.com)\//i;

const SHORT_LINK_HOST =
  /^(?:https?:\/\/)?(?:a\.co|amzn\.to|amzn\.com|amzn\.asia|amzn\.eu)\//i;

/** Amazon returns a 1×1 tracking GIF for invalid /P/{ASIN} paths. */
const MIN_IMAGE_BYTES = 2_000;

const BROWSER_HEADERS = {
  "User-Agent":
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36",
  Accept:
    "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
  "Accept-Language": "en-US,en;q=0.9",
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

function decodeAmazonUrl(raw: string): string {
  return raw
    .replace(/&amp;/g, "&")
    .replace(/\\u002F/g, "/")
    .replace(/\\\//g, "/")
    .trim();
}

function normalizeAmazonImageUrl(raw: string): string | null {
  const decoded = decodeAmazonUrl(raw);
  if (!decoded.startsWith("http")) return null;
  if (!AMAZON_IMAGE_HOST.test(decoded)) return null;
  if (/\/images\/P\//i.test(decoded)) return null;
  if (/\.(svg|gif)$/i.test(decoded)) return null;
  return upscaleAmazonImageUrl(decoded.split("?")[0]);
}

/** Collapse Amazon size suffixes to a single high-res variant. */


function upscaleAmazonImageUrl(url: string): string {
  const base = url.split("?")[0];
  const match = base.match(
    /^(https:\/\/.+\/images\/[A-Z]\/[A-Za-z0-9+\-]+)/i,
  );
  if (match) {
    return `${match[1]}._SL1500_.jpg`;
  }
  return base;
}

/*
function upscaleAmazonImageUrl(url: string): string {
  const base = url.split("?")[0];
  const match = base.match(
    /^(https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+._%-]+)(?:\._[A-Za-z0-9]+_)*\.(jpe?g|png|webp)$/i,
  );
  if (match) {
    return `${match[1]}._AC_SL1500_.${match[2]}`;
  }
  if (!/\._[A-Z0-9]+_\./i.test(base)) {
    return base.replace(/\.(jpe?g|png|webp)$/i, "._AC_SL1500_.$1");
  }
  return base.replace(/(\._[A-Za-z0-9]+_)+(?=\.[a-z]+$)/i, "._AC_SL1500_.");
}
*/
const THUMBNAIL_MARKER =
  /\._(?:SS|SX|SY|US|SR|CR|AC_US|AC_SY|AC_SX|SL\d{1,3})_\./i;

function collectAmazonImageCandidates(text: string): string[] {
  const found = new Set<string>();

  const push = (raw: string | undefined) => {
    const url = raw ? normalizeAmazonImageUrl(raw) : null;
    if (url) found.add(url);
  };

  const ogPatterns = [
    /<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i,
    /<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i,
  ];
  for (const pattern of ogPatterns) {
    push(text.match(pattern)?.[1]);
  }

  for (const match of text.matchAll(/"hiRes"\s*:\s*"(https:\/\/[^"]+)"/g)) {
    push(match[1]);
  }
  for (const match of text.matchAll(/"large"\s*:\s*"(https:\/\/[^"]+)"/g)) {
    push(match[1]);
  }
  for (const match of text.matchAll(
    /data-old-hires=["'](https:\/\/m\.media-amazon\.com\/images\/I\/[^"']+)["']/gi,
  )) {
    push(match[1]);
  }

  for (const match of text.matchAll(
    /https:\/\/m\.media-amazon\.com\/images\/I\/[A-Za-z0-9+._%-]+\.(?:jpg|jpeg|png|webp)/gi,
  )) {
    const raw = match[0];
    if (THUMBNAIL_MARKER.test(raw)) continue;
    push(raw);
  }

  return [...found];
}

/** GET the first bytes of a URL and confirm it is a real product photo (not a 1×1 GIF). */
async function measureImageBytes(url: string): Promise<number | null> {
  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        "User-Agent": BROWSER_HEADERS["User-Agent"],
        Range: "bytes=0-16383",
      },
      signal: AbortSignal.timeout(12_000),
    });

    if (!response.ok) return null;

    const type = response.headers.get("content-type") ?? "";
    if (!type.startsWith("image/")) return null;

    const buf = await response.arrayBuffer();
    const bytes = buf.byteLength;
    if (bytes < MIN_IMAGE_BYTES) return null;

    return bytes;
  } catch {
    return null;
  }
}

async function pickBestVerifiedImage(urls: string[]): Promise<string | null> {
  let best: { url: string; bytes: number } | null = null;

  for (const url of urls) {
    const bytes = await measureImageBytes(url);
    if (bytes === null) continue;
    if (!best || bytes > best.bytes) {
      best = { url, bytes };
    }
  }

  return best?.url ?? null;
}

async function fetchAmazonPage(productUrl: string): Promise<string | null> {
  const urls = [
    productUrl,
    productUrl.replace(/amazon\.[a-z.]+\/dp\//, "amazon.com/dp/"),
    productUrl.replace(/amazon\.[a-z.]+\/dp\//, "amazon.ca/dp/"),
  ].filter((u, i, arr) => arr.indexOf(u) === i);

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
      if (
        html.includes("Type the characters you see in this image") ||
        html.includes("Enter the characters you see below") ||
        (html.includes("api-services-support@amazon.com") &&
          html.length < 5000)
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

/** Jina Reader proxy — works when the app server IP is blocked by Amazon. */
async function fetchAmazonPageViaJina(productUrl: string): Promise<string | null> {
  try {
    const response = await fetch(
      `https://r.jina.ai/${encodeURIComponent(productUrl)}`,
      {
        headers: { Accept: "text/plain" },
        signal: AbortSignal.timeout(30_000),
      },
    );
    if (!response.ok) return null;
    return await response.text();
  } catch {
    return null;
  }
}

/**
 * Resolves a product hero image from an Amazon URL.
 * Tries direct page scrape, then Jina proxy, then verifies candidates are real JPEGs.
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

  const candidates: string[] = [];

  const html = await fetchAmazonPage(productUrl);
  if (html) {
    candidates.push(...collectAmazonImageCandidates(html));
  }

  if (candidates.length === 0) {
    const jina = await fetchAmazonPageViaJina(productUrl);
    if (jina) {
      const fromJina = collectAmazonImageCandidates(jina);
      candidates.push(...fromJina);
    }
  }

  if (candidates.length === 0) return null;

  return pickBestVerifiedImage(candidates);
}
