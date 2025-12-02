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
        locationDetails {
          city
          email
          hours {
            close
            day
            open
          }
          phone
          services
          shortDescription
          state
          streetAddress
          zip
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
  locationDetails?: {
    city?: string;
    email?: string;
    hours?: Array<{
      close?: string;
      day?: string;
      open?: string;
    }>;
    phone?: string;
    services?: string;
    shortDescription?: string;
    state?: string;
    streetAddress?: string;
    zip?: string;
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

  const details = location.locationDetails;

  return {
    objectID: location.id || location.databaseId?.toString() || "",
    title: location.title || "",
    slug: location.slug || "",
    content: contentText,
    city: details?.city || "",
    state: details?.state || "",
    streetAddress: details?.streetAddress || "",
    zip: details?.zip || "",
    phone: details?.phone || "",
    email: details?.email || "",
    shortDescription: details?.shortDescription || "",
    services: details?.services || "",
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
  if (!adminClient) {
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
      .map(transformLocationToAlgolia);

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
