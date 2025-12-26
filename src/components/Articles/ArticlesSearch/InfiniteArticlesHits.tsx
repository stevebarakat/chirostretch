"use client";

import { useRef, useEffect } from "react";
import { useInfiniteHits, useSearchBox } from "react-instantsearch-hooks-web";
import Link from "next/link";
import { ArticleCard } from "../ArticleCard";
import styles from "./InfiniteArticlesHits.module.css";

type ArticleHit = {
  objectID: string;
  title: string;
  slug: string;
  excerpt?: string;
  image?: string;
  imageAlt?: string;
  categories?: string;
};

export function InfiniteArticlesHits() {
  const { hits, isLastPage, showMore } = useInfiniteHits<ArticleHit>();
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
      { rootMargin: "400px" }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [isLastPage, showMore]);

  if (hits.length === 0 && query) {
    return (
      <div className={styles.empty}>
        <p>No articles found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No articles available.</p>
      </div>
    );
  }

  return (
    <ul className={styles.grid}>
      {hits.map((hit) => (
        <li key={hit.objectID}>
          <Link href={`/articles/${hit.slug}`} className={styles.cardLink}>
            <ArticleCard
              title={hit.title}
              image={hit.image}
              imageAlt={hit.imageAlt}
              excerpt={hit.excerpt}
              categories={hit.categories}
            />
          </Link>
        </li>
      ))}
      <li ref={sentinelRef} aria-hidden="true" className={styles.sentinel} />
    </ul>
  );
}
