import { fetchGraphQL } from "@/lib/graphql/client";

type LocationEventsPageProps = {
  params: Promise<{ slug: string }>;
};

const EVENTS_WITH_CLINIC = `
  query getEvents {
    events {
      nodes {
        slug
        title
        id
        databaseId
        author {
          node {
            name
          }
        }
        content
      }
    }
  }
`;

type EventsData = {
  events: {
    nodes: Array<{
      slug: string;
      title: string;
      id: string;
      databaseId: number;
      author: {
        node: {
          name: string;
        };
      } | null;
      content: string;
    }>;
  } | null;
};

export default async function LocationEvents({
  params,
}: LocationEventsPageProps) {
  const { slug } = await params;
  const data = await fetchGraphQL<EventsData>(EVENTS_WITH_CLINIC);

  const events = data.events?.nodes ?? [];

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
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
