"use client";

import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Configure } from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { ArchiveHeader } from "@/components/Layout";
import { ErrorState } from "@/components/Primitives";
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
    <EventsProvider>
      <InstantSearchNext
        searchClient={
          searchClient as unknown as Parameters<
            typeof InstantSearchNext
          >[0]["searchClient"]
        }
        indexName={algoliaConfig.indices.events}
        future={{ preserveSharedStateOnUnmount: false }}
      >
        <Configure hitsPerPage={100} />
        <ArchiveHeader
          title="Events"
          subtitle="Discover upcoming events and workshops"
          searchSlot={<EventSearchTrigger />}
        />
        <InfiniteEventsHits />
      </InstantSearchNext>
    </EventsProvider>
  );
}
