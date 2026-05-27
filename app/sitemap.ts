import type { MetadataRoute } from "next";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories, posts } from "@/lib/db/schema";
import { siteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${base}/blog`, changeFrequency: "daily", priority: 0.9 },
    { url: `${base}/about`, changeFrequency: "yearly", priority: 0.4 },
    {
      url: `${base}/affiliate-disclosure`,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    { url: `${base}/privacy-policy`, changeFrequency: "yearly", priority: 0.3 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.3 },
  ];

  if (!process.env.DATABASE_URL) {
    return staticRoutes;
  }

  try {
    const [publishedPosts, categoryRows] = await Promise.all([
      db
        .select({
          slug: posts.slug,
          publishedAt: posts.publishedAt,
          updatedAt: posts.updatedAt,
        })
        .from(posts)
        .where(eq(posts.isPublished, true)),
      db
        .select({
          slug: categories.slug,
          createdAt: categories.createdAt,
        })
        .from(categories),
    ]);

    const postRoutes =
      publishedPosts.map((post) => ({
        url: `${base}/blog/${post.slug}`,
        lastModified: new Date(post.updatedAt ?? post.publishedAt ?? Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.8,
      })) ?? [];

    const categoryRoutes =
      categoryRows.map((category) => ({
        url: `${base}/category/${category.slug}`,
        lastModified: new Date(category.createdAt ?? Date.now()),
        changeFrequency: "weekly" as const,
        priority: 0.65,
      })) ?? [];

    return [...staticRoutes, ...categoryRoutes, ...postRoutes];
  } catch (error) {
    console.warn("sitemap database read failed", error);
    return staticRoutes;
  }
}
