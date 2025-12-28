"use client";

import { Container } from "@/components/UI/Container";
import { SectionHeading } from "@/components/UI/SectionHeading";
import { Button } from "@/components/UI/Button";
import { EventsGrid, ExpandedEventModal } from "@/components/Events";
import type { Event } from "@/components/Events";
import styles from "./UpcomingEvents.module.css";

type UpcomingEventsProps = {
  eventsHeading?: string;
  eventsSubheading?: string;
  eventsCtaText?: string;
  eventsCtaLink?: string;
  events?: {
    nodes?: Event[];
  };
  eventsLimit?: number;
};

export default function UpcomingEvents({
  eventsHeading,
  eventsSubheading,
  eventsCtaText,
  eventsCtaLink,
  events,
  eventsLimit,
}: UpcomingEventsProps) {
  if (!eventsHeading) return null;

  const eventsList = events?.nodes || [];

  // Sort by startDate chronologically
  const sortedEvents = [...eventsList].sort((a, b) => {
    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
    return dateA - dateB;
  });

  const limit = eventsLimit && eventsLimit >= 3 ? eventsLimit : 14;
  const displayEvents = sortedEvents.slice(0, limit);

  return (
    <section id="upcoming-events" className={styles.section}>
      <Container>
        <SectionHeading heading={eventsHeading} subheading={eventsSubheading} />
        {displayEvents.length > 0 ? (
          <>
            <EventsGrid events={displayEvents} />
            <ExpandedEventModal events={displayEvents} basePath="/events" />
          </>
        ) : (
          <div style={{ textAlign: "center", padding: "var(--spacing-3xl) 0" }}>
            <p style={{ color: "var(--color-text-secondary)" }}>
              No upcoming events at this time.
            </p>
          </div>
        )}
        {eventsCtaText && eventsCtaLink && (
          <div className={styles.cta}>
            <Button as="a" href={eventsCtaLink}>
              {eventsCtaText}
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}
