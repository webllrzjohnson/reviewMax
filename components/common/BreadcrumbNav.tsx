import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

export function BreadcrumbNav({
  items,
  className,
}: {
  items: { label: string; href: string }[];
  className?: string;
}) {
  return (
    <nav aria-label="Breadcrumb" className={cn("text-sm", className)}>
      <ol className="flex flex-wrap items-center gap-1 text-muted-foreground">
        {items.map((item, idx) => {
          const isLast = idx === items.length - 1;
          return (
            <li key={item.href + item.label} className="flex items-center gap-1">
              {idx > 0 ? (
                <ChevronRight className="h-4 w-4 shrink-0 opacity-50" />
              ) : null}
              {isLast ? (
                <span className="line-clamp-2 font-medium text-foreground">
                  {item.label}
                </span>
              ) : (
                <Link href={item.href} className="hover:underline">
                  {item.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
