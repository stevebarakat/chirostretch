import Image from "next/image";
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
  featuredImage?: {
    node?: {
      id?: string;
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
              const imageUrl = event.featuredImage?.node?.sourceUrl;
              const imageAlt =
                event.featuredImage?.node?.altText ||
                event.title ||
                "Event image";

              return (
                <div
                  key={event.id || event.databaseId}
                  className={styles.eventCard}
                >
                  <div className={styles.imageWrapper}>
                    {imageUrl ? (
                      <Image
                        src={imageUrl}
                        alt={imageAlt}
                        fill
                        quality={75}
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className={styles.image}
                      />
                    ) : (
                      <div
                        style={{
                          width: "100%",
                          height: "100%",
                          backgroundColor: "var(--color-bg-tertiary)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "var(--color-text-tertiary)",
                          fontSize: "var(--font-size-sm)",
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </div>
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
