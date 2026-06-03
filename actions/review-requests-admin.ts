"use server";

import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { reviewRequests } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth/session";

export type RequestActionState = { ok: boolean; message?: string };

export async function deleteReviewRequestAction(
  id: string,
): Promise<RequestActionState> {
  try {
    await requireAdmin();
    await db.delete(reviewRequests).where(eq(reviewRequests.id, id));
    revalidatePath("/dashboard/review-requests");
    revalidatePath("/dashboard");
    return { ok: true };
  } catch {
    return { ok: false, message: "Could not delete request." };
  }
}
