"use client";

import { useState } from "react";
import dynamic from "next/dynamic";
import { Search } from "lucide-react";
import styles from "./LocationSearchTrigger.module.css";

const LocationSearchModal = dynamic(
  () => import("@/components/Search/LocationSearchModal"),
  { ssr: false }
);

export default function LocationSearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label="Find a location"
      >
        <Search size={18} aria-hidden="true" />
        <span>Find A Location</span>
      </button>
      <LocationSearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
