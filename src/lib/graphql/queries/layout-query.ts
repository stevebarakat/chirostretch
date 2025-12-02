export const LAYOUT_QUERY = `
  query Layout {
    logo: mediaItem(id: "chirostretch-logo", idType: SLUG) {
      altText
      sourceUrl
      srcSet
      sizes
      mediaDetails {
        width
        height
      }
    }
    headerMenu: menu(id: "main-menu", idType: SLUG) {
      id
      name
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
    footerMenu: menu(id: "footer-menu", idType: SLUG) {
      id
      name
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

export type LayoutQueryResponse = {
  logo?: {
    altText?: string;
    sourceUrl?: string;
    srcSet?: string;
    sizes?: string;
    mediaDetails?: {
      width?: number;
      height?: number;
    };
  };
  headerMenu?: {
    id?: string;
    name?: string;
    menuItems?: {
      nodes: MenuItem[];
    };
  };
  footerMenu?: {
    id?: string;
    name?: string;
    menuItems?: {
      nodes: MenuItem[];
    };
  };
};
