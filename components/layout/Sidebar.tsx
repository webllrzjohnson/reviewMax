import Link from "next/link";
import { getCategories, getPopularPosts } from "@/lib/data";
import { NewsletterSignup } from "@/components/common/NewsletterSignup";
import { Separator } from "@/components/ui/separator";

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
          {categories.map((c) => (
            <li key={c.id}>
              <Link
                href={`/category/${c.slug}`}
                className="text-muted-foreground hover:text-foreground hover:underline"
              >
                {c.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Separator />
      <NewsletterSignup compact />
    </div>
  );
}
