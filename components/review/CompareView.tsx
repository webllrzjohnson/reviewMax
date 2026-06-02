import Link from "next/link";
import type { PostWithCategory } from "@/types";
import { ReviewCardImage } from "@/components/review/ReviewCardImage";
import { StarRating } from "@/components/review/StarRating";
import { AffiliateButton } from "@/components/review/AffiliateButton";
import { Badge } from "@/components/ui/badge";
import { BreadcrumbNav } from "@/components/common/BreadcrumbNav";
import { ShareBar } from "@/components/common/ShareBar";
import { Check, Trophy, X } from "lucide-react";
import { cn, siteUrl } from "@/lib/utils";

function CompareColumn({
  post,
  otherRating,
}: {
  post: PostWithCategory;
  otherRating: number | null;
}) {
  const rating = Number(post.rating ?? 0);
  const other = Number(otherRating ?? 0);
  const ratingWins = rating > other;
  const ratingTie = rating === other;

  return (
    <div className="flex flex-col gap-6 rounded-2xl border bg-card p-5 shadow-sm">
      <div className="relative aspect-[16/10] w-full overflow-hidden rounded-xl bg-muted">
        <ReviewCardImage
          src={post.image_url}
          alt={post.title}
          sizes="(max-width:768px) 100vw, 45vw"
        />
      </div>

      {post.category ? (
        <Badge variant="secondary" className="w-fit">
          {post.category.name}
        </Badge>
      ) : null}

      <div>
        <Link
          href={`/blog/${post.slug}`}
          className="font-heading text-xl font-bold leading-snug hover:text-primary hover:underline"
        >
          {post.title}
        </Link>
        <div
          className={cn(
            "mt-3 rounded-lg border p-3",
            ratingWins
              ? "border-emerald-300 bg-emerald-50/60 dark:border-emerald-800 dark:bg-emerald-950/30"
              : ratingTie
                ? "border-amber-200 bg-amber-50/60 dark:border-amber-800 dark:bg-amber-950/30"
                : "border-muted",
          )}
        >
          <StarRating rating={post.rating} />
          {ratingWins ? (
            <p className="mt-1 text-xs font-medium text-emerald-700 dark:text-emerald-300">
              Higher rated
            </p>
          ) : ratingTie ? (
            <p className="mt-1 text-xs font-medium text-amber-700 dark:text-amber-300">
              Tied rating
            </p>
          ) : null}
        </div>
      </div>

      <div className="rounded-xl border border-[#16A34A]/25 bg-[#16A34A]/5 p-4 dark:border-[#22C55E]/20 dark:bg-[#22C55E]/8">
        <p className="text-xs font-semibold uppercase tracking-wide text-[#16A34A] dark:text-[#22C55E]">
          Verdict
        </p>
        <p className="mt-2 text-sm leading-relaxed">{post.verdict}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-1">
        <div className="rounded-lg border border-emerald-200/80 bg-emerald-50/50 p-4 dark:border-emerald-900 dark:bg-emerald-950/30">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-emerald-800 dark:text-emerald-200">
            <Check className="h-4 w-4" />
            Pros
          </h3>
          <ul className="space-y-1.5 text-sm">
            {post.pros.map((p) => (
              <li key={p} className="flex gap-2">
                <span className="text-emerald-600">•</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="rounded-lg border border-rose-200/80 bg-rose-50/50 p-4 dark:border-rose-900 dark:bg-rose-950/30">
          <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-rose-800 dark:text-rose-200">
            <X className="h-4 w-4" />
            Cons
          </h3>
          <ul className="space-y-1.5 text-sm">
            {post.cons.map((c) => (
              <li key={c} className="flex gap-2">
                <span className="text-rose-600">•</span>
                <span>{c}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <AffiliateButton
        href_raw={post.amazon_url}
        postSlug={post.slug}
        className="w-full"
      />
    </div>
  );
}

function WinnerSummary({
  left,
  right,
}: {
  left: PostWithCategory;
  right: PostWithCategory;
}) {
  const leftRating = Number(left.rating ?? 0);
  const rightRating = Number(right.rating ?? 0);

  const rows = [
    {
      label: "Rating",
      leftVal: leftRating > 0 ? `${leftRating.toFixed(1)} / 5` : "—",
      rightVal: rightRating > 0 ? `${rightRating.toFixed(1)} / 5` : "—",
      leftWins: leftRating > rightRating,
      rightWins: rightRating > leftRating,
    },
    {
      label: "Pros",
      leftVal: `${left.pros.length} listed`,
      rightVal: `${right.pros.length} listed`,
      leftWins: left.pros.length > right.pros.length,
      rightWins: right.pros.length > left.pros.length,
    },
    {
      label: "Cons",
      leftVal: `${left.cons.length} listed`,
      rightVal: `${right.cons.length} listed`,
      leftWins: left.cons.length < right.cons.length,
      rightWins: right.cons.length < left.cons.length,
    },
  ] as const;

  const leftScore = rows.filter((r) => r.leftWins).length;
  const rightScore = rows.filter((r) => r.rightWins).length;
  const winner =
    leftScore > rightScore ? left : rightScore > leftScore ? right : null;

  return (
    <div className="rounded-2xl border bg-card shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 border-b px-5 py-3">
        <Trophy className="h-4 w-4 text-amber-500" aria-hidden />
        <h2 className="text-sm font-semibold uppercase tracking-wide">
          Quick Summary
        </h2>
      </div>

      <div className="divide-y">
        {/* column headers */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 py-3 text-xs font-semibold text-muted-foreground">
          <span className="truncate">{left.title}</span>
          <span className="w-16 text-center" />
          <span className="truncate text-right">{right.title}</span>
        </div>

        {rows.map((row) => {
          const tie = !row.leftWins && !row.rightWins;
          return (
            <div
              key={row.label}
              className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-5 py-3 text-sm"
            >
              <span
                className={cn(
                  "truncate font-medium",
                  row.leftWins
                    ? "text-emerald-700 dark:text-emerald-300"
                    : tie
                      ? "text-muted-foreground"
                      : "text-muted-foreground",
                )}
              >
                {row.leftVal}
                {row.leftWins && (
                  <span className="ml-1.5 inline-block rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    ▲
                  </span>
                )}
              </span>
              <span className="w-16 text-center text-xs font-medium text-muted-foreground">
                {row.label}
              </span>
              <span
                className={cn(
                  "truncate text-right font-medium",
                  row.rightWins
                    ? "text-emerald-700 dark:text-emerald-300"
                    : tie
                      ? "text-muted-foreground"
                      : "text-muted-foreground",
                )}
              >
                {row.rightWins && (
                  <span className="mr-1.5 inline-block rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300">
                    ▲
                  </span>
                )}
                {row.rightVal}
              </span>
            </div>
          );
        })}
      </div>

      {/* conclusion */}
      <div
        className={cn(
          "flex items-center gap-3 border-t px-5 py-4",
          winner
            ? "bg-emerald-50/60 dark:bg-emerald-950/20"
            : "bg-amber-50/60 dark:bg-amber-950/20",
        )}
      >
        {winner ? (
          <>
            <Trophy className="h-5 w-5 shrink-0 text-amber-500" aria-hidden />
            <p className="text-sm font-medium">
              <span className="font-semibold">{winner.title}</span> edges ahead
              on {leftScore > rightScore ? leftScore : rightScore} out of{" "}
              {rows.length} metrics.
            </p>
          </>
        ) : (
          <>
            <span className="text-lg" aria-hidden>
              🤝
            </span>
            <p className="text-sm font-medium">
              These two products are evenly matched — it&apos;s a tie across all
              metrics.
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export function CompareView({
  left,
  right,
}: {
  left: PostWithCategory;
  right: PostWithCategory;
}) {
  const category = left.category;

  return (
    <div className="space-y-8">
      <BreadcrumbNav
        items={[
          { label: "Home", href: "/" },
          { label: "Reviews", href: "/blog" },
          ...(category
            ? [{ label: category.name, href: `/category/${category.slug}` }]
            : []),
          { label: "Compare", href: "/compare" },
        ]}
      />

      <header className="space-y-2">
        <p className="text-sm font-medium uppercase text-muted-foreground">
          Side-by-side comparison
        </p>
        <h1 className="font-heading text-3xl font-bold tracking-tight sm:text-4xl">
          {left.title} vs {right.title}
        </h1>
        {category ? (
          <p className="text-muted-foreground">
            Both products are in{" "}
            <Link
              href={`/category/${category.slug}`}
              className="font-medium text-primary hover:underline"
            >
              {category.name}
            </Link>
            .
          </p>
        ) : null}
      </header>

      <WinnerSummary left={left} right={right} />

      <ShareBar
        url={`${siteUrl()}/compare?left=${encodeURIComponent(left.slug)}&right=${encodeURIComponent(right.slug)}`}
        title={`${left.title} vs ${right.title} — Verdict`}
      />

      <div className="grid gap-8 lg:grid-cols-2">
        <CompareColumn post={left} otherRating={right.rating} />
        <CompareColumn post={right} otherRating={left.rating} />
      </div>
    </div>
  );
}
