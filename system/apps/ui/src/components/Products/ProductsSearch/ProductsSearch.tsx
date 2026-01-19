"use client";

import { InstantSearch, Configure } from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { ArchiveHeader } from "@/components/Primitives";
import { ErrorState } from "@/components/Primitives";
import { AlgoliaSearchBox } from "@/components/Search";
import { InfiniteProductsHits } from "./InfiniteProductsHits";

export function ProductsSearch() {
  if (!isAlgoliaConfigured() || !searchClient) {
    return (
      <ErrorState>
        Search is not configured. Please check your Algolia settings.
      </ErrorState>
    );
  }

  return (
    <InstantSearch
      searchClient={
        searchClient as unknown as Parameters<
          typeof InstantSearch
        >[0]["searchClient"]
      }
      indexName={algoliaConfig.indices.products}
      future={{ preserveSharedStateOnUnmount: true }}
    >
      <Configure hitsPerPage={12} />
      <ArchiveHeader
        title="Shop"
        subtitle="Browse our collection"
        showCart
        searchSlot={<AlgoliaSearchBox placeholder="Search products..." />}
      />
      <InfiniteProductsHits />
    </InstantSearch>
  );
}
