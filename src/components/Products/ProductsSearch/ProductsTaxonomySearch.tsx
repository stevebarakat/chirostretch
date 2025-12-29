"use client";

import { InstantSearch, Configure } from "react-instantsearch-hooks-web";
import { searchClient, isAlgoliaConfigured } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { PageHeader } from "@/components/UI/PageHeader";
import { AlgoliaSearchBox } from "@/components/Search";
import { InfiniteProductsHits } from "./InfiniteProductsHits";
import styles from "./ProductsSearch.module.css";

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
      <div className={styles.error}>
        <p>Search is not configured. Please check your Algolia settings.</p>
      </div>
    );
  }

  const filterAttribute =
    taxonomyType === "category" ? "categorySlugs" : "tagSlugs";
  const filters = `${filterAttribute}:${slug}`;

  return (
    // @ts-expect-error - react-instantsearch-hooks-web types not compatible with React 19 and algoliasearch v5
    <InstantSearch
      searchClient={
        searchClient as unknown as Parameters<typeof InstantSearch>[0]["searchClient"]
      }
      indexName={algoliaConfig.indices.products}
    >
      <Configure hitsPerPage={12} filters={filters} />
      <PageHeader
        title={title}
        subtitle={subtitle || `Browse ${title} products`}
        showCart
        searchSlot={<AlgoliaSearchBox placeholder="Search products..." />}
      />
      <InfiniteProductsHits />
    </InstantSearch>
  );
}
