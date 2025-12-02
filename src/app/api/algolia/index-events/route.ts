import { NextResponse } from "next/server";
import { adminClient } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { fetchGraphQL } from "@/lib/graphql/client";

const ALL_EVENTS_QUERY = `
  query getAllEvents($first: Int, $after: String) {
    events(first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        content
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

type Event = {
  id?: string;
  databaseId?: number;
  slug?: string;
  title?: string;
  content?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
};

type EventsResponse = {
  events?: {
    nodes?: Event[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string;
    };
  };
};

function transformEventToAlgolia(event: Event) {
  return {
    objectID: event.id || event.databaseId?.toString() || "",
    title: event.title || "",
    slug: event.slug || "",
    content: event.content?.replace(/<[^>]*>/g, "").substring(0, 500) || "",
    image: event.featuredImage?.node?.sourceUrl || "",
    imageAlt: event.featuredImage?.node?.altText || "",
    type: "event" as const,
  };
}

export async function POST() {
  if (!adminClient) {
    return NextResponse.json(
      { error: "Algolia admin client not configured" },
      { status: 500 }
    );
  }

  try {
    const indexName = algoliaConfig.indices.events;
    const allEvents: Event[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const variables: { first: number; after?: string | null } = {
        first: 100,
      };

      if (cursor) {
        variables.after = cursor;
      }

      const data = await fetchGraphQL<EventsResponse>(
        ALL_EVENTS_QUERY,
        variables
      );

      if (data?.events?.nodes) {
        allEvents.push(...data.events.nodes);
      }

      hasNextPage = data?.events?.pageInfo?.hasNextPage || false;
      cursor = data?.events?.pageInfo?.endCursor || null;
    }

    const algoliaObjects = allEvents
      .filter((event) => event.id && event.slug)
      .map(transformEventToAlgolia);

    await adminClient.saveObjects({
      indexName,
      objects: algoliaObjects,
    });

    return NextResponse.json({
      success: true,
      indexed: algoliaObjects.length,
    });
  } catch (error) {
    console.error("Error indexing events:", error);
    return NextResponse.json(
      { error: "Failed to index events", details: String(error) },
      { status: 500 }
    );
  }
}
