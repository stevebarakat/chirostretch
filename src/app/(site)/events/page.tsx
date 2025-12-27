import { fetchGraphQL } from "@/lib/graphql/client";
import {
  EVENTS_INDEX_QUERY,
  type EventsIndexData,
} from "@/lib/graphql/queries";
import { Container } from "@/components/UI/Container";
import { PageHeader } from "@/components/UI/PageHeader";
import { Pagination } from "@/components/UI/Pagination";
import { EventsGrid } from "@/components/Events";
import type { Event } from "@/components/Events";
import styles from "./page.module.css";

const EVENTS_PER_PAGE = 21;

type EventsIndexPageProps = {
  searchParams: Promise<{ after?: string; location?: string; venue?: string }>;
};

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
  const events: Event[] = (data.events?.nodes ?? []).map((event) => ({
    id: event.id,
    databaseId: event.databaseId,
    slug: event.slug,
    title: event.title,
    content: event.content,
    startDate: event.startDate,
    endDate: event.endDate,
    cost: event.cost,
    venue: event.venue,
    organizers: event.organizers,
    featuredImage: event.featuredImage,
  }));
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
            <EventsGrid events={events} />
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
