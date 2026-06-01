import Link from "next/link";
import { GitCompare, Search } from "lucide-react";
import { auth } from "@/auth";
import { getCategories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HeaderNavMobile } from "@/components/layout/HeaderNavMobile";

export async function Header({ className }: { className?: string }) {
  const [categories, session] = await Promise.all([getCategories(), auth()]);
  const navCategories = categories.slice(0, 4);
  const adminHref =
    session?.user?.role === "admin" ? "/dashboard" : "/login";
  const adminLabel = session?.user?.role === "admin" ? "Dashboard" : "Admin";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b border-zinc-800 bg-zinc-900",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="shrink-0 font-heading text-xl font-bold tracking-tight text-[#C98B1A] hover:text-[#D4981E] transition-colors"
          >
            Verdict
          </Link>
          <HeaderNavMobile categories={categories} />
        </div>

        <nav
          className="hidden flex-[2] items-center justify-center gap-3 text-sm font-medium lg:gap-5 xl:gap-6 md:flex"
          aria-label="Main"
        >
          <Link
            href="/blog"
            className="whitespace-nowrap text-zinc-300 transition-colors hover:text-white"
          >
            Reviews
          </Link>
          <Link
            href="/compare"
            className="whitespace-nowrap text-zinc-300 transition-colors hover:text-white"
          >
            Compare
          </Link>
          {navCategories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="hidden whitespace-nowrap text-zinc-400 transition-colors hover:text-white lg:inline"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <Button
            variant="ghost"
            size="icon"
            asChild
            className="text-zinc-300 hover:bg-zinc-800 hover:text-white"
          >
            <Link href="/blog" aria-label="Search reviews">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="hidden text-zinc-300 hover:bg-zinc-800 hover:text-white sm:inline-flex"
          >
            <Link href="/compare">
              <GitCompare className="h-4 w-4" aria-hidden />
              Compare
            </Link>
          </Button>
          <Button
            size="sm"
            asChild
            className="hidden sm:inline-flex border border-zinc-600 bg-transparent text-zinc-200 hover:bg-zinc-700 hover:text-white"
          >
            <Link href={adminHref}>{adminLabel}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
