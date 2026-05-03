/**
 * ReviewMax — shared app types and Supabase schema re-exports.
 */

export type { Database, Json, Tables, TablesInsert, TablesUpdate, UserRole } from "./supabase";

export type AdminRole = "admin" | "user";

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface Post {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  category_id: string;
  rating: number | null;
  pros: string[];
  cons: string[];
  verdict: string;
  amazon_url: string;
  image_url: string | null;
  is_published: boolean;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface PostWithCategory extends Post {
  category: Category | null;
}

export interface NewsletterSubscriber {
  id: string;
  email: string;
  created_at: string;
}

export interface ReviewRequest {
  id: string;
  product_name: string;
  category_slug: string;
  amazon_url: string;
  notes: string | null;
  created_by: string | null;
  created_at: string;
}

export interface AdminUser {
  id: string;
  email: string;
  role: AdminRole;
}

export interface Profile {
  id: string;
  role: AdminRole;
  full_name: string | null;
  created_at: string;
}
