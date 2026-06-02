import { Skeleton } from "@/components/ui/skeleton";

export default function CategoryLoading() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-4 w-20" />
        <Skeleton className="mt-2 h-9 w-64" />
        <Skeleton className="mt-3 h-5 w-full max-w-xl" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 9 }).map((_, i) => (
          <Skeleton key={i} className="h-96 rounded-lg" />
        ))}
      </div>
    </div>
  );
}
