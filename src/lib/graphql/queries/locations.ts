import type {
  Location,
  StaffMember,
  LocationHours,
  WpPageInfo,
  MediaItem,
} from "../generated/graphql";

// Re-export generated types for convenience
export type { Location, StaffMember, LocationHours };

// Alias for backward compatibility
export type WPLocation = Location;

// Type for taxonomy term nodes as returned in queries
type TaxonomyTermNode = {
  slug?: string | null;
  name?: string | null;
};

// Type for clinical staff as returned from LOCATION_BY_SLUG_QUERY
export type ClinicalStaff = {
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

export type Chiropractor = ClinicalStaff;

export const ALL_LOCATIONS_QUERY = `
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
              sourceUrl
              altText
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

export const LOCATION_BY_SLUG_QUERY = `
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
            altText
            sourceUrl
            slug
            mediaDetails {
              width
              height
            }
          }
        }
        heroLink2 {
          target
          title
          url
        }
        heroLinkIcon2 {
          node {
            sourceUrl
            altText
            slug
            mediaDetails {
              width
              height
            }
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
            sourceUrl
            altText
            description
            slug
            title
            mediaDetails {
              width
              height
            }
          }
        }
      }
      clinicalStaff {
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
