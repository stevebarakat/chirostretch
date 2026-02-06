"use client";

import { useRef } from "react";
import { useInfiniteHits, useSearchBox } from "react-instantsearch";
import { useInfiniteScroll } from "@/hooks";
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
  const { items, isLastPage, showMore } = useInfiniteHits<LocationHit>();
  const { query } = useSearchBox();
  const sentinelRef = useRef<HTMLLIElement>(null);

  useInfiniteScroll({ sentinelRef, isLastPage, showMore });

  // Show empty state only when there's a query with no results
  if (items.length === 0 && query) {
    return (
      <div className={styles.empty}>
        <p>No locations found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  return (
    <>
      <FlipMotion className={styles.grid}>
        {items.map((hit) => (
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
