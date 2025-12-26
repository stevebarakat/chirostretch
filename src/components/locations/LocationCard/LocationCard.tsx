import { StreetViewEmbed } from "@/components/Locations/StreetViewEmbed";
import LocationMapWrapper from "@/components/Locations/LocationMapWrapper";
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
      <div className={styles.streetViewWrapper}>
        <StreetViewEmbed
          lat={coordinates?.lat}
          lng={coordinates?.lng}
          title={title}
        />
      </div>
      <div className={styles.rightColumn}>
        <div className={styles.content}>
          <h3 className={styles.cardTitle}>{title}</h3>
          {content && <p className={styles.description}>{content}</p>}
        </div>
        <div className={styles.mapWrapper}>
          <LocationMapWrapper title={title} coordinates={coordinates} />
        </div>
      </div>
    </article>
  );
}
