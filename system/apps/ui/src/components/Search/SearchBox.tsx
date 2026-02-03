"use client";

import { useSearchBox } from "react-instantsearch";
import { Search, X } from "lucide-react";
import { clsx } from "clsx";
import { Input } from "@/components/Primitives";
import styles from "./SearchBox.module.css";

type SearchBoxProps = {
  placeholder?: string;
  autoFocus?: boolean;
  className?: string;
  inputClassName?: string;
};

export function SearchBox({
  placeholder = "Search...",
  autoFocus = false,
  className,
  inputClassName,
}: SearchBoxProps) {
  const { query, refine, clear } = useSearchBox();

  return (
    <div className={clsx(styles.search, className)}>
      <Search className={styles.searchIcon} size={20} aria-hidden="true" />
      <Input
        type="search"
        value={query}
        onChange={(e) => refine(e.target.value)}
        placeholder={placeholder}
        className={clsx(styles.searchInput, inputClassName)}
        aria-label={placeholder}
        autoFocus={autoFocus}
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
