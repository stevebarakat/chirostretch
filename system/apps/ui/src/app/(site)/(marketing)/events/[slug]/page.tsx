import Link from "next/link";
import Image from "next/image";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import { EVENT_BY_SLUG_QUERY, type EventData } from "@/lib/graphql/queries";
import { EventRegistration } from "@/components/Events/EventRegistration";
import {
  Calendar,
  MapPin,
  ClipboardList,
  ArrowLeft,
  Share2,
  CalendarPlus,
  ArrowRight,
} from "lucide-react";
import { getSafeImageUrl } from "@/utils/image-helpers";
import { parseHtml } from "@/components/CMS";
import styles from "./page.module.css";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

function formatEventDate(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function formatEventTime(dateString?: string): string {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

function buildMapUrl(venue: EventData["venue"]): string {
  if (!venue) return "#";
  const parts = [
    venue.address,
    venue.city,
    venue.state,
  ].filter(Boolean) as string[];
  const query = encodeURIComponent(parts.join(", "));
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const data = await wpQuery<{ event: EventData | null }>(
    EVENT_BY_SLUG_QUERY,
    { slug },
    { tags: [CACHE_TAGS.events] }
  );

  const event = data.event;
  if (!event) return <div>Event not found.</div>;

  const venue = event.venue;
  const categories = event.eventsCategories?.nodes || [];
  const hasVenue = venue?.title || venue?.address;
  const hasCategories = categories.length > 0;

  const venueAddressParts = [
    venue?.address,
    venue?.city && venue?.state ? `${venue.city}, ${venue.state}` : venue?.city,
  ].filter(Boolean);

  const img = event.featuredImage?.node;
  const heroImageUrl = img?.sourceUrl
    ? getSafeImageUrl(img.sourceUrl, "hero")
    : null;

  return (
    <main className={styles.main}>
      {/* Hero */}
      <section
        className={`${styles.heroSection} ${!heroImageUrl ? styles.heroNoImage : ""}`}
      >
        {heroImageUrl && (
          <>
            <div className={styles.heroImageWrapper}>
              <Image
                priority
                fill
                src={heroImageUrl}
                alt={img?.altText || event.title || "Event"}
                sizes="(max-width: 1200px) 100vw, 1200px"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
            <div className={styles.heroOverlay} aria-hidden />
          </>
        )}
        <div className={styles.heroContent}>
          <h1 className={styles.heroTitle}>{event.title}</h1>
        </div>
      </section>

      {/* Info cards (overlap hero) */}
      <div className={styles.cardsWrapper}>
        <div className={styles.cardsGrid}>
          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <span className={styles.detailCardIcon} aria-hidden>
                <Calendar />
              </span>
              <h2 className={styles.detailCardTitle}>Date & Time</h2>
            </div>
            <div className={styles.detailCardContent}>
              {event.startDate && (
                <div>
                  <span className={styles.detailItemLabel}>Starts</span>
                  <span className={styles.detailItemValue}>
                    {formatEventDate(event.startDate)} at{" "}
                    {formatEventTime(event.startDate)}
                  </span>
                </div>
              )}
              {event.endDate && (
                <div>
                  <span className={styles.detailItemLabel}>Ends</span>
                  <span className={styles.detailItemValue}>
                    {formatEventDate(event.endDate)} at{" "}
                    {formatEventTime(event.endDate)}
                  </span>
                </div>
              )}
              {!event.startDate && !event.endDate && (
                <span className={styles.detailItemValue}>
                  Date to be announced
                </span>
              )}
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <span className={styles.detailCardIcon} aria-hidden>
                <MapPin />
              </span>
              <h2 className={styles.detailCardTitle}>Location</h2>
            </div>
            <div className={styles.detailCardContent}>
              {hasVenue ? (
                <>
                  {venue?.title && (
                    <span className={styles.venueName}>{venue.title}</span>
                  )}
                  {venueAddressParts.length > 0 && (
                    <address className={styles.venueAddress}>
                      {venueAddressParts.join(", ")}
                    </address>
                  )}
                  <a
                    href={buildMapUrl(venue)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.mapLink}
                  >
                    View on Map <ArrowRight size={14} aria-hidden />
                  </a>
                </>
              ) : (
                <span className={styles.detailItemValue}>
                  Location to be announced
                </span>
              )}
            </div>
          </div>

          <div className={styles.detailCard}>
            <div className={styles.detailCardHeader}>
              <span className={styles.detailCardIcon} aria-hidden>
                <ClipboardList />
              </span>
              <h2 className={styles.detailCardTitle}>Registration</h2>
            </div>
            <div className={styles.detailCardContent}>
              <span className={styles.detailItemLabel}>Cost</span>
              <span className={styles.costValue}>
                {event.cost || "Free"}
              </span>
              <div className={styles.ctaSlot}>
                <EventRegistration />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main content + sidebar */}
      <section className={styles.contentSection}>
        <div className={styles.contentInner}>
          <article className={styles.articleColumn}>
            <Link href="/events" className={styles.backLink}>
              <ArrowLeft className={styles.backIcon} aria-hidden />
              Back to Events
            </Link>

            <div className={styles.eventContent}>
              {parseHtml(event.content)}
            </div>

            <div className={styles.actionBar}>
              <button type="button" className={styles.actionButton}>
                <Share2 aria-hidden />
                Share Event
              </button>
              <button type="button" className={styles.actionButton}>
                <CalendarPlus aria-hidden />
                Add to Calendar
              </button>
            </div>
          </article>

          <aside className={styles.sidebar}>
            {hasCategories && (
              <div className={styles.sidebarCard}>
                <h3 className={styles.sidebarCardTitle}>Categories</h3>
                <div className={styles.categoryList}>
                  {categories.map((category) => (
                    <Link
                      key={category.slug}
                      href={`/events?category=${category.slug}`}
                      className={styles.categoryTag}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              </div>
            )}

            <div className={`${styles.sidebarCard} ${styles.newsletterCard}`}>
              <h3 className={styles.sidebarCardTitle}>
                Can&apos;t make this time?
              </h3>
              <p className={styles.newsletterDescription}>
                Join our newsletter to be the first to know about future
                mobility workshops and spine health seminars.
              </p>
              <form
                className={styles.newsletterForm}
                action="#"
                method="post"
                aria-label="Newsletter signup"
              >
                <input
                  type="email"
                  name="email"
                  placeholder="Email Address"
                  className={styles.newsletterInput}
                  required
                  autoComplete="email"
                />
                <button type="submit" className={styles.newsletterSubmit}>
                  Subscribe
                </button>
              </form>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}
