import {
  and,
  count,
  desc,
  eq,
  ilike,
  ne,
  sql,
} from "drizzle-orm";
import { db } from "@/lib/db";
import { mapCategory, mapPostWithCategory } from "@/lib/db/mappers";
import { categories, posts } from "@/lib/db/schema";
import type {
  Category,
  CategoryWithPostCount,
  PostWithCategory,
} from "@/types";

export type ComparePostsResult =
  | { ok: true; posts: [PostWithCategory, PostWithCategory] }
  | {
      ok: false;
      reason: "not_found" | "same_slug" | "different_category";
    };

export async function getCategories(): Promise<Category[]> {
  try {
    const rows = await db
      .select()
      .from(categories)
      .orderBy(categories.name);
    return rows.map(mapCategory);
  } catch (error) {
    console.warn("getCategories", error);
    return [];
  }
}

/** Categories that have at least one published post, with counts. */
export async function getCategoriesWithPublishedPosts(): Promise<
  CategoryWithPostCount[]
> {
  try {
    const rows = await db
      .select({
        category: categories,
        postCount: count(posts.id),
      })
      .from(categories)
      .innerJoin(
        posts,
        and(eq(posts.categoryId, categories.id), eq(posts.isPublished, true)),
      )
      .groupBy(categories.id)
      .orderBy(categories.name);

    return rows.map(({ category, postCount }) => ({
      ...mapCategory(category),
      post_count: Number(postCount),
    }));
  } catch (error) {
    console.warn("getCategoriesWithPublishedPosts", error);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | null> {
  try {
    const [row] = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    return row ? mapCategory(row) : null;
  } catch {
    return null;
  }
}

/** Published posts with category, newest first. */
export async function getPublishedPosts(
  limit = 50,
): Promise<PostWithCategory[]> {
  try {
    const rows = await db
      .select({
        post: posts,
        category: categories,
      })
      .from(posts)
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.isPublished, true))
      .orderBy(desc(posts.publishedAt))
      .limit(limit);

    return rows.map(({ post, category }) =>
      mapPostWithCategory({ ...post, category }),
    );
  } catch (error) {
    console.warn("getPublishedPosts", error);
    return [];
  }
}

export async function getPostBySlug(
  slug: string,
): Promise<PostWithCategory | null> {
  try {
    const [row] = await db
      .select({
        post: posts,
        category: categories,
      })
      .from(posts)
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(and(eq(posts.slug, slug), eq(posts.isPublished, true)))
      .limit(1);

    if (!row) return null;
    return mapPostWithCategory({ ...row.post, category: row.category });
  } catch {
    return null;
  }
}

export async function getPostsByCategorySlug(
  categorySlug: string,
): Promise<PostWithCategory[]> {
  const category = await getCategoryBySlug(categorySlug);
  if (!category) return [];

  try {
    const rows = await db
      .select({
        post: posts,
        category: categories,
      })
      .from(posts)
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(
        and(eq(posts.isPublished, true), eq(posts.categoryId, category.id)),
      )
      .orderBy(desc(posts.publishedAt));

    return rows.map(({ post, category: cat }) =>
      mapPostWithCategory({ ...post, category: cat }),
    );
  } catch (error) {
    console.warn("getPostsByCategorySlug", error);
    return [];
  }
}

export async function getPostsForComparison(
  slugA: string,
  slugB: string,
): Promise<ComparePostsResult> {
  const [a, b] = await Promise.all([
    getPostBySlug(slugA),
    getPostBySlug(slugB),
  ]);

  if (!a || !b) {
    return { ok: false, reason: "not_found" };
  }
  if (a.slug === b.slug) {
    return { ok: false, reason: "same_slug" };
  }
  if (a.category_id !== b.category_id) {
    return { ok: false, reason: "different_category" };
  }

  return { ok: true, posts: [a, b] };
}

export async function getRelatedPosts(
  categoryId: string,
  excludeSlug: string,
  limit = 3,
): Promise<PostWithCategory[]> {
  try {
    const rows = await db
      .select({
        post: posts,
        category: categories,
      })
      .from(posts)
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(
        and(
          eq(posts.isPublished, true),
          eq(posts.categoryId, categoryId),
          ne(posts.slug, excludeSlug),
        ),
      )
      .orderBy(desc(posts.publishedAt))
      .limit(limit);

    return rows.map(({ post, category }) =>
      mapPostWithCategory({ ...post, category }),
    );
  } catch (error) {
    console.warn("getRelatedPosts", error);
    return [];
  }
}

export async function getPopularPosts(
  limit = 5,
): Promise<PostWithCategory[]> {
  try {
    const rows = await db
      .select({
        post: posts,
        category: categories,
      })
      .from(posts)
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(eq(posts.isPublished, true))
      .orderBy(
        sql`${posts.rating} desc nulls last`,
        desc(posts.publishedAt),
      )
      .limit(limit);

    return rows.map(({ post, category }) =>
      mapPostWithCategory({ ...post, category }),
    );
  } catch (error) {
    console.warn("getPopularPosts", error);
    return [];
  }
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
  const pageSize = Math.min(48, Math.max(1, params.pageSize ?? 9));
  const offset = (page - 1) * pageSize;

  const filters = [eq(posts.isPublished, true)];

  if (params.q?.trim()) {
    const safe = params.q.trim().replace(/[%_]/g, " ").slice(0, 80);
    if (safe.length > 0) {
      filters.push(ilike(posts.title, `%${safe}%`));
    }
  }

  if (params.categorySlug) {
    const category = await getCategoryBySlug(params.categorySlug);
    if (!category) {
      return { posts: [], total: 0 };
    }
    filters.push(eq(posts.categoryId, category.id));
  }

  const whereClause = and(...filters);

  try {
    const [totalRow] = await db
      .select({ total: count() })
      .from(posts)
      .where(whereClause);

    const rows = await db
      .select({
        post: posts,
        category: categories,
      })
      .from(posts)
      .innerJoin(categories, eq(posts.categoryId, categories.id))
      .where(whereClause)
      .orderBy(desc(posts.publishedAt))
      .limit(pageSize)
      .offset(offset);

    return {
      posts: rows.map(({ post, category }) =>
        mapPostWithCategory({ ...post, category }),
      ),
      total: Number(totalRow?.total ?? 0),
    };
  } catch (error) {
    console.warn("getPublishedPostsPage", error);
    return { posts: [], total: 0 };
  }
}
