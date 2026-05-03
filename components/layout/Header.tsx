import Link from "next/link";
import { Search } from "lucide-react";
import { getCategories } from "@/lib/data";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

export async function Header({ className }: { className?: string }) {
  const categories = await getCategories();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60",
        className,
      )}
    >
      <div className="mx-auto flex h-14 max-w-6xl items-center gap-4 px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight">
          ReviewMax
        </Link>
        <nav className="hidden flex-1 items-center gap-4 text-sm font-medium md:flex md:gap-6">
          <Link href="/blog" className="text-muted-foreground hover:text-foreground">
            All reviews
          </Link>
          {categories.slice(0, 5).map((c) => (
            <Link
              key={c.id}
              href={`/category/${c.slug}`}
              className="text-muted-foreground hover:text-foreground"
            >
              {c.name}
            </Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" asChild>
            <Link href="/blog" aria-label="Search reviews">
              <Search className="h-5 w-5" />
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="hidden sm:inline-flex">
            <Link href="/login">Admin</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
