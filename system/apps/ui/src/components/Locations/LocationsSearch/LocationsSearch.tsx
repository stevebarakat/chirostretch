"use client";

import { InstantSearch, Configure } from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { ArchiveHeader } from "@/components/Primitives";
import { ErrorState } from "@/components/Primitives";
import { SearchBox } from "@/components/Search";
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
    <InstantSearch
      searchClient={searchClient}
      indexName={algoliaConfig.indices.locations}
      future={{ preserveSharedStateOnUnmount: false }}
    >
      <Configure hitsPerPage={12} />
      <ArchiveHeader
        title="Our Locations"
        subtitle="Find a clinic near you and visit us today"
        searchSlot={<SearchBox placeholder="Search locations..." />}
      />
      <InfiniteLocationsHits />
    </InstantSearch>
  );
}
