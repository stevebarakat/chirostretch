import Image from "next/image";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import { NoImage } from "@/components/UI/NoImage";
import LocationMapWrapper from "@/components/Locations/LocationMapWrapper";
import styles from "./LocationCard.module.css";

type LocationCardProps = {
  title: string;
  image?: string;
  imageAlt?: string;
  content?: string;
};

export function LocationCard({
  title,
  image,
  imageAlt,
  content,
}: LocationCardProps) {
  return (
    <article className={styles.card}>
      {image ? (
        <ImageWrapper className={styles.imageWrapper}>
          <Image
            src={image}
            alt={imageAlt || title || "Location image"}
            fill
            className={styles.image}
            sizes="(max-width: 639px) 100vw, 320px"
          />
        </ImageWrapper>
      ) : (
        <ImageWrapper className={styles.imageWrapper}>
          <NoImage />
        </ImageWrapper>
      )}
      <div className={styles.rightColumn}>
        <div className={styles.content}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {content && <p className={styles.description}>{content}</p>}
        </div>
        <div className={styles.mapWrapper}>
          <LocationMapWrapper title={title} />
        </div>
      </div>
    </article>
  );
}
