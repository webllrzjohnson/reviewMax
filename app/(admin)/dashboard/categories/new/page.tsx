import { CategoryForm } from "@/components/admin/CategoryForm";

export const dynamic = "force-dynamic";

export default function NewCategoryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">New category</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Add a new review category. It will appear in navigation once it has
          published posts.
        </p>
      </div>
      <CategoryForm />
    </div>
  );
}
