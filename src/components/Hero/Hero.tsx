"use client";
import Image from "next/image";
import { blurOptions } from "@/utils/constants";
import { buildUrl } from "cloudinary-build-url";
import RawHtml from "../RawHtml/RawHtml";
import {
  getSafeImageUrl,
  useImageFallback,
  FALLBACK_IMAGES,
} from "@/utils/image-helpers";
import styles from "./Hero.module.css";

type HeroProps = {
  home: {
    title: string;
    seo: { metaDesc: string };
    featuredImage: {
      node: {
        sourceUrl: string;
        altText: string;
        slug: string;
        title: string;
        caption: string;
      };
    };
  };
};

function Hero({ home: { featuredImage, title, seo } }: HeroProps) {
  const initialUrl = getSafeImageUrl(featuredImage?.node.sourceUrl, "hero");
  const { currentUrl, handleError } = useImageFallback(
    initialUrl,
    FALLBACK_IMAGES.hero
  );
  const blurDataURL = buildUrl(
    featuredImage?.node.slug || "car-accident",
    blurOptions
  );

  return (
    <section className={styles.hero}>
      <div className={styles.imageWrapper}>
        <Image
          priority
          fill
          placeholder="blur"
          blurDataURL={blurDataURL}
          src={currentUrl}
          alt={featuredImage?.node?.altText || "car accident"}
          onError={handleError}
          sizes="100vw"
          style={{ objectFit: "cover", objectPosition: "center" }}
        />
      </div>
      <div className={styles.overlay} />
      <div className={styles.content}>
        <h1 className={styles.headline}>
          {featuredImage?.node?.title || title}
        </h1>
        <RawHtml className={styles.description}>
          {featuredImage?.node?.caption || seo.metaDesc}
        </RawHtml>
      </div>
    </section>
  );
}

export default Hero;
