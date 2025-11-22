import fetchQuery from "@/lib/fetch";
import { getRobotsData } from "@/utils/meta-helpers";

type Rule = {
  userAgent: string | string[];
  allow: string | string[] | undefined;
  disallow?: string | string[] | undefined;
  crawlDelay?: number | undefined;
};

/**
 * Route segment config.
 *
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route-segment-config
 */
export const runtime = "edge";

/**
 * Route handler for generating robots.txt.
 *
 * @see https://www.robotstxt.org
 * @see https://nextjs.org/docs/app/api-reference/file-conventions/route
 */
export async function GET() {
  // Fetch robots.txt data
  const { robotz } = await fetchQuery({ queryType: "getRobotsTxt" });
  const { robots } = robotz.robots;

  // Start robots.txt
  const rules: Rule[] = getRobotsData(robots);

  let txt = "";

  rules.forEach((rule) => {
    txt += `User-agent: ${rule.userAgent}\n`;

    if (rule.allow) {
      txt += `Allow: ${rule.allow}\n`;
    }

    if (rule.disallow) {
      txt += `Disallow: ${rule.disallow}\n`;
    }

    if (rule.crawlDelay) {
      txt += `Crawl-delay: ${rule.crawlDelay}\n`;
    }

    txt += "\n";
  });
  txt += `sitemap: ${process.env.NEXT_PUBLIC_FRONTEND_URL}/sitemap.xml\n`;
  // end robots.txt

  // Return response
  return new Response(txt, {
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
  });
}
