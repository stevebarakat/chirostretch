"use client";

import { useMemo } from "react";
import styles from "./LocationMap.module.css";

type LocationMapProps = {
  address?: string;
  coordinates?: {
    lat?: number | null;
    lng?: number | null;
  };
  title?: string;
  mapEmbed?: string;
};

export default function LocationMap({
  address,
  coordinates,
  title,
  mapEmbed,
}: LocationMapProps) {
  const embedUrl = useMemo(() => {
    if (mapEmbed) {
      return null;
    }

    if (coordinates?.lat && coordinates?.lng) {
      const { lat, lng } = coordinates;
      const query = encodeURIComponent(`${lat},${lng}`);
      return `https://www.google.com/maps/embed/v1/place?key=${
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
      }&q=${query}&zoom=15`;
    }

    if (address || title) {
      const query = encodeURIComponent(address || title || "");
      return `https://www.google.com/maps/embed/v1/place?key=${
        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
      }&q=${query}&zoom=15`;
    }

    return null;
  }, [mapEmbed, coordinates, address, title]);

  if (mapEmbed) {
    return (
      <div
        className={styles.mapContainer}
        dangerouslySetInnerHTML={{ __html: mapEmbed }}
      />
    );
  }

  if (!embedUrl) {
    return (
      <div className={styles.mapError}>
        <p>Map unavailable</p>
      </div>
    );
  }

  return (
    <iframe
      src={embedUrl}
      className={styles.mapIframe}
      allowFullScreen
      loading="lazy"
      referrerPolicy="no-referrer-when-downgrade"
      title={title ? `Map for ${title}` : "Location map"}
    />
  );
}
