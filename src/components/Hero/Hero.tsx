"use client";
import { useState } from "react";
import Image from "next/image";
import dynamic from "next/dynamic";
import { blurOptions } from "@/utils/constants";
import { buildUrl } from "cloudinary-build-url";
import RawHtml from "../RawHtml/RawHtml";
import { Button } from "@/components/UI/Button";
import {
  getSafeImageUrl,
  useImageFallback,
  FALLBACK_IMAGES,
} from "@/utils/image-helpers";
import styles from "./Hero.module.css";
import { CalendarDays, Compass } from "lucide-react";

// Lazy load SearchModal to reduce initial bundle size
const SearchModal = dynamic(() => import("@/components/Search/SearchModal"), {
  ssr: false,
});

type HeroUnit = {
  heroLink?: {
    target?: string;
    title?: string;
    url?: string;
  };
  heroLinkIcon?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
      slug?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  };
  heroLink2?: {
    target?: string;
    title?: string;
    url?: string;
  };
  heroLinkIcon2?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
      slug?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  };
};

type HeroProps = {
  heroUnit?: HeroUnit;
  featuredImage?: {
    node?: {
      altText?: string;
      sourceUrl?: string;
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
  isHomepage?: boolean;
};

function Hero({ featuredImage, heroUnit, description, isHomepage }: HeroProps) {
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
          <div className={styles.overlay} />
        </div>
        <div className={styles.content}>
          <h1 className={styles.headline}>{heading}</h1>
          {subheading && (
            <RawHtml className={styles.description}>{subheading}</RawHtml>
          )}
          <div className={styles.ctaWrapper}>
            {isHomepage ? (
              <Button as="button" shadow onClick={() => setIsSearchOpen(true)}>
                Find A Location
              </Button>
            ) : (
              heroUnit?.heroLink?.url &&
              heroUnit?.heroLink?.title && (
                <>
                  <Button
                    as="a"
                    href={heroUnit.heroLink.url}
                    icon={<CalendarDays />}
                    iconPosition="left"
                    shadow
                    target={heroUnit.heroLink.target || undefined}
                  >
                    {heroUnit.heroLink.title}
                  </Button>
                  <Button
                    as="a"
                    href={heroUnit.heroLink2?.url || ""}
                    icon={<Compass />}
                    iconPosition="left"
                    color="glass"
                    outline
                    shadow
                    target={heroUnit.heroLink2?.target || undefined}
                  >
                    {heroUnit.heroLink2?.title}
                  </Button>
                </>
              )
            )}
          </div>
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
