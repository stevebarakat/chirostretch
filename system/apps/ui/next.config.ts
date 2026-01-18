import type { NextConfig } from "next";
import withBundleAnalyzer from "@next/bundle-analyzer";

const nextConfig: NextConfig = {
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },

  experimental: {
    optimizePackageImports: ["lucide-react", "react-icons", "date-fns", "zod"],
  },

  images: {
    remotePatterns: [
      // Local WordPress (HTTP)
      {
        protocol: "http",
        hostname: "chirostretch-copy.local",
        pathname: "/wp-content/uploads/**",
      },
      // Local WordPress (HTTPS)
      {
        protocol: "https",
        hostname: "chirostretch-copy.local",
        pathname: "/wp-content/uploads/**",
      },

      // Localhost
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "localhost",
        pathname: "/wp-content/uploads/**",
      },

      // 127.0.0.1
      {
        protocol: "http",
        hostname: "127.0.0.1",
        pathname: "/wp-content/uploads/**",
      },
      {
        protocol: "https",
        hostname: "127.0.0.1",
        pathname: "/wp-content/uploads/**",
      },

      {
        protocol: "https",
        hostname: "cms.chirostretch.site",
      },

      // Unsplash (placeholder images)
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },

      // Gravatar (user avatars)
      {
        protocol: "https",
        hostname: "www.gravatar.com",
      },
    ],

    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 31536000, // 1 year
    dangerouslyAllowLocalIP: true,
  },

  async rewrites() {
    return [
      {
        source: "/cms-assets/:path*",
        destination: "https://cms.chirostretch.site/wp-content/uploads/:path*",
      },
    ];
  },

  async headers() {
    // Only apply aggressive caching in production
    if (process.env.NODE_ENV !== "production") {
      return [];
    }

    return [
      {
        source: "/_next/image",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        source: "/images/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
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
    ];
  },
};

const bundleAnalyzer = withBundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

export default bundleAnalyzer(nextConfig);
