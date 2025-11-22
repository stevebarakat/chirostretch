import Image from "next/legacy/image";
import { blurOptions } from "@/utils/constants";
import { buildUrl } from "cloudinary-build-url";
import RawHtml from "../RawHtml/RawHtml";
import carAccident from "/public/images/carAccident.webp";
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
  const blurDataURL = buildUrl(
    featuredImage?.node.slug || "car-accident",
    blurOptions,
  );
  const imgUrl = featuredImage?.node.sourceUrl ?? carAccident;

  return (
    <div className="hero">
      <Image
        priority
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        placeholder="blur"
        blurDataURL={blurDataURL}
        src={imgUrl}
        alt={featuredImage?.node?.altText || "car accident"}
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
