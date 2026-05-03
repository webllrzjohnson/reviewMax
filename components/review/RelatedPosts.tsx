import { getRelatedPosts } from "@/lib/data";
import { ReviewCard } from "@/components/review/ReviewCard";

export async function RelatedPosts({
  categoryId,
  excludeSlug,
}: {
  categoryId: string;
  excludeSlug: string;
}) {
  const posts = await getRelatedPosts(categoryId, excludeSlug, 4);
  if (posts.length === 0) return null;

  return (
    <section className="space-y-4 border-t pt-10">
      <h2 className="text-xl font-bold">Related reviews</h2>
      <div className="grid gap-6 sm:grid-cols-2">
        {posts.map((p) => (
          <ReviewCard key={p.id} post={p} />
        ))}
      </div>
    </section>
  );
}
