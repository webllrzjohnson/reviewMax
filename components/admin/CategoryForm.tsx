"use client";

import { useRouter } from "next/navigation";
import { useTransition, useState, useEffect } from "react";
import { toast } from "sonner";
import type { Category } from "@/types";
import { createCategory, updateCategory } from "@/actions/categories";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

function toSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 100);
}

export function CategoryForm({ category }: { category?: Category }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [name, setName] = useState(category?.name ?? "");
  const [slug, setSlug] = useState(category?.slug ?? "");
  const [description, setDescription] = useState(
    category?.description ?? "",
  );
  const [slugDirty, setSlugDirty] = useState(!!category);

  useEffect(() => {
    if (!slugDirty) setSlug(toSlug(name));
  }, [name, slugDirty]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    startTransition(async () => {
      const input = {
        name,
        slug,
        description: description.trim() || undefined,
      };
      const result = category
        ? await updateCategory(category.id, input)
        : await createCategory(input);

      if (!result.ok) {
        toast.error(result.message ?? "Something went wrong.");
        return;
      }
      toast.success(result.message);
      router.push("/dashboard/categories");
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-lg space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="cat-name">Name</Label>
        <Input
          id="cat-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          maxLength={100}
          placeholder="Kitchen Gadgets"
          disabled={pending}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cat-slug">Slug</Label>
        <Input
          id="cat-slug"
          value={slug}
          onChange={(e) => {
            setSlug(e.target.value);
            setSlugDirty(true);
          }}
          required
          maxLength={100}
          placeholder="kitchen-gadgets"
          className="font-mono text-sm"
          disabled={pending}
        />
        <p className="text-xs text-muted-foreground">
          Used in URLs: /category/<span className="font-mono">{slug || "slug"}</span>
        </p>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="cat-description">
          Description{" "}
          <span className="text-muted-foreground">(optional)</span>
        </Label>
        <Textarea
          id="cat-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          maxLength={500}
          rows={3}
          placeholder="Brief description shown on the category page."
          disabled={pending}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Saving…" : category ? "Save changes" : "Create category"}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => router.back()}
          disabled={pending}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
}
