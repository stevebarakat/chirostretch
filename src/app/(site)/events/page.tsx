import { fetchGraphQL } from "@/lib/graphql/client";

const EVENTS_INDEX = `
  query {
    events(first: 100) {
      nodes {
        slug
        title
        date
        venue {
          slug
          title
        }
      }
    }
  }
`;

type EventsIndexPageProps = {
  searchParams: Promise<{ location?: string; venue?: string }>;
};

type EventsIndexData = {
  events: {
    nodes: Array<{
      slug: string;
      title: string;
      date: string;
      venue: {
        slug: string;
        title: string;
      } | null;
    }>;
  } | null;
};

export default async function EventsIndex({
  searchParams,
}: EventsIndexPageProps) {
  const params = await searchParams;
  const data = await fetchGraphQL<EventsIndexData>(EVENTS_INDEX);
  let events = data.events?.nodes ?? [];

  // Note: clinicLocation filtering would require fetching full event data
  // For now, location filtering is disabled - can be added when clinicLocation structure is confirmed
  // if (params?.location) {
  //   events = events.filter((e) => e.clinicLocation?.slug === params.location);
  // }

  if (params?.venue) {
    events = events.filter((e) => e.venue?.slug === params.venue);
  }

  return (
    <main>
      <h1>Events</h1>

      <ul>
        {events.map((ev) => (
          <li key={ev.slug}>
            <a href={`/events/${ev.slug}`}>{ev.title}</a>
            <div>{new Date(ev.date).toLocaleString()}</div>
          </li>
        ))}
      </ul>
    </main>
  );
}
