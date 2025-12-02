export const GET_HOMEPAGE_SETTINGS_QUERY = `
  query GetHomepageSettings {
    galleryPage {
      services {
        galleryTitle
        image {
          image {
            node {
              altText
              caption
              sourceUrl
              slug
              link
            }
          }
        }
      }
    }
    customSEO {
      customSeoSettings {
        googleAnalyticsId
        canonical
        schema
      }
    }
    intro {
      introduction {
        leftSide {
          headline
          text
        }
        rightSide {
          bulletPoints
          headline
        }
      }
      stats {
        stats {
          ... on StatsStatsLayout {
            stat {
              description
              number
              prefix
              suffix
            }
          }
        }
      }
    }
    cta {
      callToAction {
        headings {
          headline
          subheading
        }
        button1 {
          btn1Link {
            nodes {
              uri
            }
          }
          button1Text
        }
        button2 {
          btn2Link {
            nodes {
              uri
            }
          }
          button2Text
        }
      }
    }
    blox {
      blocks {
        bottomBlocks {
          bottomBlocksButtonText
          bottomBlocksHeadline
          bottomBlocksImage {
            node {
              altText
              slug
              sourceUrl
            }
          }
          bottomBlocksLink
          bottomBlocksText
        }
        topBlocks {
          topBlocksAuthor
          topBlocksQuote
          topBlocksImage {
            node {
              altText
              sourceUrl
              slug
            }
          }
        }
      }
    }
  }
`;

export const HOMEPAGE_QUERY = `
  query Homepage {
    featuredProducts: products(where: { featured: true }, first: 4) {
      nodes {
        id
        name
        slug
        ... on SimpleProduct {
          price
        }
        ... on VariableProduct {
          price
        }
        ... on ExternalProduct {
          price
        }
        ... on GroupProduct {
          price
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
    }
    upcomingEvents: events {
      nodes {
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
            id
            name
            slug
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
        categories {
          nodes {
            id
            name
            slug
          }
        }
      }
    }
    page(id: "/homepage", idType: URI) {
      title
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            id
            sourceUrl
            altText
            slug
            title
            caption
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
          }
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
              __typename
              ... on NodeWithTitle {
                title
              }
              ... on NodeWithFeaturedImage {
                featuredImage {
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
      homepageCta {
        ctaBackgroundImage {
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
        ctaHeading
        ctaDescription
        ctaButtonText
        ctaButtonLink
      }
    }
  }
`;

type HomepageQueryResponse = {
  featuredProducts?: {
    nodes?: Array<{
      id?: string;
      name?: string;
      slug?: string;
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
    featuredImage?: {
      node?: {
        id?: string;
        sourceUrl?: string;
        altText?: string;
        slug?: string;
        title?: string;
        caption?: string;
        srcSet?: string;
        sizes?: string;
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
      ctaBackgroundImage?: {
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
      ctaHeading?: string;
      ctaDescription?: string;
      ctaButtonText?: string;
      ctaButtonLink?: string;
    };
  } | null;
};

export type { HomepageQueryResponse };

type GetHomepageSettingsQueryResponse = {
  galleryPage?: {
    services?: {
      galleryTitle?: string;
      image?: {
        image?: {
          node?: {
            altText?: string;
            caption?: string;
            sourceUrl?: string;
            slug?: string;
            link?: string;
          };
        };
      };
    };
  };
  customSEO?: {
    customSeoSettings?: {
      googleAnalyticsId?: string;
      canonical?: string;
      schema?: string;
    };
  };
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
    callToAction?: {
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
      button2?: {
        btn2Link?: {
          nodes?: Array<{
            uri?: string;
          }>;
        };
        button2Text?: string;
      };
    };
  };
  blox?: {
    blocks?: {
      bottomBlocks?: {
        bottomBlocksButtonText?: string;
        bottomBlocksHeadline?: string;
        bottomBlocksImage?: {
          node?: {
            altText?: string;
            slug?: string;
            sourceUrl?: string;
          };
        };
        bottomBlocksLink?: string;
        bottomBlocksText?: string;
      };
      topBlocks?: {
        topBlocksAuthor?: string;
        topBlocksQuote?: string;
        topBlocksImage?: {
          node?: {
            altText?: string;
            sourceUrl?: string;
            slug?: string;
          };
        };
      };
    };
  };
};

export type { GetHomepageSettingsQueryResponse };
