"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/UI/Container";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Button } from "@/components/UI/Button";
import { StarRating } from "@/components/UI/StarRating";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import styles from "./FeaturedProducts.module.css";

type Product = {
  id?: string;
  databaseId?: number;
  __typename?: string;
  name?: string;
  title?: string;
  slug?: string;
  price?: string;
  image?: {
    sourceUrl?: string;
    altText?: string;
    srcSet?: string;
    sizes?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
      srcSet?: string;
      sizes?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  };
};

type FeaturedProductsProps = {
  featuredProductsHeading?: string;
  featuredProductsSubheading?: string;
  featuredProductsSource?: string | string[];
  featuredProductsManual?: {
    product?: {
      nodes?: Product[];
    };
  }[];
  featuredProductsFromQuery?: {
    nodes?: Array<{
      id?: string;
      databaseId?: number;
      name?: string;
      slug?: string;
      price?: string;
      featuredImage?: {
        node?: {
          id?: string;
          sourceUrl?: string;
          altText?: string;
        };
      };
    }>;
  };
};

export default function FeaturedProducts({
  featuredProductsHeading,
  featuredProductsSubheading,
  featuredProductsSource,
  featuredProductsManual,
  featuredProductsFromQuery,
}: FeaturedProductsProps) {
  if (!featuredProductsHeading) return null;

  const products: Product[] = [];

  const sourceArray = Array.isArray(featuredProductsSource)
    ? featuredProductsSource
    : featuredProductsSource
    ? [featuredProductsSource]
    : [];

  if (sourceArray.includes("featured") && featuredProductsFromQuery?.nodes) {
    featuredProductsFromQuery.nodes.forEach((product) => {
      if (product) {
        products.push({
          id: product.id,
          databaseId: product.databaseId,
          name: product.name,
          slug: product.slug,
          price: product.price,
          featuredImage: product.featuredImage,
        });
      }
    });
  }

  if (
    sourceArray.includes("manual") &&
    featuredProductsManual &&
    Array.isArray(featuredProductsManual)
  ) {
    featuredProductsManual.forEach((item) => {
      if (item?.product?.nodes && Array.isArray(item.product.nodes)) {
        item.product.nodes.forEach((product) => {
          if (product) {
            products.push({
              id: product.id,
              name: product.name || product.title,
              slug: product.slug,
              featuredImage: product.featuredImage,
            });
          }
        });
      }
    });
  }

  return (
    <section className={styles.section}>
      <Container>
        <SectionHeading
          color="var(--color-text-inverse)"
          heading={featuredProductsHeading}
          subheading={featuredProductsSubheading}
        />
        {products.length > 0 ? (
          <div className={styles.swiperWrapper}>
            <Swiper
              modules={[Navigation, Pagination]}
              spaceBetween={32}
              slidesPerView={1}
              navigation={products.length > 1}
              pagination={{ clickable: true }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                },
                1024: {
                  slidesPerView: 4,
                },
              }}
              className={styles.swiper}
            >
              {products.map((product, index) => {
                const productName = product.name || product.title || "Product";
                const productSlug = product.slug;

                const imageUrl = product.featuredImage?.node?.sourceUrl;
                const imageAlt =
                  product.featuredImage?.node?.altText || productName;
                const imageSizes = product.featuredImage?.node?.sizes;

                // Generate different ratings for each product (4.0 to 5.0)
                const ratings = [4.5, 4.8, 4.2, 5.0, 4.7, 4.3, 4.9, 4.6];
                const reviewCounts = [127, 89, 234, 56, 312, 178, 45, 201];
                const rating = ratings[index % ratings.length];
                const reviewCount = reviewCounts[index % reviewCounts.length];

                console.log("imageSizes", imageSizes);
                return (
                  <SwiperSlide key={product.id} className={styles.slide}>
                    <div className={styles.productCard}>
                      {imageUrl ? (
                        <div className={styles.imageWrapper}>
                          <Image
                            src={imageUrl}
                            alt={imageAlt}
                            fill
                            quality={75}
                            sizes={imageSizes}
                            className={styles.image}
                            priority={index === 0}
                            fetchPriority={index === 0 ? "high" : "auto"}
                          />
                        </div>
                      ) : (
                        <div className={styles.imageWrapper}>
                          <div
                            style={{
                              width: "100%",
                              height: "100%",
                              backgroundColor: "var(--color-bg-tertiary)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "var(--color-text-tertiary)",
                              fontSize: "var(--font-size-sm)",
                            }}
                          >
                            No Image
                          </div>
                        </div>
                      )}
                      <div className={styles.overlay}>
                        <div className={styles.overlayContent}>
                          {(product.name || product.title) && (
                            <h3 className={styles.name}>
                              {productSlug ? (
                                <Link href={`/products/${productSlug}`}>
                                  {productName}
                                </Link>
                              ) : (
                                productName
                              )}
                            </h3>
                          )}
                          {product.price && (
                            <div className={styles.price}>{product.price}</div>
                          )}
                          {productSlug && (
                            <Button
                              as="a"
                              href={`/products/${productSlug}`}
                              color="secondary"
                              variant="inverse"
                              className={styles.viewItemButton}
                              aria-description={`View details for ${productName}`}
                            >
                              View Item
                            </Button>
                          )}
                        </div>
                      </div>
                      <div className={styles.content}>
                        {productName && (
                          <h3 className={styles.name}>
                            {productSlug ? (
                              <Link href={`/products/${productSlug}`}>
                                {productName}
                              </Link>
                            ) : (
                              productName
                            )}
                          </h3>
                        )}
                        <div className={styles.ratingPriceRow}>
                          <div className={styles.rating}>
                            <StarRating
                              rating={rating}
                              reviewCount={reviewCount}
                            />
                          </div>
                          {product.price && (
                            <div className={styles.price}>{product.price}</div>
                          )}
                        </div>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "var(--spacing-3xl) 0" }}>
            <p
              style={{
                color: "var(--color-text-secondary)",
                marginBottom: "var(--spacing-md)",
              }}
            >
              No products available at this time.
            </p>
            {featuredProductsSource &&
              Array.isArray(featuredProductsSource) &&
              featuredProductsSource.length > 0 && (
                <p
                  style={{
                    fontSize: "var(--font-size-sm)",
                    color: "var(--color-text-tertiary)",
                  }}
                >
                  Source: {featuredProductsSource.join(", ")}
                </p>
              )}
          </div>
        )}
      </Container>
    </section>
  );
}
