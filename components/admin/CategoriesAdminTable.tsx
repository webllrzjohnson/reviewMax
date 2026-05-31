"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import { deleteCategory } from "@/actions/categories";
import type { AdminCategory } from "@/lib/admin-data";
import { Button } from "@/components/ui/button";
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

export function CategoriesAdminTable({
  categories,
}: {
  categories: AdminCategory[];
}) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  if (categories.length === 0) {
    return (
      <div className="rounded-lg border border-dashed bg-muted/30 p-10 text-center text-sm text-muted-foreground">
        No categories yet.{" "}
        <Link
          href="/dashboard/categories/new"
          className="text-primary underline"
        >
          Create one
        </Link>
        .
      </div>
    );
  }

  function handleDelete(id: string, name: string) {
    startTransition(async () => {
      const result = await deleteCategory(id);
      if (!result.ok) {
        toast.error(result.message ?? "Could not delete category.");
        return;
      }
      toast.success(`"${name}" deleted.`);
      router.refresh();
    });
  }

  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b bg-muted/40 text-left text-muted-foreground">
            <th className="px-4 py-3 font-medium">Name</th>
            <th className="px-4 py-3 font-medium">Slug</th>
            <th className="px-4 py-3 font-medium">Description</th>
            <th className="px-4 py-3 font-medium text-center">Posts</th>
            <th className="px-4 py-3 font-medium text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat.id} className="border-b last:border-0">
              <td className="px-4 py-3 align-top font-medium">{cat.name}</td>
              <td className="px-4 py-3 align-top font-mono text-xs text-muted-foreground">
                {cat.slug}
              </td>
              <td className="max-w-xs px-4 py-3 align-top text-muted-foreground">
                {cat.description ?? "—"}
              </td>
              <td className="px-4 py-3 align-top text-center tabular-nums">
                {cat.postCount}
              </td>
              <td className="px-4 py-3 align-top text-right">
                <div className="flex items-center justify-end gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/dashboard/categories/${cat.id}/edit`}>
                      Edit
                    </Link>
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        disabled={pending || cat.postCount > 0}
                        title={
                          cat.postCount > 0
                            ? `Move or delete the ${cat.postCount} post(s) in this category first`
                            : undefined
                        }
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Delete &ldquo;{cat.name}&rdquo;?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This permanently removes the category from the
                          database. This action cannot be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          onClick={() => handleDelete(cat.id, cat.name)}
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
