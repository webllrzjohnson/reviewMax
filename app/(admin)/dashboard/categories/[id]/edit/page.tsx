import { notFound } from "next/navigation";
import { getAdminCategoryById } from "@/lib/admin-data";
import { CategoryForm } from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditCategoryPage({ params }: Props) {
  const { id } = await params;
  const category = await getAdminCategoryById(id);
  if (!category) notFound();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit category</h1>
        <p className="mt-1 text-sm text-muted-foreground">{category.name}</p>
      </div>
      <CategoryForm category={category} />
    </div>
  );
}
