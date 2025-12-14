export const ALL_LOCATIONS_QUERY = `
  query AllLocations($first: Int, $after: String) {
    locations(first: $first, after: $after) {
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
            mediaDetails {
              width
              height
            }
          }
        }
      }
      chiropractors {
        nodes {
          id
          databaseId
          title
          jobTitle
          credentials
          specialties
          bio
          acceptingPatients
          headshot {
            sourceUrl
            altText
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

type LocationImage = {
  sourceUrl?: string;
  altText?: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
};

export type Chiropractor = {
  id?: string;
  databaseId?: number;
  title?: string;
  jobTitle?: string;
  credentials?: string;
  specialties?: string[];
  bio?: string;
  acceptingPatients?: boolean;
  headshot?: {
    sourceUrl?: string;
    altText?: string;
  };
};

type LocationHours = {
  day?: string;
  open?: string;
  close?: string;
};

type LocationCoordinates = {
  lat?: number;
  lng?: number;
};

type Location = {
  id?: string;
  databaseId?: number;
  slug?: string;
  title?: string;
  content?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zip?: string;
  phone?: string;
  email?: string;
  shortDescription?: string;
  coordinates?: LocationCoordinates;
  hours?: LocationHours[];
  featuredImage?: {
    node?: LocationImage;
  };
  chiropractors?: {
    nodes?: Chiropractor[];
  };
};

export type AllLocationsResponse = {
  locations?: {
    nodes?: Location[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
      hasPreviousPage?: boolean;
      startCursor?: string | null;
    };
  };
};

export type LocationBySlugResponse = {
  location?: Location | null;
};

export type AllLocationSlugsResponse = {
  locations?: {
    nodes?: Array<{
      id?: string;
      slug?: string;
    }>;
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string;
    };
  };
};
