"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { Calendar, Clock, MapPin, DollarSign, Users, ArrowRight } from "lucide-react";
import type { Event } from "../types";
import styles from "./EventsGrid.module.css";

type EventsGridProps = {
  events: Event[];
  basePath?: string;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

function formatCompactDate(startDate?: string): { day: string; weekday: string } {
  if (!startDate) return { day: "", weekday: "" };

  const date = new Date(startDate);
  return {
    day: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    weekday: date.toLocaleDateString("en-US", { weekday: "short" }),
  };
}

function formatFullDate(startDate?: string): string {
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

export function EventsGrid({ events, basePath = "/events" }: EventsGridProps) {
  const [activeEvent, setActiveEvent] = useState<Event | null>(null);

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

  return (
    <>
      <div className={styles.grid}>
        {events.map((event) => {
          if (!event.slug) return null;

          const image = event.featuredImage?.node;
          const { day } = formatCompactDate(event.startDate);
          const layoutId = `event-${event.id || event.databaseId || event.slug}`;

          return (
            <motion.div
              key={event.slug}
              layoutId={layoutId}
              className={styles.card}
              onClick={() => setActiveEvent(event)}
              style={{
                backgroundImage: image?.sourceUrl
                  ? `url(${image.sourceUrl})`
                  : undefined,
              }}
            >
              <div className={styles.compactContent}>
                <span className={styles.compactDay}>{day}</span>
                <span className={styles.compactTitle}>{event.title}</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {activeEvent && (
          <ExpandedEvent
            event={activeEvent}
            basePath={basePath}
            onClose={() => setActiveEvent(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}

function ExpandedEvent({
  event,
  basePath,
  onClose,
}: {
  event: Event;
  basePath: string;
  onClose: () => void;
}) {
  const image = event.featuredImage?.node;
  const layoutId = `event-${event.id || event.databaseId || event.slug}`;
  const excerpt = event.content
    ? stripHtml(event.content).substring(0, 200) + "..."
    : "";
  const organizer = event.organizers?.nodes?.[0]?.title;
  const venueLocation = [event.venue?.city, event.venue?.state]
    .filter(Boolean)
    .join(", ");

  return (
    <motion.div
      className={styles.overlay}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        layoutId={layoutId}
        className={styles.modal}
        onClick={(e) => e.stopPropagation()}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
      >
        <motion.div
          className={styles.expandedContent}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          {image?.sourceUrl && (
            <div className={styles.expandedImage}>
              <Image
                src={image.sourceUrl}
                alt={image.altText || event.title || "Event image"}
                width={800}
                height={450}
                className={styles.image}
                sizes="(max-width: 768px) 100vw, 800px"
              />
            </div>
          )}
          <div className={styles.expandedBody}>
            <h3 className={styles.cardTitle}>{event.title}</h3>

            <div className={styles.meta}>
              {event.startDate && (
                <div className={styles.metaItem}>
                  <Calendar size={14} />
                  <span>{formatFullDate(event.startDate)}</span>
                </div>
              )}
              {event.startDate && (
                <div className={styles.metaItem}>
                  <Clock size={14} />
                  <span>{formatTime(event.startDate)}</span>
                </div>
              )}
              <div className={styles.metaItem}>
                <DollarSign size={14} />
                <span>{formatCost(event.cost)}</span>
              </div>
              {(event.venue?.title || venueLocation) && (
                <div className={styles.metaItem}>
                  <MapPin size={14} />
                  <span>
                    {event.venue?.title}
                    {venueLocation && `, ${venueLocation}`}
                  </span>
                </div>
              )}
              {organizer && (
                <div className={styles.metaItem}>
                  <Users size={14} />
                  <span>{organizer}</span>
                </div>
              )}
            </div>

            {excerpt && <p className={styles.excerpt}>{excerpt}</p>}

            <Link
              href={`${basePath}/${event.slug}`}
              className={styles.viewLink}
              onClick={(e) => e.stopPropagation()}
            >
              View Event <ArrowRight size={14} />
            </Link>
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}
