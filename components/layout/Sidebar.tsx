import Link from "next/link";
import { getCategories, getPopularPosts } from "@/lib/data";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { Separator } from "@/components/ui/separator";
import { categoryIconForSlug } from "@/lib/category-icons";

export async function Sidebar() {
  const [categories, popular] = await Promise.all([
    getCategories(),
    getPopularPosts(5),
  ]);

  return (
    <div className="space-y-8 rounded-lg border bg-card p-4 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Popular reviews
        </h2>
        <ul className="mt-3 space-y-3">
          {popular.map((p) => (
            <li key={p.id}>
              <Link
                href={`/blog/${p.slug}`}
                className="line-clamp-2 text-sm font-medium hover:underline"
              >
                {p.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          Categories
        </h2>
        <ul className="mt-3 space-y-2 text-sm">
          {categories.map((c) => {
            const Icon = categoryIconForSlug(c.slug);
            return (
              <li key={c.id}>
                <Link
                  href={`/category/${c.slug}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground hover:underline"
                >
                  <Icon className="h-4 w-4 shrink-0 opacity-80" aria-hidden />
                  <span>{c.name}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <Separator />
      <NewsletterSignup compact />
    </div>
  );
}
