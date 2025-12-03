export const getSitemapData = `
query getSitemapData {
  pages(first: 100, where: {status: PUBLISH}) {
    nodes {
      uri
      date
      modified
    }
  }
  posts(first: 100, where: {status: PUBLISH}) {
    nodes {
      uri
      date
      modified
    }
  }
}
`;
