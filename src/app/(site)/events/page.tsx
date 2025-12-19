import Image from "next/image";
import Link from "next/link";
import { fetchGraphQL } from "@/lib/graphql/client";
import {
  EVENTS_INDEX_QUERY,
  type EventsIndexData,
} from "@/lib/graphql/queries";
import { Container } from "@/components/UI/Container";
import { PageHeader } from "@/components/UI/PageHeader";
import { Pagination } from "@/components/UI/Pagination";
import { ImageWrapper } from "@/components/UI/ImageWrapper";
import { NoImage } from "@/components/UI/NoImage";
import styles from "./page.module.css";

const EVENTS_PER_PAGE = 6;

type EventsIndexPageProps = {
  searchParams: Promise<{ after?: string; location?: string; venue?: string }>;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "").trim();
}

export default async function EventsIndex({
  searchParams,
}: EventsIndexPageProps) {
  const params = await searchParams;
  const after = params.after || null;

  const variables: { first: number; after?: string | null } = {
    first: EVENTS_PER_PAGE,
  };

  if (after) {
    variables.after = after;
  }

  const data = await fetchGraphQL<EventsIndexData>(
    EVENTS_INDEX_QUERY,
    variables
  );
  const events = data.events?.nodes ?? [];
  const pageInfo = data.events?.pageInfo;

  return (
    <main className={styles.main}>
      <Container>
        <PageHeader
          title="Events"
          subtitle="Discover upcoming events and workshops"
        />

        {events.length > 0 ? (
          <>
            <div className={styles.grid}>
              {events.map((event) => {
                if (!event.slug) return null;

                const image = event.featuredImage?.node;
                const imageWidth = image?.mediaDetails?.width || 800;
                const imageHeight = image?.mediaDetails?.height || 450;
                const excerpt = event.content
                  ? stripHtml(event.content).substring(0, 150) + "..."
                  : "";

                return (
                  <Link
                    key={event.id || event.slug}
                    href={`/events/${event.slug}`}
                    className={styles.card}
                  >
                    {image?.sourceUrl ? (
                      <ImageWrapper className={styles.imageWrapper}>
                        <Image
                          src={image.sourceUrl}
                          alt={image.altText || event.title || "Event image"}
                          width={imageWidth}
                          height={imageHeight}
                          className={styles.image}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        />
                      </ImageWrapper>
                    ) : (
                      <ImageWrapper className={styles.imageWrapper}>
                        <NoImage />
                      </ImageWrapper>
                    )}
                    <div className={styles.content}>
                      <h3 className={styles.cardTitle}>{event.title}</h3>
                      {event.author?.node?.name && (
                        <div className={styles.author}>
                          By {event.author.node.name}
                        </div>
                      )}
                      {excerpt && <p className={styles.excerpt}>{excerpt}</p>}
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
                currentPath="/events"
              />
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <p>No events available at this time.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
