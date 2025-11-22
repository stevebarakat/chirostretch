export const getHierarchicalMenuBySlug = `
  query GetHierarchicalMenuBySlug($slug: ID!) {
    menu(id: $slug, idType: SLUG) {
      menuItems(where: {parentDatabaseId: 0}) {
        nodes {
          label
          uri
          id
          childItems {
            nodes {
              label
              uri
              id
            }
          }
        }
      }
    }
  }
`;
