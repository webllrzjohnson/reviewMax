import { revalidatePath } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { createServiceRoleClient } from "@/lib/supabase/admin";
import { WebhookPayloadSchema } from "@/lib/validations";

export async function POST(request: NextRequest) {
  const headerSecret = request.headers.get("x-webhook-secret");
  const expected = process.env.WEBHOOK_SECRET;

  if (!expected || headerSecret !== expected) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const parsed = WebhookPayloadSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const payload = parsed.data;

  try {
    const supabase = createServiceRoleClient();

    const { data: category, error: catError } = await supabase
      .from("categories")
      .select("id, slug")
      .eq("slug", payload.category_slug)
      .single();

    if (catError || !category) {
      return NextResponse.json(
        { error: `Unknown category_slug: ${payload.category_slug}` },
        { status: 400 },
      );
    }

    const published_at = payload.published_at ?? new Date().toISOString();

    const { error: insertError } = await supabase.from("posts").insert({
      title: payload.title,
      slug: payload.slug,
      excerpt: payload.excerpt,
      body: payload.body,
      category_id: category.id,
      rating: payload.rating,
      pros: payload.pros,
      cons: payload.cons,
      verdict: payload.verdict,
      amazon_url: payload.amazon_url,
      image_url: payload.image_url ?? null,
      is_published: payload.is_published ?? true,
      published_at,
    });

    if (insertError) {
      if (insertError.code === "23505") {
        return NextResponse.json(
          { error: "A post with this slug already exists" },
          { status: 400 },
        );
      }
      console.error("webhook insert", insertError);
      return NextResponse.json(
        { error: "Database error", code: insertError.code },
        { status: 500 },
      );
    }

    revalidatePath("/");
    revalidatePath("/blog");
    revalidatePath(`/blog/${payload.slug}`);
    revalidatePath(`/category/${category.slug}`);

    return NextResponse.json({ ok: true, slug: payload.slug });
  } catch (e) {
    console.error("webhook", e);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}
