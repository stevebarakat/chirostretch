const BASE_URL = process.env.NEXT_PUBLIC_FRONTEND_URL;
import fetchQuery from "@/lib/fetch";

type Page = {
  uri: string;
  date: string | number | Date;
  modified: string | number | Date;
};

/**
 * Route segment config.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 */
export const runtime = "edge";

/**
 * Route handler for generating sitemap.xml.
 *
 * @see https://www.sitemaps.org/protocol.html
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route
 */
export async function GET() {
  // Fetch all pages
  const { posts, pages } = await fetchQuery({ queryType: "getSitemapData" });
  const sitemapPages = pages.nodes;
  const sitemapPosts = posts.nodes;

  // Start sitemap XML
  let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  // Add all pages to sitemap
  sitemapPages.forEach((page: Page) => {
    xml += `
  <url>
    <loc>${BASE_URL}${page.uri}</loc>
    <lastmod>${new Date(page.modified).toISOString()}</lastmod>
  </url>`;
  });

  // Add all posts to sitemap'
  sitemapPosts.forEach((post: Page) => {
    xml += `
  <url>
    <loc>${BASE_URL}/blog${post.uri}</loc>
    <lastmod>${new Date(post.modified).toISOString()}</lastmod>
  </url>`;
  });

  // Close urlset tag
  xml += `</urlset>`;

  // Return response
  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  });
}
