import { getCategories } from "@/lib/data";
import { NewReviewForm } from "@/components/admin/NewReviewForm";

export const dynamic = "force-dynamic";

export default async function NewReviewPage() {
  const categories = await getCategories();

  if (!categories.length) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6 text-sm text-amber-900 dark:border-amber-900 dark:bg-amber-950 dark:text-amber-100">
        No categories found in the database. Run{" "}
        <code>npm run db:migrate</code> and <code>npm run db:seed</code>, then
        refresh this page.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">New review request</h1>
        <p className="text-muted-foreground">
          n8n should call Claude, store images, then POST the finished payload
          to <code className="text-xs">/api/webhook/n8n</code> with the shared
          secret header.
        </p>
      </div>
      <NewReviewForm categories={categories} />
    </div>
  );
}
