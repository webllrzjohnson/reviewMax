import { getCategoryBySlug, getPostsByCategorySlug } from "@/lib/data";
import { siteUrl } from "@/lib/utils";

export const revalidate = 3600;

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const { slug } = await params;
  const base = siteUrl();

  const [category, posts] = await Promise.all([
    getCategoryBySlug(slug),
    getPostsByCategorySlug(slug),
  ]);

  if (!category) {
    return new Response("Category not found", { status: 404 });
  }

  const publishedPosts = posts
    .filter((p) => p.is_published)
    .slice(0, 50);

  const items = publishedPosts
    .map((post) => {
      const url = `${base}/blog/${post.slug}`;
      const pubDate = post.published_at
        ? new Date(post.published_at).toUTCString()
        : new Date().toUTCString();
      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${pubDate}</pubDate>
      <description>${escapeXml(post.excerpt ?? "")}</description>
      <category>${escapeXml(category.name)}</category>
    </item>`;
    })
    .join("\n");

  const feedUrl = `${base}/category/${slug}/feed.xml`;
  const categoryUrl = `${base}/category/${slug}`;
  const title = `${category.name} Reviews — Verdict`;
  const description =
    category.description ??
    `Product reviews in the ${category.name} category from Verdict.`;

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <link>${escapeXml(categoryUrl)}</link>
    <description>${escapeXml(description)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${escapeXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  });
}
