import { PublicShell } from "@/components/layout/PublicShell";

export const revalidate = 3600;

export default function MainBrowseLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <PublicShell>{children}</PublicShell>;
}
