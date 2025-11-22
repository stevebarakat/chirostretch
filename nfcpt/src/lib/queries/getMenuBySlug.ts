export const getMenuBySlug = `
  query GetMenuBySlug {
    menu(idType: NAME, id: "Main Menu") {
      menuItems(first: 100) {
        edges {
          node {
            uri
            label
            id
          }
        }
      }
    }
  }
`;
