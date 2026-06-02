import { NextResponse } from "next/server";
import { getPostsByCategoryId } from "@/lib/data";

export async function GET(request: Request) {
  const categoryId = new URL(request.url).searchParams.get("categoryId")?.trim();
  if (!categoryId) {
    return NextResponse.json(
      { error: "categoryId is required" },
      { status: 400 },
    );
  }

  const posts = await getPostsByCategoryId(categoryId);
  return NextResponse.json(
    posts.map((post) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
    })),
    {
      headers: {
        "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
      },
    },
  );
}
