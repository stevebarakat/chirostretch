"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import useOnClickOutside from "@/hooks/useOnClickOutside";
import {
  InstantSearch,
  useSearchBox,
  useHits,
  Configure,
} from "react-instantsearch-hooks-web";
import { searchClient, isAlgoliaConfigured } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
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
  const [inputValue, setInputValue] = useState(query || "");

  useEffect(() => {
    setInputValue(query || "");
  }, [query]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const value = e.target.value;
    setInputValue(value);
    refine(value);
  }

  return (
    <input
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
          <h3 className={styles.hitTitle}>{productHit.name}</h3>
          {productHit.price && (
            <p className={styles.hitPrice}>{productHit.price}</p>
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
          <h3 className={styles.hitTitle}>{eventHit.title}</h3>
          {eventHit.content && (
            <p className={styles.hitExcerpt}>
              {eventHit.content.replace(/<[^>]*>/g, "").substring(0, 100)}...
            </p>
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
          <h3 className={styles.hitTitle}>{locationHit.title}</h3>
          {displayText && <p className={styles.hitExcerpt}>{displayText}</p>}
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
        <h3 className={styles.hitTitle}>{articleHit.title}</h3>
        {articleHit.excerpt && (
          <p className={styles.hitExcerpt}>{articleHit.excerpt}</p>
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
        <p>Start typing to search...</p>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={styles.noResults}>
        <p>No results found for &quot;{query}&quot;.</p>
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
  const modalRef = useRef<HTMLDivElement>(null);
  const indexName = getIndexName(pathname);

  if (process.env.NODE_ENV === "development") {
    console.log("Searching index:", indexName);
  }

  useOnClickOutside(modalRef, () => {
    if (isOpen) {
      onClose();
    }
  });

  if (!isOpen) {
    return null;
  }

  if (!isAlgoliaConfigured() || !searchClient) {
    return (
      <div className={styles.overlay}>
        <div ref={modalRef} className={styles.modal}>
          <div className={styles.header}>
            <h2 className={styles.title}>Search</h2>
            <button
              type="button"
              onClick={onClose}
              className={styles.closeButton}
              aria-label="Close search"
            >
              <X size={24} />
            </button>
          </div>
          <div className={styles.noResults}>
            <p>Search is not configured. Please set up Algolia credentials.</p>
            <p className={styles.configHint}>
              Add NEXT_PUBLIC_ALGOLIA_APP_ID and NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
              to your environment variables.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.overlay}>
      <div ref={modalRef} className={styles.modal}>
        <div className={styles.header}>
          <h2 className={styles.title}>Search</h2>
          <button
            type="button"
            onClick={onClose}
            className={styles.closeButton}
            aria-label="Close search"
          >
            <X size={24} />
          </button>
        </div>
        {/* @ts-expect-error - react-instantsearch-hooks-web types are not fully compatible with React 19 */}
        <InstantSearch searchClient={searchClient} indexName={indexName}>
          <Configure hitsPerPage={10} />
          <SearchBox />
          <SearchResults onHitClick={onClose} />
        </InstantSearch>
      </div>
    </div>
  );
}
