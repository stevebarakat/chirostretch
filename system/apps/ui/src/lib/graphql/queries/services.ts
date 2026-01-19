import { MEDIA_ITEM_BASIC_FIELDS } from "./fragments";

export const SERVICES_SETTINGS_QUERY = `
  ${MEDIA_ITEM_BASIC_FIELDS}

  query ChiroServicesSettings {
    chiroServicesSettings {
      title
      description
      services {
        tabLabel
        tabIcon {
          ...MediaItemBasicFields
        }
        title
        description
        bulletPoints
        infoBox
        image {
          ...MediaItemBasicFields
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
