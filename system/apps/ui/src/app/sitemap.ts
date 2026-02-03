import type { MetadataRoute } from "next";
import { getSiteConfig } from "@/config";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";

const SITEMAP_QUERY = `
  query SitemapData {
    pages(first: 1000, where: { parent: null }) {
      nodes {
        slug
        uri
        modified
      }
    }
    posts(first: 1000) {
      nodes {
        slug
        modified
      }
    }
    products(first: 1000) {
      nodes {
        slug
        modified
      }
    }
    locations(first: 1000) {
      nodes {
        slug
        modified
      }
    }
    events(first: 1000) {
      nodes {
        slug
        modified
      }
    }
  }
`;

type SitemapNode = {
  slug?: string;
  uri?: string;
  modified?: string;
};

type SitemapResponse = {
  pages?: { nodes?: SitemapNode[] };
  posts?: { nodes?: SitemapNode[] };
  products?: { nodes?: SitemapNode[] };
  locations?: { nodes?: SitemapNode[] };
  events?: { nodes?: SitemapNode[] };
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteConfig = getSiteConfig();
  const baseUrl = siteConfig.url;

  // Static pages with high priority
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/locations`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/articles`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/events`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/franchise-opportunities`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/pricing`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  try {
    const data = await wpQuery<SitemapResponse>(
      SITEMAP_QUERY,
      {},
      {
        revalidate: 3600,
        tags: [
          CACHE_TAGS.pages,
          CACHE_TAGS.posts,
          CACHE_TAGS.products,
          CACHE_TAGS.locations,
        ],
      }
    );

    const dynamicPages: MetadataRoute.Sitemap = [];

    // WordPress pages (excluding homepage which is already in static)
    if (data?.pages?.nodes) {
      for (const page of data.pages.nodes) {
        if (page.slug && page.slug !== "home" && page.slug !== "homepage") {
          // Use URI if available, otherwise construct from slug
          const path = page.uri || `/${page.slug}`;
          dynamicPages.push({
            url: `${baseUrl}${path}`,
            lastModified: page.modified ? new Date(page.modified) : new Date(),
            changeFrequency: "monthly",
            priority: 0.7,
          });
        }
      }
    }

    // Articles/Posts
    if (data?.posts?.nodes) {
      for (const post of data.posts.nodes) {
        if (post.slug) {
          dynamicPages.push({
            url: `${baseUrl}/articles/${post.slug}`,
            lastModified: post.modified ? new Date(post.modified) : new Date(),
            changeFrequency: "monthly",
            priority: 0.6,
          });
        }
      }
    }

    // Products
    if (data?.products?.nodes) {
      for (const product of data.products.nodes) {
        if (product.slug) {
          dynamicPages.push({
            url: `${baseUrl}/shop/${product.slug}`,
            lastModified: product.modified
              ? new Date(product.modified)
              : new Date(),
            changeFrequency: "weekly",
            priority: 0.7,
          });
        }
      }
    }

    // Locations
    if (data?.locations?.nodes) {
      for (const location of data.locations.nodes) {
        if (location.slug) {
          dynamicPages.push({
            url: `${baseUrl}/locations/${location.slug}`,
            lastModified: location.modified
              ? new Date(location.modified)
              : new Date(),
            changeFrequency: "monthly",
            priority: 0.8,
          });
        }
      }
    }

    // Events
    if (data?.events?.nodes) {
      for (const event of data.events.nodes) {
        if (event.slug) {
          dynamicPages.push({
            url: `${baseUrl}/events/${event.slug}`,
            lastModified: event.modified
              ? new Date(event.modified)
              : new Date(),
            changeFrequency: "weekly",
            priority: 0.6,
          });
        }
      }
    }

    return [...staticPages, ...dynamicPages];
  } catch (error) {
    console.error("Error generating sitemap:", error);
    // Return static pages only if WordPress query fails
    return staticPages;
  }
}
