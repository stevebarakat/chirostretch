import type {
  Location,
  Practitioner as GeneratedPractitioner,
  LocationHours,
  WpPageInfo,
  MediaItem,
} from "../generated/graphql";
import {
  MEDIA_ITEM_BASIC_FIELDS,
  MEDIA_ITEM_EXTENDED_FIELDS,
  PAGE_INFO_FIELDS,
} from "./fragments";

// Re-export generated types for convenience
export type { Location, LocationHours };
export type { GeneratedPractitioner };

// Alias for backward compatibility
export type WPLocation = Location;

// Type for taxonomy term nodes as returned in queries
type TaxonomyTermNode = {
  slug?: string | null;
  name?: string | null;
};

// Type for practitioner as returned from LOCATION_BY_SLUG_QUERY
export type Practitioner = {
  id?: string;
  databaseId?: number;
  title?: string | null;
  jobTitle?: string | null;
  credentials?: string | null;
  bio?: string | null;
  acceptingPatients?: boolean | null;
  headshot?: Pick<MediaItem, "sourceUrl" | "altText"> | null;
  disciplines?: { nodes?: TaxonomyTermNode[] | null } | null;
  services?: { nodes?: TaxonomyTermNode[] | null } | null;
  specialties?: { nodes?: TaxonomyTermNode[] | null } | null;
};

export const ALL_LOCATIONS_QUERY = `
  ${MEDIA_ITEM_BASIC_FIELDS}
  ${PAGE_INFO_FIELDS}

  query AllLocations($first: Int, $after: String) {
    locations(first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        content
        shortDescription
        city
        state
        streetAddress
        zip
        phone
        email
        coordinates {
          lat
          lng
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
        ...PageInfoFields
      }
    }
  }
`;

export const LOCATION_BY_SLUG_QUERY = `
  ${MEDIA_ITEM_BASIC_FIELDS}
  ${MEDIA_ITEM_EXTENDED_FIELDS}

  query LocationBySlug($slug: ID!) {
    location(id: $slug, idType: SLUG) {
      id
      databaseId
      slug
      title
      content
      streetAddress
      city
      state
      zip
      phone
      email
      shortDescription
      servicesOffered
      heroUnit {
        heroLink {
          target
          title
          url
        }
        heroLinkIcon {
          node {
            ...MediaItemBasicFields
            slug
          }
        }
        heroLink2 {
          target
          title
          url
        }
        heroLinkIcon2 {
          node {
            ...MediaItemBasicFields
            slug
          }
        }
      }
      coordinates {
        lat
        lng
      }
      hours {
        day
        open
        close
      }
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            ...MediaItemExtendedFields
          }
        }
      }
      practitioners {
        nodes {
          id
          databaseId
          title
          jobTitle
          credentials
          bio
          acceptingPatients
          headshot {
            sourceUrl
            altText
          }
          disciplines {
            nodes {
              slug
              name
            }
          }
          services {
            nodes {
              slug
              name
            }
          }
          specialties {
            nodes {
              slug
              name
            }
          }
        }
      }
    }
  }
`;

export const ALL_LOCATION_SLUGS_QUERY = `
  query AllLocationSlugs {
    locations(first: 1000) {
      nodes {
        id
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

// Response types for queries
export type AllLocationsResponse = {
  locations?: {
    nodes?: Location[];
    pageInfo?: WpPageInfo;
  };
};

export type LocationBySlugResponse = {
  location?: Location | null;
};

export type AllLocationSlugsResponse = {
  locations?: {
    nodes?: Array<{ id?: string; slug?: string }>;
    pageInfo?: WpPageInfo;
  };
};
