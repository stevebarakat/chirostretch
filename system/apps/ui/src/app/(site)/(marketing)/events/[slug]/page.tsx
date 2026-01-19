import Link from "next/link";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import { EVENT_BY_SLUG_QUERY, type EventData } from "@/lib/graphql/queries";
import { Container, Button } from "@/components/UI";
import { Hero } from "@/components/Hero";
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

function CalendarIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
      <line x1="16" x2="16" y1="2" y2="6" />
      <line x1="8" x2="8" y1="2" y2="6" />
      <line x1="3" x2="21" y1="10" y2="10" />
    </svg>
  );
}

function MapPinIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  );
}

function TicketIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2Z" />
      <path d="M13 5v2" />
      <path d="M13 17v2" />
      <path d="M13 11v2" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </svg>
  );
}

function ArrowLeftIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m12 19-7-7 7-7" />
      <path d="M19 12H5" />
    </svg>
  );
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
  const organizers = event.organizers?.nodes || [];
  const categories = event.eventsCategories?.nodes || [];
  const hasVenue = venue?.title || venue?.address;
  const hasOrganizers = organizers.length > 0;
  const hasCategories = categories.length > 0;

  const venueAddressParts = [
    venue?.address,
    venue?.city && venue?.state ? `${venue.city}, ${venue.state}` : venue?.city,
  ].filter(Boolean);

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <Hero
        featuredImage={event.featuredImage ?? undefined}
        title={event.title}
        maxHeight={500}
      />

      {/* Details Section */}
      <section className={styles.detailsSection}>
        <Container>
          <div className={styles.detailsGrid}>
            {/* Date & Time Card */}
            <div className={styles.detailCard}>
              <div className={styles.detailCardHeader}>
                <div className={styles.detailCardIcon}>
                  <CalendarIcon />
                </div>
                <h2 className={styles.detailCardTitle}>Date & Time</h2>
              </div>
              <div className={styles.detailCardContent}>
                {event.startDate && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailItemLabel}>Starts</span>
                    <span className={styles.detailItemValue}>
                      {formatEventDate(event.startDate)} at{" "}
                      {formatEventTime(event.startDate)}
                    </span>
                  </div>
                )}
                {event.endDate && (
                  <div className={styles.detailItem}>
                    <span className={styles.detailItemLabel}>Ends</span>
                    <span className={styles.detailItemValue}>
                      {formatEventDate(event.endDate)} at{" "}
                      {formatEventTime(event.endDate)}
                    </span>
                  </div>
                )}
                {!event.startDate && !event.endDate && (
                  <p className={styles.detailItem}>Date to be announced</p>
                )}
              </div>
            </div>

            {/* Location Card */}
            <div className={styles.detailCard}>
              <div className={styles.detailCardHeader}>
                <div className={styles.detailCardIcon}>
                  <MapPinIcon />
                </div>
                <h2 className={styles.detailCardTitle}>Location</h2>
              </div>
              <div className={styles.detailCardContent}>
                {hasVenue ? (
                  <>
                    {venue?.title && (
                      <div className={styles.detailItem}>
                        <span className={styles.detailItemValue}>
                          {venue.title}
                        </span>
                      </div>
                    )}
                    {venueAddressParts.length > 0 && (
                      <address className={styles.venueAddress}>
                        {venueAddressParts.map((part, i) => (
                          <span key={i} className={styles.detailItem}>
                            {part}
                          </span>
                        ))}
                      </address>
                    )}
                    {venue?.phone && (
                      <a
                        href={`tel:${venue.phone}`}
                        className={styles.venuePhone}
                      >
                        <PhoneIcon />
                        {venue.phone}
                      </a>
                    )}
                  </>
                ) : (
                  <p className={styles.detailItem}>Location to be announced</p>
                )}
              </div>
            </div>

            {/* Cost & Registration Card */}
            <div className={styles.detailCard}>
              <div className={styles.detailCardHeader}>
                <div className={styles.detailCardIcon}>
                  <TicketIcon />
                </div>
                <h2 className={styles.detailCardTitle}>Registration</h2>
              </div>
              <div className={styles.detailCardContent}>
                <div className={styles.detailItem}>
                  <span className={styles.detailItemLabel}>Cost</span>
                  <span className={styles.costValue}>
                    {event.cost || "Free"}
                  </span>
                </div>
                <div className={styles.ctaButton}>
                  <Button as="a" href="#register" size="md">
                    Register Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Content Section */}
      <section className={styles.contentSection}>
        <Container>
          <Link href="/events" className={styles.backLink}>
            <span className={styles.backIcon}>
              <ArrowLeftIcon />
            </span>
            Back to Events
          </Link>

          <div className={styles.contentLayout}>
            {/* Main Content */}
            <article className={styles.mainContent}>
              <div
                className={styles.eventContent}
                dangerouslySetInnerHTML={{ __html: event.content }}
              />
            </article>

            {/* Sidebar */}
            {(hasOrganizers || hasCategories) && (
              <aside className={styles.sidebar}>
                {/* Organizers */}
                {hasOrganizers && (
                  <div className={styles.sidebarCard}>
                    <h3 className={styles.sidebarCardTitle}>
                      {organizers.length === 1 ? "Organizer" : "Organizers"}
                    </h3>
                    <div className={styles.organizerList}>
                      {organizers.map((organizer, index) => (
                        <div key={index} className={styles.organizerItem}>
                          {organizer.title && (
                            <span className={styles.organizerName}>
                              {organizer.title}
                            </span>
                          )}
                          <div className={styles.organizerContact}>
                            {organizer.email && (
                              <a
                                href={`mailto:${organizer.email}`}
                                className={styles.organizerLink}
                              >
                                <span className={styles.organizerIcon}>
                                  <MailIcon />
                                </span>
                                {organizer.email}
                              </a>
                            )}
                            {organizer.phone && (
                              <a
                                href={`tel:${organizer.phone}`}
                                className={styles.organizerLink}
                              >
                                <span className={styles.organizerIcon}>
                                  <PhoneIcon />
                                </span>
                                {organizer.phone}
                              </a>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Categories */}
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
              </aside>
            )}
          </div>
        </Container>
      </section>
    </main>
  );
}
