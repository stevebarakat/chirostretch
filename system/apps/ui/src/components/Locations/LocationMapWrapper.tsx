"use client";

import dynamic from "next/dynamic";
import styles from "./LocationMapWrapper.module.css";

const LocationMap = dynamic(
  () => import("./LocationMap").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <div className={styles.placeholder}>Loading map...</div>,
  }
);

type LocationMapWrapperProps = {
  title?: string;
  coordinates?: {
    lat?: number | null;
    lng?: number | null;
  };
  address?: string;
  mapEmbed?: string;
};

export default function LocationMapWrapper(props: LocationMapWrapperProps) {
  return <LocationMap {...props} />;
}
