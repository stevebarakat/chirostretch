declare module "next-gravity-forms" {
  import { ReactElement } from "react";

  type GravityFormFieldInput = {
    id: string | number;
    label: string;
    autocompleteAttribute?: string;
    customLabel?: string | null;
    defaultValue?: string | null;
    isHidden?: boolean;
    key?: string;
    name?: string;
    placeholder?: string;
  };

  type GravityFormFieldChoice = {
    text: string;
    value: string;
    isSelected?: boolean;
  };

  type GravityFormField = {
    id?: string;
    databaseId?: number;
    type?: string;
    inputType: string;
    label?: string;
    description?: string;
    isRequired?: boolean;
    placeholder?: string;
    visibility?: string;
    inputs?: GravityFormFieldInput[];
    choices?: GravityFormFieldChoice[];
    addressType?: string;
    defaultCountry?: string;
    defaultProvince?: string;
    defaultState?: string;
    addressValues?: Record<string, unknown>;
    adminLabel?: string;
    canPrepopulate?: boolean;
    conditionalLogic?: unknown;
    copyValuesOptionFieldId?: number;
    copyValuesOptionLabel?: string;
    cssClass?: string;
    descriptionPlacement?: string;
    displayOnly?: boolean;
    errorMessage?: string;
    hasAutocomplete?: boolean;
    inputName?: string;
    labelPlacement?: string;
    layoutGridColumnSpan?: number;
    layoutSpacerGridColumnSpan?: number;
    pageNumber?: number;
    personalData?: unknown;
    shouldCopyValuesOption?: boolean;
    subLabelPlacement?: string;
    value?: string;
    allowedExtensions?: string;
    maxFileSize?: number;
    maxFiles?: number;
    numberFormat?: string;
    maxLength?: number;
  };

  type GravityFormSubmitButton = {
    text?: string;
    type?: string;
    width?: string;
  };

  type GravityFormData = {
    id: string;
    databaseId?: number;
    title?: string;
    description?: string;
    formFields?: {
      nodes: GravityFormField[];
    };
    submitButton?: GravityFormSubmitButton;
  };

  type GravityFormFormProps = {
    data: GravityFormData;
  };

  const GravityFormForm: (props: GravityFormFormProps) => ReactElement;

  export default GravityFormForm;
}

declare module "next-gravity-forms/server" {
  type GravityFormFieldInput = {
    id: string | number;
    label: string;
    autocompleteAttribute?: string;
    customLabel?: string | null;
    defaultValue?: string | null;
    isHidden?: boolean;
    key?: string;
    name?: string;
    placeholder?: string;
  };

  type GravityFormFieldChoice = {
    text: string;
    value: string;
    isSelected?: boolean;
  };

  type GravityFormField = {
    id?: string;
    databaseId?: number;
    type?: string;
    inputType: string;
    label?: string;
    description?: string;
    isRequired?: boolean;
    placeholder?: string;
    visibility?: string;
    inputs?: GravityFormFieldInput[];
    choices?: GravityFormFieldChoice[];
    addressType?: string;
    defaultCountry?: string;
    defaultProvince?: string;
    defaultState?: string;
    addressValues?: Record<string, unknown>;
    adminLabel?: string;
    canPrepopulate?: boolean;
    conditionalLogic?: unknown;
    copyValuesOptionFieldId?: number;
    copyValuesOptionLabel?: string;
    cssClass?: string;
    descriptionPlacement?: string;
    displayOnly?: boolean;
    errorMessage?: string;
    hasAutocomplete?: boolean;
    inputName?: string;
    labelPlacement?: string;
    layoutGridColumnSpan?: number;
    layoutSpacerGridColumnSpan?: number;
    pageNumber?: number;
    personalData?: unknown;
    shouldCopyValuesOption?: boolean;
    subLabelPlacement?: string;
    value?: string;
    allowedExtensions?: string;
    maxFileSize?: number;
    maxFiles?: number;
    numberFormat?: string;
    maxLength?: number;
  };

  type GravityFormSubmitButton = {
    text?: string;
    type?: string;
    width?: string;
  };

  type GravityFormData = {
    id: string;
    databaseId?: number;
    title?: string;
    description?: string;
    formFields?: {
      nodes: GravityFormField[];
    };
    submitButton?: GravityFormSubmitButton;
  };

  function getGravityForm(id: number): Promise<GravityFormData | null>;

  export { getGravityForm };
}
