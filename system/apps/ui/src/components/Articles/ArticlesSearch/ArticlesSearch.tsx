"use client";

import { InstantSearch, Configure } from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { ArchiveHeader } from "@/components/Primitives";
import { ErrorState } from "@/components/Primitives";
import { AlgoliaSearchBox } from "@/components/Search";
import { InfiniteArticlesHits } from "./InfiniteArticlesHits";

export function ArticlesSearch() {
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
      indexName={algoliaConfig.indices.articles}
      future={{ preserveSharedStateOnUnmount: false }}
    >
      <Configure hitsPerPage={12} />
      <ArchiveHeader
        title="Articles"
        subtitle="Insights, tips, and updates from our team"
        searchSlot={<AlgoliaSearchBox placeholder="Search articles..." />}
      />
      <InfiniteArticlesHits />
    </InstantSearch>
  );
}
