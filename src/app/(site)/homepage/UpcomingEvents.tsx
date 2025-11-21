import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import styles from "./UpcomingEvents.module.css";

type Event = {
  id?: string;
  slug?: string;
  title?: string;
  databaseId?: number;
  content?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
      srcSet?: string;
      sizes?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  };
  startDate?: string;
  endDate?: string;
  allDay?: boolean;
  venue?: {
    id?: string;
    title?: string;
    address?: string;
  };
};

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

function formatEventDate(startDate?: string, endDate?: string, allDay?: boolean): string {
  if (!startDate) return "";

  const start = new Date(startDate);
  const end = endDate ? new Date(endDate) : null;

  const options: Intl.DateTimeFormatOptions = allDay
    ? { year: "numeric", month: "long", day: "numeric" }
    : { year: "numeric", month: "long", day: "numeric", hour: "numeric", minute: "2-digit" };

  const startFormatted = start.toLocaleDateString("en-US", options);

  if (end && end.getTime() !== start.getTime()) {
    const endOptions: Intl.DateTimeFormatOptions = allDay
      ? { month: "long", day: "numeric" }
      : { month: "long", day: "numeric", hour: "numeric", minute: "2-digit" };
    const endFormatted = end.toLocaleDateString("en-US", endOptions);
    return `${startFormatted} - ${endFormatted}`;
  }

  return startFormatted;
}

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

  const now = new Date();
  const upcomingEvents = eventsList.filter((event) => {
    if (!event.startDate) return false;
    const eventDate = new Date(event.startDate);
    return eventDate >= now;
  });

  const limit = eventsLimit && eventsLimit >= 3 ? eventsLimit : 3;
  const displayEvents = upcomingEvents.slice(0, limit);

  return (
    <section className={styles.section}>
      <Container>
        <SectionHeading heading={eventsHeading} subheading={eventsSubheading} />
        {displayEvents.length > 0 ? (
          <div className={styles.grid}>
            {displayEvents.map((event) => {
              const imageUrl = event.featuredImage?.node?.sourceUrl;
              const imageAlt =
                event.featuredImage?.node?.altText ||
                event.title ||
                "Event";
              const eventDate = formatEventDate(
                event.startDate,
                event.endDate,
                event.allDay
              );

              return (
                <div key={event.id || event.databaseId} className={styles.eventCard}>
                  {imageUrl && (
                    <div className={styles.imageWrapper}>
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        quality={75}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className={styles.image}
                      />
                    </div>
                  )}
                  <div className={styles.content}>
                    {event.title && (
                      <h3 className={styles.title}>
                        {event.slug ? (
                          <Link href={`/events/${event.slug}`}>
                            {event.title}
                          </Link>
                        ) : (
                          event.title
                        )}
                      </h3>
                    )}
                    {eventDate && (
                      <div className={styles.date}>{eventDate}</div>
                    )}
                    {event.venue?.title && (
                      <div className={styles.date}>{event.venue.title}</div>
                    )}
                    {event.content && (
                      <div
                        className={styles.description}
                        dangerouslySetInnerHTML={{
                          __html: event.content.substring(0, 150) + "...",
                        }}
                      />
                    )}
                    {event.slug && (
                      <Button
                        as="a"
                        href={`/events/${event.slug}`}
                        variant="secondary"
                      >
                        Learn More
                      </Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "var(--spacing-3xl) 0" }}>
            <p style={{ color: "var(--color-text-secondary)" }}>
              No upcoming events at this time.
            </p>
          </div>
        )}
        {eventsCtaText && eventsCtaLink && (
          <div className={styles.cta}>
            <Button as="a" href={eventsCtaLink} variant="primary">
              {eventsCtaText}
            </Button>
          </div>
        )}
      </Container>
    </section>
  );
}

