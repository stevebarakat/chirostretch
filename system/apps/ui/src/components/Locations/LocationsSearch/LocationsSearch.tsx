"use client";

import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Configure } from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { ArchiveHeader } from "@/components/Primitives";
import { ErrorState } from "@/components/Primitives";
import { AlgoliaSearchBox } from "@/components/Search";
import { InfiniteLocationsHits } from "./InfiniteLocationsHits";

export function LocationsSearch() {
  if (!isAlgoliaConfigured() || !searchClient) {
    return (
      <ErrorState>
        Search is not configured. Please check your Algolia settings.
      </ErrorState>
    );
  }

  return (
    <InstantSearchNext
      searchClient={
        searchClient as unknown as Parameters<
          typeof InstantSearchNext
        >[0]["searchClient"]
      }
      indexName={algoliaConfig.indices.locations}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={12} />
      <ArchiveHeader
        title="Our Locations"
        subtitle="Find a clinic near you and visit us today"
        searchSlot={<AlgoliaSearchBox placeholder="Search locations..." />}
      />
      <InfiniteLocationsHits />
    </InstantSearchNext>
  );
}
