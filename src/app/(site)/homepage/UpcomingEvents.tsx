import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";
import styles from "./UpcomingEvents.module.css";

type Event = {
  slug?: string;
  title?: string;
  id?: string;
  databaseId?: number;
  author?: {
    node?: {
      name?: string;
    };
  } | null;
  content?: string;
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

  const limit = eventsLimit && eventsLimit >= 3 ? eventsLimit : 3;
  const displayEvents = eventsList.slice(0, limit);

  return (
    <section className={styles.section}>
      <Container>
        <SectionHeading heading={eventsHeading} subheading={eventsSubheading} />
        {displayEvents.length > 0 ? (
          <div className={styles.grid}>
            {displayEvents.map((event) => {
              return (
                <div
                  key={event.id || event.databaseId}
                  className={styles.eventCard}
                >
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
                    {event.author?.node?.name && (
                      <div className={styles.date}>
                        By {event.author.node.name}
                      </div>
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
