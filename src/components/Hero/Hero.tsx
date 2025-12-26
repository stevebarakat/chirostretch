"use client";

import Image from "next/image";
import Link from "next/link";
import { blurOptions } from "@/utils/constants";
import { buildUrl } from "cloudinary-build-url";
import RawHtml from "../RawHtml/RawHtml";
import { Button } from "@/components/UI/Button";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import {
  getSafeImageUrl,
  useImageFallback,
  FALLBACK_IMAGES,
} from "@/utils/image-helpers";
import styles from "./Hero.module.css";

type IconNode = {
  sourceUrl?: string;
  altText?: string;
  slug?: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
};

type HeroUnit = {
  heroLink?: {
    target?: string;
    title?: string;
    url?: string;
  };
  heroLinkIcon?: {
    node?: IconNode;
  };
  heroLink2?: {
    target?: string;
    title?: string;
    url?: string;
  };
  heroLinkIcon2?: {
    node?: IconNode;
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
  maxHeight?: number;
  title?: string;
};

function ButtonIcon({ icon }: { icon?: IconNode }) {
  if (!icon?.sourceUrl) return null;

  return (
    <span
      className={styles.buttonIcon}
      style={
        {
          "--icon-url": `url(${icon.sourceUrl})`,
        } as React.CSSProperties
      }
    >
      <Image
        src={icon.sourceUrl}
        alt={icon.altText || ""}
        width={icon.mediaDetails?.width || 20}
        height={icon.mediaDetails?.height || 20}
        className={styles.buttonIconImage}
      />
    </span>
  );
}

function Hero({
  featuredImage,
  heroUnit,
  description,
  maxHeight = 750,
  title,
}: HeroProps) {
  const img = featuredImage?.node;
  const heading = img?.title || title;
  const subheading = img?.description || description;

  const style = {
    "--max-height": `${maxHeight}px`,
  } as React.CSSProperties;

  const initialUrl = getSafeImageUrl(img?.sourceUrl || "", "hero");
  const { currentUrl, handleError } = useImageFallback(
    initialUrl,
    FALLBACK_IMAGES.hero
  );
  const blurDataURL = buildUrl(img?.slug || "", blurOptions);

  if (!img?.sourceUrl) {
    return null;
  }

  const icon1 = heroUnit?.heroLinkIcon?.node;
  const icon2 = heroUnit?.heroLinkIcon2?.node;

  const icon1Element = icon1?.sourceUrl ? (
    <ButtonIcon icon={icon1} />
  ) : undefined;

  const icon2Element = icon2?.sourceUrl ? (
    <ButtonIcon icon={icon2} />
  ) : undefined;

  return (
    <section className={styles.hero} style={style}>
      <ImageWrapper className={styles.imageWrapper}>
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
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div className={styles.overlay} />
      </ImageWrapper>
      <div className={styles.content}>
        <h1 className={styles.headline}>{heading}</h1>
        {subheading && (
          <RawHtml className={styles.description}>{subheading}</RawHtml>
        )}
        <div className={styles.ctaWrapper}>
          {heroUnit?.heroLink?.url && heroUnit?.heroLink?.title && (
            <>
              <Link href={heroUnit.heroLink.url}>
                <Button icon={icon1Element} iconPosition="left" shadow>
                  {heroUnit.heroLink.title}
                </Button>
              </Link>
              {heroUnit.heroLink2?.url && heroUnit.heroLink2?.title && (
                <Link href={heroUnit.heroLink2.url}>
                  <Button
                    icon={icon2Element}
                    iconPosition="left"
                    color="glass"
                    outline
                    shadow
                  >
                    {heroUnit.heroLink2.title}
                  </Button>
                </Link>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
