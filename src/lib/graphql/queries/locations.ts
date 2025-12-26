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
          staffType
          jobTitle
          credentials
          specialties
          servicesOffered
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
  description?: string;
  slug?: string;
  title?: string;
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
  heroLink?: LocationHeroLink;
};

export type ClinicalStaff = {
  id?: string;
  databaseId?: number;
  title?: string;
  staffType?: string;
  jobTitle?: string;
  credentials?: string;
  specialties?: string[];
  servicesOffered?: string[];
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

type LocationHeroUnit = {
  heroLink?: LocationHeroLink;
  heroLinkIcon?: LocationHeroLinkIcon;
  heroLink2?: LocationHeroLink;
  heroLinkIcon2?: LocationHeroLinkIcon;
};

type LocationHeroLink = {
  target?: string;
  title?: string;
  url?: string;
};

type LocationHeroLinkIcon = {
  node?: {
    sourceUrl?: string;
    altText?: string;
    slug?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
};

export type WPLocation = {
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
  servicesOffered?: string[];
  coordinates?: LocationCoordinates;
  hours?: LocationHours[];
  heroUnit?: LocationHeroUnit;
  featuredImage?: {
    node?: LocationImage;
  };
  chiropractors?: {
    nodes?: Chiropractor[];
  };
  clinicalStaff?: {
    nodes?: ClinicalStaff[];
  };
};

// Keep Location as an alias for backward compatibility, but prefer WPLocation
export type Location = WPLocation;

export type AllLocationsResponse = {
  locations?: {
    nodes?: WPLocation[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
      hasPreviousPage?: boolean;
      startCursor?: string | null;
    };
  };
};

export type LocationBySlugResponse = {
  location?: WPLocation | null;
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
