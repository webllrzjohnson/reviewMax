import Link from "next/link";
import { getAdminCategories } from "@/lib/admin-data";
import { CategoriesAdminTable } from "@/components/admin/CategoriesAdminTable";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const categories = await getAdminCategories();

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Categories</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {categories.length} {categories.length === 1 ? "category" : "categories"}
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/categories/new">New category</Link>
        </Button>
      </div>
      <CategoriesAdminTable categories={categories} />
    </div>
  );
}
