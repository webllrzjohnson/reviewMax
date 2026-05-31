import Link from "next/link";
import { Search } from "lucide-react";
import { auth } from "@/auth";
import { getCategories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { HeaderNavMobile } from "@/components/layout/HeaderNavMobile";

export async function Header({ className }: { className?: string }) {
  const [categories, session] = await Promise.all([getCategories(), auth()]);
  const navCategories = categories.slice(0, 5);
  const adminHref =
    session?.user?.role === "admin" ? "/dashboard" : "/login";
  const adminLabel = session?.user?.role === "admin" ? "Dashboard" : "Admin";

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-2 px-4 sm:gap-4 sm:px-6">
        <div className="flex min-w-0 flex-1 items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="shrink-0 text-lg font-bold tracking-tight text-foreground"
          >
            ReviewMax
          </Link>
          <HeaderNavMobile categories={categories} />
        </div>

        <nav
          className="hidden flex-[2] items-center justify-center gap-4 text-sm font-medium md:flex lg:gap-6"
          aria-label="Categories"
        >
          {navCategories.map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="whitespace-nowrap text-muted-foreground transition-colors hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/blog" aria-label="Search reviews">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button
            variant="outline"
            size="sm"
            asChild
            className="hidden sm:inline-flex"
          >
            <Link href={adminHref}>{adminLabel}</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
