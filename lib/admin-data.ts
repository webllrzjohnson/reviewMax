import { count, desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { mapPostWithCategory, mapReviewRequest } from "@/lib/db/mappers";
import {
  categories,
  newsletterSubscribers,
  posts,
  reviewRequests,
} from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import type { PostWithCategory, ReviewRequest } from "@/types";

export type AdminDashboardData = {
  email: string;
  stats: {
    posts: number;
    categories: number;
    subscribers: number;
    pendingReviewRequests: number;
  };
  recentRequests: ReviewRequest[];
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const session = await requireAdmin();

  const [
    postsRes,
    categoriesRes,
    subscribersRes,
    requestsRes,
    recentRequestsRes,
  ] = await Promise.all([
    db.select({ total: count() }).from(posts),
    db.select({ total: count() }).from(categories),
    db.select({ total: count() }).from(newsletterSubscribers),
    db.select({ total: count() }).from(reviewRequests),
    db
      .select()
      .from(reviewRequests)
      .orderBy(desc(reviewRequests.createdAt))
      .limit(10),
  ]);

  return {
    email: session.user.email!,
    stats: {
      posts: Number(postsRes[0]?.total ?? 0),
      categories: Number(categoriesRes[0]?.total ?? 0),
      subscribers: Number(subscribersRes[0]?.total ?? 0),
      pendingReviewRequests: Number(requestsRes[0]?.total ?? 0),
    },
    recentRequests: recentRequestsRes.map(mapReviewRequest),
  };
}

export async function getAdminPostById(
  id: string,
): Promise<PostWithCategory | null> {
  await requireAdmin();

  const [row] = await db
    .select({
      post: posts,
      category: categories,
    })
    .from(posts)
    .leftJoin(categories, eq(posts.categoryId, categories.id))
    .where(eq(posts.id, id))
    .limit(1);

  if (!row) return null;
  return mapPostWithCategory({ ...row.post, category: row.category });
}

export async function getAdminPosts(): Promise<PostWithCategory[]> {
  await requireAdmin();

  try {
    const rows = await db
      .select({
        post: posts,
        category: categories,
      })
      .from(posts)
      .leftJoin(categories, eq(posts.categoryId, categories.id))
      .orderBy(desc(posts.updatedAt));

    return rows.map(({ post, category }) =>
      mapPostWithCategory({ ...post, category }),
    );
  } catch (error) {
    console.warn("getAdminPosts", error);
    return [];
  }
}
