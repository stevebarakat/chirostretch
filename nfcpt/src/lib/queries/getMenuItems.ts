export const getMenuItems = `
query GetMenuItems {
  header: menuItems(first: 100, where: {location: PRIMARY}) {
    nodes {
      path
      label
      id
      childItems {
        nodes {
          id
          path
          label
        }
      }
    }
  }
  footer: menuItems(first: 100, where : {location: FOOTER}) {
    nodes {
      path
      label
      id
      childItems {
        nodes {
          id
          path
          label
        }
      }
    }
  }
}
`;
