"use client";

import { InstantSearch, Configure } from "react-instantsearch-hooks-web";
import { searchClient, isAlgoliaConfigured } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { PageHeader } from "@/components/UI/PageHeader";
import { ErrorState } from "@/components/UI/ErrorState";
import { AlgoliaSearchBox } from "@/components/Search";
import { InfiniteArticlesHits } from "./InfiniteArticlesHits";

type ArticlesTaxonomySearchProps = {
  taxonomyType: "category" | "tag";
  slug: string;
  title: string;
  subtitle?: string;
};

export function ArticlesTaxonomySearch({
  taxonomyType,
  slug,
  title,
  subtitle,
}: ArticlesTaxonomySearchProps) {
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
    // @ts-expect-error - react-instantsearch-hooks-web types not compatible with React 19 and algoliasearch v5
    <InstantSearch
      searchClient={
        searchClient as unknown as Parameters<typeof InstantSearch>[0]["searchClient"]
      }
      indexName={algoliaConfig.indices.articles}
    >
      <Configure hitsPerPage={12} filters={filters} />
      <PageHeader
        title={title}
        subtitle={subtitle || `Browse ${title} articles`}
        searchSlot={<AlgoliaSearchBox placeholder="Search articles..." />}
      />
      <InfiniteArticlesHits />
    </InstantSearch>
  );
}
