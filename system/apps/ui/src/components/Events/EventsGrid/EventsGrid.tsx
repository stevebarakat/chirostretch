"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type { Event } from "../types";
import styles from "./EventsGrid.module.css";
import { Divider } from "@/components/UI";

type EventsGridProps = {
  events: Event[];
};

function formatCompactDate(startDate?: string): string {
  if (!startDate) return "";
  const date = new Date(startDate);
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function EventsGrid({ events }: EventsGridProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleCardClick(slug: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("event", slug);
    router.push(`?${params.toString()}`, { scroll: false });
  }

  return (
    <div className={styles.grid}>
      {events.map((event) => {
        if (!event.slug) return null;

        const image = event.featuredImage?.node;
        const day = formatCompactDate(event.startDate);
        const city = event.venue?.city;

        return (
          <button
            key={event.slug}
            type="button"
            className={styles.card}
            onClick={() => handleCardClick(event.slug!)}
            style={
              image?.sourceUrl
                ? { backgroundImage: `url(${image.sourceUrl})` }
                : undefined
            }
          >
            <div className={styles.compactContent}>
              <span className={styles.compactDay}>{day}</span>
              <span className={styles.compactTitle}>{event.title}</span>
              <Divider
                orientation="horizontal"
                thickness="thin"
                className={styles.divider}
              />
              {city && <span className={styles.compactCity}>{city}</span>}
            </div>
          </button>
        );
      })}
    </div>
  );
}
