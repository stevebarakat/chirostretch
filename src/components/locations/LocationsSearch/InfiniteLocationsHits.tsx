"use client";

import { useRef, useEffect } from "react";
import { useInfiniteHits, useSearchBox } from "react-instantsearch-hooks-web";
import Link from "next/link";
import { LocationCard } from "../LocationCard";
import styles from "./InfiniteLocationsHits.module.css";

type LocationHit = {
  objectID: string;
  title: string;
  slug: string;
  city?: string;
  state?: string;
  streetAddress?: string;
  content?: string;
  shortDescription?: string;
  image?: string;
  imageAlt?: string;
  latitude?: number | null;
  longitude?: number | null;
};

export function InfiniteLocationsHits() {
  const { hits, isLastPage, showMore } = useInfiniteHits<LocationHit>();
  const { query } = useSearchBox();
  const sentinelRef = useRef<HTMLLIElement>(null);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLastPage) {
            showMore();
          }
        });
      },
      { rootMargin: "400px" } // Trigger 400px before reaching bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isLastPage, showMore]);

  if (hits.length === 0 && query) {
    return (
      <div className={styles.empty}>
        <p>No locations found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No locations available.</p>
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {hits.map((hit) => (
        <li key={hit.objectID}>
          <Link href={`/locations/${hit.slug}`} className={styles.cardLink}>
            <LocationCard
              title={hit.title}
              content={hit.shortDescription || hit.content}
              coordinates={{
                lat: hit.latitude,
                lng: hit.longitude,
              }}
            />
          </Link>
        </li>
      ))}
      <li ref={sentinelRef} aria-hidden="true" className={styles.sentinel} />
    </ul>
  );
}
