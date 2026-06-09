import type { Metadata } from "next";
import { Geist, Playfair_Display } from "next/font/google";
import "./globals.css";
import { AppProviders } from "@/components/providers/AppProviders";
import { Toaster } from "sonner";
import { CookieBanner } from "@/components/common/CookieBanner";
import { siteUrl, cn } from "@/lib/utils";
import { Suspense } from "react";

/**
 * Root shell: fonts, providers, toast, and cookie consent.
 * Browse pages wrap content in `PublicShell` (sticky Header, Footer, Sidebar).
 */

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["400", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl()),
  title: {
    default:
      "Verdict — Unbiased Product Reviews for Kitchen, Tech & Fitness Gear",
    template: "%s | Verdict",
  },
  description:
    "Honest product reviews and buying guides. Find kitchen gadgets, home tech, and fitness gear picks with clear pros, cons, star ratings, and verdicts.",
  alternates: {
    types: {
      "application/rss+xml": [{ url: "/feed.xml", title: "Verdict — Product Reviews" }],
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Verdict",
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
          playfair.variable,
        )}
      >
        <AppProviders>
          {children}
          <Toaster richColors position="top-center" />
          <Suspense fallback={null}>
            <CookieBanner />
          </Suspense>
        </AppProviders>
      </body>
    </html>
  );
}
