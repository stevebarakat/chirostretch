import Image from "next/image";
import Link from "next/link";
import { wpQuery } from "@/app/_lib/wp/graphql";
import {
  ALL_LOCATIONS_QUERY,
  type AllLocationsResponse,
} from "@/lib/graphql/queries";
import { Container } from "@/components/UI/Container";
import { PageHeader } from "@/components/UI/PageHeader";
import { Pagination } from "@/components/UI/Pagination";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import { NoImage } from "@/components/UI/NoImage";
import { LocationMapWrapper } from "@/components/Locations";
import styles from "./page.module.css";

export const revalidate = 300;

const LOCATIONS_PER_PAGE = 6;

type LocationsPageProps = {
  searchParams: Promise<{ after?: string }>;
};

export default async function LocationsPage({
  searchParams,
}: LocationsPageProps) {
  const params = await searchParams;
  const after = params.after || null;

  const variables: { first: number; after?: string | null } = {
    first: LOCATIONS_PER_PAGE,
  };

  if (after) {
    variables.after = after;
  }

  const data = await wpQuery<AllLocationsResponse>(
    ALL_LOCATIONS_QUERY,
    variables,
    300
  );
  const locations = data.locations?.nodes ?? [];
  const pageInfo = data.locations?.pageInfo;

  function stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, "").trim();
  }

  return (
    <main className={styles.main}>
      <Container>
        <PageHeader
          title="Our Locations"
          subtitle="Find a clinic near you and visit us today"
        />
        {locations.length > 0 ? (
          <>
            <div className={styles.grid}>
              {locations.map((location) => {
                if (!location.slug) return null;

                const image = location.featuredImage?.node;
                const imageWidth = image?.mediaDetails?.width || 800;
                const imageHeight = image?.mediaDetails?.height || 450;
                const excerpt = location.content
                  ? stripHtml(location.content)
                  : "";

                return (
                  <Link
                    key={location.id || location.slug}
                    href={`/locations/${location.slug}`}
                    className={styles.card}
                  >
                    {image?.sourceUrl ? (
                      <ImageWrapper className={styles.imageWrapper}>
                        <Image
                          src={image.sourceUrl}
                          alt={
                            image.altText || location.title || "Location image"
                          }
                          width={imageWidth}
                          height={imageHeight}
                          className={styles.image}
                          sizes="(max-width: 639px) 100vw, 320px"
                        />
                      </ImageWrapper>
                    ) : (
                      <ImageWrapper className={styles.imageWrapper}>
                        <NoImage />
                      </ImageWrapper>
                    )}
                    <div className={styles.rightColumn}>
                      <div className={styles.content}>
                        <h3 className={styles.cardTitle}>{location.title}</h3>
                        {excerpt && (
                          <p className={styles.description}>{excerpt}</p>
                        )}
                      </div>
                      <div className={styles.mapWrapper}>
                        <LocationMapWrapper title={location.title} />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
            {pageInfo && (
              <Pagination
                hasNextPage={pageInfo.hasNextPage ?? false}
                hasPreviousPage={pageInfo.hasPreviousPage ?? false}
                endCursor={pageInfo.endCursor}
                startCursor={pageInfo.startCursor}
                currentPath="/locations"
              />
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <p>No locations available at this time.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
