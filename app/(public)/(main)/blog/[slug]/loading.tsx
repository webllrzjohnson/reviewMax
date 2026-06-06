import { Skeleton } from "@/components/ui/skeleton";

export default function BlogPostLoading() {
  return (
    <article className="space-y-8">
      <Skeleton className="h-4 w-72" />
      <div className="flow-root">
        <Skeleton className="mx-auto mb-6 aspect-square w-full max-w-[280px] rounded-xl sm:float-right sm:mb-4 sm:ml-8 sm:w-64" />
        <div className="space-y-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-10 w-full max-w-3xl" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="mt-6 h-32 w-full rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Skeleton className="h-48 rounded-lg" />
        <Skeleton className="h-48 rounded-lg" />
      </div>
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </article>
  );
}
