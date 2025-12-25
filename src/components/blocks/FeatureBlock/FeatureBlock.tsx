import Image from "next/image";
import type { Block } from "../BlockRenderer";
import { parseHtml } from "../parseHtml";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import styles from "./FeatureBlock.module.css";

type FeatureBlockProps = {
  block: Block;
  renderedHtml?: string;
};

type ExtractedContent = {
  heading: string | null;
  text: string | null;
  image: {
    src: string;
    alt: string;
    width: number;
    height: number;
  } | null;
};

export default function FeatureBlock({
  block,
  renderedHtml,
}: FeatureBlockProps) {
  const uniqueId = block.attributes?.uniqueId as string | undefined;

  if (!renderedHtml || !uniqueId) return null;

  const blockHtml = extractBlockHtml(renderedHtml, uniqueId);
  if (!blockHtml) return null;

  const content = extractContent(blockHtml);

  return (
    <div className={styles.feature}>
      <div className={styles.content}>
        {content.heading && (
          <h2 className={styles.heading}>{parseHtml(content.heading)}</h2>
        )}
        {content.text && (
          <div className={styles.text}>{parseHtml(content.text)}</div>
        )}
      </div>
      {content.image && (
        <div className={styles.imageContainer}>
          <ImageWrapper className={styles.imageWrapper}>
            <Image
              src={content.image.src}
              alt={content.image.alt}
              width={content.image.width}
              height={content.image.height}
              className={styles.image}
            />
          </ImageWrapper>
        </div>
      )}
    </div>
  );
}

function extractContent(html: string): ExtractedContent {
  const result: ExtractedContent = {
    heading: null,
    text: null,
    image: null,
  };

  const headingMatch = html.match(
    /<h[1-6][^>]*class="[^"]*stk-block-heading__text[^"]*"[^>]*>([\s\S]*?)<\/h[1-6]>/i
  );
  if (headingMatch) {
    result.heading = headingMatch[1].trim();
  }

  const textMatch = html.match(
    /<p[^>]*class="[^"]*stk-block-text__text[^"]*"[^>]*>([\s\S]*?)<\/p>/i
  );
  if (textMatch) {
    result.text = textMatch[1].trim();
  }

  const imgMatch = html.match(
    /<img[^>]*src="([^"]*)"[^>]*(?:alt="([^"]*)")?[^>]*(?:width="(\d+)")?[^>]*(?:height="(\d+)")?[^>]*>/i
  );
  if (imgMatch) {
    result.image = {
      src: imgMatch[1],
      alt: imgMatch[2] || "",
      width: parseInt(imgMatch[3] || "600", 10),
      height: parseInt(imgMatch[4] || "400", 10),
    };
  }

  return result;
}

function extractBlockHtml(html: string, uniqueId: string): string | null {
  const startMarker = `data-block-id="${uniqueId}"`;
  const startIndex = html.indexOf(startMarker);
  if (startIndex === -1) return null;

  const blockStart = html.lastIndexOf("<div", startIndex);
  if (blockStart === -1) return null;

  let depth = 0;
  let i = blockStart;
  while (i < html.length) {
    if (html.slice(i, i + 4) === "<div") {
      depth++;
      i += 4;
    } else if (html.slice(i, i + 6) === "</div>") {
      depth--;
      if (depth === 0) {
        return html.slice(blockStart, i + 6);
      }
      i += 6;
    } else {
      i++;
    }
  }
  return null;
}
