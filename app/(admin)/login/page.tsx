import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LoginForm } from "@/components/auth/LoginForm";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Sign in",
  description: "Admin sign in for ReviewMax",
};

type Props = {
  searchParams: Promise<{ next?: string | string[] }>;
};

function safeNext(next: string): string {
  if (next.startsWith("/") && !next.startsWith("//")) return next;
  return "/dashboard";
}

export default async function AdminLoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const nextParam = sp.next;
  const next = safeNext(
    typeof nextParam === "string" ? nextParam : nextParam?.[0] ?? "/dashboard",
  );

  const session = await auth();
  if (session?.user?.role === "admin") {
    redirect(next);
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/30 p-4">
      <LoginForm defaultNext={next} />
    </div>
  );
}
