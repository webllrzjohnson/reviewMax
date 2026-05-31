"use server";

import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { categories } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";
import { CategorySchema, type CategoryInput } from "@/lib/validations";

export type CategoryActionState = { ok: boolean; message?: string; id?: string };

function pgErrorCode(e: unknown): string | undefined {
  return typeof e === "object" && e !== null && "code" in e && typeof (e as Record<string, unknown>).code === "string"
    ? (e as Record<string, unknown>).code as string
    : undefined;
}

function revalidateCategoryPaths(slug?: string) {
  revalidatePath("/dashboard/categories");
  revalidatePath("/dashboard");
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) revalidatePath(`/category/${slug}`);
}

export async function createCategory(
  input: CategoryInput,
): Promise<CategoryActionState> {
  const parsed = CategorySchema.safeParse(input);
  if (!parsed.success) {
    const first =
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
      "Check your inputs.";
    return { ok: false, message: first };
  }

  try {
    await requireAdmin();
    const [inserted] = await db
      .insert(categories)
      .values({
        name: parsed.data.name.trim(),
        slug: parsed.data.slug.trim(),
        description: parsed.data.description?.trim() || null,
      })
      .returning({ id: categories.id });

    revalidateCategoryPaths(parsed.data.slug);
    return { ok: true, id: inserted?.id, message: "Category created." };
  } catch (e) {
    if (pgErrorCode(e) === "23505")
      return { ok: false, message: "A category with this slug already exists." };
    const message =
      e instanceof Error && e.message === "Unauthorized"
        ? "Your session expired. Sign in again."
        : "Something went wrong.";
    return { ok: false, message };
  }
}

export async function updateCategory(
  id: string,
  input: CategoryInput,
): Promise<CategoryActionState> {
  const parsed = CategorySchema.safeParse(input);
  if (!parsed.success) {
    const first =
      Object.values(parsed.error.flatten().fieldErrors).flat()[0] ??
      "Check your inputs.";
    return { ok: false, message: first };
  }

  try {
    await requireAdmin();
    const [existing] = await db
      .select({ slug: categories.slug })
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    if (!existing) return { ok: false, message: "Category not found." };

    await db
      .update(categories)
      .set({
        name: parsed.data.name.trim(),
        slug: parsed.data.slug.trim(),
        description: parsed.data.description?.trim() || null,
      })
      .where(eq(categories.id, id));

    revalidateCategoryPaths(existing.slug);
    if (existing.slug !== parsed.data.slug) {
      revalidateCategoryPaths(parsed.data.slug);
    }
    return { ok: true, id, message: "Category saved." };
  } catch (e) {
    if (pgErrorCode(e) === "23505")
      return { ok: false, message: "A category with this slug already exists." };
    const message =
      e instanceof Error && e.message === "Unauthorized"
        ? "Your session expired. Sign in again."
        : "Something went wrong.";
    return { ok: false, message };
  }
}

export async function deleteCategory(
  id: string,
): Promise<CategoryActionState> {
  try {
    await requireAdmin();
    const [cat] = await db
      .select({ slug: categories.slug })
      .from(categories)
      .where(eq(categories.id, id))
      .limit(1);

    await db.delete(categories).where(eq(categories.id, id));

    revalidateCategoryPaths(cat?.slug);
    return { ok: true };
  } catch (e) {
    if (pgErrorCode(e) === "23503")
      return {
        ok: false,
        message:
          "Cannot delete a category that still has posts. Move or delete its posts first.",
      };
    const message =
      e instanceof Error && e.message === "Unauthorized"
        ? "Your session expired. Sign in again."
        : "Something went wrong.";
    return { ok: false, message };
  }
}
