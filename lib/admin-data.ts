import type { PostWithCategory } from "@/types";
import { createClient } from "@/lib/supabase/server";
import type { Tables } from "@/types/supabase";

export type AdminDashboardData = {
  email: string;
  stats: {
    posts: number;
    categories: number;
    subscribers: number;
    pendingReviewRequests: number;
  };
  recentRequests: Tables<"review_requests">[];
};

export async function getAdminDashboardData(): Promise<AdminDashboardData> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.email) {
    throw new Error("Not authenticated");
  }

  const [
    postsRes,
    categoriesRes,
    subscribersRes,
    requestsRes,
    recentRequestsRes,
  ] = await Promise.all([
    supabase.from("posts").select("*", { count: "exact", head: true }),
    supabase.from("categories").select("*", { count: "exact", head: true }),
    supabase
      .from("newsletter_subscribers")
      .select("*", { count: "exact", head: true }),
    supabase.from("review_requests").select("*", { count: "exact", head: true }),
    supabase
      .from("review_requests")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  return {
    email: user.email,
    stats: {
      posts: postsRes.count ?? 0,
      categories: categoriesRes.count ?? 0,
      subscribers: subscribersRes.count ?? 0,
      pendingReviewRequests: requestsRes.count ?? 0,
    },
    recentRequests: recentRequestsRes.data ?? [],
  };
}

export async function getAdminPosts(): Promise<PostWithCategory[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("posts")
    .select("*, category:categories(*)")
    .order("updated_at", { ascending: false });

  if (error) {
    console.warn("getAdminPosts", error);
    return [];
  }
  return (data as PostWithCategory[]) ?? [];
}
