"use client";

import { InstantSearch, Configure } from "react-instantsearch-hooks-web";
import { searchClient, isAlgoliaConfigured } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { PageHeader } from "@/components/UI/PageHeader";
import { AlgoliaSearchBox } from "@/components/Search";
import { InfiniteArticlesHits } from "./InfiniteArticlesHits";
import styles from "./ArticlesSearch.module.css";

export function ArticlesSearch() {
  if (!isAlgoliaConfigured() || !searchClient) {
    return (
      <div className={styles.error}>
        <p>Search is not configured. Please check your Algolia settings.</p>
      </div>
    );
  }

  return (
    // @ts-expect-error - react-instantsearch-hooks-web types not compatible with React 19
    <InstantSearch
      searchClient={searchClient as any}
      indexName={algoliaConfig.indices.articles}
    >
      <Configure hitsPerPage={12} />
      <PageHeader
        title="Articles"
        subtitle="Insights, tips, and updates from our team"
        searchSlot={<AlgoliaSearchBox placeholder="Search articles..." />}
      />
      <InfiniteArticlesHits />
    </InstantSearch>
  );
}
