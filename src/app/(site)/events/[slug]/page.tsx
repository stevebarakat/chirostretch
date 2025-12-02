import { fetchGraphQL } from "@/lib/graphql/client";
import { EVENT_BY_SLUG_QUERY, type EventData } from "@/lib/graphql/queries";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const data = await fetchGraphQL<{ event: EventData | null }>(
    EVENT_BY_SLUG_QUERY,
    {
      slug,
    }
  );

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
