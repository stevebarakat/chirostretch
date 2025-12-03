import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import { buildUrl } from "cloudinary-build-url";
import { blurOptions } from "@/utils/constants";
import styles from "./blocks.module.css";

type BlocksProps = {
  blocks?: {
    topBlocks?: {
      topBlocksAuthor?: string;
      topBlocksQuote?: string;
      topBlocksImage?: {
        node?: {
          altText?: string;
          sourceUrl?: string;
          slug?: string;
        };
      };
    };
    bottomBlocks?: {
      bottomBlocksButtonText?: string;
      bottomBlocksHeadline?: string;
      bottomBlocksImage?: {
        node?: {
          sourceUrl?: string;
          altText?: string;
          slug?: string;
        };
      };
      bottomBlocksText?: string;
      bottomBlocksLink?: string;
    };
  };
};

export default function Blocks({ blocks }: BlocksProps) {
  if (!blocks?.topBlocks || !blocks?.bottomBlocks) return null;

  const { topBlocks, bottomBlocks } = blocks;
  const { topBlocksAuthor, topBlocksQuote, topBlocksImage } = topBlocks;
  const {
    bottomBlocksButtonText,
    bottomBlocksHeadline,
    bottomBlocksImage,
    bottomBlocksText,
    bottomBlocksLink,
  } = bottomBlocks;

  if (
    !topBlocksImage?.node?.sourceUrl ||
    !topBlocksImage?.node?.altText ||
    !topBlocksImage?.node?.slug ||
    !topBlocksQuote ||
    !topBlocksAuthor ||
    !bottomBlocksImage?.node?.sourceUrl ||
    !bottomBlocksImage?.node?.altText ||
    !bottomBlocksImage?.node?.slug ||
    !bottomBlocksHeadline ||
    !bottomBlocksText ||
    !bottomBlocksButtonText ||
    !bottomBlocksLink
  ) {
    return null;
  }

  const { altText, sourceUrl, slug } = topBlocksImage.node;
  const { slug: bottomSlug } = bottomBlocksImage.node;
  const top = buildUrl(slug, blurOptions);
  const bottom = buildUrl(bottomSlug, blurOptions);

  return (
    <div className={styles.blocks}>
      <div className={styles.wrapper}>
        {/* BLOCK 1 */}
        <div className={styles.block1}>
          <div className={styles.brightness}>
            <Image
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL={top}
              src={sourceUrl}
              alt={altText}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
          <figure>
            <blockquote className={styles.blockquote}>
              <p>{topBlocksQuote}</p>
            </blockquote>
            <figcaption>—{topBlocksAuthor}</figcaption>
          </figure>
        </div>

        {/* BLOCK 2 */}
        <figure className={styles.block2}>
          <blockquote className={styles.blockquote}>
            <p>{topBlocksQuote}</p>
          </blockquote>
          <figcaption>—{topBlocksAuthor}</figcaption>
        </figure>
      </div>

      {/* BLOCK 3 */}
      <div
        style={{ background: "var(--accentGradient)", color: "white" }}
        className={styles.wrapper}
      >
        <div className={styles.contain} style={{ justifySelf: "flex-end" }}>
          <div className={styles.block3}>
            <div className={styles.figure}>
              <div className={styles.headline}>
                <p>{bottomBlocksHeadline}</p>
              </div>
              <p className={styles.description}>{bottomBlocksText}</p>
              <Link passHref href={bottomBlocksLink}>
                <Button variant="primary">{bottomBlocksButtonText}</Button>
              </Link>
            </div>
          </div>
        </div>

        {/* BLOCK 4 */}
        <div className={styles.block4}>
          <div className={styles.brightness}>
            <Image
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL={bottom}
              src={bottomBlocksImage.node.sourceUrl}
              alt={bottomBlocksImage.node.altText}
              style={{ objectFit: "cover", objectPosition: "center" }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
