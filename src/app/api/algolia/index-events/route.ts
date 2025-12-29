import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { wpQuery } from "@/lib/wp/graphql";
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
      cost
      eventsCategories {
        nodes {
          name
          slug
        }
      }
      venue {
        title
        city
        state
      }
      organizers {
        nodes {
          title
        }
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
  cost?: string;
  eventsCategories?: {
    nodes?: {
      name?: string;
      slug?: string;
    }[];
  };
  venue?: {
    title?: string;
    city?: string;
    state?: string;
  };
  organizers?: {
    nodes?: {
      title?: string;
    }[];
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

function formatMonth(dateStr?: string): { month: string; monthShort: string } {
  if (!dateStr) return { month: "", monthShort: "" };
  const date = new Date(dateStr);
  return {
    month: date.toLocaleDateString("en-US", { month: "long" }),
    monthShort: date.toLocaleDateString("en-US", { month: "short" }),
  };
}

function transformEventToAlgolia(event: Event) {
  const { month, monthShort } = formatMonth(event.startDate);
  return {
    objectID: event.id || event.databaseId?.toString() || "",
    title: event.title || "",
    slug: event.slug || "",
    content: event.content?.replace(/<[^>]*>/g, "").substring(0, 500) || "",
    startDate: event.startDate || "",
    endDate: event.endDate || "",
    month,
    monthShort,
    cost: event.cost || "",
    venue: event.venue?.title || "",
    venueCity: event.venue?.city || "",
    venueState: event.venue?.state || "",
    organizer: event.organizers?.nodes?.[0]?.title || "",
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

    const data = await wpQuery<{ event: Event }>(
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

      const data = await wpQuery<EventsResponse>(
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

    // Clear index before saving to remove stale records with old objectID formats
    await adminClient!.clearObjects({ indexName });

    await adminClient!.saveObjects({
      indexName,
      objects: algoliaObjects,
    });

    // Configure searchable attributes and sorting
    await adminClient!.setSettings({
      indexName,
      indexSettings: {
        searchableAttributes: [
          "title",
          "month",
          "monthShort",
          "organizer",
          "venue",
          "venueCity",
          "venueState",
        ],
        ranking: [
          "asc(startDate)",
          "typo",
          "geo",
          "words",
          "filters",
          "proximity",
          "attribute",
          "exact",
          "custom",
        ],
      },
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
