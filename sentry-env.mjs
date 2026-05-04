/**
 * Single source for “is Sentry actually configured?” Used by both `next.config.mjs`
 * and TS entrypoints so we do not wrap the build when `.env.local` still has placeholders.
 */

export function isSentryConfigured() {
  const dsn =
    typeof process.env.SENTRY_DSN === "string"
      ? process.env.SENTRY_DSN.trim()
      : typeof process.env.NEXT_PUBLIC_SENTRY_DSN === "string"
        ? process.env.NEXT_PUBLIC_SENTRY_DSN.trim()
        : "";
  if (!dsn || !/^https:/.test(dsn)) return false;
  const lower = dsn.toLowerCase();
  if (
    lower.includes("your-sentry-dsn") ||
    lower.includes("changeme") ||
    lower.includes("example.com")
  ) {
    return false;
  }
  return true;
}
