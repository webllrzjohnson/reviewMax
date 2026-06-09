"use client";

import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  getStoredConsent,
  setStoredConsent,
  type ConsentValue,
} from "@/lib/analytics-consent";

export function CookieBanner() {
  const searchParams = useSearchParams()
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setVisible(getStoredConsent() === null);
  }, []);

  if (searchParams.get('headless') === '1') return null
  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      aria-modal="false"
      className="fixed inset-x-0 bottom-0 z-50 border-t bg-background/95 p-4 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/85"
    >
      <div className="mx-auto flex max-w-4xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-muted-foreground">
          We use essential cookies and optional analytics (PostHog) to improve
          the site. You can accept or decline non-essential cookies. See our{" "}
          <a href="/privacy-policy" className="font-medium underline">
            Privacy Policy
          </a>
          .
        </p>
        <div className="flex shrink-0 flex-wrap gap-2 sm:justify-end">
          <Button
            type="button"
            variant="outline"
            onClick={() => persistPreference("declined")}
          >
            Decline
          </Button>
          <Button type="button" onClick={() => persistPreference("accepted")}>
            Accept
          </Button>
        </div>
      </div>
    </div>
  );

  function persistPreference(value: ConsentValue) {
    setStoredConsent(value);
    setVisible(false);
  }
}