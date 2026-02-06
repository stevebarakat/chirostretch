import {
  MEDIA_ITEM_FIELDS,
  MEDIA_ITEM_EXTENDED_FIELDS,
} from "./fragments";

export const FRANCHISE_QUERY = `
  ${MEDIA_ITEM_FIELDS}
  ${MEDIA_ITEM_EXTENDED_FIELDS}

  query FranchiseOpportunities {
    page(id: "/franchise", idType: URI) {
      title
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            ...MediaItemExtendedFields
          }
        }
      }
      heroUnit {
        heading
        subheading
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
            ...MediaItemFields
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
      }
      franchiseOpportunitiesWhyUs {
        whyusHeading
        whyusDescription
        whyusImage {
          node {
            ...MediaItemFields
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
      heading?: string;
      subheading?: string;
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
    };
    franchiseOpportunitiesWhyUs?: {
      whyusHeading?: string;
      whyusDescription?: string;
      whyusImage?: {
        node?: {
          altText?: string;
          srcSet?: string;
          sourceUrl?: string;
        };
      };
    };
  } | null;
};

export type { FranchiseOpportunitiesQueryResponse };
