"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import { Container } from "@/components/UI/Container";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { ProductCard } from "@/components/ProductCard";
import CartSummary from "@/components/Layout/CartSummary";
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
  stockStatus?: string;
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
      stockStatus?: string;
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
          stockStatus: product.stockStatus,
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
        <div className={styles.header}>
          {/* empty spacer div to help center heading*/}
          <div></div>
          <SectionHeading
            color="var(--color-text-inverse)"
            heading={featuredProductsHeading}
            subheading={featuredProductsSubheading}
          />
          <div className={styles.cartWrapper}>
            <CartSummary />
          </div>
        </div>
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
              {products.map((product, index) => (
                <SwiperSlide key={product.id} className={styles.slide}>
                  <ProductCard
                    id={product.id}
                    databaseId={product.databaseId}
                    name={product.name || product.title}
                    slug={product.slug}
                    price={product.price}
                    featuredImage={product.featuredImage}
                    averageRating={product.averageRating}
                    reviewCount={product.reviewCount}
                    stockStatus={product.stockStatus}
                    variant="featured"
                    priority={index === 0}
                    className={styles.productCard}
                  />
                </SwiperSlide>
              ))}
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
