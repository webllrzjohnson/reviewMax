import type { ReactNode } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Sidebar } from "@/components/layout/Sidebar";

export function PublicShell({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <div className="mx-auto flex w-full max-w-6xl flex-1 gap-8 px-4 py-8 sm:px-6">
        <main className="min-w-0 flex-1">{children}</main>
        <aside className="hidden w-72 shrink-0 lg:block">
          <Sidebar />
        </aside>
      </div>
      <Footer />
    </div>
  );
}
