import Image from "next/image";
import Link from "next/link";
import type { PostWithCategory } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarRating } from "@/components/review/StarRating";
import { Badge } from "@/components/ui/badge";

const PLACEHOLDER =
  "https://placehold.co/800x500/e2e8f0/64748b?text=Product";

export function ReviewCard({ post }: { post: PostWithCategory }) {
  const src = post.image_url || PLACEHOLDER;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full bg-muted">
          <Image
            src={src}
            alt={post.title}
            fill
            className="object-cover"
            sizes="(max-width:768px) 100vw, 33vw"
          />
        </div>
        <CardHeader className="space-y-2 pb-2">
          {post.category ? (
            <Badge variant="secondary" className="w-fit">
              {post.category.name}
            </Badge>
          ) : null}
          <h3 className="line-clamp-2 text-lg font-semibold leading-snug">
            {post.title}
          </h3>
          <StarRating rating={post.rating} className="pt-1" />
        </CardHeader>
        <CardContent>
          <p className="line-clamp-3 text-sm text-muted-foreground">
            {post.excerpt}
          </p>
          <span className="mt-3 inline-block text-sm font-medium text-primary">
            Read review →
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}
