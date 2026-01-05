"use client";

import { InstantSearch, Configure } from "react-instantsearch-hooks-web";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { PageHeader } from "@/components/UI";
import { ErrorState } from "@/components/UI";
import { EventsProvider } from "../EventsContext";
import { EventSearchTrigger } from "./EventSearchTrigger";
import { InfiniteEventsHits } from "./InfiniteEventsHits";

export function EventsSearch() {
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
      indexName={algoliaConfig.indices.events}
    >
      <Configure hitsPerPage={100} />
      <PageHeader
        title="Events"
        subtitle="Discover upcoming events and workshops"
        searchSlot={<EventSearchTrigger />}
      />
      <InfiniteEventsHits />
    </InstantSearch>
  );
}
