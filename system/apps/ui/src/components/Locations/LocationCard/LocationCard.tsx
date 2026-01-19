import LocationMapWrapper from "@/components/Locations/LocationMapWrapper";
import { Text } from "@/components/Primitives";
import styles from "./LocationCard.module.css";

type LocationCardProps = {
  title: string;
  content?: string;
  coordinates?: {
    lat?: number | null;
    lng?: number | null;
  };
};

export function LocationCard({
  title,
  content,
  coordinates,
}: LocationCardProps) {
  return (
    <article className={styles.card}>
      <div className={styles.content}>
        <Text as="h3" className={styles.cardTitle}>{title}</Text>
        {content && <Text className={styles.description}>{content}</Text>}
      </div>
      <div className={styles.mapWrapper}>
        <LocationMapWrapper title={title} coordinates={coordinates} />
      </div>
    </article>
  );
}
