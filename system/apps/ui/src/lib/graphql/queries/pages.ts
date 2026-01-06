export const PAGE_BY_URI_QUERY = `
  query PageByUri($uri: ID!) {
    page(id: $uri, idType: URI) {
      id
      databaseId
      title
      slug
      uri
      content
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            sourceUrl
            altText
            srcSet
            sizes
            slug
            title
            description
            mediaDetails {
              width
              height
            }
          }
        }
      }
      heroUnit {
        heroLink {
          target
          title
          url
        }
        heroLinkIcon {
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
      blocks
    }
  }
`;

export const ALL_PAGE_SLUGS_QUERY = `
  query AllPageSlugs {
    pages(first: 1000, where: { parent: null }) {
      nodes {
        id
        slug
        uri
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export type PageByUriResponse = {
  page: {
    id: string;
    databaseId: number;
    title: string;
    slug: string;
    uri: string;
    content: string;
    featuredImage?: {
      node?: {
        sourceUrl?: string;
        altText?: string;
        srcSet?: string;
        sizes?: string;
        slug?: string;
        title?: string;
        description?: string;
        mediaDetails?: {
          width?: number;
          height?: number;
        };
      };
    };
    heroUnit?: {
      heroLink?: {
        target?: string;
        title?: string;
        url?: string;
      };
      heroLinkIcon?: {
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
      heroLink2?: {
        target?: string;
        title?: string;
        url?: string;
      };
      heroLinkIcon2?: {
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
    };
    blocks?: unknown[];
  } | null;
};

export type AllPageSlugsResponse = {
  pages?: {
    nodes?: Array<{
      id?: string;
      slug?: string;
      uri?: string;
    }>;
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string;
    };
  };
};
