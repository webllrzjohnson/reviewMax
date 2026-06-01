import type { PostWithCategory } from "@/types";
import { ReviewCard } from "@/components/review/ReviewCard";

export function RelatedPosts({ posts }: { posts: PostWithCategory[] }) {
  if (posts.length === 0) return null;

  return (
    <section className="space-y-4 border-t pt-10">
      <h2 className="text-xl font-bold">Related reviews</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <ReviewCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
