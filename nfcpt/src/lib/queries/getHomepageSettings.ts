export const getHomepageSettings = `
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
}`;
