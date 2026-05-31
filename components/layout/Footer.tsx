import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium"
          aria-label="Footer"
        >
          <Link
            href="/about"
            className="text-muted-foreground hover:text-foreground"
          >
            About
          </Link>
          <Link
            href="/affiliate-disclosure"
            className="text-muted-foreground hover:text-foreground"
          >
            Affiliate Disclosure
          </Link>
          <Link
            href="/privacy-policy"
            className="text-muted-foreground hover:text-foreground"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-muted-foreground hover:text-foreground"
          >
            Terms
          </Link>
        </nav>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-muted-foreground">
          As an Amazon Associate, Verdict earns from qualifying purchases.
          Prices and availability change; always verify details on the
          retailer&apos;s site before you buy.
        </p>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Verdict. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
