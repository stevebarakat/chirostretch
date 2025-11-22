import { fetchGraphQL } from "@/lib/graphql/client";
import { EVENT_FIELDS } from "@/lib/graphql/fragments";

const EVENT_BY_SLUG = `
  ${EVENT_FIELDS}
  query EventBySlug($slug: ID!) {
    event(id: $slug, idType: SLUG) {
      ...EventFields
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
      <p>{new Date(event.date).toLocaleString()}</p>

      <div dangerouslySetInnerHTML={{ __html: event.content }} />

      {event.venue && (
        <section>
          <h2>Venue</h2>
          <p>{event.venue.title}</p>
          <p>
            {event.venue.address}
            <br />
            {event.venue.city}, {event.venue.state} {event.venue.zip}
          </p>
        </section>
      )}

      {event.clinicLocation && (
        <section>
          <h2>Associated Clinic</h2>
          <p>{event.clinicLocation.title}</p>
        </section>
      )}

      {event.staffPresenters && event.staffPresenters.length > 0 && (
        <section>
          <h2>Staff Presenters</h2>
          <ul>
            {event.staffPresenters.map((s) => (
              <li key={s.slug}>{s.title}</li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}

type EventData = {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  content: string;
  date: string;
  venue: {
    id: string;
    databaseId: number;
    title: string;
    address: string;
    city: string;
    state: string;
    zip: string;
  } | null;
  clinicLocation: {
    id: string;
    databaseId: number;
    slug: string;
    title: string;
    streetAddress: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    email: string;
    coordinates: {
      lat: number;
      lng: number;
    } | null;
    hours: Array<{
      day: string;
      open: string;
      close: string;
    }>;
    mapEmbed: string | null;
    services: string | null;
    heroImage: {
      sourceUrl: string;
      altText: string;
    } | null;
    shortDescription: string | null;
  } | null;
  staffPresenters: Array<{
    id: string;
    databaseId: number;
    slug: string;
    title: string;
    content: string;
    featuredImage: {
      node: {
        sourceUrl: string;
        altText: string;
      } | null;
    } | null;
    clinicLocation: {
      id: string;
      databaseId: number;
      slug: string;
      title: string;
    } | null;
  }> | null;
};
