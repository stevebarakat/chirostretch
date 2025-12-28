"use client";

import { InstantSearch, Configure } from "react-instantsearch-hooks-web";
import { searchClient, isAlgoliaConfigured } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { PageHeader } from "@/components/UI/PageHeader";
import { AlgoliaSearchBox } from "@/components/Search";
import { InfiniteLocationsHits } from "./InfiniteLocationsHits";
import styles from "./LocationsSearch.module.css";

export function LocationsSearch() {
  if (!isAlgoliaConfigured() || !searchClient) {
    return (
      <div className={styles.error}>
        <p>Search is not configured. Please check your Algolia settings.</p>
      </div>
    );
  }

  return (
    // @ts-expect-error - react-instantsearch-hooks-web types not compatible with React 19 and algoliasearch v5
    <InstantSearch
      searchClient={searchClient as unknown as Parameters<typeof InstantSearch>[0]["searchClient"]}
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
