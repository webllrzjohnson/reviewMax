import { ReviewCard } from "@/components/review/ReviewCard";
import type { PostWithCategory } from "@/types";

/** Blog grid card — alias of review card for layout consistency. */
export function PostCard({ post }: { post: PostWithCategory }) {
  return <ReviewCard post={post} />;
}
