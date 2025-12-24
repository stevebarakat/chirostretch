import type { MenuItem } from "./menu";

export const LAYOUT_QUERY = `
  query Layout {
    logo: mediaItem(id: "logo", idType: SLUG) {
      altText
      sourceUrl
      srcSet
      sizes
      mediaDetails {
        width
        height
      }
    }
    topMenu: menu(id: "main-menu", idType: SLUG) {
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
    headerMenu: menu(id: "chirostretch-menu", idType: SLUG) {
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
    footerMenu: menu(id: "shop", idType: SLUG) {
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
  topMenu?: {
    id?: string;
    name?: string;
    menuItems?: {
      nodes: MenuItem[];
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
