export const HOMEPAGE_QUERY = `
  query Homepage {
    pageBy(uri: "home") {
      title
      acfHome {
        heroSlides {
          slideBackgroundImage {
            sourceUrl
          }
          slideHeading
          slideSubheading
          slideCtaText
          slideCtaLink
        }

        aboutHeading
        aboutSubheading
        aboutImage {
          sourceUrl
        }
        aboutCtaText
        aboutCtaLink

        whyusHeading
        whyusDescription
        whyusImage {
          sourceUrl
        }
        whyusBenefits {
          benefitIcon {
            sourceUrl
          }
          benefitTitle
          benefitDescription
        }

        featuredProductsHeading
        featuredProductsSubheading
        featuredProductsSource
        featuredProductsManual {
          product
        }

        eventsHeading
        eventsSubheading
        eventsLimit
        eventsCtaText
        eventsCtaLink

        insightsHeading
        insightsSubheading
        insightsLimit
        insightsCtaText
        insightsCtaLink

        ctaBackgroundImage {
          sourceUrl
        }
        ctaHeading
        ctaDescription
        ctaButtonText
        ctaButtonLink
      }
    }
  }
`;

