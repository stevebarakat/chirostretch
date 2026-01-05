"use client";

import { InstantSearch, Configure } from "react-instantsearch-hooks-web";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { PageHeader } from "@/components/UI";
import { ErrorState } from "@/components/UI";
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
    // @ts-expect-error - react-instantsearch types incompatible with React 19
    <InstantSearch
      searchClient={
        searchClient as unknown as Parameters<
          typeof InstantSearch
        >[0]["searchClient"]
      }
      indexName={algoliaConfig.indices.locations}
    >
      <Configure hitsPerPage={12} />
      <PageHeader
        title="Our Locations"
        subtitle="Find a clinic near you and visit us today"
        searchSlot={<AlgoliaSearchBox placeholder="Search locations..." />}
      />
      <InfiniteLocationsHits />
    </InstantSearch>
  );
}
