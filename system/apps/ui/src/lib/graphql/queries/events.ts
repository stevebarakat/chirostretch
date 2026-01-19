import {
  MEDIA_ITEM_FIELDS,
  MEDIA_ITEM_BASIC_FIELDS,
  PAGE_INFO_FIELDS,
} from "./fragments";

export const EVENTS_INDEX_QUERY = `
  ${MEDIA_ITEM_FIELDS}
  ${PAGE_INFO_FIELDS}

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
        eventsCategories {
          nodes {
            name
            slug
          }
        }
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
              ...MediaItemFields
            }
          }
        }
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
`;

export const EVENT_BY_SLUG_QUERY = `
  ${MEDIA_ITEM_BASIC_FIELDS}

  query EventBySlug($slug: ID!) {
    event(id: $slug, idType: SLUG) {
      slug
      title
      id
      databaseId
      content
      startDate
      endDate
      cost
      eventsCategories {
        nodes {
          name
          slug
        }
      }
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
            ...MediaItemBasicFields
            title
            description
          }
        }
      }
    }
  }
`;

export const ALL_EVENTS_QUERY = `
  ${MEDIA_ITEM_BASIC_FIELDS}

  query getAllEvents($first: Int, $after: String) {
    events(first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        content
        startDate
        endDate
        cost
        eventsCategories {
          nodes {
            name
            slug
          }
        }
        venue {
          title
          city
          state
        }
        organizers {
          nodes {
            title
          }
        }
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...MediaItemBasicFields
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
  content: string;
  startDate?: string;
  endDate?: string;
  cost?: string | null;
  eventsCategories?: {
    nodes?: EventCategory[];
  } | null;
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
      sourceUrl?: string;
      altText?: string;
      title?: string;
      description?: string;
      mediaDetails?: {
        width?: number;
        height?: number;
      };
    };
  } | null;
};

type EventCategory = {
  name: string;
  slug: string;
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
      eventsCategories?: {
        nodes?: EventCategory[];
      } | null;
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

export type { EventData, EventsIndexData, Event, EventsResponse, EventCategory };
