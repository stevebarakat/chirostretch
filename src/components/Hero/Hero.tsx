"use client";
import Image from "next/image";
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

type HeroProps = {
  heroUnit?: {
    heroHeading?: string;
    heroSubheading?: string;
    heroImage?: {
      node?: {
        altText?: string;
        sourceUrl?: string;
        srcSet?: string;
        sizes?: string;
        slug?: string;
        mediaDetails?: {
          width?: number;
          height?: number;
        };
      };
    };
    heroLink?: {
      target?: string;
      title?: string;
      url?: string;
    };
  };
  fallbackTitle?: string;
};

function Hero({ heroUnit, fallbackTitle }: HeroProps) {
  const initialUrl = getSafeImageUrl(
    heroUnit?.heroImage?.node?.sourceUrl || "",
    "hero"
  );
  const { currentUrl, handleError } = useImageFallback(
    initialUrl,
    FALLBACK_IMAGES.hero
  );
  const blurDataURL = buildUrl(
    heroUnit?.heroImage?.node?.slug || "car-accident",
    blurOptions
  );

  if (!heroUnit?.heroImage?.node?.sourceUrl) {
    return null;
  }

  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image
          priority
          fill
          placeholder="blur"
          blurDataURL={blurDataURL}
          src={currentUrl}
          alt={heroUnit?.heroImage?.node?.altText || "Hero image"}
          onError={handleError}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.headline}>
          {heroUnit?.heroHeading || fallbackTitle}
        </h1>
        {heroUnit?.heroSubheading && (
          <RawHtml className={styles.description}>
            {heroUnit.heroSubheading}
          </RawHtml>
        )}
        {heroUnit?.heroLink?.url && heroUnit?.heroLink?.title && (
          <div className={styles.ctaWrapper}>
            <Button
              as="a"
              href={heroUnit.heroLink.url}
              target={heroUnit.heroLink.target || undefined}
              variant="primary"
            >
              {heroUnit.heroLink.title}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}

export default Hero;
