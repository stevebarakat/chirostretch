export const FRANCHISE_OPPORTUNITIES_QUERY = `
  query FranchiseOpportunities {
    page(id: "/franchise-opportunities", idType: URI) {
      title
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            altText
            sourceUrl
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
      }
      franchiseOpportunitiesAbout {
        aboutHeading
        aboutSubheading
        aboutImage {
          node {
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
        aboutCtaText
        aboutCtaLink {
          url
          title
          target
        }
        aboutCta2Text
        aboutCta2Link {
          url
          title
          target
        }
      }
      componentDescriptionList {
        descriptionListItems {
          itemTitle
          itemDescription
          itemIcon {
            node {
              altText
              sourceUrl
            }
          }
        }
        whyusHeading
        whyusDescription
        whyusImage {
          node {
            altText
            srcSet
          }
        }
      }
    }
  }
`;

type FranchiseOpportunitiesQueryResponse = {
  page: {
    title: string;
    featuredImage?: {
      node?: {
        altText?: string;
        sourceUrl?: string;
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
    };
    franchiseOpportunitiesAbout?: {
      aboutHeading?: string;
      aboutSubheading?: string;
      aboutImage?: {
        node?: {
          sourceUrl?: string;
          altText?: string;
          srcSet?: string;
          sizes?: string;
          mediaDetails?: {
            width?: number;
            height?: number;
          };
        };
      };
      aboutCtaText?: string;
      aboutCtaLink?: {
        url?: string;
        title?: string;
        target?: string;
      };
      aboutCta2Text?: string;
      aboutCta2Link?: {
        url?: string;
        title?: string;
        target?: string;
      };
    };
    componentDescriptionList?: {
      descriptionListItems?: Array<{
        itemTitle?: string;
        itemDescription?: string;
        itemIcon?: {
          node?: {
            altText?: string;
            sourceUrl?: string;
          };
        };
      }>;
      whyusHeading?: string;
      whyusDescription?: string;
      whyusImage?: {
        node?: {
          altText?: string;
          srcSet?: string;
        };
      };
    };
  } | null;
};

export type { FranchiseOpportunitiesQueryResponse };
