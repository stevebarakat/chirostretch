"use client";

import { InstantSearch, Configure } from "react-instantsearch-hooks-web";
import { searchClient, isAlgoliaConfigured } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { PageHeader } from "@/components/UI/PageHeader";
import { AlgoliaSearchBox } from "@/components/Search";
import { InfiniteEventsHits } from "./InfiniteEventsHits";
import styles from "./EventsSearch.module.css";

export function EventsSearch() {
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
      indexName={algoliaConfig.indices.events}
    >
      <Configure hitsPerPage={100} />
      <PageHeader
        title="Events"
        subtitle="Discover upcoming events and workshops"
        searchSlot={<AlgoliaSearchBox placeholder="Search events..." />}
      />
      <InfiniteEventsHits />
    </InstantSearch>
  );
}
