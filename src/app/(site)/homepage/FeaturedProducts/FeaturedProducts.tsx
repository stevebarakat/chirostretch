"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { Container } from "@/components/UI/Container";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Button } from "@/components/UI/Button";
import { StarRating } from "@/components/UI/StarRating";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import { NoImage } from "@/components/UI/NoImage";
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
  averageRating?: number;
  reviewCount?: number;
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
      averageRating?: number;
      reviewCount?: number;
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
          averageRating: product.averageRating,
          reviewCount: product.reviewCount,
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
    <section id="featured-products" className={styles.section}>
      <Container>
        <SectionHeading
          color="var(--color-text-inverse)"
          heading={featuredProductsHeading}
          subheading={featuredProductsSubheading}
        />
        {products.length > 0 ? (
          <div className={styles.swiperWrapper}>
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              spaceBetween={32}
              slidesPerView={1}
              pagination={{ clickable: true }}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
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

                const rating = product.averageRating ?? 0;
                const reviewCount = product.reviewCount ?? 0;

                return (
                  <SwiperSlide key={product.id} className={styles.slide}>
                    <div className={styles.productCard}>
                      {imageUrl ? (
                        <ImageWrapper className={styles.imageWrapper}>
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
                        </ImageWrapper>
                      ) : (
                        <ImageWrapper className={styles.imageWrapper}>
                          <NoImage />
                        </ImageWrapper>
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
                          <div className={styles.contentInner}>
                            {(rating > 0 || reviewCount > 0) && (
                              <div className={styles.rating}>
                                <StarRating
                                  rating={rating}
                                  reviewCount={reviewCount}
                                />
                              </div>
                            )}
                            {product.price && (
                              <div className={styles.price}>
                                {product.price}
                              </div>
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
