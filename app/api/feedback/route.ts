import { NextResponse } from "next/server";
import { z } from "zod";
import { and, count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { reviewFeedback } from "@/lib/db/schema";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug")?.trim();
  if (!slug) {
    return NextResponse.json({ error: "slug is required" }, { status: 400 });
  }

  try {
    const [helpfulRow] = await db
      .select({ total: count() })
      .from(reviewFeedback)
      .where(and(eq(reviewFeedback.postSlug, slug), eq(reviewFeedback.helpful, true)));

    const [unhelpfulRow] = await db
      .select({ total: count() })
      .from(reviewFeedback)
      .where(and(eq(reviewFeedback.postSlug, slug), eq(reviewFeedback.helpful, false)));

    return NextResponse.json(
      {
        helpful: Number(helpfulRow?.total ?? 0),
        unhelpful: Number(unhelpfulRow?.total ?? 0),
      },
      { headers: { "Cache-Control": "no-store" } },
    );
  } catch {
    return NextResponse.json({ helpful: 0, unhelpful: 0 });
  }
}

const VoteSchema = z.object({
  slug: z.string().min(1).max(200),
  helpful: z.boolean(),
  fingerprint: z.string().min(1).max(64),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = VoteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const { slug, helpful, fingerprint } = parsed.data;

    await db
      .insert(reviewFeedback)
      .values({ postSlug: slug, helpful, fingerprint })
      .onConflictDoUpdate({
        target: [reviewFeedback.postSlug, reviewFeedback.fingerprint],
        set: { helpful },
      });

    const [helpfulRow] = await db
      .select({ total: count() })
      .from(reviewFeedback)
      .where(and(eq(reviewFeedback.postSlug, slug), eq(reviewFeedback.helpful, true)));

    const [unhelpfulRow] = await db
      .select({ total: count() })
      .from(reviewFeedback)
      .where(and(eq(reviewFeedback.postSlug, slug), eq(reviewFeedback.helpful, false)));

    return NextResponse.json({
      helpful: Number(helpfulRow?.total ?? 0),
      unhelpful: Number(unhelpfulRow?.total ?? 0),
    });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
