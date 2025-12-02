export const GRAVITY_FORM_BY_ID_QUERY = `
  query GravityFormById($id: ID!) {
    gfForm(id: $id) {
      id
      databaseId
      description
      formFields {
        nodes {
          inputType
          ... on EmailField {
            id
            databaseId
            label
            inputType
          }
        }
      }
      submitButton {
        text
        type
        width
      }
    }
  }
`;

export type GravityFormFieldInput = {
  id: string;
  label: string;
  name: string;
  placeholder?: string;
  isHidden?: boolean;
};

export type GravityFormFieldChoice = {
  text: string;
  value: string;
  isSelected?: boolean;
};

export type GravityFormField = {
  id: string;
  databaseId?: number;
  type: string;
  inputType: string;
  label?: string;
  description?: string;
  isRequired?: boolean;
  placeholder?: string;
  visibility: string;
  inputs?: GravityFormFieldInput[];
  choices?: GravityFormFieldChoice[];
  allowedExtensions?: string;
  maxFileSize?: number;
  maxFiles?: number;
  numberFormat?: string;
  maxLength?: number;
};

export type GravityFormResponse = {
  gfForm: {
    id: string;
    databaseId?: number;
    description?: string;
    formFields: {
      nodes: GravityFormField[];
    };
    submitButton?: {
      text?: string;
      type?: string;
      width?: string;
    };
  } | null;
};
