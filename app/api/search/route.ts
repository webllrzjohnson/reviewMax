import { NextResponse } from "next/server";
import { getPublishedPostsPage } from "@/lib/data";

export async function GET(request: Request) {
  const q = new URL(request.url).searchParams.get("q")?.trim() ?? "";

  if (q.length < 2) {
    return NextResponse.json([], {
      headers: { "Cache-Control": "no-store" },
    });
  }

  const { posts } = await getPublishedPostsPage({ q, pageSize: 8 });

  return NextResponse.json(
    posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt,
      rating: p.rating,
      category: p.category?.name ?? null,
    })),
    { headers: { "Cache-Control": "no-store" } },
  );
}
