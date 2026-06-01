import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t border-zinc-800 bg-zinc-900">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm font-medium"
          aria-label="Footer"
        >
          <Link
            href="/blog"
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Reviews
          </Link>
          <Link
            href="/compare"
            className="text-zinc-300 hover:text-white transition-colors"
          >
            Compare
          </Link>
          <Link
            href="/about"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            About
          </Link>
          <Link
            href="/contact"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Contact
          </Link>
          <Link
            href="/affiliate-disclosure"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Affiliate Disclosure
          </Link>
          <Link
            href="/privacy-policy"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="/terms"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Terms
          </Link>
        </nav>

        <p className="mx-auto mt-8 max-w-3xl text-center text-sm text-zinc-500">
          As an Amazon Associate, Verdict earns from qualifying purchases.
          Prices and availability change; always verify details on the
          retailer&apos;s site before you buy.
        </p>

        <p className="mt-8 text-center text-xs text-zinc-600">
          © {new Date().getFullYear()} Verdict. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
