"use client";

// eslint-disable-next-line no-restricted-imports
import { useRef, useEffect } from "react";
import { useInfiniteHits, useSearchBox } from "react-instantsearch-hooks-web";
import { ProductCard } from "@/components/ProductCard";
import { FlipMotion, FlipMotionItem } from "@/components/UI";
import styles from "./InfiniteProductsHits.module.css";

type ProductHit = {
  objectID: string;
  name: string;
  slug: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  image?: string;
  imageAlt?: string;
  categories?: string;
  excerpt?: string;
};

export function InfiniteProductsHits() {
  const { hits, isLastPage, showMore } = useInfiniteHits<ProductHit>();
  const { query } = useSearchBox();
  const sentinelRef = useRef<HTMLLIElement>(null);

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

  if (hits.length === 0 && query) {
    return (
      <div className={styles.empty}>
        <p>No products found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  if (hits.length === 0) {
    return (
      <div className={styles.empty}>
        <p>No products available.</p>
      </div>
    );
  }

  return (
    <FlipMotion className={styles.grid} enableExit={false}>
      {hits.map((hit) => {
        const databaseId = parseInt(hit.objectID.replace("product_", ""), 10);

        return (
          <FlipMotionItem key={hit.objectID} itemId={hit.objectID}>
            <ProductCard
              id={hit.objectID}
              databaseId={isNaN(databaseId) ? undefined : databaseId}
              name={hit.name}
              slug={hit.slug}
              price={hit.price}
              regularPrice={hit.regularPrice}
              salePrice={hit.salePrice}
              stockStatus={hit.stockStatus}
              featuredImage={
                hit.image
                  ? {
                      node: {
                        sourceUrl: hit.image,
                        altText: hit.imageAlt,
                      },
                    }
                  : undefined
              }
            />
          </FlipMotionItem>
        );
      })}
      <FlipMotionItem
        ref={sentinelRef}
        aria-hidden={true}
        className={styles.sentinel}
        itemId="sentinel"
        initialOpacity={0}
        animateOpacity={0}
      >
        {/* Sentinel element for infinite scroll */}
      </FlipMotionItem>
    </FlipMotion>
  );
}
