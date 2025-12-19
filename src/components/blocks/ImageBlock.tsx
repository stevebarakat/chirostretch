import Image from "next/image";
import { clsx } from "clsx";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import styles from "./ImageBlock.module.css";

type ImageBlockProps = {
  url: string;
  alt?: string;
  width?: number;
  height?: number;
  caption?: string;
  align?: "left" | "center" | "right" | "wide" | "full";
  sizeSlug?: string;
  className?: string;
  style?: {
    border?: {
      radius?: string;
    };
    borderRadius?: string;
  };
  borderRadius?: string;
  aspectRatio?: string;
  scale?: "cover" | "contain";
  objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
};

function isValidUrl(url: string): boolean {
  if (!url) return false;
  if (url.startsWith("IMAGE:")) return false;
  try {
    const urlObj = new URL(url);
    return urlObj.protocol === "http:" || urlObj.protocol === "https:";
  } catch {
    return url.startsWith("http://") || url.startsWith("https://");
  }
}

function getImageSizeFromSlug(
  sizeSlug: string | undefined,
  defaultWidth: number,
  defaultHeight: number
): { width: number; height: number } {
  if (!sizeSlug) {
    return { width: defaultWidth, height: defaultHeight };
  }

  const sizeMap: Record<string, { width: number; height: number }> = {
    thumbnail: { width: 150, height: 150 },
    medium: { width: 300, height: 300 },
    medium_large: { width: 768, height: 576 },
    large: { width: 1024, height: 1024 },
    full: { width: defaultWidth, height: defaultHeight },
  };

  return sizeMap[sizeSlug] || { width: defaultWidth, height: defaultHeight };
}

function parseAspectRatio(aspectRatio?: string): string | undefined {
  if (!aspectRatio) {
    return undefined;
  }

  const normalizedRatio = aspectRatio.replace(/\//g, ":");

  const ratioMap: Record<string, string> = {
    "1:1": "1 / 1",
    "4:3": "4 / 3",
    "3:2": "3 / 2",
    "16:9": "16 / 9",
    "21:9": "21 / 9",
  };

  if (ratioMap[normalizedRatio]) {
    return ratioMap[normalizedRatio];
  }

  if (normalizedRatio.includes(":")) {
    const [w, h] = normalizedRatio.split(":").map(Number);
    if (!isNaN(w) && !isNaN(h) && h > 0) {
      return `${w} / ${h}`;
    }
  }

  return undefined;
}

export default function ImageBlock({
  url,
  alt = "",
  width,
  height,
  caption,
  align,
  sizeSlug,
  className = "",
  style,
  borderRadius,
  aspectRatio,
  scale,
  objectFit,
}: ImageBlockProps) {
  if (!url || !isValidUrl(url)) return null;

  const alignClassMap: Record<string, string> = {
    left: styles.alignLeft,
    right: styles.alignRight,
    center: styles.alignCenter,
    wide: styles.alignWide,
    full: styles.alignFull,
  };
  const alignClass = align ? alignClassMap[align] : undefined;

  const imageSize = getImageSizeFromSlug(
    sizeSlug,
    width || 1200,
    height || 800
  );
  const finalWidth = width || imageSize.width;
  const finalHeight = height || imageSize.height;

  const borderRadiusValue =
    borderRadius ||
    style?.borderRadius ||
    style?.border?.radius ||
    (className.includes("is-style-rounded") ? "9999px" : undefined);

  const aspectRatioValue = parseAspectRatio(aspectRatio);
  const finalObjectFit =
    objectFit || scale || (aspectRatioValue ? "cover" : undefined);

  const imageStyle: React.CSSProperties = {
    ...(borderRadiusValue && { borderRadius: borderRadiusValue }),
    ...(finalObjectFit && { objectFit: finalObjectFit }),
  };

  const figureStyle: React.CSSProperties = {
    ...(aspectRatioValue && { aspectRatio: aspectRatioValue }),
  };

  const figureClasses = clsx(
    styles.figure,
    alignClass,
    borderRadiusValue && styles.rounded,
    className.includes("is-style-rounded") && styles.rounded,
    className.includes("is-style-circle") && styles.circle,
    aspectRatioValue && styles.hasAspectRatio
  );

  if (aspectRatioValue) {
    return (
      <figure
        className={figureClasses}
        style={{
          ...figureStyle,
          position: "relative",
        }}
      >
        <ImageWrapper className={styles.imageWrapper}>
          <Image
            src={url}
            alt={alt}
            fill
            sizes={
              align === "wide" || align === "full"
                ? "100vw"
                : sizeSlug === "thumbnail"
                ? "150px"
                : sizeSlug === "medium"
                ? "300px"
                : sizeSlug === "medium_large"
                ? "768px"
                : sizeSlug === "large"
                ? "1024px"
                : "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
            }
            style={imageStyle}
          />
        </ImageWrapper>
        {caption && (
          <figcaption className={styles.caption}>{caption}</figcaption>
        )}
      </figure>
    );
  }

  return (
    <figure className={figureClasses}>
      <Image
        src={url}
        alt={alt}
        width={finalWidth}
        height={finalHeight}
        sizes={
          align === "wide" || align === "full"
            ? "100vw"
            : sizeSlug === "thumbnail"
            ? "150px"
            : sizeSlug === "medium"
            ? "300px"
            : sizeSlug === "medium_large"
            ? "768px"
            : sizeSlug === "large"
            ? "1024px"
            : "(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
        }
        style={imageStyle}
      />
      {caption && <figcaption className={styles.caption}>{caption}</figcaption>}
    </figure>
  );
}
