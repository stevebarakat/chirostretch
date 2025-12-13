export const HOMEPAGE_QUERY = `
  # Reusable Fragments
  fragment MediaDetailsFields on MediaDetails {
    width
    height
  }

  fragment FeaturedImageFields on MediaItem {
    id
    sourceUrl
    altText
    srcSet
    sizes
    mediaDetails {
      ...MediaDetailsFields
    }
  }

  fragment AuthorFields on User {
    id
    name
    slug
  }

  fragment CategoryFields on Category {
    id
    name
    slug
  }

  query Homepage {
    featuredProducts: products(where: { featured: true }, first: 100) {
      nodes {
        id
        databaseId
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
              ...FeaturedImageFields
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
              ...FeaturedImageFields
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
            ...AuthorFields
          }
        }
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...FeaturedImageFields
            }
          }
        }
        categories {
          nodes {
            ...CategoryFields
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
            altText
            sourceUrl
            srcSet
            sizes
            slug
            title
            description
            mediaDetails {
              ...MediaDetailsFields
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
      homepageCta {
        headings {
          headline
          subheading
        }
        button1 {
          button1Text
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
                        ...MediaDetailsFields
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
      homepageStats {
        homepageStats {
          ... on HomepageStatsHomepageStatsLayout {
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
    customSEO {
      customSeoSettings {
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
        button1Text?: string;
      };
    };
    homepageIntroduction?: {
      leftSide?: {
        headline?: string;
        text?: string;
      };
      rightSide?: {
        headline?: string;
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
    homepageStats?: {
      homepageStats?: Array<{
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
