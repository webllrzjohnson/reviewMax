"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  PostEditorSchema,
  type PostEditorInput,
} from "@/lib/validations";
import { createPost, updatePost } from "@/actions/posts";
import type { Category, PostWithCategory } from "@/types";
import { slugifyTitle } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "sonner";

function linesFromArray(items: string[]): string {
  return items.join("\n");
}

function postToFormValues(post: PostWithCategory): PostEditorInput {
  return {
    title: post.title,
    slug: post.slug,
    excerpt: post.excerpt,
    body: post.body,
    category_id: post.category_id,
    rating: post.rating ?? 4,
    pros: linesFromArray(post.pros),
    cons: linesFromArray(post.cons),
    verdict: post.verdict,
    amazon_url: post.amazon_url,
    image_url: post.image_url ?? "",
    gallery_urls: linesFromArray(post.gallery_urls ?? []),
    is_published: post.is_published,
  };
}

export function PostEditorForm({
  categories,
  post,
}: {
  categories: Category[];
  post?: PostWithCategory;
}) {
  const router = useRouter();
  const isEdit = Boolean(post);
  const defaultCategory = categories[0]?.id ?? "";

  const form = useForm<PostEditorInput>({
    resolver: zodResolver(PostEditorSchema),
    defaultValues: post
      ? postToFormValues(post)
      : {
          title: "",
          slug: "",
          excerpt: "",
          body: "",
          category_id: defaultCategory,
          rating: 4,
          pros: "",
          cons: "",
          verdict: "",
          amazon_url: "",
          image_url: "",
          gallery_urls: "",
          is_published: true,
        },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = form;

  const title = watch("title");
  const [slugTouched, setSlugTouched] = useState(isEdit);

  async function onSubmit(values: PostEditorInput) {
    const result = isEdit && post
      ? await updatePost(post.id, values)
      : await createPost(values);

    if (!result.ok) {
      toast.error(result.message ?? "Could not save post.");
      return;
    }

    toast.success(result.message ?? "Saved.");
    router.push("/dashboard/posts");
    router.refresh();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEdit ? "Edit post" : "Create post manually"}</CardTitle>
        <CardDescription>
          Write or update a review without n8n. Hero image can be left blank to
          auto-fetch from the product URL. Add extra image URLs one per line.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                {...register("title")}
                onBlur={() => {
                  if (!slugTouched && title.trim()) {
                    setValue("slug", slugifyTitle(title));
                  }
                }}
              />
              {errors.title ? (
                <p className="text-sm text-destructive">{errors.title.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                {...register("slug", {
                  onChange: () => setSlugTouched(true),
                })}
              />
              {errors.slug ? (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category_id">Category</Label>
              <select
                id="category_id"
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                {...register("category_id")}
              >
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              {errors.category_id ? (
                <p className="text-sm text-destructive">
                  {errors.category_id.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="excerpt">Excerpt</Label>
              <Textarea id="excerpt" rows={2} {...register("excerpt")} />
              {errors.excerpt ? (
                <p className="text-sm text-destructive">
                  {errors.excerpt.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="body">Body (HTML or Markdown)</Label>
              <Textarea id="body" rows={12} className="font-mono text-sm" {...register("body")} />
              {errors.body ? (
                <p className="text-sm text-destructive">{errors.body.message}</p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="verdict">Quick verdict</Label>
              <Textarea id="verdict" rows={3} {...register("verdict")} />
              {errors.verdict ? (
                <p className="text-sm text-destructive">
                  {errors.verdict.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="rating">Rating (0–5)</Label>
              <Input
                id="rating"
                type="number"
                step="0.1"
                min={0}
                max={5}
                {...register("rating", { valueAsNumber: true })}
              />
              {errors.rating ? (
                <p className="text-sm text-destructive">
                  {errors.rating.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="amazon_url">Product URL</Label>
              <Input
                id="amazon_url"
                type="url"
                placeholder="https://www.amazon.com/dp/… or a.co short link"
                {...register("amazon_url")}
              />
              {errors.amazon_url ? (
                <p className="text-sm text-destructive">
                  {errors.amazon_url.message}
                </p>
              ) : null}
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="image_url">Hero image URL (optional)</Label>
              <Input
                id="image_url"
                type="url"
                placeholder="Leave blank to fetch from Amazon on save"
                {...register("image_url")}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="gallery_urls">Additional images (one URL per line)</Label>
              <Textarea
                id="gallery_urls"
                rows={4}
                placeholder="https://m.media-amazon.com/images/I/…"
                {...register("gallery_urls")}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pros">Pros (one per line)</Label>
              <Textarea id="pros" rows={4} {...register("pros")} />
              {errors.pros ? (
                <p className="text-sm text-destructive">{errors.pros.message}</p>
              ) : null}
            </div>

            <div className="space-y-2">
              <Label htmlFor="cons">Cons (one per line)</Label>
              <Textarea id="cons" rows={4} {...register("cons")} />
              {errors.cons ? (
                <p className="text-sm text-destructive">{errors.cons.message}</p>
              ) : null}
            </div>

            <div className="flex items-center gap-2 sm:col-span-2">
              <input
                id="is_published"
                type="checkbox"
                className="h-4 w-4 rounded border-input"
                {...register("is_published")}
              />
              <Label htmlFor="is_published" className="font-normal">
                Published (visible on the blog)
              </Label>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving…" : isEdit ? "Save changes" : "Create post"}
            </Button>
            <Button type="button" variant="outline" asChild>
              <Link href="/dashboard/posts">Cancel</Link>
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
