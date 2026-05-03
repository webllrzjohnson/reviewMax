import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-muted/40">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="font-semibold">ReviewMax</p>
            <p className="mt-2 text-sm text-muted-foreground">
              AI-researched buying guides and honest product reviews. We may earn
              a commission when you purchase through our Amazon links—at no
              extra cost to you.
            </p>
          </div>
          <div>
            <p className="font-semibold">Explore</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/blog" className="hover:text-foreground">
                  Reviews & blog
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-foreground">
                  About
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <p className="font-semibold">Legal</p>
            <ul className="mt-2 space-y-2 text-sm text-muted-foreground">
              <li>
                <Link
                  href="/affiliate-disclosure"
                  className="hover:text-foreground"
                >
                  Affiliate disclosure
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className="hover:text-foreground">
                  Privacy policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground">
                  Terms of use
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <p className="mt-8 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} ReviewMax. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
