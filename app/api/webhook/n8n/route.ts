import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
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

    let supabase;
    try {
      supabase = createServiceRoleClient();
    } catch (e) {
      console.error("webhook: Supabase service client", e);
      return json(
        { success: false, error: "Database configuration error" },
        500,
      );
    }

    const published_at = new Date().toISOString();

    const row = {
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      body: payload.body,
      category_id: payload.category_id,
      rating: payload.rating,
      pros: payload.pros,
      cons: payload.cons,
      verdict: payload.verdict,
      amazon_url: payload.amazon_url,
      image_url: payload.image_url ?? null,
      is_published: true,
      published_at,
    };

    const { data, error: insertError } = await supabase
      .from("posts")
      .insert(row)
      .select("id")
      .single();

    if (insertError || !data) {
      const code = insertError?.code;
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
      console.error("webhook: insert error", insertError);
      return json(
        {
          success: false,
          error: "Database error",
          code: code ?? undefined,
          message: insertError?.message,
        },
        500,
      );
    }

    revalidatePath("/");
    revalidatePath("/blog");

    return json({ success: true, id: data.id }, 200);
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
