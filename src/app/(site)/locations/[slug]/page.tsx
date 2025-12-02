import Image from "next/image";
import { notFound } from "next/navigation";
import { wpQuery } from "@/app/_lib/wp/graphql";
import {
  LOCATION_BY_SLUG_QUERY,
  ALL_LOCATION_SLUGS_QUERY,
  type LocationBySlugResponse,
  type AllLocationSlugsResponse,
} from "@/app/_lib/wp/queries/locations";
import Container from "@/components/ui/Container";
import { LocationMapWrapper } from "@/components/locations";
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
  const imageWidth = image?.mediaDetails?.width || 1200;
  const imageHeight = image?.mediaDetails?.height || 800;

  return (
    <main className={styles.main}>
      <Container>
        <article className={styles.article}>
          {image?.sourceUrl && (
            <div className={styles.featuredImage}>
              <Image
                src={image.sourceUrl}
                alt={image.altText || location.title || "Location image"}
                width={imageWidth}
                height={imageHeight}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                priority={true}
                fetchPriority="high"
                className={styles.image}
              />
            </div>
          )}

          <header className={styles.header}>
            <h1 className={styles.title}>{location.title}</h1>
          </header>

          {location.content && (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: location.content }}
            />
          )}

          <div className={styles.mapWrapper}>
            <LocationMapWrapper title={location.title} />
          </div>
        </article>
      </Container>
    </main>
  );
}
