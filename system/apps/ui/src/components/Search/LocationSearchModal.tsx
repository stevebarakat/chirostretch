"use client";

import { InstantSearchNext } from "react-instantsearch-nextjs";
import { useSearchBox, useHits, Configure } from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import Link from "next/link";
import { X, MapPin } from "lucide-react";
import { Modal, Text, Input } from "@/components/Primitives";
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
    <Input
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
        <Text as="h3" className={styles.hitTitle}>{hit.title}</Text>
        {addressParts && <Text className={styles.hitExcerpt}>{addressParts}</Text>}
        {hit.streetAddress && (
          <Text className={styles.hitExcerpt}>{hit.streetAddress}</Text>
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
        <Text>Enter a city, state, or zip code to find locations near you.</Text>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={styles.noResults}>
        <Text>No locations found for &quot;{query}&quot;.</Text>
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
          <Text as="h2" className={styles.title}>Find A Location</Text>
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
            <Text>Search is not configured.</Text>
          </div>
        ) : (
          <InstantSearchNext
            searchClient={
              searchClient as unknown as Parameters<
                typeof InstantSearchNext
              >[0]["searchClient"]
            }
            indexName={algoliaConfig.indices.locations}
            future={{ preserveSharedStateOnUnmount: true }}
          >
            <Configure hitsPerPage={10} />
            <SearchBox />
            <SearchResults onHitClick={onClose} />
          </InstantSearchNext>
        )}
      </div>
    </Modal>
  );
}
