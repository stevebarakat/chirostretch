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
};

