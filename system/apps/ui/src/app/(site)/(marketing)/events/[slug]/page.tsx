import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import { EVENT_BY_SLUG_QUERY, type EventData } from "@/lib/graphql/queries";
import { Container } from "@/components/UI";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const data = await wpQuery<{ event: EventData | null }>(
    EVENT_BY_SLUG_QUERY,
    { slug },
    { tags: [CACHE_TAGS.events] }
  );

  const event = data.event;
  if (!event) return <div>Event not found.</div>;

  return (
    <main>
      <Container>
        <h1>{event.title}</h1>

        {event.author?.node?.name && <p>By {event.author.node.name}</p>}

        <div dangerouslySetInnerHTML={{ __html: event.content }} />
      </Container>
    </main>
  );
}
