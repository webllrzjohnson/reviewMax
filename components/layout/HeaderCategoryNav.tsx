"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

export function HeaderCategoryNav({ categories }: { categories: Category[] }) {
  const pathname = usePathname();

  return (
    <>
      {categories.map((c) => {
        const href = `/category/${c.slug}`;
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={c.id}
            href={href}
            className={cn(
              "hidden whitespace-nowrap transition-colors hover:text-white lg:inline",
              active ? "text-white" : "text-zinc-400",
            )}
            aria-current={active ? "page" : undefined}
          >
            {c.name}
          </Link>
        );
      })}
    </>
  );
}
