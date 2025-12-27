"use client";

// eslint-disable-next-line no-restricted-imports
import { useEffect, useRef, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { X, Calendar, Clock, DollarSign, MapPin, Users, ArrowRight } from "lucide-react";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import { NoImage } from "@/components/UI/NoImage";
import type { Event } from "../types";
import styles from "./ExpandedEventModal.module.css";

type ExpandedEventModalProps = {
  events: Event[];
  basePath?: string;
};

function formatDate(startDate?: string): string {
  if (!startDate) return "";
  const date = new Date(startDate);
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(startDate?: string): string {
  if (!startDate) return "";
  const date = new Date(startDate);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatCost(cost?: string | null): string {
  if (!cost || cost === "0" || cost === "$0" || cost === "$0.00") {
    return "Free";
  }
  return cost.startsWith("$") ? cost : `$${cost}`;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

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
    router.push(newSearch ? `?${newSearch}` : window.location.pathname, {
      scroll: false,
    });
  }, [searchParams, router]);

  // Reason this component must use useEffect:
  // - Syncing with browser API (document.body.style) to prevent scrolling when modal is open
  // - This is a side effect that modifies global document state
  // - Must clean up on unmount or when modal closes
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

  // Reason this component must use useEffect:
  // - Syncing with browser API (keyboard events and focus management)
  // - This is a side effect that sets up event listeners and manages focus
  // - Must clean up event listeners on unmount
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
  const organizer = activeEvent.organizers?.nodes?.[0]?.title;
  const venueLocation = [activeEvent.venue?.city, activeEvent.venue?.state]
    .filter(Boolean)
    .join(", ");
  const excerpt = activeEvent.content
    ? stripHtml(activeEvent.content).substring(0, 300) + "..."
    : "";

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
          className={styles.modal}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            type="button"
            className={styles.closeButton}
            onClick={handleClose}
            aria-label="Close event details"
          >
            <X size={24} aria-hidden="true" />
          </button>

          <div className={styles.content}>
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

              {activeEvent.eventsCategories?.nodes &&
                activeEvent.eventsCategories.nodes.length > 0 && (
                  <div className={styles.categories}>
                    {activeEvent.eventsCategories.nodes.map((category) => (
                      <span key={category.slug} className={styles.category}>
                        {category.name}
                      </span>
                    ))}
                  </div>
                )}

              <div className={styles.meta}>
                {activeEvent.startDate && (
                  <div className={styles.metaItem}>
                    <Calendar size={16} />
                    <span>{formatDate(activeEvent.startDate)}</span>
                  </div>
                )}
                {activeEvent.startDate && (
                  <div className={styles.metaItem}>
                    <Clock size={16} />
                    <span>{formatTime(activeEvent.startDate)}</span>
                  </div>
                )}
                <div className={styles.metaItem}>
                  <DollarSign size={16} />
                  <span>{formatCost(activeEvent.cost)}</span>
                </div>
                {(activeEvent.venue?.title || venueLocation) && (
                  <div className={styles.metaItem}>
                    <MapPin size={16} />
                    <span>
                      {activeEvent.venue?.title}
                      {venueLocation && `, ${venueLocation}`}
                    </span>
                  </div>
                )}
                {organizer && (
                  <div className={styles.metaItem}>
                    <Users size={16} />
                    <span>{organizer}</span>
                  </div>
                )}
              </div>

              {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

              <Link
                href={`${basePath}/${activeEvent.slug}`}
                className={styles.viewLink}
              >
                View Full Event <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
