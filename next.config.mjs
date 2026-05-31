/** @type {import('next').NextConfig} */
import { withSentryConfig } from "@sentry/nextjs";
import { isSentryConfigured } from "./sentry-env.mjs";

const nextConfig = {
  output: "standalone",
  experimental: {
    outputFileTracingExcludes: {
      "*": [
        "node_modules/@swc/**",
        "node_modules/@esbuild/**",
        "node_modules/esbuild/**",
        "node_modules/webpack/**",
        "node_modules/rollup/**",
        "node_modules/terser/**",
        "node_modules/typescript/**",
        "node_modules/drizzle-kit/**",
        "node_modules/@sentry/cli/**",
        "node_modules/eslint/**",
      ],
    },
  },
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
