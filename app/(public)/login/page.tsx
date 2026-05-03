import { LoginForm } from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign in",
  description: "Admin sign in for ReviewMax",
};

type Props = {
  searchParams: Promise<{ next?: string | string[] }>;
};

export default async function LoginPage({ searchParams }: Props) {
  const sp = await searchParams;
  const nextParam = sp.next;
  const next =
    typeof nextParam === "string" ? nextParam : nextParam?.[0] ?? "/dashboard";

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center bg-muted/30 p-4">
      <LoginForm defaultNext={next} />
    </div>
  );
}
