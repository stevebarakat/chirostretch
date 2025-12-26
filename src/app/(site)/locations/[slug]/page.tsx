import { Suspense } from "react";
import Link from "next/link";
import { Hero } from "@/components/Hero";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { wpQuery } from "@/app/_lib/wp/graphql";
import {
  LOCATION_BY_SLUG_QUERY,
  ALL_LOCATION_SLUGS_QUERY,
  BOOKING_PRODUCTS_QUERY,
  ALL_TESTIMONIALS_QUERY,
  type LocationBySlugResponse,
  type AllLocationSlugsResponse,
  type BookingProductsResponse,
  type AllTestimonialsResponse,
} from "@/lib/graphql/queries";
import { Container } from "@/components/UI/Container";
import {
  StaffCard,
  ServicesTabs,
  ValuePropositions,
  Testimonials,
} from "@/components/Locations";
import { BookingWidget } from "@/components/Bookings";
import styles from "./page.module.css";
import { RawHtml } from "@/components/RawHtml";

type HoursEntry = { day?: string; open?: string; close?: string };

function formatCondensedHours(hours: HoursEntry[]): React.ReactNode {
  const validHours = hours.filter(
    (h): h is { day: string; open: string; close: string } =>
      Boolean(h.day && h.open && h.close)
  );
  const dayAbbrev: Record<string, string> = {
    Sunday: "Sun",
    Monday: "Mon",
    Tuesday: "Tue",
    Wednesday: "Wed",
    Thursday: "Thu",
    Friday: "Fri",
    Saturday: "Sat",
  };

  const grouped: Record<string, string[]> = {};
  validHours.forEach((h) => {
    const timeRange = `${h.open} - ${h.close}`;
    if (!grouped[timeRange]) grouped[timeRange] = [];
    grouped[timeRange].push(dayAbbrev[h.day] || h.day);
  });

  const lines: string[] = [];
  Object.entries(grouped).forEach(([time, days]) => {
    if (days.length === 1) {
      lines.push(`${days[0]}: ${time}`);
    } else if (days.length === 2) {
      lines.push(`${days[0]} & ${days[1]}: ${time}`);
    } else {
      lines.push(`${days[0]}-${days[days.length - 1]}: ${time}`);
    }
  });

  return lines.map((line, i) => (
    <span key={i} className={styles.hoursLine}>
      {line}
    </span>
  ));
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

export async function generateStaticParams() {
  try {
    const data = await wpQuery<AllLocationSlugsResponse>(
      ALL_LOCATION_SLUGS_QUERY,
      {},
      300
    );

    const locations = data.locations?.nodes ?? [];

    return locations
      .filter((location) => location.slug)
      .map((location) => ({
        slug: location.slug!,
      }));
  } catch (error) {
    console.error("Error generating static params for locations:", error);
    return [];
  }
}

type LocationPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params;

  const [locationData, bookingData, testimonialsData] = await Promise.all([
    wpQuery<LocationBySlugResponse>(LOCATION_BY_SLUG_QUERY, { slug }, 300),
    wpQuery<BookingProductsResponse>(BOOKING_PRODUCTS_QUERY, {}, 300),
    wpQuery<AllTestimonialsResponse>(ALL_TESTIMONIALS_QUERY, {}, 300),
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

  // Type assertion to include heroUnit property
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
  };
  const location = data.location as LocationWithHeroUnit;
  const clinicalStaff = location.clinicalStaff?.nodes ?? [];
  const hours = location.hours ?? [];
  const servicesOffered = location.servicesOffered ?? [];
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
        {clinicalStaff.length > 0 && (
          <section id="team" className={styles.teamSection}>
            <Container>
              <h2 className={styles.sectionTitle}>Meet Our Team</h2>
              <p className={styles.sectionSubtitle}>
                Our licensed healthcare professionals are dedicated to helping
                you achieve optimal wellness through personalized care.
              </p>
              <div className={styles.teamGrid}>
                {clinicalStaff.map((staff) => (
                  <StaffCard key={staff.id} staff={staff} />
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
                      src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${location.coordinates.lat},${location.coordinates.lng}&zoom=15`}
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
                          <div className={styles.mapInfoHours}>
                            {formatCondensedHours(hours)}
                          </div>
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
                  <div className={styles.hoursList}>
                    {hours.map((hour, index) => (
                      <div key={index} className={styles.hoursRow}>
                        <span className={styles.hoursDay}>{hour.day}</span>
                        <span className={styles.hoursTime}>
                          {hour.open} - {hour.close}
                        </span>
                      </div>
                    ))}
                  </div>
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
