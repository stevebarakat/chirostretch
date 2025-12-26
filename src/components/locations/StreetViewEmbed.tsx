"use client";

import { useState } from "react";
import styles from "./StreetViewEmbed.module.css";

type StreetViewEmbedProps = {
  lat?: number | null;
  lng?: number | null;
  title?: string;
};

export function StreetViewEmbed({ lat, lng, title }: StreetViewEmbedProps) {
  const [hasError, setHasError] = useState(false);
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  if (!lat || !lng || !apiKey) {
    return null;
  }

  // If Street View fails, fall back to regular map
  if (hasError) {
    const mapUrl = `https://www.google.com/maps/embed/v1/place?key=${apiKey}&q=${lat},${lng}&zoom=15`;
    return (
      <iframe
        src={mapUrl}
        className={styles.embed}
        loading="lazy"
        allowFullScreen
        referrerPolicy="no-referrer-when-downgrade"
        title={title ? `Map of ${title}` : "Location map"}
      />
    );
  }

  const streetViewUrl = `https://www.google.com/maps/embed/v1/streetview?key=${apiKey}&location=${lat},${lng}&heading=0&pitch=0`;

  return (
    <iframe
      src={streetViewUrl}
      className={styles.embed}
      loading="lazy"
      allowFullScreen
      referrerPolicy="no-referrer-when-downgrade"
      title={title ? `Street view of ${title}` : "Street view"}
      onError={() => setHasError(true)}
    />
  );
}
