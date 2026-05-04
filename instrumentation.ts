import { isSentryConfigured } from "./sentry-env.mjs";

export async function register() {
  if (!isSentryConfigured()) return;

  if (process.env.NEXT_RUNTIME === "nodejs") {
    await import("./sentry.server.config");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    await import("./sentry.edge.config");
  }
}
