import { NextResponse } from "next/server";
import { adminClient } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { fetchGraphQL } from "@/lib/graphql/client";

const ALL_LOCATIONS_QUERY = `
  query getAllLocations($first: Int, $after: String) {
    locations(first: $first, after: $after) {
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

type Location = {
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

export async function POST() {
  console.log("📍 Index locations API route called");

  if (!adminClient) {
    console.error("Algolia admin client not configured");
    return NextResponse.json(
      { error: "Algolia admin client not configured" },
      { status: 500 }
    );
  }

  try {
    const indexName = algoliaConfig.indices.locations;
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

      const data = await fetchGraphQL<LocationsResponse>(
        ALL_LOCATIONS_QUERY,
        variables
      );

      if (!data) {
        console.error("No data returned from GraphQL query");
        break;
      }

      if (data?.locations?.nodes) {
        allLocations.push(...data.locations.nodes);
      } else {
        console.warn("No location nodes in response:", data);
      }

      hasNextPage = data?.locations?.pageInfo?.hasNextPage || false;
      cursor = data?.locations?.pageInfo?.endCursor || null;
    }

    console.log(`Found ${allLocations.length} locations from WordPress`);

    if (allLocations.length > 0) {
      console.log(
        "Sample location data:",
        JSON.stringify(allLocations[0], null, 2)
      );
    }

    const algoliaObjects = allLocations
      .filter((location) => location.id && location.slug)
      .map(transformLocationToAlgolia);

    console.log(`Transformed ${algoliaObjects.length} locations for Algolia`);

    if (algoliaObjects.length > 0) {
      console.log(
        "Sample Algolia object:",
        JSON.stringify(algoliaObjects[0], null, 2)
      );
    }

    if (algoliaObjects.length === 0) {
      return NextResponse.json({
        success: false,
        indexed: 0,
        message:
          "No locations found to index. Check if locations exist in WordPress.",
        locationsFound: allLocations.length,
      });
    }

    await adminClient.saveObjects({
      indexName,
      objects: algoliaObjects,
    });

    return NextResponse.json({
      success: true,
      indexed: algoliaObjects.length,
    });
  } catch (error) {
    console.error("Error indexing locations:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    const errorStack = error instanceof Error ? error.stack : undefined;
    console.error("Error details:", { errorMessage, errorStack });
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
