"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import {
  expandAmazonProductUrl,
  resolveAmazonProductImageUrl,
} from "@/lib/amazon-image";
import { PostEditorSchema, type PostEditorInput } from "@/lib/validations";

export type PostActionState = { ok: boolean; message?: string; id?: string };

function parseLines(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function parseUrlLines(value: string | undefined): string[] {
  if (!value?.trim()) return [];
  return parseLines(value).filter((line) => {
    try {
      new URL(line);
      return true;
    } catch {
      return false;
    }
  });
}

function normalizeImageUrl(value: string | undefined): string | null {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

async function preparePostValues(input: PostEditorInput) {
  const amazonUrl = await expandAmazonProductUrl(input.amazon_url);
  let imageUrl = normalizeImageUrl(input.image_url);
  if (!imageUrl) {
    imageUrl = await resolveAmazonProductImageUrl(amazonUrl);
  }

  const pros = parseLines(input.pros);
  const cons = parseLines(input.cons);
  if (pros.length === 0 || cons.length === 0) {
    throw new Error("At least one pro and one con are required.");
  }

  const now = new Date().toISOString();
  const isPublished = Boolean(input.is_published);

  return {
    title: input.title.trim(),
    slug: input.slug.trim(),
    excerpt: input.excerpt.trim(),
    body: input.body.trim(),
    categoryId: input.category_id,
    rating: input.rating.toString(),
    pros,
    cons,
    verdict: input.verdict.trim(),
    amazonUrl,
    imageUrl,
    galleryUrls: parseUrlLines(input.gallery_urls),
    isPublished,
    publishedAt: isPublished ? now : null,
    updatedAt: now,
  };
}

function revalidatePostPaths(slug?: string) {
  revalidatePath("/dashboard/posts");
  revalidatePath("/dashboard");
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) {
    revalidatePath(`/blog/${slug}`);
  }
}

export async function retryPostImage(id: string): Promise<PostActionState> {
  try {
    await requireAdmin();

    const [post] = await db
      .select({ slug: posts.slug, amazonUrl: posts.amazonUrl })
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) return { ok: false, message: "Post not found." };

    const imageUrl = await resolveAmazonProductImageUrl(post.amazonUrl);
    if (!imageUrl) {
      return {
        ok: false,
        message:
          "Could not resolve an image from Amazon. Paste the image URL manually in the post editor.",
      };
    }

    await db
      .update(posts)
      .set({ imageUrl, updatedAt: new Date().toISOString() })
      .where(eq(posts.id, id));

    revalidatePostPaths(post.slug);
    return { ok: true, message: "Image updated." };
  } catch (e) {
    console.warn(e);
    const message =
      e instanceof Error && e.message === "Unauthorized"
        ? "Your session expired. Sign in again."
        : "Something went wrong.";
    return { ok: false, message };
  }
}

export async function setPostPublished(
  id: string,
  is_published: boolean,
): Promise<PostActionState> {
  try {
    await requireAdmin();

    const [post] = await db
      .select({ publishedAt: posts.publishedAt, slug: posts.slug })
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!post) {
      return { ok: false, message: "Post not found." };
    }

    await db
      .update(posts)
      .set({
        isPublished: is_published,
        publishedAt:
          is_published && !post.publishedAt
            ? new Date().toISOString()
            : post.publishedAt,
        updatedAt: new Date().toISOString(),
      })
      .where(eq(posts.id, id));

    revalidatePostPaths(post.slug);
    return { ok: true };
  } catch (e) {
    console.warn(e);
    const message =
      e instanceof Error && e.message === "Unauthorized"
        ? "Your session expired. Sign in again."
        : "Something went wrong.";
    return { ok: false, message };
  }
}

export async function deletePost(id: string): Promise<PostActionState> {
  try {
    await requireAdmin();

    const [post] = await db
      .select({ slug: posts.slug })
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    await db.delete(posts).where(eq(posts.id, id));

    revalidatePostPaths(post?.slug);
    return { ok: true };
  } catch (e) {
    console.warn(e);
    const message =
      e instanceof Error && e.message === "Unauthorized"
        ? "Your session expired. Sign in again."
        : "Something went wrong.";
    return { ok: false, message };
  }
}

export async function createPost(
  input: PostEditorInput,
): Promise<PostActionState> {
  const parsed = PostEditorSchema.safeParse(input);
  if (!parsed.success) {
    const first =
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
      "Check your inputs.";
    return { ok: false, message: first };
  }

  try {
    await requireAdmin();
    const values = await preparePostValues(parsed.data);

    const [inserted] = await db
      .insert(posts)
      .values({
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        body: values.body,
        categoryId: values.categoryId,
        rating: values.rating,
        pros: values.pros,
        cons: values.cons,
        verdict: values.verdict,
        amazonUrl: values.amazonUrl,
        imageUrl: values.imageUrl,
        galleryUrls: values.galleryUrls,
        isPublished: values.isPublished,
        publishedAt: values.publishedAt,
        updatedAt: values.updatedAt,
      })
      .returning({ id: posts.id });

    revalidatePostPaths(values.slug);
    return { ok: true, id: inserted?.id, message: "Post created." };
  } catch (e) {
    console.warn(e);
    const code =
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      typeof e.code === "string"
        ? e.code
        : undefined;
    if (code === "23505") {
      return { ok: false, message: "A post with this slug already exists." };
    }
    const message =
      e instanceof Error && e.message === "Unauthorized"
        ? "Your session expired. Sign in again."
        : e instanceof Error
          ? e.message
          : "Something went wrong.";
    return { ok: false, message };
  }
}

export async function updatePost(
  id: string,
  input: PostEditorInput,
): Promise<PostActionState> {
  const parsed = PostEditorSchema.safeParse(input);
  if (!parsed.success) {
    const first =
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
      "Check your inputs.";
    return { ok: false, message: first };
  }

  try {
    await requireAdmin();

    const [existing] = await db
      .select({ publishedAt: posts.publishedAt, slug: posts.slug })
      .from(posts)
      .where(eq(posts.id, id))
      .limit(1);

    if (!existing) {
      return { ok: false, message: "Post not found." };
    }

    const values = await preparePostValues(parsed.data);
    const publishedAt =
      values.isPublished && !existing.publishedAt
        ? new Date().toISOString()
        : values.isPublished
          ? existing.publishedAt
          : null;

    await db
      .update(posts)
      .set({
        title: values.title,
        slug: values.slug,
        excerpt: values.excerpt,
        body: values.body,
        categoryId: values.categoryId,
        rating: values.rating,
        pros: values.pros,
        cons: values.cons,
        verdict: values.verdict,
        amazonUrl: values.amazonUrl,
        imageUrl: values.imageUrl,
        galleryUrls: values.galleryUrls,
        isPublished: values.isPublished,
        publishedAt,
        updatedAt: values.updatedAt,
      })
      .where(eq(posts.id, id));

    revalidatePostPaths(existing.slug);
    if (existing.slug !== values.slug) {
      revalidatePostPaths(values.slug);
    }

    return { ok: true, id, message: "Post saved." };
  } catch (e) {
    console.warn(e);
    const code =
      typeof e === "object" &&
      e !== null &&
      "code" in e &&
      typeof e.code === "string"
        ? e.code
        : undefined;
    if (code === "23505") {
      return { ok: false, message: "A post with this slug already exists." };
    }
    const message =
      e instanceof Error && e.message === "Unauthorized"
        ? "Your session expired. Sign in again."
        : e instanceof Error
          ? e.message
          : "Something went wrong.";
    return { ok: false, message };
  }
}
