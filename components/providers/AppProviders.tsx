"use client";

import { useEffect, useState } from "react";
import posthog from "posthog-js";
import { PostHogProvider } from "posthog-js/react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import {
  CONSENT_CHANGE_EVENT,
  getStoredConsent,
  type ConsentValue,
} from "@/lib/analytics-consent";

let posthogInitialized = false;

function PostHogPageView() {
  useEffect(() => {
    posthog.capture("$pageview");
  }, []);
  return null;
}

function PostHogShell({ children }: { children: React.ReactNode }) {
  const [consent, setConsent] = useState<ConsentValue | null>(null);

  useEffect(() => {
    setConsent(getStoredConsent());
    function onChange(event: Event) {
      setConsent((event as CustomEvent<ConsentValue>).detail);
    }
    window.addEventListener(CONSENT_CHANGE_EVENT, onChange);
    return () => window.removeEventListener(CONSENT_CHANGE_EVENT, onChange);
  }, []);

  useEffect(() => {
    const key = process.env.NEXT_PUBLIC_POSTHOG_KEY;
    if (
      key &&
      consent === "accepted" &&
      typeof window !== "undefined" &&
      !posthogInitialized
    ) {
      posthog.init(key, {
        api_host:
          process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com",
        person_profiles: "identified_only",
        capture_pageview: false,
      });
      posthogInitialized = true;
    }
  }, [consent]);

  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY || consent !== "accepted") {
    return <>{children}</>;
  }

  return (
    <PostHogProvider client={posthog}>
      <PostHogPageView />
      {children}
    </PostHogProvider>
  );
}

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <PostHogShell>{children}</PostHogShell>
    </ThemeProvider>
  );
}
