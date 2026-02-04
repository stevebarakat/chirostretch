"use client";

import { useRef } from "react";
import { useInfiniteHits, useSearchBox } from "react-instantsearch";
import { useInfiniteScroll } from "@/hooks";
import { ProductCard } from "@/components/ProductCard";
import { FlipMotion, FlipMotionItem } from "@/components/Primitives";
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

  useInfiniteScroll({ sentinelRef, isLastPage, showMore });

  // Show empty state only when there's a query with no results
  if (hits.length === 0 && query) {
    return (
      <div className={styles.empty}>
        <p>No products found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  return (
    <>
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
      </FlipMotion>
      <li ref={sentinelRef} aria-hidden="true" className={styles.sentinel} />
    </>
  );
}
