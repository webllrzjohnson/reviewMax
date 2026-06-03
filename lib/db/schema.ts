import { relations, sql } from "drizzle-orm";
import {
  boolean,
  jsonb,
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const userRoleEnum = pgEnum("user_role", ["admin", "user"]);

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  passwordHash: text("password_hash").notNull(),
  role: userRoleEnum("role").notNull().default("user"),
  fullName: text("full_name"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const categories = pgTable("categories", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const posts = pgTable("posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  slug: text("slug").notNull().unique(),
  excerpt: text("excerpt").notNull(),
  body: text("body").notNull(),
  categoryId: uuid("category_id")
    .notNull()
    .references(() => categories.id, { onDelete: "restrict" }),
  rating: numeric("rating", { precision: 2, scale: 1 }),
  pros: text("pros").array().notNull().default(sql`'{}'::text[]`),
  cons: text("cons").array().notNull().default(sql`'{}'::text[]`),
  verdict: text("verdict").notNull(),
  amazonUrl: text("amazon_url").notNull(),
  imageUrl: text("image_url"),
  galleryUrls: text("gallery_urls")
    .array()
    .notNull()
    .default(sql`'{}'::text[]`),
  badge: text("badge"),
  faqs: jsonb("faqs").notNull().default(sql`'[]'::jsonb`),
  priceAtReview: text("price_at_review"),
  specs: jsonb("specs").notNull().default(sql`'{}'::jsonb`),
  isPublished: boolean("is_published").notNull().default(false),
  publishedAt: timestamp("published_at", { withTimezone: true, mode: "string" }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const reviewFeedback = pgTable("review_feedback", {
  id: uuid("id").primaryKey().defaultRandom(),
  postSlug: text("post_slug").notNull(),
  helpful: boolean("helpful").notNull(),
  fingerprint: text("fingerprint").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const newsletterSubscribers = pgTable("newsletter_subscribers", {
  id: uuid("id").primaryKey().defaultRandom(),
  email: text("email").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const reviewRequests = pgTable("review_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  productName: text("product_name").notNull(),
  categorySlug: text("category_slug").notNull(),
  amazonUrl: text("amazon_url").notNull(),
  notes: text("notes"),
  createdBy: uuid("created_by").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at", { withTimezone: true, mode: "string" })
    .notNull()
    .defaultNow(),
});

export const categoriesRelations = relations(categories, ({ many }) => ({
  posts: many(posts),
}));

export const postsRelations = relations(posts, ({ one }) => ({
  category: one(categories, {
    fields: [posts.categoryId],
    references: [categories.id],
  }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  reviewRequests: many(reviewRequests),
}));

export const reviewRequestsRelations = relations(reviewRequests, ({ one }) => ({
  creator: one(users, {
    fields: [reviewRequests.createdBy],
    references: [users.id],
  }),
}));
