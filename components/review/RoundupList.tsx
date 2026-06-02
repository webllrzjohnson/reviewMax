import Link from "next/link";
import type { PostWithCategory } from "@/types";
import { ReviewCardImage } from "@/components/review/ReviewCardImage";
import { StarRating } from "@/components/review/StarRating";
import { AffiliateButton } from "@/components/review/AffiliateButton";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

function rankLabel(rank: number): string {
  if (rank === 1) return "Editor's pick";
  if (rank === 2) return "Runner-up";
  if (rank === 3) return "Also great";
  return `#${rank}`;
}

function rankAccent(rank: number): string {
  if (rank === 1) {
    return "border-amber-400/60 bg-amber-50/50 dark:border-amber-500/40 dark:bg-amber-950/20";
  }
  if (rank === 2) {
    return "border-zinc-300/80 bg-zinc-50/50 dark:border-zinc-600 dark:bg-zinc-900/30";
  }
  if (rank === 3) {
    return "border-orange-300/50 bg-orange-50/40 dark:border-orange-800/40 dark:bg-orange-950/20";
  }
  return "border-border bg-card";
}

export function RoundupList({
  posts,
  categoryName,
}: {
  posts: PostWithCategory[];
  categoryName: string;
}) {
  return (
    <ol className="space-y-8">
      {posts.map((post, index) => {
        const rank = index + 1;
        return (
          <li
            key={post.id}
            className={cn(
              "overflow-hidden rounded-2xl border shadow-sm",
              rankAccent(rank),
            )}
          >
            <article className="grid gap-6 p-5 sm:grid-cols-[minmax(0,240px)_1fr] sm:p-6">
              <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted sm:aspect-[4/3]">
                <ReviewCardImage
                  src={post.image_url}
                  alt={post.title}
                  sizes="(max-width:640px) 100vw, 240px"
                />
                <div className="absolute left-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-900/90 text-lg font-bold text-white shadow">
                  {rank}
                </div>
              </div>

              <div className="flex min-w-0 flex-col gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  <Badge
                    variant={rank === 1 ? "default" : "secondary"}
                    className={cn(rank === 1 && "bg-amber-500 hover:bg-amber-500")}
                  >
                    {rankLabel(rank)}
                  </Badge>
                  <Badge variant="outline">{categoryName}</Badge>
                </div>

                <div>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="font-heading text-xl font-bold leading-snug hover:text-primary hover:underline sm:text-2xl"
                  >
                    {post.title}
                  </Link>
                  <StarRating rating={post.rating} className="mt-3" />
                </div>

                <p className="text-sm leading-relaxed text-muted-foreground">
                  {post.excerpt}
                </p>

                {post.pros.length > 0 ? (
                  <ul className="space-y-1.5 text-sm">
                    {post.pros.slice(0, 3).map((pro) => (
                      <li key={pro} className="flex gap-2">
                        <Check
                          className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600"
                          aria-hidden
                        />
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                ) : null}

                <div className="mt-auto flex flex-wrap gap-3 pt-2">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center text-sm font-semibold text-primary hover:underline"
                  >
                    Read full review
                    <span aria-hidden className="ml-1">
                      →
                    </span>
                  </Link>
                  {post.amazon_url ? (
                    <AffiliateButton
                      href_raw={post.amazon_url}
                      postSlug={post.slug}
                      label="Buy on Amazon"
                      className="px-5 text-sm"
                    />
                  ) : null}
                </div>
              </div>
            </article>
          </li>
        );
      })}
    </ol>
  );
}
