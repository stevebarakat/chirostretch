import { NextResponse } from "next/server";
import { adminClient, isAlgoliaConfigured } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";

export async function GET() {
  if (!isAlgoliaConfigured()) {
    return NextResponse.json({
      configured: false,
      error: "Algolia is not configured. Please set environment variables.",
    });
  }

  if (!adminClient) {
    return NextResponse.json({
      configured: false,
      error: "Admin client not available. Check ALGOLIA_ADMIN_API_KEY.",
    });
  }

  try {
    const indices = [
      algoliaConfig.indices.products,
      algoliaConfig.indices.events,
      algoliaConfig.indices.articles,
    ];

    const status = await Promise.all(
      indices.map(async (indexName) => {
        try {
          const settings = await adminClient.getSettings({ indexName });
          const searchResult = await adminClient.searchSingleIndex({
            indexName,
            searchParams: { query: "", hitsPerPage: 0 },
          });
          return {
            name: indexName,
            exists: true,
            recordCount: searchResult.hits?.length || 0,
            totalHits: searchResult.nbHits || 0,
            searchableAttributes: settings.searchableAttributes || [],
          };
        } catch (error) {
          return {
            name: indexName,
            exists: false,
            error: String(error),
          };
        }
      })
    );

    return NextResponse.json({
      configured: true,
      indices: status,
    });
  } catch (error) {
    return NextResponse.json(
      {
        configured: true,
        error: "Failed to check index status",
        details: String(error),
      },
      { status: 500 }
    );
  }
}
