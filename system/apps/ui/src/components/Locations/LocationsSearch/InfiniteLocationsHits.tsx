"use client";

// eslint-disable-next-line no-restricted-imports
import { useRef, useEffect } from "react";
import {
  useInfiniteHits,
  useSearchBox,
  useInstantSearch,
} from "react-instantsearch";
import { LocationCard } from "../LocationCard";
import Link from "next/link";
import styles from "./InfiniteLocationsHits.module.css";
import { FlipMotion, FlipMotionItem } from "@/components/Primitives";

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
  const { status } = useInstantSearch();
  const sentinelRef = useRef<HTMLLIElement>(null);
  const isLoading = status === "loading" || status === "stalled";

  // Reason this component must use useEffect:
  // - Syncing with browser API (IntersectionObserver) for infinite scroll
  // - IntersectionObserver is a browser API that requires DOM access
  // - This is a side effect that sets up and cleans up an observer when dependencies change
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

  if (hits.length === 0 && query && !isLoading) {
    return (
      <div className={styles.empty}>
        <p>No locations found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  if (hits.length === 0 && !isLoading) {
    return (
      <div className={styles.empty}>
        <p>No locations available.</p>
      </div>
    );
  }

  if (hits.length === 0 && isLoading) {
    return (
      <div className={styles.empty}>
        <p>Loading locations...</p>
      </div>
    );
  }

  return (
    <>
      <FlipMotion className={styles.grid}>
        {hits.map((hit) => (
          <FlipMotionItem key={hit.objectID} itemId={hit.objectID}>
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
          </FlipMotionItem>
        ))}
      </FlipMotion>
      <li ref={sentinelRef} aria-hidden="true" className={styles.sentinel} />
    </>
  );
}
