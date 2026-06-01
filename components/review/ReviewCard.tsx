import Link from "next/link";
import { Star } from "lucide-react";
import type { PostWithCategory } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReviewCardImage } from "@/components/review/ReviewCardImage";
import { formatDate, cn } from "@/lib/utils";
import { categoryAccentForSlug } from "@/lib/category-colors";

export function ReviewCard({
  post,
  imageSizes = "(max-width:768px) 100vw, 33vw",
  highlight,
}: {
  post: PostWithCategory;
  imageSizes?: string;
  highlight?: "top-rated";
}) {
  const slug = post.category?.slug ?? "";
  const accent = categoryAccentForSlug(slug);
  const rating = Number(post.rating ?? 0);

  return (
    <Card
      className={cn(
        "group overflow-hidden border-l-4 transition-all duration-200",
        accent.cardBorder,
        accent.cardHover,
      )}
    >
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full bg-muted overflow-hidden">
          <ReviewCardImage
            src={post.image_url}
            alt={post.title}
            sizes={imageSizes}
          />
        </div>
        <CardHeader className="space-y-2 pb-2">
          <div className="flex flex-wrap items-center gap-1.5">
            {post.category ? (
              <Badge
                className={cn(
                  "border shadow-sm",
                  accent.badge,
                  accent.badgeHover,
                )}
              >
                {post.category.name}
              </Badge>
            ) : null}
            {highlight === "top-rated" ? (
              <Badge className="border-amber-400/50 bg-amber-500 text-white shadow-sm">
                Top rated
              </Badge>
            ) : null}
            {post.rating != null && rating > 0 ? (
              <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-zinc-100 px-2 py-0.5 dark:border-zinc-700 dark:bg-zinc-800">
                <Star className="h-3 w-3 fill-[#C98B1A] text-[#C98B1A]" aria-hidden />
                <span className="text-xs font-bold tabular-nums text-zinc-800 dark:text-zinc-200">
                  {rating.toFixed(1)}
                </span>
                <span className="text-xs text-zinc-500 dark:text-zinc-400">/ 5</span>
              </div>
            ) : null}
          </div>
          <h3 className="line-clamp-2 text-sm font-semibold leading-snug transition-colors group-hover:text-primary">
            {post.title}
          </h3>
          {post.published_at ? (
            <time
              dateTime={post.published_at}
              className="text-xs text-muted-foreground"
            >
              {formatDate(post.published_at)}
            </time>
          ) : null}
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
          <span className="mt-3 inline-flex items-center text-sm font-semibold text-primary">
            Read review
            <span
              className="ml-1 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            >
              →
            </span>
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}
