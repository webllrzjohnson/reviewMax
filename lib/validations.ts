import { z } from "zod";

const slugRegex = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export const ReviewRequestSchema = z.object({
  product_name: z
    .string()
    .min(2, "Product name is required")
    .max(200, "Product name is too long"),
  category: z
    .string()
    .min(1, "Category is required")
    .regex(slugRegex, "Use a slug like kitchen-gadgets"),
  amazon_url: z.string().url("Enter a valid Amazon product URL"),
  notes: z.string().max(2000).optional(),
});

export type ReviewRequestInput = z.infer<typeof ReviewRequestSchema>;

export const NewsletterSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

export type NewsletterInput = z.infer<typeof NewsletterSchema>;

export const WebhookPayloadSchema = z.object({
  title: z.string().min(1).max(500),
  slug: z.string().min(1).max(200).regex(slugRegex),
  excerpt: z.string().min(1).max(2000),
  body: z.string().min(1),
  category_slug: z.string().min(1).regex(slugRegex),
  rating: z.number().min(0).max(5),
  pros: z.array(z.string().min(1)).min(1),
  cons: z.array(z.string().min(1)).min(1),
  verdict: z.string().min(1).max(2000),
  amazon_url: z.string().url(),
  image_url: z.string().url().nullable().optional(),
  is_published: z.boolean().optional().default(true),
  published_at: z.string().optional(),
});

export type WebhookPayload = z.infer<typeof WebhookPayloadSchema>;
