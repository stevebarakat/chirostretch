"use client";

import { useRef } from "react";
import { useInfiniteHits, useSearchBox } from "react-instantsearch";
import { useInfiniteScroll } from "@/hooks";
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
  const { items, isLastPage, showMore } = useInfiniteHits<ArticleHit>();
  const { query } = useSearchBox();
  const sentinelRef = useRef<HTMLLIElement>(null);

  useInfiniteScroll({ sentinelRef, isLastPage, showMore });

  // Show empty state only when there's a query with no results
  if (items.length === 0 && query) {
    return (
      <div className={styles.empty}>
        <p>No articles found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  // Always render the grid - even if empty initially during hydration
  return (
    <ul className={styles.grid} suppressHydrationWarning>
      {items.map((hit) => (
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
