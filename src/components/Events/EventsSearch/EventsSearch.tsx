"use client";

import { InstantSearch, Configure } from "react-instantsearch-hooks-web";
import { searchClient, isAlgoliaConfigured } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { PageHeader } from "@/components/UI/PageHeader";
import { ErrorState } from "@/components/UI/ErrorState";
import { EventsProvider } from "../EventsContext";
import { EventSearchTrigger } from "./EventSearchTrigger";
import { InfiniteEventsHits } from "./InfiniteEventsHits";

export function EventsSearch() {
  if (!isAlgoliaConfigured() || !searchClient) {
    return (
      <ErrorState>Search is not configured. Please check your Algolia settings.</ErrorState>
    );
  }

  return (
    <EventsProvider>
      <PageHeader
        title="Events"
        subtitle="Discover upcoming events and workshops"
        searchSlot={<EventSearchTrigger />}
      />
      {/* @ts-expect-error - react-instantsearch-hooks-web types not compatible with React 19 and algoliasearch v5 */}
      <InstantSearch
        searchClient={
          searchClient as unknown as Parameters<
            typeof InstantSearch
          >[0]["searchClient"]
        }
        indexName={algoliaConfig.indices.events}
      >
        <Configure hitsPerPage={100} />
        <InfiniteEventsHits />
      </InstantSearch>
    </EventsProvider>
  );
}
