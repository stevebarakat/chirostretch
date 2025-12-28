"use client";

import { useState } from "react";
import Image from "next/image";
import ImageMagnifier from "@/components/ImageMagnifier/ImageMagnifier";
import styles from "./ProductGallery.module.css";

type ProductImage = {
  sourceUrl?: string;
  altText?: string;
  srcSet?: string;
  sizes?: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
};

type ProductGalleryProps = {
  mainImage?: ProductImage;
  galleryImages?: ProductImage[];
  enableMagnifier?: boolean;
};

export default function ProductGallery({
  mainImage,
  galleryImages = [],
  enableMagnifier = true,
}: ProductGalleryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const allImages = mainImage ? [mainImage, ...galleryImages] : galleryImages;

  if (allImages.length === 0) {
    return null;
  }

  const selectedImage = allImages[selectedImageIndex];
  const mainImageSrc = selectedImage?.sourceUrl || allImages[0]?.sourceUrl || "";
  const hasValidMainImage = mainImageSrc.length > 0;
  const mainImageAlt = selectedImage?.altText || allImages[0]?.altText || "";
  const mainImageWidth = selectedImage?.mediaDetails?.width || 800;
  const mainImageHeight = selectedImage?.mediaDetails?.height || 800;

  return (
    <div className={styles.gallery}>
      {hasValidMainImage && enableMagnifier ? (
        <ImageMagnifier
          src={mainImageSrc}
          alt={mainImageAlt}
          width={mainImageWidth}
          height={mainImageHeight}
          priority
          fetchPriority="high"
          sizes="(max-width: 768px) 100vw, 50vw"
          className={styles.mainImage}
        />
      ) : hasValidMainImage ? (
        <div className={styles.mainImage}>
          <Image
            src={mainImageSrc}
            alt={mainImageAlt}
            width={mainImageWidth}
            height={mainImageHeight}
            priority
            fetchPriority="high"
            className={styles.image}
            sizes="(max-width: 768px) 100vw, 50vw"
          />
        </div>
      ) : null}
      {allImages.length > 1 && (
        <div className={styles.thumbnails}>
          {allImages.map((image, index) => {
            if (!image.sourceUrl || image.sourceUrl.length === 0) return null;
            return (
              <button
                key={index}
                className={`${styles.thumbnail} ${
                  selectedImageIndex === index ? styles.active : ""
                }`}
                onClick={() => setSelectedImageIndex(index)}
                type="button"
                aria-label={`Select image: ${image.altText || "Product image"}`}
              >
                <Image
                  src={image.sourceUrl}
                  alt={image.altText || ""}
                  width={image.mediaDetails?.width || 150}
                  height={image.mediaDetails?.height || 150}
                  className={styles.thumbnailImage}
                  sizes="150px"
                />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
