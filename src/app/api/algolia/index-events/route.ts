import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { fetchGraphQL } from "@/lib/graphql/client";
import { ALL_EVENTS_QUERY } from "@/lib/graphql/queries";

const SINGLE_EVENT_QUERY = `
  query EventById($id: ID!) {
    event(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      slug
      title
      content
      startDate
      endDate
      venue {
        title
        city
        state
      }
      featuredImage {
        node {
          sourceUrl
          altText
        }
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
  startDate?: string;
  endDate?: string;
  venue?: {
    title?: string;
    city?: string;
    state?: string;
  };
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
    startDate: event.startDate || "",
    endDate: event.endDate || "",
    venue: event.venue?.title || "",
    venueCity: event.venue?.city || "",
    venueState: event.venue?.state || "",
    image: event.featuredImage?.node?.sourceUrl || "",
    imageAlt: event.featuredImage?.node?.altText || "",
    type: "event" as const,
  };
}

export async function POST(req: NextRequest) {
  if (!adminClient) {
    return NextResponse.json(
      { error: "Algolia admin client not configured" },
      { status: 500 }
    );
  }

  const indexName = algoliaConfig.indices.events;

  // Check if this is a webhook request
  const webhookSecret = req.headers.get("x-webhook-secret");
  if (webhookSecret) {
    return handleWebhook(req, webhookSecret, indexName);
  }

  // Otherwise, do bulk reindex
  return handleBulkReindex(indexName);
}

async function handleWebhook(
  req: NextRequest,
  secret: string,
  indexName: string
) {
  if (secret !== process.env.WP_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { post_id, action } = await req.json();
    const objectID = `event_${post_id}`;

    console.log("[Algolia Webhook] Events received:", { post_id, action, objectID });

    if (action === "delete") {
      await adminClient!.deleteObject({ indexName, objectID });
      return NextResponse.json({ deleted: true, objectID });
    }

    const data = await fetchGraphQL<{ event: Event }>(
      SINGLE_EVENT_QUERY,
      { id: post_id }
    );

    if (!data?.event) {
      return NextResponse.json({ skipped: true, reason: "not_found" });
    }

    const record = {
      ...transformEventToAlgolia(data.event),
      objectID,
    };

    await adminClient!.saveObject({ indexName, body: record });
    console.log("[Algolia Webhook] Indexed event:", objectID);
    return NextResponse.json({ indexed: true, objectID });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Algolia Webhook] Events error:", errorMessage);
    return NextResponse.json(
      { error: "Webhook failed", message: errorMessage },
      { status: 500 }
    );
  }
}

async function handleBulkReindex(indexName: string) {
  try {
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
      .map((e) => ({
        ...transformEventToAlgolia(e),
        objectID: `event_${e.databaseId}`,
      }));

    await adminClient!.saveObjects({
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
