"use client";

import { Suspense } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { blurOptions } from "@/utils/constants";
import { buildUrl } from "cloudinary-build-url";
import RawHtml from "../RawHtml/RawHtml";
import { Button, ButtonIcon } from "@/components/UI";
import { ImageWrapper } from "@/components/UI";
import {
  getSafeImageUrl,
  useImageFallback,
  FALLBACK_IMAGES,
} from "@/utils/image-helpers";
import styles from "./Hero.module.css";

type IconNode = {
  sourceUrl?: string;
  altText?: string;
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

function Hero(props: HeroProps) {
  return (
    <Suspense fallback={<HeroFallback {...props} />}>
      <HeroContent {...props} />
    </Suspense>
  );
}

function HeroFallback({ featuredImage, maxHeight = 750 }: HeroProps) {
  const img = featuredImage?.node;
  const style = { maxHeight: `${maxHeight}px` } as React.CSSProperties;

  if (!img?.sourceUrl) return null;

  return (
    <section className={styles.hero} style={style}>
      <div className={styles.imageWrapper} />
    </section>
  );
}

function HeroContent({
  featuredImage,
  heroUnit,
  description,
  maxHeight = 750,
  title,
}: HeroProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const img = featuredImage?.node;
  const heading = img?.title || title;
  const subheading = img?.description || description;

  const style = {
    maxHeight: `${maxHeight}px`,
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

  const getLinkUrl = (href: string): string => {
    if (href.startsWith("?")) {
      const params = new URLSearchParams(href.slice(1));
      const newParams = new URLSearchParams(searchParams.toString());

      params.forEach((value, key) => {
        newParams.set(key, value);
      });

      return newParams.toString()
        ? `${pathname}?${newParams.toString()}`
        : pathname;
    }
    return href;
  };

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
              {heroUnit.heroLink.url.startsWith("?") ? (
                <Button
                  as="Link"
                  href={getLinkUrl(heroUnit.heroLink.url)}
                  scroll={false}
                  icon={icon1Element}
                  iconPosition="left"
                  shadow
                >
                  {heroUnit.heroLink.title}
                </Button>
              ) : (
                <Button
                  as="a"
                  href={heroUnit.heroLink.url}
                  icon={icon1Element}
                  iconPosition="left"
                  shadow
                >
                  {heroUnit.heroLink.title}
                </Button>
              )}
              {heroUnit.heroLink2?.url &&
                heroUnit.heroLink2?.title &&
                (heroUnit.heroLink2.url.startsWith("?") ? (
                  <Button
                    as="Link"
                    href={getLinkUrl(heroUnit.heroLink2.url)}
                    scroll={false}
                    icon={icon2Element}
                    iconPosition="left"
                    color="glass"
                    outline
                    shadow
                  >
                    {heroUnit.heroLink2.title}
                  </Button>
                ) : (
                  <Button
                    as="a"
                    href={heroUnit.heroLink2.url}
                    icon={icon2Element}
                    iconPosition="left"
                    color="glass"
                    outline
                    shadow
                  >
                    {heroUnit.heroLink2.title}
                  </Button>
                ))}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

export default Hero;
