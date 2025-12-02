import Image from "next/image";
import BlockRenderer, { type Block } from "./BlockRenderer";
import styles from "./CoverBlock.module.css";

type CoverBlockProps = {
  url?: string;
  alt?: string;
  dimRatio?: number;
  overlayColor?: string;
  minHeight?: number;
  contentPosition?: string;
  innerBlocks?: Block[];
  className?: string;
};

function isValidUrl(url: string): boolean {
  if (!url) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return url.startsWith("http://") || url.startsWith("https://");
  }
}

export default function CoverBlock({
  url,
  alt = "",
  dimRatio = 0,
  overlayColor = "black",
  minHeight = 300,
  contentPosition = "center center",
  innerBlocks,
  className,
}: CoverBlockProps) {
  const hasValidImage = url && isValidUrl(url);
  const overlayOpacity = dimRatio / 100;
  const minHeightValue = `${minHeight}px`;

  if (!hasValidImage && (!innerBlocks || innerBlocks.length === 0)) {
    return null;
  }

  const positionClasses = contentPosition
    .split(" ")
    .map((pos) => styles[`position-${pos}`] || "")
    .filter(Boolean)
    .join(" ");

  const overlayBgColor =
    overlayColor === "black"
      ? "hsl(0, 0%, 0%)"
      : overlayColor === "white"
      ? "hsl(0, 0%, 100%)"
      : overlayColor;

  return (
    <div
      className={`${styles.cover} ${className || ""}`}
      style={{ minHeight: minHeightValue }}
    >
      {hasValidImage && (
        <div className={styles.backgroundImage}>
          <Image
            src={url}
            alt={alt}
            fill
            sizes="100vw"
            style={{ objectFit: "cover" }}
            priority={false}
          />
        </div>
      )}
      {hasValidImage && overlayOpacity > 0 && (
        <span
          className={styles.overlay}
          style={{
            backgroundColor: overlayBgColor,
            opacity: overlayOpacity,
          }}
          aria-hidden="true"
        />
      )}
      {innerBlocks && innerBlocks.length > 0 && (
        <div className={`${styles.innerContainer} ${positionClasses}`}>
          <BlockRenderer blocks={innerBlocks} />
        </div>
      )}
    </div>
  );
}
