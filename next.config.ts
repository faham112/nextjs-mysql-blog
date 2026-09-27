import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  // Trailing slashes, www and legacy URLs are 301'd in one hop by src/middleware.ts
  skipTrailingSlashRedirect: true,
  // Always render <title>/<meta description> in <head> (no streamed metadata) for every client
  htmlLimitedBots: /.*/,
  compress: true,
  productionBrowserSourceMaps: false,
  experimental: {
    // Tree-shake icon imports to the icons actually used (also a Next default for lucide-react).
    optimizePackageImports: ["lucide-react"],
  },
  webpack(config, { isServer, dev }) {
    if (!isServer && !dev) {
      // Next always bundles a small polyfill module (Array.prototype.at/flat/flatMap,
      // Object.fromEntries/hasOwn, String trimStart/trimEnd, Promise.finally, URL.canParse...)
      // regardless of browserslist. Every browser in our browserslist (package.json:
      // Chrome/Edge/Firefox 111+, Safari 16.4+) has these natively, so drop it from the client
      // build (PageSpeed "Legacy JavaScript"). URL.canParse is only used by the dev overlay.
      config.resolve.alias = {
        ...config.resolve.alias,
        [require.resolve("next/dist/build/polyfills/polyfill-module")]: false,
      };
    }
    return config;
  },
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      { protocol: "https", hostname: "**" },
      { protocol: "http", hostname: "**" },
    ],
    unoptimized: false,
  },
  async rewrites() {
    return [
      {
        source: "/uploads/:name",
        destination: "/api/media/:name",
      },
    ];
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      // AdSense / Google tags load from many Google domains and iframes
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "font-src 'self' https://fonts.gstatic.com data:",
      "img-src 'self' data: blob: https: http:",
      "connect-src 'self' https:",
      "frame-src 'self' https:",
      "frame-ancestors 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join("; ");

    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
          {
            key: "Strict-Transport-Security",
            value: "max-age=63072000; includeSubDomains; preload",
          },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=(), payment=()",
          },
          { key: "Content-Security-Policy", value: csp },
        ],
      },
      {
        source: "/_next/static/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/uploads/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      {
        source: "/api/media/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          {
            key: "Cache-Control",
            value: "public, max-age=2592000, stale-while-revalidate=86400",
          },
        ],
      },
      // Static files in public/. Post covers are requested with a ?v=<content hash> query
      // (src/lib/coverSrcset.ts), so a year + immutable is safe. On Hostinger the front server
      // serves existing public/ files itself (Next never sees them), so public/.htaccess sets
      // the same headers there; these rules cover `next start` / any other host.
      ...[
        "/covers/:path*",
        "/logo.svg",
        "/favicon.ico",
        "/apple-touch-icon.png",
      ].map((source) => ({
        source,
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      })),
    ];
  },
};

export default nextConfig;
