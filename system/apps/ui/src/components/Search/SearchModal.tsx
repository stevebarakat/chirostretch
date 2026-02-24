"use client";
import { usePathname } from "next/navigation";
import { InstantSearchNext } from "react-instantsearch-nextjs";
import { useSearchBox, useHits, Configure } from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import Link from "next/link";
import Image from "next/image";
import { X, Search } from "lucide-react";
import { Modal, Text } from "@/components/Primitives";
import { SearchBox } from "./SearchBox";
import styles from "./SearchModal.module.css";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

type ModalConfig = {
  title: string;
  placeholder: string;
  emptyState: string;
};

function getModalConfig(pathname: string): ModalConfig {
  const path = pathname.toLowerCase();

  if (path.startsWith("/events")) {
    return {
      title: "Search Events",
      placeholder: "Search by event name, location, or date...",
      emptyState: "Search for events by name, location, or keyword.",
    };
  }

  if (
    path.startsWith("/blog") ||
    path.startsWith("/articles") ||
    path.startsWith("/insights") ||
    path.startsWith("/posts") ||
    path.startsWith("/category")
  ) {
    return {
      title: "Search Articles",
      placeholder: "Search by title, topic, or keyword...",
      emptyState: "Search for articles by title, topic, or keyword.",
    };
  }

  if (path.startsWith("/locations")) {
    return {
      title: "Search Locations",
      placeholder: "Search by city, state, or zip...",
      emptyState: "Search for a location by city, state, or zip code.",
    };
  }

  if (
    path.startsWith("/shop") ||
    path.startsWith("/cart") ||
    path.startsWith("/checkout") ||
    path.startsWith("/products")
  ) {
    return {
      title: "Search Products",
      placeholder: "Search by product name or keyword...",
      emptyState: "Search for products by name or keyword.",
    };
  }

  return {
    title: "Search",
    placeholder: "Start typing to search...",
    emptyState: "Enter a search term to get started.",
  };
}

function getIndexName(pathname: string): string {
  const path = pathname.toLowerCase();

  if (path.startsWith("/events")) {
    return algoliaConfig.indices.events;
  }

  if (
    path.startsWith("/blog") ||
    path.startsWith("/articles") ||
    path.startsWith("/insights") ||
    path.startsWith("/posts") ||
    path.startsWith("/category")
  ) {
    return algoliaConfig.indices.articles;
  }

  if (
    path.startsWith("/shop") ||
    path.startsWith("/cart") ||
    path.startsWith("/checkout") ||
    path.startsWith("/products")
  ) {
    return algoliaConfig.indices.products;
  }

  if (path.startsWith("/locations")) {
    return algoliaConfig.indices.locations;
  }

  return algoliaConfig.indices.locations;
}

type ProductHit = {
  objectID: string;
  name: string;
  slug: string;
  price?: string;
  image?: string;
  imageAlt?: string;
  type: "product";
};

type EventHit = {
  objectID: string;
  title: string;
  slug: string;
  content?: string;
  image?: string;
  imageAlt?: string;
  type: "event";
};

type ArticleHit = {
  objectID: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  type: "article";
};

type LocationHit = {
  objectID: string;
  title: string;
  slug: string;
  city?: string;
  state?: string;
  streetAddress?: string;
  zip?: string;
  phone?: string;
  email?: string;
  shortDescription?: string;
  services?: string;
  content?: string;
  image?: string;
  imageAlt?: string;
  type: "location";
};

type Hit = ProductHit | EventHit | ArticleHit | LocationHit;

type HitComponentProps = {
  hit: Hit;
  onHitClick: () => void;
};

function HitComponent({ hit, onHitClick }: HitComponentProps) {
  if (hit.type === "product") {
    const productHit = hit as ProductHit;
    return (
      <Link
        href={`/shop/${productHit.slug}`}
        className={styles.hit}
        onClick={onHitClick}
      >
        <div className={styles.hitImage}>
          {productHit.image ? (
            <Image
              src={productHit.image}
              alt={productHit.imageAlt || productHit.name}
              width={56}
              height={56}
              className={styles.hitImageInner}
            />
          ) : (
            <Search size={20} className={styles.hitPlaceholderIcon} />
          )}
        </div>
        <div className={styles.hitContent}>
          <Text as="h3" className={styles.hitTitle}>{productHit.name}</Text>
          {productHit.price && (
            <Text className={styles.hitMeta}>{productHit.price}</Text>
          )}
        </div>
        <span className={styles.hitType}>Product</span>
      </Link>
    );
  }

  if (hit.type === "event") {
    const eventHit = hit as EventHit;
    return (
      <Link
        href={`/events/${eventHit.slug}`}
        className={styles.hit}
        onClick={onHitClick}
      >
        <div className={styles.hitImage}>
          {eventHit.image ? (
            <Image
              src={eventHit.image}
              alt={eventHit.imageAlt || eventHit.title}
              width={56}
              height={56}
              className={styles.hitImageInner}
            />
          ) : (
            <Search size={20} className={styles.hitPlaceholderIcon} />
          )}
        </div>
        <div className={styles.hitContent}>
          <Text as="h3" className={styles.hitTitle}>{eventHit.title}</Text>
          {eventHit.content && (
            <Text className={styles.hitMeta}>
              {eventHit.content.replace(/<[^>]*>/g, "").substring(0, 80)}…
            </Text>
          )}
        </div>
        <span className={styles.hitType}>Event</span>
      </Link>
    );
  }

  if (hit.type === "location") {
    const locationHit = hit as LocationHit;
    const addressParts = [
      locationHit.streetAddress,
      locationHit.city,
      locationHit.state,
      locationHit.zip,
    ]
      .filter(Boolean)
      .join(", ");

    const displayText =
      addressParts ||
      locationHit.shortDescription?.substring(0, 80) ||
      locationHit.content?.substring(0, 80) ||
      "";

    return (
      <Link
        href={`/locations/${locationHit.slug}`}
        className={styles.hit}
        onClick={onHitClick}
      >
        <div className={styles.hitImage}>
          {locationHit.image ? (
            <Image
              src={locationHit.image}
              alt={locationHit.imageAlt || locationHit.title}
              width={56}
              height={56}
              className={styles.hitImageInner}
            />
          ) : (
            <Search size={20} className={styles.hitPlaceholderIcon} />
          )}
        </div>
        <div className={styles.hitContent}>
          <Text as="h3" className={styles.hitTitle}>{locationHit.title}</Text>
          {displayText && <Text className={styles.hitMeta}>{displayText}</Text>}
        </div>
        <span className={styles.hitType}>Location</span>
      </Link>
    );
  }

  const articleHit = hit as ArticleHit;
  return (
    <Link
      href={`/${articleHit.slug}`}
      className={styles.hit}
      onClick={onHitClick}
    >
      <div className={styles.hitImage}>
        {articleHit.image ? (
          <Image
            src={articleHit.image}
            alt={articleHit.imageAlt || articleHit.title}
            width={56}
            height={56}
            className={styles.hitImageInner}
          />
        ) : (
          <Search size={20} className={styles.hitPlaceholderIcon} />
        )}
      </div>
      <div className={styles.hitContent}>
        <Text as="h3" className={styles.hitTitle}>{articleHit.title}</Text>
        {articleHit.excerpt && (
          <Text className={styles.hitMeta}>{articleHit.excerpt}</Text>
        )}
      </div>
      <span className={styles.hitType}>Article</span>
    </Link>
  );
}

type SearchResultsProps = {
  onHitClick: () => void;
  emptyState: string;
};

function SearchResults({ onHitClick, emptyState }: SearchResultsProps) {
  const { hits } = useHits<Hit>();
  const { query } = useSearchBox();

  if (!query || query.trim() === "") {
    return (
      <div className={styles.emptyState}>
        <Search size={36} className={styles.emptyIcon} aria-hidden="true" />
        <Text className={styles.emptyText}>{emptyState}</Text>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={styles.emptyState}>
        <Text className={styles.emptyText}>
          No results found for &ldquo;{query}&rdquo;.
        </Text>
      </div>
    );
  }

  return (
    <div className={styles.results}>
      {hits.map((hit) => (
        <HitComponent key={hit.objectID} hit={hit} onHitClick={onHitClick} />
      ))}
    </div>
  );
}

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const pathname = usePathname();
  const indexName = getIndexName(pathname);
  const config = getModalConfig(pathname);

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className={styles.modal}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Search size={18} className={styles.headerIcon} aria-hidden="true" />
            <Text as="h2" className={styles.title}>{config.title}</Text>
          </div>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close search"
          >
            <X size={20} />
          </button>
        </div>
        {!isAlgoliaConfigured() || !searchClient ? (
          <div className={styles.emptyState}>
            <Text className={styles.emptyText}>
              Search is not configured. Please set up Algolia credentials.
            </Text>
          </div>
        ) : (
          <InstantSearchNext
            searchClient={searchClient}
            indexName={indexName}
            future={{ preserveSharedStateOnUnmount: true }}
          >
            <Configure hitsPerPage={10} />
            <SearchBox
              placeholder={config.placeholder}
              autoFocus
              className={styles.searchWrapper}
              inputClassName={styles.searchBox}
            />
            <SearchResults onHitClick={onClose} emptyState={config.emptyState} />
          </InstantSearchNext>
        )}
      </div>
    </Modal>
  );
}
