import Image from "next/legacy/image";
import { blurOptions } from "@/utils/constants";
import { buildUrl } from "cloudinary-build-url";
import { Container } from "../Container";
import { RawHtml } from "../RawHtml";
import "./masthead.css";

const featuredImg =
  "https://res.cloudinary.com/nfcpt/images/v1728148775/wordpress-assets/blog/blog.jpg";

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
  const imgUrl = featuredImage?.node?.sourceUrl ?? featuredImg;

  const blurDataURL = buildUrl(imgUrl, blurOptions);

  console.log("imgUrl", imgUrl);

  return (
    <div className={`${className} `}>
      <Image
        priority
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        placeholder="blur"
        blurDataURL={blurDataURL}
        src={imgUrl}
        alt={featuredImage?.node?.altText || "featured image"}
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
