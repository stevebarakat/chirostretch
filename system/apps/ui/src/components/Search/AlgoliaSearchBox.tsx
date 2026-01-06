"use client";

import { useSearchBox } from "react-instantsearch";
import { Search, X } from "lucide-react";
import styles from "./AlgoliaSearchBox.module.css";

type AlgoliaSearchBoxProps = {
  placeholder?: string;
};

export function AlgoliaSearchBox({
  placeholder = "Search...",
}: AlgoliaSearchBoxProps) {
  const { query, refine, clear } = useSearchBox();

  return (
    <div className={styles.search}>
      <Search className={styles.searchIcon} size={20} aria-hidden="true" />
      <input
        type="search"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder={placeholder}
        className={styles.searchInput}
        aria-label={placeholder}
      />
      {query && (
        <button
          type="button"
          onClick={() => clear()}
          className={styles.clearButton}
          aria-label="Clear search"
        >
          <X size={16} />
        </button>
      )}
    </div>
  );
}
