"use client";

import { useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import { NoImage } from "@/components/UI/NoImage";
import type { Event } from "../types";
import styles from "./ExpandedEventModal.module.css";

type ExpandedEventModalProps = {
  events: Event[];
  basePath?: string;
};

export function ExpandedEventModal({
  events,
  basePath = "",
}: ExpandedEventModalProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeEventSlug = searchParams.get("event");
  const modalRef = useRef<HTMLDivElement>(null);

  const activeEvent = events.find((event) => event.slug === activeEventSlug);

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete("event");
    const newSearch = params.toString();
    const path = basePath
      ? newSearch
        ? `${basePath}?${newSearch}`
        : basePath
      : newSearch
        ? `/?${newSearch}`
        : "/";
    router.push(path, {
      scroll: false,
    });
  }, [searchParams, router, basePath]);

  useEffect(() => {
    if (activeEvent) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [activeEvent]);

  useEffect(() => {
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape" && activeEvent) {
        handleClose();
      }
    }

    if (activeEvent) {
      document.addEventListener("keydown", handleEscape);
      const firstFocusable = modalRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      firstFocusable?.focus();
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [activeEvent, handleClose]);

  function handleBackdropClick(e: React.MouseEvent<HTMLDivElement>) {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  }

  if (!activeEvent) return null;

  const image = activeEvent.featuredImage?.node;
  const imageWidth = image?.mediaDetails?.width || 1200;
  const imageHeight = image?.mediaDetails?.height || 675;
  const layoutId = `event-${activeEvent.id || activeEvent.databaseId || activeEvent.slug}`;

  return (
    <AnimatePresence>
      <motion.div
        className={styles.overlay}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleBackdropClick}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          ref={modalRef}
          layoutId={layoutId}
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close event details"
          >
            <X size={24} aria-hidden="true" />
          </button>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className={styles.content}
          >
            {image?.sourceUrl ? (
              <ImageWrapper className={styles.imageWrapper}>
                <Image
                  src={image.sourceUrl}
                  alt={image.altText || activeEvent.title || "Event image"}
                  width={imageWidth}
                  height={imageHeight}
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </ImageWrapper>
            ) : (
              <ImageWrapper className={styles.imageWrapper}>
                <NoImage />
              </ImageWrapper>
            )}

            <div className={styles.textContent}>
              <h2 className={styles.title}>{activeEvent.title}</h2>
              {activeEvent.organizers?.nodes?.[0]?.title && (
                <div className={styles.author}>
                  By {activeEvent.organizers.nodes[0].title}
                </div>
              )}
              {activeEvent.content && (
                <div
                  className={styles.description}
                  dangerouslySetInnerHTML={{ __html: activeEvent.content }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

