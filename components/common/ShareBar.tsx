"use client";

import { Share2, Link as LinkIcon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ShareBar({
  url,
  title,
  className,
}: {
  url: string;
  title: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  }

  return (
    <div className={cn("flex flex-wrap items-center gap-2", className)}>
      <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        <Share2 className="h-3.5 w-3.5" aria-hidden />
        Share
      </span>

      {/* X / Twitter */}
      <a
        href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on X (Twitter)"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-sky-500/60 hover:bg-sky-50 hover:text-sky-600 dark:hover:bg-sky-950/30"
      >
        {/* X (Twitter) logo */}
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" />
        </svg>
      </a>

      {/* Facebook */}
      <a
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on Facebook"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-blue-600/60 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-950/30"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047v-2.66c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.236 2.686.236v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.265h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073Z" />
        </svg>
      </a>

      {/* WhatsApp */}
      <a
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Share on WhatsApp"
        className="inline-flex h-8 w-8 items-center justify-center rounded-full border bg-background text-muted-foreground transition-colors hover:border-emerald-500/60 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/30"
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
          <path d="M12.004 2.003C6.479 2.003 2 6.482 2 12.007c0 1.772.462 3.441 1.268 4.898L2.05 21.997l5.225-1.37A9.98 9.98 0 0012.004 22C17.53 22 22 17.52 22 12.007c0-5.524-4.471-10.004-9.996-10.004zm0 18.364a8.31 8.31 0 01-4.234-1.16l-.303-.18-3.101.813.828-3.019-.198-.311A8.334 8.334 0 013.659 12c0-4.601 3.743-8.344 8.345-8.344 4.603 0 8.346 3.743 8.346 8.344 0 4.603-3.744 8.367-8.346 8.367z" />
        </svg>
      </a>

      {/* Copy link */}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="h-8 gap-1.5 px-3 text-xs"
        onClick={copyLink}
        aria-label="Copy link to clipboard"
      >
        <LinkIcon className="h-3.5 w-3.5" aria-hidden />
        {copied ? "Copied!" : "Copy link"}
      </Button>
    </div>
  );
}
