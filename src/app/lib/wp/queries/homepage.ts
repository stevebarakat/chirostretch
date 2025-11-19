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
            }
          }
        }
      }
    }
    upcomingEvents: events(first: 50, where: { orderby: { field: DATE, order: ASC } }) {
      nodes {
        id
        slug
        title
        databaseId
        content
        featuredImage {
          node {
            sourceUrl
            altText
          }
        }
        ... on Event {
          startDate
          endDate
          allDay
          venue {
            ... on Venue {
              id
              title
              address
            }
          }
        }
      }
    }
    page(id: "/homepage", idType: URI) {
      title
      homepageHero {
        heroSlides {
          slideBackgroundImage {
            node {
              sourceUrl
              altText
            }
          }
          slideHeading
          slideSubheading
          slideCtaText
          slideCtaLink {
            url
            title
            target
          }
        }
      }
      homepageAbout {
        aboutHeading
        aboutSubheading
        aboutImage {
          node {
            sourceUrl
            altText
          }
        }
        aboutCtaText
        aboutCtaLink {
          url
          title
          target
        }
      }
      homepageWhyUs {
        whyusHeading
        whyusDescription
        whyusImage {
          node {
            sourceUrl
            altText
          }
        }
        whyusBenefits {
          benefitIcon {
            node {
              sourceUrl
              altText
            }
          }
          benefitTitle
          benefitDescription
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
              ... on ContentNode {
                ... on NodeWithTitle {
                  title
                }
                ... on NodeWithFeaturedImage {
                  featuredImage {
                    node {
                      sourceUrl
                      altText
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
        };
      };
      price?: string;
    }>;
  };
  upcomingEvents?: {
    nodes?: Array<{
      id?: string;
      slug?: string;
      title?: string;
      databaseId?: number;
      content?: string;
      featuredImage?: {
        node?: {
          sourceUrl?: string;
          altText?: string;
        };
      };
      startDate?: string;
      endDate?: string;
      allDay?: boolean;
      venue?: {
        id?: string;
        title?: string;
        address?: string;
      };
    }>;
  };
  page: {
    title: string;
    homepageHero?: {
      heroSlides?: Array<{
        slideBackgroundImage?: {
          node?: {
            sourceUrl?: string;
            altText?: string;
          };
        };
        slideHeading?: string;
        slideSubheading?: string;
        slideCtaText?: string;
        slideCtaLink?: {
          url?: string;
          title?: string;
          target?: string;
        };
      }>;
    };
    homepageAbout?: {
      aboutHeading?: string;
      aboutSubheading?: string;
      aboutImage?: {
        node?: {
          sourceUrl?: string;
          altText?: string;
        };
      };
      aboutCtaText?: string;
      aboutCtaLink?: {
        url?: string;
        title?: string;
        target?: string;
      };
    };
    homepageWhyUs?: {
      whyusHeading?: string;
      whyusDescription?: string;
      whyusImage?: {
        node?: {
          sourceUrl?: string;
          altText?: string;
        };
      };
      whyusBenefits?: Array<{
        benefitIcon?: {
          node?: {
            sourceUrl?: string;
            altText?: string;
          };
        };
        benefitTitle?: string;
        benefitDescription?: string;
      }>;
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
