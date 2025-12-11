export const FRANCHISE_OPPORTUNITIES_QUERY = `
  query FranchiseOpportunities {
    page(id: "/franchise-opportunities", idType: URI) {
      title
      franchiseOpportunitiesHero {
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
      franchiseOpportunitiesWhyUs {
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
    }
  }
`;

type FranchiseOpportunitiesQueryResponse = {
  page: {
    title: string;
    franchiseOpportunitiesHero?: {
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
    franchiseOpportunitiesWhyUs?: {
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
  } | null;
};

export type { FranchiseOpportunitiesQueryResponse };
