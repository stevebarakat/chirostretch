"use client";

import { InstantSearch, Configure } from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { ArchiveHeader } from "@/components/Primitives";
import { ErrorState } from "@/components/Primitives";
import { AlgoliaSearchBox } from "@/components/Search";
import { InfiniteProductsHits } from "./InfiniteProductsHits";

type ProductsTaxonomySearchProps = {
  taxonomyType: "category" | "tag";
  slug: string;
  title: string;
  subtitle?: string;
};

export function ProductsTaxonomySearch({
  taxonomyType,
  slug,
  title,
  subtitle,
}: ProductsTaxonomySearchProps) {
  if (!isAlgoliaConfigured() || !searchClient) {
    return (
      <ErrorState>
        Search is not configured. Please check your Algolia settings.
      </ErrorState>
    );
  }

  const filterAttribute =
    taxonomyType === "category" ? "categorySlugs" : "tagSlugs";
  const filters = `${filterAttribute}:${slug}`;

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
      <Configure hitsPerPage={12} filters={filters} />
      <ArchiveHeader
        title={title}
        subtitle={subtitle || `Browse ${title} products`}
        showCart
        searchSlot={<AlgoliaSearchBox placeholder="Search products..." />}
      />
      <InfiniteProductsHits />
    </InstantSearch>
  );
}
