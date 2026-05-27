import { auth } from "@/auth";
import type { Session } from "next-auth";

export async function getSession(): Promise<Session | null> {
  return auth();
}

export async function requireAdmin(): Promise<Session> {
  const session = await auth();
  if (!session?.user?.email || session.user.role !== "admin") {
    throw new Error("Unauthorized");
  }
  return session;
}
