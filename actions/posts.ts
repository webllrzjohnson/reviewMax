"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type PostActionState = { ok: boolean; message?: string };

export async function setPostPublished(
  id: string,
  is_published: boolean,
): Promise<PostActionState> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, message: "Not signed in." };
    }

    const { data: post } = await supabase
      .from("posts")
      .select("published_at")
      .eq("id", id)
      .single();

    const payload: {
      is_published: boolean;
      published_at?: string | null;
    } = { is_published };

    if (is_published && post && !post.published_at) {
      payload.published_at = new Date().toISOString();
    }

    const { error } = await supabase
      .from("posts")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.warn("setPostPublished", error);
      return { ok: false, message: "Could not update post." };
    }

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
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      return { ok: false, message: "Not signed in." };
    }

    const { error } = await supabase.from("posts").delete().eq("id", id);

    if (error) {
      console.warn("deletePost", error);
      return { ok: false, message: "Could not delete post." };
    }

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
