"use client";
import Image from "next/legacy/image";
import { blurOptions } from "@/utils/constants";
import { buildUrl } from "cloudinary-build-url";
import { Container } from "../Container";
import { RawHtml } from "../RawHtml";
import {
  getSafeImageUrl,
  useImageFallback,
  FALLBACK_IMAGES,
} from "@/utils/image-helpers";
import "./masthead.css";

type MastheadProps = {
  className?: string;
  featuredImage?: {
    node: {
      sourceUrl: string;
      altText: string;
      title: string;
      caption: string;
      slug: string;
      uri: string;
    };
  };
};

function Masthead({ featuredImage, className }: MastheadProps) {
  const initialUrl = getSafeImageUrl(
    featuredImage?.node?.sourceUrl,
    "featured"
  );
  const { currentUrl, handleError } = useImageFallback(
    initialUrl,
    FALLBACK_IMAGES.featured
  );
  const blurDataURL = buildUrl(currentUrl, blurOptions);

  console.log("currentUrl", currentUrl);

  return (
    <div className={`${className} `}>
      <Image
        priority
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        placeholder="blur"
        blurDataURL={blurDataURL}
        src={currentUrl}
        alt={featuredImage?.node?.altText || "featured image"}
        onError={handleError}
      />
      <Container>
        <span className="headline">{featuredImage?.node?.title || ""}</span>
        <RawHtml className="description">
          {featuredImage?.node?.caption || ""}
        </RawHtml>
      </Container>
    </div>
  );
}

export default Masthead;
