import type { PostWithCategory } from "@/types";
import { PostCard } from "@/components/blog/PostCard";

export function PostList({ posts }: { posts: PostWithCategory[] }) {
  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-12 text-center">
        <p className="font-medium">No reviews match your filters.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Try a different search or category.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}
