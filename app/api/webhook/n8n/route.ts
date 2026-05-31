import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { resolveAmazonProductImageUrl } from "@/lib/amazon-image";
import { WebhookPayloadSchema } from "@/lib/validations";

const HEADER_SECRET = "x-webhook-secret";

function json(body: unknown, status: number) {
  return NextResponse.json(body, { status });
}

export async function POST(request: NextRequest) {
  try {
    const expected = process.env.WEBHOOK_SECRET;
    const headerSecret = request.headers.get(HEADER_SECRET);
    if (!expected || !headerSecret || headerSecret !== expected) {
      return json({ success: false, error: "Unauthorized" }, 401);
    }

    let raw: unknown;
    try {
      raw = await request.json();
    } catch {
      return json({ success: false, error: "Invalid JSON body" }, 400);
    }

    const parsed = WebhookPayloadSchema.safeParse(raw);
    if (!parsed.success) {
      return json(
        {
          success: false,
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        400,
      );
    }

    const payload = parsed.data;

    let imageUrl = payload.image_url ?? null;
    if (!imageUrl) {
      imageUrl = await resolveAmazonProductImageUrl(payload.amazon_url);
    }

    const publishedAt = new Date().toISOString();

    try {
      const [inserted] = await db
        .insert(posts)
        .values({
          title: payload.title,
          slug: payload.slug,
          excerpt: payload.excerpt,
          body: payload.body,
          categoryId: payload.category_id,
          rating: payload.rating.toString(),
          pros: payload.pros,
          cons: payload.cons,
          verdict: payload.verdict,
          amazonUrl: payload.amazon_url,
          imageUrl,
          isPublished: true,
          publishedAt,
        })
        .returning({ id: posts.id });

      if (!inserted) {
        return json({ success: false, error: "Database error" }, 500);
      }

      revalidatePath("/");
      revalidatePath("/blog");

      return json({ success: true, id: inserted.id }, 200);
    } catch (error) {
      const code =
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        typeof error.code === "string"
          ? error.code
          : undefined;

      if (code === "23505") {
        return json(
          { success: false, error: "A post with this slug already exists" },
          400,
        );
      }
      if (code === "23503") {
        return json(
          { success: false, error: "Invalid category_id reference" },
          400,
        );
      }

      console.error("webhook: insert error", error);
      return json(
        {
          success: false,
          error: "Database error",
          code,
          message: error instanceof Error ? error.message : undefined,
        },
        500,
      );
    }
  } catch (e) {
    console.error("webhook: unexpected", e);
    return json(
      {
        success: false,
        error: "Internal server error",
        message: e instanceof Error ? e.message : undefined,
      },
      500,
    );
  }
}
