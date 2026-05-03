import Link from "next/link";
import type { PostWithCategory } from "@/types";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { StarRating } from "@/components/review/StarRating";
import { Badge } from "@/components/ui/badge";
import { ReviewCardImage } from "@/components/review/ReviewCardImage";

export function ReviewCard({
  post,
  imageSizes = "(max-width:768px) 100vw, 33vw",
}: {
  post: PostWithCategory;
  imageSizes?: string;
}) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-md">
      <Link href={`/blog/${post.slug}`} className="block">
        <div className="relative aspect-[16/10] w-full bg-muted">
          <ReviewCardImage
            src={post.image_url}
            alt={post.title}
            sizes={imageSizes}
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
            Read more
          </span>
        </CardContent>
      </Link>
    </Card>
  );
}
