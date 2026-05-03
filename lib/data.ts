import { createClient } from "@/lib/supabase/server";
import type { Category, PostWithCategory } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("name", { ascending: true });
  if (error) {
    console.warn("getCategories", error);
    return [];
  }
  return data ?? [];
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .eq("slug", slug)
    .single();
  if (error) return null;
  return data;
}

/** Published posts with category, newest first. */
export async function getPublishedPosts(limit = 50): Promise<PostWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("is_published", true)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("getPublishedPosts", error);
    return [];
  }
  return (data as PostWithCategory[]) ?? [];
}

export async function getPostBySlug(
  slug: string,
): Promise<PostWithCategory | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();
  if (error) return null;
  return data as PostWithCategory;
}

export async function getPostsByCategorySlug(
  categorySlug: string,
): Promise<PostWithCategory[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("is_published", true)
    .eq("category_id", category.id)
    .order("published_at", { ascending: false });
  if (error) {
    console.warn("getPostsByCategorySlug", error);
    return [];
  }
  return (data as PostWithCategory[]) ?? [];
}

export async function getRelatedPosts(
  categoryId: string,
  excludeSlug: string,
  limit = 4,
): Promise<PostWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("is_published", true)
    .eq("category_id", categoryId)
    .neq("slug", excludeSlug)
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("getRelatedPosts", error);
    return [];
  }
  return (data as PostWithCategory[]) ?? [];
}

export async function getPopularPosts(limit = 5): Promise<PostWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .eq("is_published", true)
    .order("rating", { ascending: false, nullsFirst: false })
    .order("published_at", { ascending: false })
    .limit(limit);
  if (error) {
    console.warn("getPopularPosts", error);
    return [];
  }
  return (data as PostWithCategory[]) ?? [];
}

export type PostsPageResult = {
  posts: PostWithCategory[];
  total: number;
};

export async function getPublishedPostsPage(params: {
  page?: number;
  pageSize?: number;
  q?: string;
  categorySlug?: string;
}): Promise<PostsPageResult> {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(48, Math.max(1, params.pageSize ?? 12));
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const supabase = await createClient();
  let query = supabase
    .from("posts")
    .select("*, category:categories(*)", { count: "exact" })
    .eq("is_published", true);

  if (params.q?.trim()) {
    const safe = params.q.trim().replace(/[%_]/g, " ").slice(0, 80);
    if (safe.length > 0) {
      const term = `%${safe}%`;
      query = query.or(`title.ilike.${term},excerpt.ilike.${term}`);
    }
  }

  if (params.categorySlug) {
    const cat = await getCategoryBySlug(params.categorySlug);
    if (!cat) {
      return { posts: [], total: 0 };
    }
    query = query.eq("category_id", cat.id);
  }

  const { data, error, count } = await query
    .order("published_at", { ascending: false })
    .range(from, to);

  if (error) {
    console.warn("getPublishedPostsPage", error);
    return { posts: [], total: 0 };
  }

  return {
    posts: (data as PostWithCategory[]) ?? [],
    total: count ?? 0,
  };
}
