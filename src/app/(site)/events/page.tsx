import { fetchGraphQL } from "@/lib/graphql/client";

const EVENTS_INDEX = `
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

type EventsIndexPageProps = {
  searchParams: Promise<{ location?: string; venue?: string }>;
};

type EventsIndexData = {
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

export default async function EventsIndex({
  searchParams,
}: EventsIndexPageProps) {
  const params = await searchParams;
  const data = await fetchGraphQL<EventsIndexData>(EVENTS_INDEX);
  const events = data.events?.nodes ?? [];

  return (
    <main>
      <h1>Events</h1>

      <ul>
        {events.map((ev) => (
          <li key={ev.slug}>
            <a href={`/events/${ev.slug}`}>{ev.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
