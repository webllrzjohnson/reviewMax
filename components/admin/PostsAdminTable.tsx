"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import type { PostWithCategory } from "@/types";
import { deletePost, retryPostImage, setPostPublished } from "@/actions/posts";
import { isDirectImageUrl } from "@/lib/amazon-image";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function PostsAdminTable({ posts }: { posts: PostWithCategory[] }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (posts.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-10 text-center text-sm text-muted-foreground">
        No posts yet.{" "}
        <Link href="/dashboard/posts/new" className="text-primary underline">
          Create one manually
        </Link>{" "}
        or use the n8n workflow.
      </div>
    );
  }

  function refresh() {
    router.refresh();
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full min-w-[900px] border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Title</th>
            <th className="px-4 py-3 font-medium">Category</th>
            <th className="px-4 py-3 font-medium">Rating</th>
            <th className="px-4 py-3 font-medium">Published</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">Image</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id} className="border-b last:border-0">
              <td className="max-w-[280px] px-4 py-3 align-top">
                <Link
                  href={`/blog/${post.slug}`}
                  className="font-medium text-primary hover:underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {post.title}
                </Link>
              </td>
              <td className="px-4 py-3 align-top">
                {post.category?.name ?? "—"}
              </td>
              <td className="px-4 py-3 align-top tabular-nums">
                {post.rating != null ? `${post.rating.toFixed(1)} / 5` : "—"}
              </td>
              <td className="px-4 py-3 align-top text-muted-foreground">
                {post.published_at ? formatDate(post.published_at) : "—"}
              </td>
              <td className="px-4 py-3 align-top">
                <Badge
                  variant={post.is_published ? "default" : "secondary"}
                  className={cn(
                    !post.is_published && "text-muted-foreground",
                  )}
                >
                  {post.is_published ? "Published" : "Draft"}
                </Badge>
              </td>
              <td className="px-4 py-3 align-top">
                {post.image_url && isDirectImageUrl(post.image_url) ? (
                  <span className="text-xs text-green-600">✓</span>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto px-1 py-0 text-xs text-amber-600 hover:text-amber-700"
                    disabled={pending}
                    onClick={() =>
                      startTransition(async () => {
                        toast.loading("Fetching image from Amazon…", {
                          id: `img-${post.id}`,
                        });
                        const result = await retryPostImage(post.id);
                        toast.dismiss(`img-${post.id}`);
                        if (!result.ok) {
                          toast.error(result.message ?? "Could not fetch image.");
                        } else {
                          toast.success("Image updated.");
                          refresh();
                        }
                      })
                    }
                  >
                    ⚠ Retry
                  </Button>
                )}
              </td>
              <td className="px-4 py-3 align-top text-right">
                <div className="flex flex-wrap items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/posts/${post.id}/edit`}>Edit</Link>
                  </Button>
                  <label className="flex cursor-pointer items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      className="h-4 w-4 rounded border-input"
                      checked={post.is_published}
                      disabled={pending}
                      onChange={() => {
                        startTransition(async () => {
                          const result = await setPostPublished(
                            post.id,
                            !post.is_published,
                          );
                          if (!result.ok) {
                            toast.error(
                              result.message ?? "Could not update status.",
                            );
                            return;
                          }
                          toast.success(
                            post.is_published
                              ? "Post unpublished."
                              : "Post published.",
                          );
                          refresh();
                        });
                      }}
                    />
                    Live
                  </label>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        disabled={pending}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete this post permanently?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          &ldquo;{post.title}&rdquo; will be permanently removed
                          from the database. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() =>
                            startTransition(async () => {
                              const result = await deletePost(post.id);
                              if (!result.ok) {
                                toast.error(
                                  result.message ?? "Could not delete post.",
                                );
                                return;
                              }
                              toast.success("Post deleted.");
                              refresh();
                            })
                          }
                        >
                          Delete permanently
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
