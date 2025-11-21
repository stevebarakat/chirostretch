import Image from "next/image";
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
};

export default function ProductGallery({
  mainImage,
  galleryImages = [],
}: ProductGalleryProps) {
  const allImages = mainImage
    ? [mainImage, ...galleryImages]
    : galleryImages;

  if (allImages.length === 0) {
    return null;
  }

  const mainImageSrc = mainImage?.sourceUrl || galleryImages[0]?.sourceUrl;
  const mainImageAlt = mainImage?.altText || galleryImages[0]?.altText || "";
  const mainImageWidth = mainImage?.mediaDetails?.width || 800;
  const mainImageHeight = mainImage?.mediaDetails?.height || 800;

  return (
    <div className={styles.gallery}>
      <div className={styles.mainImage}>
        {mainImageSrc && (
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
        )}
      </div>
      {galleryImages.length > 0 && (
        <div className={styles.thumbnails}>
          {galleryImages.map((image, index) => {
            if (!image.sourceUrl) return null;
            return (
              <div key={index} className={styles.thumbnail}>
                <Image
                  src={image.sourceUrl}
                  alt={image.altText || ""}
                  width={image.mediaDetails?.width || 150}
                  height={image.mediaDetails?.height || 150}
                  className={styles.thumbnailImage}
                  sizes="150px"
                />
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

