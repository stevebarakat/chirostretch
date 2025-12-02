import { fetchGraphQL } from "@/lib/graphql/client";

const EVENT_BY_SLUG = `
  query EventBySlug($slug: ID!) {
    event(id: $slug, idType: SLUG) {
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
`;

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const data = await fetchGraphQL<{ event: EventData | null }>(EVENT_BY_SLUG, {
    slug,
  });

  const event = data.event;
  if (!event) return <div>Event not found.</div>;

  return (
    <main>
      <h1>{event.title}</h1>

      {event.author?.node?.name && <p>By {event.author.node.name}</p>}

      <div dangerouslySetInnerHTML={{ __html: event.content }} />
    </main>
  );
}

type EventData = {
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
};
