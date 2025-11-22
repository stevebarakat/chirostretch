export const getPageBySlug = `
query GetPageBySlug($slug: ID!) {
  page(id: $slug, idType: URI) {
    slug
    uri
    link
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
    siteScripts {
      scripts {
        ... on SiteScriptsScriptsScriptLayout {
          id
          async
          code
          location
          src
          strategy
          type
        }
      }
    }
  }
  customSEO {
    customSeoSettings {
      canonical
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
          type
          strategy
          src
          location
        }
      }
    }
  }
}
`;
