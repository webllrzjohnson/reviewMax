import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/common/CookieBanner";
import { siteUrl, cn } from "@/lib/utils";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default: "ReviewMax — AI-powered product reviews",
    template: "%s | ReviewMax",
  },
  description:
    "Honest, AI-researched product reviews and buying guides. Find kitchen, tech, fitness, and home picks with clear pros, cons, and verdicts.",
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "ReviewMax",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          geist.variable,
        )}
      >
        <AppProviders>
          {children}
          <Toaster richColors position="top-center" />
          <CookieBanner />
        </AppProviders>
      </body>
    </html>
  );
}
