import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories } from "@/lib/data";
import { getAdminPostById } from "@/lib/admin-data";
import { PostEditorForm } from "@/components/admin/PostEditorForm";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getAdminPostById(id),
    getCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
            Edit post
          </h1>
          <p className="mt-1 text-muted-foreground">{post.title}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href={`/blog/${post.slug}`} target="_blank" rel="noopener">
              View live
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/dashboard/posts">← All posts</Link>
          </Button>
        </div>
      </div>

      <PostEditorForm categories={categories} post={post} />
    </div>
  );
}
