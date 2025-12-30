export const VALUE_PROPOSITIONS_SETTINGS_QUERY = `
  query ChiroFeatureSettings {
    chiroFeatureSettings {
      title
      description
      keyPoints {
        icon {
          sourceUrl
          altText
        }
        iconBackgroundColor
        title
        description
      }
    }
  }
`;

export type ValueProposition = {
  icon: {
    sourceUrl: string;
    altText: string;
  } | null;
  iconBackgroundColor: string | null;
  title: string;
  description: string;
};

export type ValuePropositionsSettings = {
  title: string;
  description: string;
  keyPoints: ValueProposition[];
};

export type ValuePropositionsSettingsResponse = {
  chiroFeatureSettings: ValuePropositionsSettings | null;
};
