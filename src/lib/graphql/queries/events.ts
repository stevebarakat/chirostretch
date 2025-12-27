export const EVENTS_INDEX_QUERY = `
  query getEvents($first: Int, $after: String) {
    events(first: $first, after: $after) {
      nodes {
        slug
        title
        id
        databaseId
        content
        startDate
        endDate
        cost
        venue {
          title
          address
          city
          state
          phone
        }
        organizers {
          nodes {
            title
            phone
            email
          }
        }
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              id
              sourceUrl
              altText
              srcSet
              sizes
              mediaDetails {
                width
                height
              }
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const EVENT_BY_SLUG_QUERY = `
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

export const ALL_EVENTS_QUERY = `
  query getAllEvents($first: Int, $after: String) {
    events(first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        content
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

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

type EventsIndexData = {
  events: {
    nodes: Array<{
      slug: string;
      title: string;
      id: string;
      databaseId: number;
      content: string;
      startDate?: string;
      endDate?: string;
      cost?: string | null;
      venue?: {
        title?: string;
        address?: string;
        city?: string;
        state?: string;
        phone?: string;
      } | null;
      organizers?: {
        nodes?: {
          title?: string;
          phone?: string;
          email?: string;
        }[];
      } | null;
      featuredImage?: {
        node?: {
          id: string;
          sourceUrl: string;
          altText?: string;
          srcSet?: string;
          sizes?: string;
          mediaDetails?: {
            width?: number;
            height?: number;
          };
        };
      } | null;
    }>;
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
      hasPreviousPage?: boolean;
      startCursor?: string | null;
    };
  } | null;
};

type Event = {
  id?: string;
  databaseId?: number;
  slug?: string;
  title?: string;
  content?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
};

type EventsResponse = {
  events?: {
    nodes?: Event[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string;
    };
  };
};

export type { EventData, EventsIndexData, Event, EventsResponse };
