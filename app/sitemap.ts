import type { MetadataRoute } from "next";
import { createAnonymousClient } from "@/lib/supabase/anonymous";
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

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return staticRoutes;
  }

  const supabase = createAnonymousClient();

  const [postsRes, catRes] = await Promise.all([
    supabase
      .from("posts")
      .select("slug, published_at, updated_at")
      .eq("is_published", true),
    supabase.from("categories").select("slug, created_at"),
  ]);

  const posts =
    postsRes.data?.map((p) => ({
      url: `${base}/blog/${p.slug}`,
      lastModified: new Date(p.updated_at ?? p.published_at ?? Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })) ?? [];

  const categories =
    catRes.data?.map((c) => ({
      url: `${base}/category/${c.slug}`,
      lastModified: new Date(c.created_at ?? Date.now()),
      changeFrequency: "weekly" as const,
      priority: 0.65,
    })) ?? [];

  return [...staticRoutes, ...categories, ...posts];
}
