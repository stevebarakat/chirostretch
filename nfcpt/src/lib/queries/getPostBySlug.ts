export const getPostBySlug = `
query GetPostBySlug($slug: ID!) {
  post(id: $slug, idType: SLUG) {
    slug
    uri
    link
    title
    content
    seo {
      title
      metaDesc
      schema {
        raw
      }
    }
    featuredImage {
      node {
        altText
        sourceUrl
        title
        slug
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
}
`;
