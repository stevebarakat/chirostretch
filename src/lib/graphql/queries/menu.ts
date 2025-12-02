export const MENU_QUERY = `
  query GetMenuBySlug($slug: ID!) {
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

export type MenuItem = {
  label: string;
  uri: string;
  id: string;
  childItems?: {
    nodes: MenuItem[];
  };
};

export type MenuQueryResponse = {
  menu?: {
    menuItems?: {
      nodes: MenuItem[];
    };
  };
};
