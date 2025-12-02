"use client";
import Image from "next/legacy/image";
import { blurOptions } from "@/utils/constants";
import { buildUrl } from "cloudinary-build-url";
import RawHtml from "../RawHtml/RawHtml";
import carAccident from "../../../public/images/carAccident.webp";
import {
  getSafeImageUrl,
  useImageFallback,
  FALLBACK_IMAGES,
} from "@/utils/image-helpers";
import "./hero.css";

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
    <div className="hero">
      <Image
        priority
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        placeholder="blur"
        blurDataURL={blurDataURL}
        src={currentUrl}
        alt={featuredImage?.node?.altText || "car accident"}
        onError={handleError}
      />
      <span className="hero-headline">
        {featuredImage?.node?.title || title}
      </span>
      <RawHtml className="description">
        {featuredImage?.node?.caption || seo.metaDesc}
      </RawHtml>
    </div>
  );
}

export default Hero;
