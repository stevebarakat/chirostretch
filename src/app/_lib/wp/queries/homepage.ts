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
              srcSet
              sizes
              mediaDetails {
                width
                height
              }
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
      }
      homepageWhyUs {
        whyusHeading
        whyusDescription
        whyusImage {
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
        whyusBenefits {
          benefitIcon {
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
            srcSet?: string;
            sizes?: string;
            mediaDetails?: {
              width?: number;
              height?: number;
            };
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
    };
    homepageWhyUs?: {
      whyusHeading?: string;
      whyusDescription?: string;
      whyusImage?: {
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
      whyusBenefits?: Array<{
        benefitIcon?: {
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
