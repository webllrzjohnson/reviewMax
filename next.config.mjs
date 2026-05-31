/** @type {import('next').NextConfig} */
import { withSentryConfig } from "@sentry/nextjs";
import { isSentryConfigured } from "./sentry-env.mjs";

const nextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
  },
};

const sentryOptions = {
  silent: true,
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
};

export default isSentryConfigured()
  ? withSentryConfig(nextConfig, sentryOptions)
  : nextConfig;
