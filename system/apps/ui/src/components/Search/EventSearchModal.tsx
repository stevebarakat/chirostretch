"use client";

import {
  InstantSearch,
  useSearchBox,
  useHits,
  Configure,
} from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import Image from "next/image";
import { X, Calendar } from "lucide-react";
import { Modal } from "@/components/UI";
import { useEventsContext } from "@/components/Events/EventsContext";
import styles from "./SearchModal.module.css";

type EventSearchModalProps = {
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
      placeholder="Search by event name, location, or date..."
      className={styles.searchBox}
      autoFocus
    />
  );
}

type EventHit = {
  objectID: string;
  title: string;
  slug: string;
  startDate?: string;
  venue?: string;
  venueCity?: string;
  venueState?: string;
  image?: string;
  imageAlt?: string;
};

function formatDate(startDate?: string): string {
  if (!startDate) return "";
  return new Date(startDate).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

type HitComponentProps = {
  hit: EventHit;
  onSelect: (slug: string) => void;
};

function EventHitComponent({ hit, onSelect }: HitComponentProps) {
  const locationParts = [hit.venueCity, hit.venueState]
    .filter(Boolean)
    .join(", ");

  return (
    <button
      type="button"
      className={styles.hit}
      onClick={() => onSelect(hit.slug)}
    >
      <div className={styles.hitImage}>
        {hit.image ? (
          <Image
            src={hit.image}
            alt={hit.imageAlt || hit.title}
            width={80}
            height={80}
            className={styles.hitImageInner}
          />
        ) : (
          <Calendar
            size={32}
            style={{ margin: "auto", color: "var(--color-text-tertiary)" }}
          />
        )}
      </div>
      <div className={styles.hitContent}>
        <h3 className={styles.hitTitle}>{hit.title}</h3>
        {hit.startDate && (
          <p className={styles.hitExcerpt}>{formatDate(hit.startDate)}</p>
        )}
        {locationParts && <p className={styles.hitExcerpt}>{locationParts}</p>}
      </div>
    </button>
  );
}

type SearchResultsProps = {
  onSelect: (slug: string) => void;
};

function SearchResults({ onSelect }: SearchResultsProps) {
  const { hits } = useHits<EventHit>();
  const { query } = useSearchBox();

  if (!query || query.trim() === "") {
    return (
      <div className={styles.noResults}>
        <p>Search for events by name, location, or keyword.</p>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>No events found for &quot;{query}&quot;.</p>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      {hits.map((hit) => (
        <EventHitComponent key={hit.objectID} hit={hit} onSelect={onSelect} />
      ))}
    </div>
  );
}

export default function EventSearchModal({
  isOpen,
  onClose,
}: EventSearchModalProps) {
  const eventsContext = useEventsContext();

  function handleEventSelect(slug: string) {
    eventsContext?.scrollToEvent(slug);
    onClose();
  }

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className={styles.modal}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <h2 className={styles.title}>Search Events</h2>
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
          <InstantSearch
            searchClient={
              searchClient as unknown as Parameters<
                typeof InstantSearch
              >[0]["searchClient"]
            }
            indexName={algoliaConfig.indices.events}
            future={{ preserveSharedStateOnUnmount: true }}
          >
            <Configure hitsPerPage={10} />
            <SearchBox />
            <SearchResults onSelect={handleEventSelect} />
          </InstantSearch>
        )}
      </div>
    </Modal>
  );
}
