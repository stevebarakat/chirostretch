import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { wpQuery } from "@/app/_lib/wp/graphql";
import {
  LOCATION_BY_SLUG_QUERY,
  ALL_LOCATION_SLUGS_QUERY,
  type LocationBySlugResponse,
  type AllLocationSlugsResponse,
} from "@/lib/graphql/queries";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";
import { StaffCard, ServicesTabs } from "@/components/locations";
import styles from "./page.module.css";

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

  const data = await wpQuery<LocationBySlugResponse>(
    LOCATION_BY_SLUG_QUERY,
    { slug },
    300
  );

  if (!data?.location) {
    notFound();
  }

  const location = data.location;
  const image = location.featuredImage?.node;
  const chiropractors = location.chiropractors?.nodes ?? [];
  const hours = location.hours ?? [];

  const fullAddress = [
    location.streetAddress,
    location.city,
    location.state,
    location.zip,
  ]
    .filter(Boolean)
    .join(", ");

  const googleMapsUrl = location.coordinates?.lat && location.coordinates?.lng
    ? `https://www.google.com/maps?q=${location.coordinates.lat},${location.coordinates.lng}`
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`;

  return (
    <main className={styles.main}>
      {/* Hero Section */}
      <section className={styles.hero}>
        {image?.sourceUrl && (
          <Image
            src={image.sourceUrl}
            alt={image.altText || location.title || "Location"}
            fill
            priority
            fetchPriority="high"
            className={styles.heroImage}
          />
        )}
        <div className={styles.heroOverlay} />
        <Container>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>{location.title}</h1>
            {location.shortDescription && (
              <p className={styles.heroSubtitle}>{location.shortDescription}</p>
            )}
            <div className={styles.heroButtons}>
              <Button as="a" href="#book" variant="primary">
                Book Appointment
              </Button>
              <Button as="a" href="#team" variant="white">
                Meet Our Team
              </Button>
            </div>
          </div>
        </Container>
      </section>

      {/* Location Info Section */}
      <section className={styles.infoSection}>
        <Container>
          <div className={styles.infoGrid}>
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
                  <a href={`tel:${location.phone}`} className={styles.infoItem}>
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

            {/* Map Card */}
            <div className={styles.mapCard}>
              {location.coordinates?.lat && location.coordinates?.lng && (
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${location.coordinates.lat},${location.coordinates.lng}&zoom=15`}
                  className={styles.map}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${location.title}`}
                />
              )}
            </div>
          </div>
        </Container>
      </section>

      {/* Services Section */}
      <section className={styles.servicesSection}>
        <Container>
          <h2 className={styles.sectionTitle}>Our Core Therapies</h2>
          <p className={styles.sectionSubtitle}>
            We combine modern chiropractic adjustments with assisted stretching
            to treat the root cause of your discomfort.
          </p>
          <ServicesTabs />
        </Container>
      </section>

      {/* Meet Our Team Section */}
      {chiropractors.length > 0 && (
        <section id="team" className={styles.teamSection}>
          <Container>
            <h2 className={styles.sectionTitle}>Meet Our Team</h2>
            <p className={styles.sectionSubtitle}>
              Our licensed chiropractors are dedicated to helping you achieve
              optimal wellness through personalized care.
            </p>
            <div className={styles.teamGrid}>
              {chiropractors.map((chiro) => (
                <StaffCard key={chiro.id} staff={chiro} />
              ))}
            </div>
          </Container>
        </section>
      )}

      {/* Book Appointment CTA */}
      <section id="book" className={styles.ctaSection}>
        <Container>
          <div className={styles.ctaContent}>
            <h2 className={styles.ctaTitle}>Ready to Feel Better?</h2>
            <p className={styles.ctaText}>
              Schedule your first consultation and take the first step toward a
              pain-free life.
            </p>
            <Button as="a" href={`tel:${location.phone}`} variant="primary">
              Call to Book: {location.phone}
            </Button>
          </div>
        </Container>
      </section>

      {/* Location Content (if any) */}
      {location.content && (
        <section className={styles.contentSection}>
          <Container>
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: location.content }}
            />
          </Container>
        </section>
      )}
    </main>
  );
}
