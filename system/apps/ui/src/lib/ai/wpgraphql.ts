// Standalone WPGraphQL fetcher for ingestion scripts.
// Does NOT use Next.js cache APIs — safe to run in Node scripts.

export interface WPPage {
  id: string;
  databaseId: number;
  uri: string;
  title: string;
  content: string;
  modified: string;
}

export interface WPLocation {
  id: string;
  databaseId: number;
  slug: string;
  title: string;
  content: string;
  shortDescription: string;
  servicesOffered: string;
  city: string;
  state: string;
  streetAddress: string;
  phone: string;
  modified: string;
}

// ── Text helpers ──────────────────────────────────────────────────────────────

export function stripHtml(html: string): string {
  return (html ?? "")
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ");
}

export function normalizeWhitespace(text: string): string {
  return text
    .replace(/[ \t]+/g, " ")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

// ── GraphQL fetcher ───────────────────────────────────────────────────────────

async function graphqlFetch<T>(
  query: string,
  variables: Record<string, unknown> = {}
): Promise<T> {
  const endpoint = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT;
  if (!endpoint) {
    throw new Error(
      "NEXT_PUBLIC_WPGRAPHQL_ENDPOINT environment variable is not set."
    );
  }

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) {
    throw new Error(`WPGraphQL request failed: ${res.status} ${res.statusText}`);
  }

  const json = (await res.json()) as { data?: T; errors?: unknown[] };

  if (json.errors?.length) {
    throw new Error(`WPGraphQL errors: ${JSON.stringify(json.errors)}`);
  }

  return json.data as T;
}

// ── Queries ───────────────────────────────────────────────────────────────────

const PAGES_QUERY = `
  query IngestPages($first: Int!, $after: String) {
    pages(first: $first, after: $after) {
      nodes {
        id
        databaseId
        uri
        title
        content
        modified
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

const LOCATIONS_QUERY = `
  query IngestLocations($first: Int!, $after: String) {
    locations(first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        content
        shortDescription
        servicesOffered
        city
        state
        streetAddress
        phone
        modified
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// ── Paginated fetchers ────────────────────────────────────────────────────────

type PagedResponse<T> = {
  nodes: T[];
  pageInfo: { hasNextPage: boolean; endCursor: string | null };
};

export async function fetchAllPages(): Promise<WPPage[]> {
  const all: WPPage[] = [];
  let after: string | null = null;

  do {
    const data = await graphqlFetch<{ pages: PagedResponse<WPPage> }>(
      PAGES_QUERY,
      { first: 50, after }
    );
    const { nodes, pageInfo } = data.pages;
    all.push(...nodes);
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);

  return all;
}

export async function fetchAllLocations(): Promise<WPLocation[]> {
  const all: WPLocation[] = [];
  let after: string | null = null;

  do {
    const data = await graphqlFetch<{ locations: PagedResponse<WPLocation> }>(
      LOCATIONS_QUERY,
      { first: 50, after }
    );
    const { nodes, pageInfo } = data.locations;
    all.push(...nodes);
    after = pageInfo.hasNextPage ? pageInfo.endCursor : null;
  } while (after);

  return all;
}
