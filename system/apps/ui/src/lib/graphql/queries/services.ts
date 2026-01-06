export const SERVICES_SETTINGS_QUERY = `
  query ChiroServicesSettings {
    chiroServicesSettings {
      title
      description
      services {
        tabLabel
        tabIcon {
          sourceUrl
          altText
        }
        title
        description
        bulletPoints
        infoBox
        image {
          sourceUrl
          altText
          mediaDetails {
            width
            height
          }
        }
      }
    }
  }
`;

export type Service = {
  tabLabel: string;
  tabIcon: {
    sourceUrl: string;
    altText: string;
  } | null;
  title: string;
  description: string;
  bulletPoints: string[];
  infoBox: string;
  image: {
    sourceUrl: string;
    altText: string;
    mediaDetails: {
      width: number;
      height: number;
    };
  } | null;
};

export type ServicesSettings = {
  title: string;
  description: string;
  services: Service[];
};

export type ServicesSettingsResponse = {
  chiroServicesSettings: ServicesSettings | null;
};
