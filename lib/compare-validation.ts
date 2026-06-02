import type { PostWithCategory } from "@/types";

export type ComparePostsResult =
  | { ok: true; posts: [PostWithCategory, PostWithCategory] }
  | {
      ok: false;
      reason: "not_found" | "same_slug" | "different_category";
    };

export function validateComparisonPair(
  a: PostWithCategory | null,
  b: PostWithCategory | null,
): ComparePostsResult {
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
