import { getMenuBySlug } from "@/lib/queries";
import { getPageBySlug } from "@/lib/queries/getPageBySlug";
import { getPostBySlug } from "@/lib/queries/getPostBySlug";
import { getHomepage } from "./queries/getHomepage";
import { getHomepageSettings } from "@/lib/queries/getHomepageSettings";
import { getSitemapData } from "@/lib/queries/getSitemapData";
import { getAllPosts } from "@/lib/queries/getAllPosts";
import { getRobotsTxt } from "@/lib/queries/getRobotsTxt";
import { getFooterContent } from "@/lib/queries/getFooterContent";
import { getHierarchicalMenuBySlug } from "@/lib/queries";
import { getMenuItems } from "@/lib/queries/getMenuItems";
import { getCurrentPromo } from "@/lib/queries";

type Query = { queryType: string; variables?: {} };

export default async function fetchQuery({ queryType, variables }: Query) {
  let queryToUse = null;

  switch (queryType) {
    case "getSitemapData":
      queryToUse = getSitemapData;
      break;
    case "getAllPosts":
      queryToUse = getAllPosts;
      break;
    case "getPageBySlug":
      queryToUse = getPageBySlug;
      break;
    case "getPostBySlug":
      queryToUse = getPostBySlug;
      break;
    case "getHierarchicalMenuBySlug":
      queryToUse = getHierarchicalMenuBySlug;
      break;
    case "getHomepage":
      queryToUse = getHomepage;
      break;
    case "getMenuBySlug":
      queryToUse = getMenuBySlug;
      break;
    case "getMenuItems":
      queryToUse = getMenuItems;
      break;
    case "getCurrentPromo":
      queryToUse = getCurrentPromo;
      break;
    case "getFooterContent":
      queryToUse = getFooterContent;
      break;
    case "getHomepageSettings":
      queryToUse = getHomepageSettings;
      break;
    case "getRobotsTxt":
      queryToUse = getRobotsTxt;
      break;
    default:
      break;
  }

  const res = await fetch(`${process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    next: {
      revalidate: 60,
    },
    body: JSON.stringify({ query: queryToUse, variables }),
  });

  const { data } = await res.json();

  if (data) {
    return data;
  } else {
    throw new Error(`There is an error with the query: ${queryType}`);
  }
  // }
}
