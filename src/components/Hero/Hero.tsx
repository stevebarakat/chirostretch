"use client";
import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { blurOptions } from "@/utils/constants";
import { buildUrl } from "cloudinary-build-url";
import RawHtml from "../RawHtml/RawHtml";
import Button from "@/components/ui/Button";
import {
  getSafeImageUrl,
  useImageFallback,
  FALLBACK_IMAGES,
} from "@/utils/image-helpers";
import styles from "./Hero.module.css";

// Lazy load SearchModal to reduce initial bundle size
const SearchModal = dynamic(() => import("@/components/search/SearchModal"), {
  ssr: false,
});

type HeroProps = {
  featuredImage?: {
    node?: {
      altText?: string;
      sourceUrl?: string;
      srcSet?: string;
      sizes?: string;
      slug?: string;
      title?: string;
      description?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  };
  description?: string;
  heroLink?: {
    target?: string;
    title?: string;
    url?: string;
  };
  fallbackTitle?: string;
  isHomepage?: boolean;
};

function Hero({
  featuredImage,
  heroLink,
  fallbackTitle,
  description,
  isHomepage,
}: HeroProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const img = featuredImage?.node;
  const heading = img?.title;
  const subheading = img?.description || description;

  const initialUrl = getSafeImageUrl(img?.sourceUrl || "", "hero");
  const { currentUrl, handleError } = useImageFallback(
    initialUrl,
    FALLBACK_IMAGES.hero
  );
  const blurDataURL = buildUrl(img?.slug || "", blurOptions);

  if (!img?.sourceUrl) {
    return null;
  }

  console.log("featuredImage", featuredImage);

  return (
    <>
      <section className={styles.hero}>
        <div className={styles.imageWrapper}>
          <Image
            priority
            fetchPriority="high"
            fill
            placeholder="blur"
            blurDataURL={blurDataURL}
            src={currentUrl}
            alt={img?.altText || "Hero image"}
            onError={handleError}
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        <div className={styles.overlay} />
        <div className={styles.content}>
          <h1 className={styles.headline}>{heading}</h1>
          {subheading && (
            <RawHtml className={styles.description}>{subheading}</RawHtml>
          )}
          {isHomepage ? (
            <div className={styles.ctaWrapper}>
              <Button as="button" shadow onClick={() => setIsSearchOpen(true)}>
                Find A Location
              </Button>
            </div>
          ) : (
            heroLink?.url &&
            heroLink?.title && (
              <div className={styles.ctaWrapper}>
                <Button
                  as="a"
                  href={heroLink.url}
                  shadow
                  target={heroLink.target || undefined}
                >
                  {heroLink.title}
                </Button>
              </div>
            )
          )}
        </div>
      </section>

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </>
  );
}

export default Hero;
