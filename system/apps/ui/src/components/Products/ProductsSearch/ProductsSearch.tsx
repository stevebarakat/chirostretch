"use client";

import { InstantSearch, Configure } from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { ArchiveHeader } from "@/components/Layout";
import { ErrorState } from "@/components/Primitives";
import { SearchBox } from "@/components/Search";
import { InfiniteProductsHits } from "./InfiniteProductsHits";

type ProductsSearchProps = {
  title?: string;
  subtitle?: string;
};

export function ProductsSearch({
  title = "Products",
  subtitle = "Browse our full collection",
}: ProductsSearchProps) {
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
      indexName={algoliaConfig.indices.products}
      future={{ preserveSharedStateOnUnmount: false }}
    >
      <Configure hitsPerPage={12} />
      <ArchiveHeader
        title={title}
        subtitle={subtitle}
        showCart
        searchSlot={<SearchBox placeholder="Search products..." />}
      />
      <InfiniteProductsHits />
    </InstantSearch>
  );
}
