export const FOOTER_CONTENT_QUERY = `
  query FooterContent {
    footerSettings: acfOptions {
      footerSettings {
        contactInfo
        officeHours
        socialMedia {
          ... on FooterSettingsSocialMediaSocialMediaPropertyLayout {
            name
            url
            icon {
              node {
                altText
                mediaDetails {
                  height
                  width
                }
                sourceUrl
              }
            }
          }
        }
        footerCta {
          headline
          description
          primaryButton {
            text
            link {
              ... on Page {
                uri
              }
            }
          }
          secondaryButton {
            text
            link {
              ... on Page {
                uri
              }
            }
          }
        }
      }
    }
  }
`;

export type SocialMediaItem = {
  name: string;
  url: string;
  icon: {
    node: {
      altText: string;
      mediaDetails: {
        height: number;
        width: number;
      };
      sourceUrl: string;
    };
  };
};

export type FooterContentQueryResponse = {
  footerSettings?: {
    footerSettings?: {
      contactInfo?: string;
      officeHours?: string;
      socialMedia?: SocialMediaItem[];
      footerCta?: {
        headline?: string;
        description?: string;
        primaryButton?: {
          text?: string;
          link?: {
            uri?: string;
          };
        };
        secondaryButton?: {
          text?: string;
          link?: {
            uri?: string;
          };
        };
      };
    };
  };
};
