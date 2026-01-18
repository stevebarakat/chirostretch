import { Suspense } from "react";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import {
  LOCATION_BY_SLUG_QUERY,
  ALL_LOCATION_SLUGS_QUERY,
  BOOKING_PRODUCTS_QUERY,
  ALL_TESTIMONIALS_QUERY,
  type LocationBySlugResponse,
  type AllLocationSlugsResponse,
  type BookingProductsResponse,
  type AllTestimonialsResponse,
  type Practitioner,
  type LocationHours,
} from "@/lib/graphql/queries";
import { Container } from "@/components/UI";
import {
  PractitionerCard,
  ServicesTabs,
  ValuePropositions,
  Testimonials,
} from "@/components/Locations";
import { BookingWidget } from "@/components/Bookings";
import styles from "./page.module.css";
import { RawHtml } from "@/components/RawHtml";
import {
  formatBusinessHours,
  type HourEntry,
} from "@/utils/formatBusinessHours";

/**
 * Convert GraphQL LocationHours to normalized HourEntry format
 */
function toHourEntries(hours: LocationHours[]): HourEntry[] {
  const dayMap: Record<string, HourEntry["day"]> = {
    Monday: "monday",
    Tuesday: "tuesday",
    Wednesday: "wednesday",
    Thursday: "thursday",
    Friday: "friday",
    Saturday: "saturday",
    Sunday: "sunday",
  };

  return hours
    .filter((h): h is LocationHours & { day: string } => Boolean(h.day))
    .map((h) => ({
      day: dayMap[h.day] ?? "monday",
      opens_at: h.open ?? "",
      closes_at: h.close ?? "",
      is_closed: !h.open || !h.close,
    }));
}

function BookingWidgetSkeleton() {
  return (
    <div className={styles.bookingSkeleton}>
      <div className={styles.skeletonHeader} />
      <div className={styles.skeletonContent}>
        <div className={styles.skeletonField} />
        <div className={styles.skeletonField} />
        <div className={styles.skeletonField} />
      </div>
      <div className={styles.skeletonButton} />
    </div>
  );
}

export const revalidate = 300;

// Skip static generation - pages are built on-demand with ISR
export async function generateStaticParams() {
  return [];
}

type LocationPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;

  const [locationData, bookingData, testimonialsData] = await Promise.all([
    wpQuery<LocationBySlugResponse>(LOCATION_BY_SLUG_QUERY, { slug }, {
      tags: [CACHE_TAGS.locations, CACHE_TAGS.staff],
    }),
    wpQuery<BookingProductsResponse>(BOOKING_PRODUCTS_QUERY, {}, {
      tags: [CACHE_TAGS.products],
    }),
    wpQuery<AllTestimonialsResponse>(ALL_TESTIMONIALS_QUERY, {}, {
      tags: [CACHE_TAGS.testimonials],
    }),
  ]);

  if (!locationData?.location) {
    notFound();
  }

  const data = locationData;

  // Transform booking products to services
  const services = (bookingData?.bookingProducts ?? []).map((product) => ({
    id: product.databaseId,
    name: product.name,
    duration: product.bookingDuration,
    durationUnit: product.bookingDurationUnit as "minute" | "hour" | "day",
    price: product.price ? `$${product.price}` : undefined,
  }));

  // Type assertion to include heroUnit and practitioners properties
  // Note: Browser's global Location interface conflicts with our Location type name
  type LocationWithHeroUnit = typeof data.location & {
    heroUnit?: {
      heroLink?: { target?: string; title?: string; url?: string };
      heroLinkIcon?: {
        node?: {
          sourceUrl?: string;
          altText?: string;
          slug?: string;
          mediaDetails?: { width?: number; height?: number };
        };
      };
      heroLink2?: { target?: string; title?: string; url?: string };
      heroLinkIcon2?: {
        node?: {
          sourceUrl?: string;
          altText?: string;
          slug?: string;
          mediaDetails?: { width?: number; height?: number };
        };
      };
    };
    practitioners?: {
      nodes?: Practitioner[];
    };
  };
  const location = data.location as LocationWithHeroUnit;
  const practitioners = (location.practitioners?.nodes ?? []).filter(
    Boolean
  ) as Practitioner[];
  const hours = (location.hours ?? []).filter(Boolean) as LocationHours[];
  const servicesOffered = (location.servicesOffered ?? []).filter(
    (s): s is string => Boolean(s)
  );
  const testimonials = (testimonialsData?.testimonials?.nodes ?? []).filter(
    (t) => t.locationId === location.databaseId
  );

  const fullAddress = [
    location.streetAddress,
    location.city,
    location.state,
    location.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const googleMapsUrl =
    location.coordinates?.lat && location.coordinates?.lng
      ? `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`
      : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
          fullAddress
        )}`;

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <main className={styles.main}>
        {/* Hero Section */}
        {location.featuredImage && (
          <Hero
            featuredImage={location.featuredImage}
            description={location.shortDescription}
            heroUnit={location.heroUnit}
            title={location.title}
          />
        )}

        {/* Value Props Section */}
        <section className={styles.valuePropsSection}>
          <Container>
            <ValuePropositions />
          </Container>
        </section>

        {/* Services Section */}
        {servicesOffered.length > 0 && (
          <section id="services" className={styles.servicesSection}>
            <Container>
              <ServicesTabs servicesOffered={servicesOffered} />
            </Container>
          </section>
        )}

        {/* Team Section */}
        {practitioners.length > 0 && (
          <section id="team" className={styles.teamSection}>
            <Container>
              <h2 className={styles.sectionTitle}>Meet Our Team</h2>
              <p className={styles.sectionSubtitle}>
                Our licensed healthcare professionals are dedicated to helping
                you achieve optimal wellness through personalized care.
              </p>
              <div className={styles.teamGrid}>
                {practitioners.map((practitioner) => (
                  <PractitionerCard key={practitioner.id} practitioner={practitioner} />
                ))}
              </div>
            </Container>
          </section>
        )}

        {/* Book Your Session Section */}
        <section id="book" className={styles.bookingSection}>
          <Container>
            <div className={styles.bookingGrid}>
              <div className={styles.bookingColumn}>
                <h2 className={styles.bookingTitle}>Book Your Session</h2>
                <p className={styles.bookingSubtitle}>
                  Select a service and time. First-time consultations are 70%
                  off with coupon.
                </p>
                <Suspense fallback={<BookingWidgetSkeleton />}>
                  <BookingWidget services={services} />
                </Suspense>
              </div>
              <div className={styles.visitColumn}>
                <h2 className={styles.visitTitle}>Visit Us</h2>
                <p className={styles.visitSubtitle}>
                  Serving {location.city} and the surrounding community.
                </p>
                <div className={styles.mapContainer}>
                  {location.coordinates?.lat && location.coordinates?.lng && (
                    <iframe
                      src={`https://www.google.com/maps/embed/v1/place?key=${
                        process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
                      }&q=${location.coordinates.lat},${location.coordinates.lng}&zoom=15`}
                      className={styles.bookingMap}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Map of ${location.title}`}
                    />
                  )}
                  <div className={styles.mapInfoOverlay}>
                    <div className={styles.mapInfoContent}>
                      <div className={styles.mapInfoLeft}>
                        <div className={styles.mapInfoHeader}>
                          <span className={styles.mapInfoDot} />
                          <span className={styles.mapInfoName}>
                            {location.title}
                          </span>
                        </div>
                        <div className={styles.mapInfoAddress}>
                          {location.streetAddress}
                          <br />
                          {location.city}, {location.state} {location.zip}
                        </div>
                        {hours.length > 0 && (
                          <dl className={styles.mapInfoHours}>
                            {formatBusinessHours(toHourEntries(hours)).map(
                              (line, i) => (
                                <div key={i} className={styles.hoursLine}>
                                  <dt>{line.days}:</dt>
                                  <dd>
                                    {line.hours !== "Closed" ? (
                                      <time>{line.hours}</time>
                                    ) : (
                                      line.hours
                                    )}
                                  </dd>
                                </div>
                              )
                            )}
                          </dl>
                        )}
                      </div>
                      {location.phone && (
                        <a
                          href={`tel:${location.phone}`}
                          className={styles.mapInfoPhone}
                          aria-label={`Call ${location.title}`}
                        >
                          <Phone className={styles.mapInfoPhoneIcon} />
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Location Info Section */}
        <section className={styles.infoSection}>
          <Container>
            <div className={styles.infoGrid}>
              {/* Hours Card */}
              {hours.length > 0 && (
                <div className={styles.infoCard}>
                  <h2 className={styles.infoCardTitle}>
                    <Clock className={styles.titleIcon} />
                    Hours
                  </h2>
                  <dl className={styles.hoursList}>
                    {formatBusinessHours(toHourEntries(hours)).map(
                      (line, index) => (
                        <div key={index} className={styles.hoursRow}>
                          <dt className={styles.hoursDay}>{line.days}</dt>
                          <dd className={styles.hoursTime}>
                            {line.hours !== "Closed" ? (
                              <time>{line.hours}</time>
                            ) : (
                              line.hours
                            )}
                          </dd>
                        </div>
                      )
                    )}
                  </dl>
                </div>
              )}

              {/* Location Description */}
              {location.content && (
                <div className={styles.infoCard}>
                  <h2 className={styles.infoCardTitle}>
                    <Clock className={styles.titleIcon} />
                    About {location.title}
                  </h2>
                  <RawHtml>{location.content}</RawHtml>
                </div>
              )}

              {/* Contact Card */}
              <div className={styles.infoCard}>
                <h2 className={styles.infoCardTitle}>Contact Us</h2>
                <div className={styles.infoList}>
                  {fullAddress && (
                    <Link
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.infoItem}
                    >
                      <MapPin className={styles.infoIcon} />
                      <span>{fullAddress}</span>
                    </Link>
                  )}
                  {location.phone && (
                    <a
                      href={`tel:${location.phone}`}
                      className={styles.infoItem}
                    >
                      <Phone className={styles.infoIcon} />
                      <span>{location.phone}</span>
                    </a>
                  )}
                  {location.email && (
                    <a
                      href={`mailto:${location.email}`}
                      className={styles.infoItem}
                    >
                      <Mail className={styles.infoIcon} />
                      <span>{location.email}</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </Container>
        </section>

        {/* Testimonials Section */}
        <Testimonials testimonials={testimonials} />
      </main>
    </Suspense>
  );
}
