import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";

export function ProsConsList({
  pros,
  cons,
  className,
}: {
  pros: string[];
  cons: string[];
  className?: string;
}) {
  return (
    <div
      className={cn("grid gap-6 md:grid-cols-2", className)}
    >
      <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-emerald-800 dark:text-emerald-200">
          <Check className="h-5 w-5" />
          Pros
        </h3>
        <ul className="space-y-2 text-sm">
          {pros.map((p) => (
            <li key={p} className="flex gap-2">
              <span className="mt-1 text-emerald-600">•</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-rose-200/80 bg-rose-50/50 p-4 dark:border-rose-900 dark:bg-rose-950/30">
        <h3 className="mb-3 flex items-center gap-2 font-semibold text-rose-800 dark:text-rose-200">
          <X className="h-5 w-5" />
          Cons
        </h3>
        <ul className="space-y-2 text-sm">
          {cons.map((c) => (
            <li key={c} className="flex gap-2">
              <span className="mt-1 text-rose-600">•</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
