import Link from "next/link";
import { SignOutButton } from "@/components/admin/SignOutButton";

export const dynamic = "force-dynamic";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-muted/20">
      <header className="border-b bg-background">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
          <Link href="/dashboard" className="font-semibold">
            Admin
          </Link>
          <nav className="flex items-center gap-3 text-sm">
            <Link href="/dashboard/new-review" className="text-primary hover:underline">
              New review request
            </Link>
            <Link href="/" className="text-muted-foreground hover:text-foreground">
              View site
            </Link>
            <SignOutButton />
          </nav>
        </div>
      </header>
      <div className="mx-auto max-w-3xl px-4 py-8">{children}</div>
    </div>
  );
}
