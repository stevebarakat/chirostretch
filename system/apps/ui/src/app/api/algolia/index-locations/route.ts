import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { wpQuery } from "@/lib/cms/graphql";
import { ALL_LOCATIONS_QUERY } from "@/lib/graphql/queries";

const SINGLE_LOCATION_QUERY = `
  query LocationById($id: ID!) {
    location(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      slug
      title
      content
      shortDescription
      city
      state
      streetAddress
      zip
      phone
      email
      coordinates {
        lat
        lng
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

type Location = {
  id?: string;
  databaseId?: number;
  slug?: string;
  title?: string;
  content?: string;
  shortDescription?: string;
  city?: string;
  state?: string;
  streetAddress?: string;
  zip?: string;
  phone?: string;
  email?: string;
  coordinates?: {
    lat?: number;
    lng?: number;
  };
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
};

type LocationsResponse = {
  locations?: {
    nodes?: Location[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string;
    };
  };
};

function transformLocationToAlgolia(location: Location) {
  const contentText = location.content
    ? location.content.replace(/<[^>]*>/g, "").substring(0, 500)
    : "";

  return {
    objectID: location.id || location.databaseId?.toString() || "",
    title: location.title || "",
    slug: location.slug || "",
    content: contentText,
    city: location.city || "",
    state: location.state || "",
    streetAddress: location.streetAddress || "",
    zip: location.zip || "",
    phone: location.phone || "",
    email: location.email || "",
    shortDescription: location.shortDescription || "",
    latitude: location.coordinates?.lat || null,
    longitude: location.coordinates?.lng || null,
    image: location.featuredImage?.node?.sourceUrl || "",
    imageAlt: location.featuredImage?.node?.altText || "",
    type: "location" as const,
  };
}

export async function GET() {
  return NextResponse.json({
    message: "Use POST method to index locations",
    endpoint: "/api/algolia/index-locations",
    method: "POST",
  });
}

export async function POST(req: NextRequest) {
  if (!adminClient) {
    return NextResponse.json(
      { error: "Algolia admin client not configured" },
      { status: 500 }
    );
  }

  const indexName = algoliaConfig.indices.locations;

  // Check if this is a webhook request
  const webhookSecret = req.headers.get("x-webhook-secret");
  if (webhookSecret) {
    return handleWebhook(req, webhookSecret, indexName);
  }

  // Otherwise, do bulk reindex
  return handleBulkReindex(indexName);
}

// Handle single location webhook from WordPress
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
    const objectID = `location_${post_id}`;

    if (action === "delete") {
      await adminClient!.deleteObject({ indexName, objectID });
      return NextResponse.json({ deleted: true, objectID });
    }

    // Fetch single location from GraphQL
    const data = await wpQuery<{ location: Location }>(
      SINGLE_LOCATION_QUERY,
      { id: post_id }
    );

    if (!data?.location) {
      return NextResponse.json({ skipped: true, reason: "not_found" });
    }

    const record = {
      ...transformLocationToAlgolia(data.location),
      objectID, // Override with consistent ID
    };

    await adminClient!.saveObject({ indexName, body: record });
    return NextResponse.json({ indexed: true, objectID });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Algolia Webhook] Error:", errorMessage);
    return NextResponse.json(
      { error: "Webhook failed", message: errorMessage },
      { status: 500 }
    );
  }
}

// Handle bulk reindex (original behavior)
async function handleBulkReindex(indexName: string) {
  try {
    const allLocations: Location[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const variables: { first: number; after?: string | null } = {
        first: 100,
      };

      if (cursor) {
        variables.after = cursor;
      }

      const data = await wpQuery<LocationsResponse>(
        ALL_LOCATIONS_QUERY,
        variables
      );

      if (!data) {
        break;
      }

      if (data?.locations?.nodes) {
        allLocations.push(...data.locations.nodes);
      }

      hasNextPage = data?.locations?.pageInfo?.hasNextPage || false;
      cursor = data?.locations?.pageInfo?.endCursor || null;
    }

    const algoliaObjects = allLocations
      .filter((location) => location.id && location.slug)
      .map((loc) => ({
        ...transformLocationToAlgolia(loc),
        objectID: `location_${loc.databaseId}`, // Consistent ID format
      }));

    if (algoliaObjects.length === 0) {
      return NextResponse.json({
        success: false,
        indexed: 0,
        message:
          "No locations found to index. Check if locations exist in WordPress.",
        locationsFound: allLocations.length,
      });
    }

    // Clear index before saving to remove stale records with old objectID formats
    await adminClient!.clearObjects({ indexName });

    await adminClient!.saveObjects({
      indexName,
      objects: algoliaObjects,
    });

    return NextResponse.json({
      success: true,
      indexed: algoliaObjects.length,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    return NextResponse.json(
      {
        error: "Failed to index locations",
        message: errorMessage,
        details: errorStack,
      },
      { status: 500 }
    );
  }
}
