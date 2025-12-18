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
          "/dashboard",
          "/profile",
          "/addresses",
          "/payment-methods",
          "/orders",
          "/downloads",
          "/franchisee",
          "/staff",
          "/application",
          "/cart",
          "/checkout",
          "/checkout/success",
          "/login",
          "/logout",
          "/auth-test",
          "/_next/",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
