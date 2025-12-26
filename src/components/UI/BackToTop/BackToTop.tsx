"use client";

import { useState, useEffect } from "react";
import { ArrowUp } from "lucide-react";
import { clsx } from "clsx";
import styles from "./BackToTop.module.css";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollThreshold = 400;
      setIsVisible(window.scrollY > scrollThreshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <button
      type="button"
      onClick={scrollToTop}
      className={clsx(styles.button, isVisible && styles.visible)}
      aria-label="Back to top"
    >
      <ArrowUp className={styles.icon} aria-hidden="true" />
    </button>
  );
}
