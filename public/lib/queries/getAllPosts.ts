export const getAllPosts = `
query getAllPosts {
  posts(first: 100) {
    nodes {
      title
      excerpt
      uri
      link
      featuredImage {
        node {
          altText
          title
          sourceUrl(size: THUMBNAIL)
        }
      }
    }
  }
}
`;
