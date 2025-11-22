export const getHomepage = `
query getHomepage($slug: ID!) {
  page(id: $slug, idType: URI) {
    slug
    title
    content
    seo {
      title
      metaDesc
      schema {
        pageType
        raw
      }
    }
    featuredImage {
      node {
        sourceUrl
        altText
        title
        caption
        slug
      }
    }
  }
  customSEO {
    customSeoSettings {
      canonical
      googleVerify
      bingVerify
    }
  }
  redirection {
    redirects {
      origin
      target
    }
  }
  scripts {
    siteScripts {
      scripts {
        ... on SiteScriptsScriptsScriptLayout {
          id
          async
          code
          strategy
          type
          src
          location
        }
      }
    }
  }
}
`;
