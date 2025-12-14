export const VALUE_PROPOSITIONS_SETTINGS_QUERY = `
  query ChiroValuePropositionsSettings {
    chiroValuePropositionsSettings {
      title
      description
      valuePropositions {
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
  valuePropositions: ValueProposition[];
};

export type ValuePropositionsSettingsResponse = {
  chiroValuePropositionsSettings: ValuePropositionsSettings | null;
};
