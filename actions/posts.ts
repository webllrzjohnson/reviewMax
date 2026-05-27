"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { posts } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";

export type PostActionState = { ok: boolean; message?: string };

export async function setPostPublished(
  id: string,
  is_published: boolean,
): Promise<PostActionState> {
  try {
    await requireAdmin();

    const [post] = await db
      .select({ publishedAt: posts.publishedAt })
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
      })
      .where(eq(posts.id, id));

    revalidatePath("/dashboard/posts");
    revalidatePath("/dashboard");
    revalidatePath("/blog");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    console.warn(e);
    return { ok: false, message: "Something went wrong." };
  }
}

export async function deletePost(id: string): Promise<PostActionState> {
  try {
    await requireAdmin();

    await db.delete(posts).where(eq(posts.id, id));

    revalidatePath("/dashboard/posts");
    revalidatePath("/dashboard");
    revalidatePath("/blog");
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    console.warn(e);
    return { ok: false, message: "Something went wrong." };
  }
}
