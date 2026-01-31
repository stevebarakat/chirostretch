"use client";

// eslint-disable-next-line no-restricted-imports
import { useRef, useEffect } from "react";
import {
  useInfiniteHits,
  useSearchBox,
  useInstantSearch,
} from "react-instantsearch";
import { ArticleCard } from "../ArticleCard";
import styles from "./InfiniteArticlesHits.module.css";

type ArticleHit = {
  objectID: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  categories?: string[];
  categorySlugs?: string[];
  tags?: string[];
  tagSlugs?: string[];
};

function buildTaxonomyItems(
  names: string[] = [],
  slugs: string[] = []
): { name: string; slug: string }[] {
  return names
    .map((name, i) => ({ name, slug: slugs[i] || "" }))
    .filter((item) => item.slug);
}

export function InfiniteArticlesHits() {
  const { hits, isLastPage, showMore } = useInfiniteHits<ArticleHit>();
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
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isLastPage, showMore]);

  if (hits.length === 0 && query && !isLoading) {
    return (
      <div className={styles.empty}>
        <p>No articles found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  if (hits.length === 0 && !isLoading) {
    return (
      <div className={styles.empty}>
        <p>No articles available.</p>
      </div>
    );
  }

  if (hits.length === 0 && isLoading) {
    return (
      <div className={styles.empty}>
        <p>Loading articles...</p>
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {hits.map((hit) => (
        <li key={hit.objectID}>
          <ArticleCard
            title={hit.title}
            slug={hit.slug}
            image={hit.image}
            imageAlt={hit.imageAlt}
            excerpt={hit.excerpt}
            tags={buildTaxonomyItems(hit.tags, hit.tagSlugs)}
            categories={buildTaxonomyItems(hit.categories, hit.categorySlugs)}
          />
        </li>
      ))}
      <li ref={sentinelRef} aria-hidden="true" className={styles.sentinel} />
    </ul>
  );
}
