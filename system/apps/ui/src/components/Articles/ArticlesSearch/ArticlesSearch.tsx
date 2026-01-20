"use client";

import { InstantSearchNext } from "react-instantsearch-nextjs";
import { Configure } from "react-instantsearch";
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
    <InstantSearchNext
      searchClient={
        searchClient as unknown as Parameters<
          typeof InstantSearchNext
        >[0]["searchClient"]
      }
      indexName={algoliaConfig.indices.articles}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={12} />
      <ArchiveHeader
        title="Articles"
        subtitle="Insights, tips, and updates from our team"
        searchSlot={<AlgoliaSearchBox placeholder="Search articles..." />}
      />
      <InfiniteArticlesHits />
    </InstantSearchNext>
  );
}
