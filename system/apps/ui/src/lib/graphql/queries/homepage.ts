import {
  MEDIA_ITEM_FIELDS,
  MEDIA_ITEM_EXTENDED_FIELDS,
  MEDIA_ITEM_BASIC_FIELDS,
  AUTHOR_FIELDS,
  TAXONOMY_TERM_FIELDS,
  PRODUCT_BASIC_PRICING_FIELDS,
} from "./fragments";

export const HOMEPAGE_QUERY = `
  ${MEDIA_ITEM_FIELDS}
  ${MEDIA_ITEM_EXTENDED_FIELDS}
  ${MEDIA_ITEM_BASIC_FIELDS}
  ${AUTHOR_FIELDS}
  ${TAXONOMY_TERM_FIELDS}
  ${PRODUCT_BASIC_PRICING_FIELDS}

  query Homepage {
    featuredProducts: products(where: { featured: true }, first: 100) {
      nodes {
        id
        databaseId
        name
        slug
        averageRating
        reviewCount
        ...ProductBasicPricingFields
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...MediaItemFields
            }
          }
        }
      }
    }
    upcomingEvents: events(first: 20) {
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
          city
          state
        }
        organizers {
          nodes {
            title
          }
        }
        eventsCategories {
          nodes {
            name
            slug
          }
        }
        featuredImage {
          node {
            ...MediaItemFields
          }
        }
      }
    }
    latestPosts: posts(first: 2) {
      nodes {
        id
        databaseId
        slug
        title
        excerpt
        date
        author {
          node {
            ...AuthorFields
          }
        }
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...MediaItemFields
            }
          }
        }
        categories {
          nodes {
            ...TaxonomyTermFields
          }
        }
      }
    }
    page(id: "/homepage", idType: URI) {
      title
      content
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            ...MediaItemExtendedFields
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
            sizes
          }
        }
      }
      homepageCta {
        headings {
          headline
          subheading
        }
        button1 {
          btn1Link {
            nodes {
              uri
              ... on NodeWithTitle {
                title
              }
            }
          }
          btn1Icon {
            node {
              ...MediaItemBasicFields
            }
          }
        }
        button2 {
          btn2Link {
            url
            title
            target
          }
          btn2Icon {
            node {
              ...MediaItemBasicFields
            }
          }
        }
      }
      componentDescriptionList {
        descriptionListItems {
        itemTitle
        itemIcon {
          node {
            altText
            sourceUrl
          }
        }
        itemDescription
      }
      }
      homepageFeaturedProducts {
        featuredProductsHeading
        featuredProductsSubheading
        featuredProductsSource
        featuredProductsManual {
          product {
            nodes {
              id
              ... on NodeWithTitle {
                title
              }
              ... on NodeWithFeaturedImage {
                featuredImage {
                  node {
                    ...MediaItemFields
                  }
                }
              }
            }
          }
        }
      }
      homepageUpcomingEvents {
        eventsHeading
        eventsSubheading
        eventsLimit
        eventsCtaText
        eventsCtaLink
      }
      homepageLatestInsights {
        insightsHeading
        insightsSubheading
        insightsLimit
        insightsCtaText
        insightsCtaLink
      }
      homepageIntroduction {
        leftSide {
          headline
          text
        }
        rightSide {
          bulletPoints
          headline
        }
      }
    }
    customSEO {
      customSeoSettings {
        fieldGroupName
        googleAnalyticsId
        canonical
        googleVerify
        bingVerify
      }
    }
    currentPromo {
      promo {
        bottomLine
        middleLine
        price
        topLine
      }
    }
  }
`;

type HomepageQueryResponse = {
  featuredProducts?: {
    nodes?: Array<{
      id?: string;
      databaseId?: number;
      name?: string;
      slug?: string;
      averageRating?: number;
      reviewCount?: number;
      featuredImage?: {
        node?: {
          id?: string;
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
      price?: string;
    }>;
  };
  upcomingEvents?: {
    nodes?: Array<{
      slug?: string;
      title?: string;
      id?: string;
      databaseId?: number;
      author?: {
        node?: {
          name?: string;
        };
      } | null;
      content?: string;
      featuredImage?: {
        node?: {
          id?: string;
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
    }>;
  };
  latestPosts?: {
    nodes?: Array<{
      id?: string;
      databaseId?: number;
      slug?: string;
      title?: string;
      excerpt?: string;
      date?: string;
      author?: {
        node?: {
          id?: string;
          name?: string;
          slug?: string;
        };
      };
      featuredImage?: {
        node?: {
          id?: string;
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
      categories?: {
        nodes?: Array<{
          id?: string;
          name?: string;
          slug?: string;
        }>;
      };
    }>;
  };
  page: {
    title: string;
    content?: string;
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
      heroLinkIcon?: {
        node?: {
          sourceUrl?: string;
          altText?: string;
          mediaDetails?: {
            width?: number;
            height?: number;
          };
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
        mediaDetails?: {
          width?: number;
          height?: number;
        };
      };
    };
    homepageFeaturedProducts?: {
      featuredProductsHeading?: string;
      featuredProductsSubheading?: string;
      featuredProductsSource?: string;
      featuredProductsManual?: Array<{
        product?: {
          nodes?: Array<{
            id?: string;
            __typename?: string;
            title?: string;
            featuredImage?: {
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
          }>;
        };
      }>;
    };
    homepageUpcomingEvents?: {
      eventsHeading?: string;
      eventsSubheading?: string;
      eventsLimit?: number;
      eventsCtaText?: string;
      eventsCtaLink?: string;
    };
    homepageLatestInsights?: {
      insightsHeading?: string;
      insightsSubheading?: string;
      insightsLimit?: number;
      insightsCtaText?: string;
      insightsCtaLink?: string;
    };
    homepageCta?: {
      headings?: {
        headline?: string;
        subheading?: string;
      };
      button1?: {
        btn1Link?: {
          nodes?: Array<{
            uri?: string;
            title?: string;
          }>;
        };
        btn1Icon?: {
          node?: {
            sourceUrl?: string;
            altText?: string;
            mediaDetails?: {
              width?: number;
              height?: number;
            };
          };
        };
      };
      button2?: {
        btn2Link?: {
          url?: string;
          title?: string;
          target?: string;
        };
        btn2Icon?: {
          node?: {
            sourceUrl?: string;
            altText?: string;
            mediaDetails?: {
              width?: number;
              height?: number;
            };
          };
        };
      };
    };
    homepageIntroduction?: {
      leftSide?: {
        headline?: string;
        text?: string;
      };
      rightSide?: {
        headline?: string;
        bulletPoints?: string;
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
    stats?: {
      stats?: Array<{
        stat?: {
          description?: string;
          number?: number;
          prefix?: string;
          suffix?: string;
        };
      }>;
    };
  } | null;
  customSEO?: {
    customSeoSettings?: {
      googleAnalyticsId?: string;
      canonical?: string;
      googleVerify?: string;
      bingVerify?: string;
    };
  };
  cta?: {
    headings?: {
      headline?: string;
      subheading?: string;
    };
    button1?: {
      btn1Link?: {
        nodes?: Array<{
          uri?: string;
        }>;
      };
      button1Text?: string;
    };
  };
  currentPromo?: {
    promo?: {
      bottomLine?: string;
      middleLine?: string;
      price?: number;
      topLine?: string;
    };
  };
};

export type { HomepageQueryResponse };

type GetHomepageSettingsQueryResponse = {
  intro?: {
    introduction?: {
      leftSide?: {
        headline?: string;
        text?: string;
      };
      rightSide?: {
        bulletPoints?: string;
        headline?: string;
      };
    };
    stats?: {
      stats?: Array<{
        stat?: {
          description?: string;
          number?: string;
          prefix?: string;
          suffix?: string;
        };
      }>;
    };
  };
  cta?: {
    headings?: {
      headline?: string;
      subheading?: string;
    };
    button1?: {
      btn1Link?: {
        nodes?: Array<{
          uri?: string;
        }>;
      };
      button1Text?: string;
    };
  };
};

export type { GetHomepageSettingsQueryResponse };
