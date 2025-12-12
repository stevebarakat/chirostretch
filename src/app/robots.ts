import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/config";

export default function robots(): MetadataRoute.Robots {
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url;

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: [
          "/api/",
          "/admin/",
          "/my-account/",
          "/cart",
          "/checkout",
          "/checkout/success",
          "/login",
          "/auth-test",
          "/_next/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
