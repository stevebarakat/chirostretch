import type { MenuItem } from "./menu";
import { MEDIA_ITEM_FIELDS } from "./fragments";

export const LAYOUT_QUERY = `
  ${MEDIA_ITEM_FIELDS}

  query Layout {
    logo: mediaItem(id: "logo", idType: SLUG) {
      ...MediaItemFields
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
    headerMenu: menu(id: "homepage-menu", idType: SLUG) {
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
    siteSettings {
      announcementBar {
        enabled
        message
        highlight
        showOn
      }
    }
  }
`;

export type AnnouncementBarData = {
  enabled?: boolean;
  message?: string;
  highlight?: string;
  showOn?: "all" | "shop" | ("all" | "shop")[];
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
  siteSettings?: {
    announcementBar?: AnnouncementBarData;
  };
};
