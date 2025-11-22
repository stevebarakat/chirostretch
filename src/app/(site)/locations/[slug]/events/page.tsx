import { fetchGraphQL } from "@/lib/graphql/client";
import { EVENT_FIELDS } from "@/lib/graphql/fragments";

type LocationEventsPageProps = {
  params: Promise<{ slug: string }>;
};

const EVENTS_WITH_CLINIC = `
  ${EVENT_FIELDS}
  query LocationEvents {
    events(first: 100) {
      nodes {
        ...EventFields
      }
    }
  }
`;

type EventsData = {
  events: {
    nodes: Array<{
      id: string;
      databaseId: number;
      slug: string;
      title: string;
      content: string;
      date: string;
      clinicLocation: {
        id: string;
        databaseId: number;
        slug: string;
        title: string;
      } | null;
    }>;
  } | null;
};

export default async function LocationEvents({
  params,
}: LocationEventsPageProps) {
  const { slug } = await params;
  const data = await fetchGraphQL<EventsData>(EVENTS_WITH_CLINIC);

  const events =
    data.events?.nodes?.filter(
      (event) => event.clinicLocation?.slug === slug
    ) ?? [];

  return (
    <main>
      <h1>Events at this Clinic</h1>

      {events.length === 0 ? (
        <p>No upcoming events.</p>
      ) : (
        <ul>
          {events.map((ev) => (
            <li key={ev.slug}>
              <a href={`/events/${ev.slug}`}>{ev.title}</a>
              <div>{new Date(ev.date).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
