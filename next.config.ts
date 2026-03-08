import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const useEmulators = process.env.NEXT_PUBLIC_USE_FIREBASE_EMULATORS === "true";

const connectSrc = [
  "'self'",
  "https://*.googleapis.com",
  "https://*.firebaseio.com",
  "wss://*.firebaseio.com",
  "https://api.stripe.com",
  "https://*.firebaseapp.com",
  ...(useEmulators
    ? [
        "http://127.0.0.1:9099",
        "http://127.0.0.1:8080",
        "http://127.0.0.1:9199",
        "ws://127.0.0.1:9099",
        "ws://127.0.0.1:8080",
      ]
    : []),
].join(" ");

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: [
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        { key: "Cross-Origin-Opener-Policy", value: "same-origin-allow-popups" },
        {
          key: "Content-Security-Policy",
          value: [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com https://apis.google.com https://accounts.google.com https://www.gstatic.com",
            "style-src 'self' 'unsafe-inline' https://accounts.google.com",
            "img-src 'self' data: blob: https://firebasestorage.googleapis.com https://images.unsplash.com https://*.googleusercontent.com",
            "font-src 'self' https://fonts.gstatic.com",
            `connect-src ${connectSrc} https://accounts.google.com https://securetoken.googleapis.com`,
            "frame-src https://js.stripe.com https://*.firebaseapp.com https://accounts.google.com",
            "object-src 'none'",
            "base-uri 'self'",
          ].join("; "),
        },
      ],
    },
  ],
};

const withNextIntl = createNextIntlPlugin("./lib/i18n/request.ts");
export default withNextIntl(nextConfig);
