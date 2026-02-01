"use client";

import { Suspense } from "react";
import Image from "next/image";
import { usePathname, useSearchParams } from "next/navigation";
import { RichText } from "@/components/RichText";
import { Button, ButtonIcon } from "@/components/Primitives";
import {
  getSafeImageUrl,
  useImageFallback,
  FALLBACK_IMAGES,
} from "@/utils/image-helpers";
import styles from "./Hero.module.css";

// Static 1x1 pixel blur placeholder to avoid Cloudinary network request
const STATIC_BLUR_PLACEHOLDER =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWESEyIxQf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AmACV/9k=";

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
  const { featuredImage } = props;
  const img = featuredImage?.node;

  if (!img?.sourceUrl) {
    return null;
  }

  return <HeroContent {...props} />;
}

// Separate component for CTA buttons that need useSearchParams
function HeroCtaButtons({ heroUnit }: { heroUnit?: HeroUnit }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

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

  if (!heroUnit?.heroLink?.url || !heroUnit?.heroLink?.title) {
    return null;
  }

  return (
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
  );
}

// Fallback buttons for Suspense (static links without search params)
function HeroCtaFallback({ heroUnit }: { heroUnit?: HeroUnit }) {
  const icon1 = heroUnit?.heroLinkIcon?.node;
  const icon2 = heroUnit?.heroLinkIcon2?.node;

  const icon1Element = icon1?.sourceUrl ? (
    <ButtonIcon icon={icon1} />
  ) : undefined;

  const icon2Element = icon2?.sourceUrl ? (
    <ButtonIcon icon={icon2} />
  ) : undefined;

  if (!heroUnit?.heroLink?.url || !heroUnit?.heroLink?.title) {
    return null;
  }

  return (
    <>
      <Button
        as="a"
        href={heroUnit.heroLink.url}
        icon={icon1Element}
        iconPosition="left"
        shadow
      >
        {heroUnit.heroLink.title}
      </Button>
      {heroUnit.heroLink2?.url && heroUnit.heroLink2?.title && (
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
      )}
    </>
  );
}

function HeroContent({
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
    maxHeight: `${maxHeight}px`,
  } as React.CSSProperties;

  const initialUrl = getSafeImageUrl(img?.sourceUrl || "", "hero");
  const { currentUrl, handleError } = useImageFallback(
    initialUrl,
    FALLBACK_IMAGES.hero
  );

  if (!img?.sourceUrl) {
    return null;
  }

  return (
    <section className={styles.hero} style={style}>
      <div className={styles.imageWrapper}>
        <Image
          priority
          fetchPriority="high"
          fill
          placeholder="blur"
          blurDataURL={STATIC_BLUR_PLACEHOLDER}
          src={currentUrl}
          alt={img?.altText || "Hero image"}
          onError={handleError}
          sizes="(max-width: 1200px) 100vw, 1200px"
          style={{
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div className={styles.overlay} />
      </div>
      <div className={styles.content}>
        <h1 className={styles.headline}>{heading}</h1>
        {subheading && (
          <RichText content={subheading} className={styles.description} />
        )}
        <div className={styles.ctaWrapper}>
          <Suspense fallback={<HeroCtaFallback heroUnit={heroUnit} />}>
            <HeroCtaButtons heroUnit={heroUnit} />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

export default Hero;
