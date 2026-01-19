"use client";
import { usePathname } from "next/navigation";
import {
  InstantSearch,
  useSearchBox,
  useHits,
  Configure,
} from "react-instantsearch";
import { searchClient, isAlgoliaConfigured } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { Modal, Text, Input } from "@/components/Primitives";
import styles from "./SearchModal.module.css";

type SearchModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

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

function SearchBox() {
  const { query, refine } = useSearchBox();
  // Use query directly as controlled value instead of syncing in effect
  const inputValue = query || "";

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    refine(value);
  }

  return (
    <Input
      type="search"
      value={inputValue}
      onChange={handleChange}
      placeholder="Start typing to search..."
      className={styles.searchBox}
      autoFocus
    />
  );
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
        href={`/products/${productHit.slug}`}
        className={styles.hit}
        onClick={onHitClick}
      >
        {productHit.image && (
          <div className={styles.hitImage}>
            <Image
              src={productHit.image}
              alt={productHit.imageAlt || productHit.name}
              width={80}
              height={80}
              className={styles.hitImageInner}
            />
          </div>
        )}
        <div className={styles.hitContent}>
          <Text as="h3" className={styles.hitTitle}>{productHit.name}</Text>
          {productHit.price && (
            <Text className={styles.hitPrice}>{productHit.price}</Text>
          )}
        </div>
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
        {eventHit.image && (
          <div className={styles.hitImage}>
            <Image
              src={eventHit.image}
              alt={eventHit.imageAlt || eventHit.title}
              width={80}
              height={80}
              className={styles.hitImageInner}
            />
          </div>
        )}
        <div className={styles.hitContent}>
          <Text as="h3" className={styles.hitTitle}>{eventHit.title}</Text>
          {eventHit.content && (
            <Text className={styles.hitExcerpt}>
              {eventHit.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
            </Text>
          )}
        </div>
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
      locationHit.shortDescription?.substring(0, 100) ||
      locationHit.content?.substring(0, 100) ||
      "";

    return (
      <Link
        href={`/locations/${locationHit.slug}`}
        className={styles.hit}
        onClick={onHitClick}
      >
        {locationHit.image && (
          <div className={styles.hitImage}>
            <Image
              src={locationHit.image}
              alt={locationHit.imageAlt || locationHit.title}
              width={80}
              height={80}
              className={styles.hitImageInner}
            />
          </div>
        )}
        <div className={styles.hitContent}>
          <Text as="h3" className={styles.hitTitle}>{locationHit.title}</Text>
          {displayText && <Text className={styles.hitExcerpt}>{displayText}</Text>}
        </div>
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
      {articleHit.image && (
        <div className={styles.hitImage}>
          <Image
            src={articleHit.image}
            alt={articleHit.imageAlt || articleHit.title}
            width={80}
            height={80}
            className={styles.hitImageInner}
          />
        </div>
      )}
      <div className={styles.hitContent}>
        <Text as="h3" className={styles.hitTitle}>{articleHit.title}</Text>
        {articleHit.excerpt && (
          <Text className={styles.hitExcerpt}>{articleHit.excerpt}</Text>
        )}
      </div>
    </Link>
  );
}

type SearchResultsProps = {
  onHitClick: () => void;
};

function SearchResults({ onHitClick }: SearchResultsProps) {
  const { hits } = useHits<Hit>();
  const { query } = useSearchBox();

  if (!query || query.trim() === "") {
    return (
      <div className={styles.noResults}>
        <Text>Start typing to search...</Text>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={styles.noResults}>
        <Text>No results found for &quot;{query}&quot;.</Text>
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

  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      showCloseButton={false}
      className={styles.modal}
    >
      <div className={styles.content}>
        <div className={styles.header}>
          <Text as="h2" className={styles.title}>Search</Text>
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
            <Text>Search is not configured. Please set up Algolia credentials.</Text>
            <Text className={styles.configHint}>
              Add NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
              to your environment variables.
            </Text>
          </div>
        ) : (
          <InstantSearch
            searchClient={searchClient}
            indexName={indexName}
            future={{ preserveSharedStateOnUnmount: true }}
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
