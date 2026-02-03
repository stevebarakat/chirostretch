"use client";

// eslint-disable-next-line no-restricted-imports
import { useRef, useEffect } from "react";
import { useInfiniteHits, useSearchBox } from "react-instantsearch";
import { useInfiniteScroll } from "@/hooks";
import { EventsCalendar, type EventsCalendarHandle } from "../EventsCalendar";
import { ExpandedEventModal } from "../ExpandedEventModal";
import { useEventsContext } from "../EventsContext";
import type { Event } from "../types";
import styles from "./InfiniteEventsHits.module.css";

type EventHit = {
  objectID: string;
  title: string;
  slug: string;
  content?: string;
  startDate?: string;
  endDate?: string;
  cost?: string;
  venue?: string;
  venueCity?: string;
  venueState?: string;
  organizer?: string;
  categories?: { name: string; slug: string }[];
  image?: string;
  imageAlt?: string;
};

function mapHitToEvent(hit: EventHit): Event {
  return {
    id: hit.objectID,
    slug: hit.slug,
    title: hit.title,
    content: hit.content,
    startDate: hit.startDate,
    endDate: hit.endDate,
    cost: hit.cost,
    venue: hit.venue
      ? {
          title: hit.venue,
          city: hit.venueCity,
          state: hit.venueState,
        }
      : null,
    organizers: hit.organizer
      ? {
          nodes: [{ title: hit.organizer }],
        }
      : null,
    eventsCategories: hit.categories?.length
      ? { nodes: hit.categories }
      : null,
    featuredImage: hit.image
      ? {
          node: {
            sourceUrl: hit.image,
            altText: hit.imageAlt,
          },
        }
      : null,
  };
}

export function InfiniteEventsHits() {
  const { hits, isLastPage, showMore } = useInfiniteHits<EventHit>();
  const { query } = useSearchBox();
  const sentinelRef = useRef<HTMLDivElement>(null);
  const calendarRef = useRef<EventsCalendarHandle>(null);
  const eventsContext = useEventsContext();

  // Register scrollToEvent when calendar ref becomes available
  // Reason: Syncing calendar's scrollToEvent function with context for cross-component access
  useEffect(() => {
    if (calendarRef.current && eventsContext) {
      eventsContext.registerScrollToEvent(calendarRef.current.scrollToEvent);
    }
  }, [eventsContext, hits]);

  useInfiniteScroll({ sentinelRef, isLastPage, showMore });

  // Show empty state only when there's a query with no results
  if (hits.length === 0 && query) {
    return (
      <div className={styles.empty}>
        <p>No events found for &ldquo;{query}&rdquo;</p>
      </div>
    );
  }

  const events = hits.map(mapHitToEvent);

  return (
    <div className={styles.container}>
      <EventsCalendar ref={calendarRef} events={events} basePath="/events" />
      <ExpandedEventModal events={events} basePath="/events" />
      <div ref={sentinelRef} aria-hidden="true" className={styles.sentinel} />
    </div>
  );
}
