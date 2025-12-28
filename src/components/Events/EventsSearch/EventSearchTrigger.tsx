"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import EventSearchModal from "@/components/Search/EventSearchModal";
import styles from "./EventSearchTrigger.module.css";

export function EventSearchTrigger() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className={styles.trigger}
        onClick={() => setIsOpen(true)}
        aria-label="Search events"
      >
        <Search className={styles.icon} size={20} aria-hidden="true" />
        <span className={styles.placeholder}>Search events...</span>
      </button>
      <EventSearchModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
