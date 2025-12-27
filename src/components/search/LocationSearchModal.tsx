"use client";

import {
  InstantSearch,
  useSearchBox,
  useHits,
  Configure,
} from "react-instantsearch-hooks-web";
import { searchClient, isAlgoliaConfigured } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import Link from "next/link";
import { X, MapPin } from "lucide-react";
import Modal from "@/components/UI/Modal/Modal";
import styles from "./SearchModal.module.css";

type LocationSearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

function SearchBox() {
  const { query, refine } = useSearchBox();
  const inputValue = query || "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    refine(e.target.value);
  }

  return (
    <input
      type="search"
      value={inputValue}
      onChange={handleChange}
      placeholder="Search by city, state, or zip..."
      className={styles.searchBox}
    />
  );
}

type LocationHit = {
  objectID: string;
  title: string;
  slug: string;
  city?: string;
  state?: string;
  streetAddress?: string;
  zip?: string;
  phone?: string;
  shortDescription?: string;
};

type HitComponentProps = {
  hit: LocationHit;
  onHitClick: () => void;
};

function LocationHitComponent({ hit, onHitClick }: HitComponentProps) {
  const addressParts = [hit.city, hit.state].filter(Boolean).join(", ");

  return (
    <Link
      href={`/locations/${hit.slug}`}
      className={styles.hit}
      onClick={onHitClick}
    >
      <div className={styles.hitImage}>
        <MapPin
          size={32}
          style={{ margin: "auto", color: "var(--color-text-tertiary)" }}
        />
      </div>
      <div className={styles.hitContent}>
        <h3 className={styles.hitTitle}>{hit.title}</h3>
        {addressParts && <p className={styles.hitExcerpt}>{addressParts}</p>}
        {hit.streetAddress && (
          <p className={styles.hitExcerpt}>{hit.streetAddress}</p>
        )}
      </div>
    </Link>
  );
}

type SearchResultsProps = {
  onHitClick: () => void;
};

function SearchResults({ onHitClick }: SearchResultsProps) {
  const { hits } = useHits<LocationHit>();
  const { query } = useSearchBox();

  if (!query || query.trim() === "") {
    return (
      <div className={styles.noResults}>
        <p>Enter a city, state, or zip code to find locations near you.</p>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>No locations found for &quot;{query}&quot;.</p>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      {hits.map((hit) => (
        <LocationHitComponent
          key={hit.objectID}
          hit={hit}
          onHitClick={onHitClick}
        />
      ))}
    </div>
  );
}

export default function LocationSearchModal({
  isOpen,
  onClose,
}: LocationSearchModalProps) {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className={styles.modal}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Find A Location</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close search"
          >
            <X size={24} />
          </button>
        </div>
        {!isAlgoliaConfigured() || !searchClient ? (
          <div className={styles.noResults}>
            <p>Search is not configured.</p>
          </div>
        ) : (
          /* @ts-expect-error - react-instantsearch-hooks-web types not compatible with React 19 and algoliasearch v5 */
          <InstantSearch
            searchClient={searchClient as unknown as Parameters<typeof InstantSearch>[0]["searchClient"]}
            indexName={algoliaConfig.indices.locations}
          >
            <Configure hitsPerPage={10} />
            <SearchBox />
            <SearchResults onHitClick={onClose} />
          </InstantSearch>
        )}
      </div>
    </Modal>
  );
}
