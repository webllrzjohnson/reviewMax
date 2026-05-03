import { PublicShell } from "@/components/layout/PublicShell";

export default function MainBrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell>{children}</PublicShell>;
}
