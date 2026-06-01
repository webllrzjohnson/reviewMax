"use client";

import Link from "next/link";
import { GitCompare, Menu } from "lucide-react";
import type { Category } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

export function HeaderNavMobile({ categories }: { categories: Category[] }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="md:hidden"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[min(100%,320px)]">
        <SheetHeader>
          <SheetTitle>Browse</SheetTitle>
        </SheetHeader>
        <nav className="mt-6 flex flex-col gap-1">
          <Link
            href="/blog"
            className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            All reviews
          </Link>
          <Link
            href="/compare"
            className="flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
          >
            <GitCompare className="h-4 w-4" aria-hidden />
            Compare products
          </Link>
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="rounded-md px-3 py-2 text-sm font-medium hover:bg-accent"
            >
              {c.name}
            </Link>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
