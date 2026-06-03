import type { Category, Post, PostBadge, PostFaq, PostWithCategory, ReviewRequest } from "@/types";
import type {
  categories,
  posts,
  reviewRequests,
} from "@/lib/db/schema";

type CategoryRow = typeof categories.$inferSelect;
type PostRow = typeof posts.$inferSelect;
type ReviewRequestRow = typeof reviewRequests.$inferSelect;

export function mapCategory(row: CategoryRow): Category {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    created_at: row.createdAt,
  };
}

export function mapPost(row: PostRow): Post {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    excerpt: row.excerpt,
    body: row.body,
    category_id: row.categoryId,
    rating: row.rating != null ? Number(row.rating) : null,
    pros: row.pros,
    cons: row.cons,
    verdict: row.verdict,
    amazon_url: row.amazonUrl,
    image_url: row.imageUrl,
    gallery_urls: row.galleryUrls ?? [],
    badge: (row.badge as PostBadge | null) ?? null,
    faqs: Array.isArray(row.faqs) ? (row.faqs as PostFaq[]) : [],
    price_at_review: row.priceAtReview ?? null,
    specs:
      row.specs && typeof row.specs === "object" && !Array.isArray(row.specs)
        ? (row.specs as Record<string, string>)
        : {},
    is_published: row.isPublished,
    published_at: row.publishedAt,
    created_at: row.createdAt,
    updated_at: row.updatedAt,
  };
}

export function mapPostWithCategory(
  row: PostRow & { category: CategoryRow | null },
): PostWithCategory {
  return {
    ...mapPost(row),
    category: row.category ? mapCategory(row.category) : null,
  };
}

export function mapReviewRequest(row: ReviewRequestRow): ReviewRequest {
  return {
    id: row.id,
    product_name: row.productName,
    category_slug: row.categorySlug,
    amazon_url: row.amazonUrl,
    notes: row.notes,
    created_by: row.createdBy,
    processed_at: row.processedAt,
    processed_by: row.processedBy,
    process_error: row.processError,
    created_at: row.createdAt,
  };
}
