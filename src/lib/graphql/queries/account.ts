// GraphQL fragments for WooCommerce customer account queries

export const ADDRESS_FIELDS_FRAGMENT = `
  fragment AddressFields on CustomerAddress {
    address1
    address2
    city
    company
    country
    email
    firstName
    lastName
    phone
    postcode
    state
  }
`;

export const ORDER_FIELDS_FRAGMENT = `
  fragment OrderFields on Order {
    id
    databaseId
    orderNumber
    date
    status
    total
    subtotal
    totalTax
    shippingTotal
    paymentMethodTitle
    lineItems {
      nodes {
        product {
          node {
            ... on Product {
              id
              name
              slug
            }
          }
        }
        quantity
        total
      }
    }
  }
`;

export const DOWNLOAD_FIELDS_FRAGMENT = `
  fragment DownloadFields on ProductDownload {
    downloadId
    name
    file
  }
`;

// Query to get current viewer (logged-in customer) account details
export const VIEWER_ACCOUNT_QUERY = `
  ${ADDRESS_FIELDS_FRAGMENT}
  query ViewerAccount {
    viewer {
      id
      databaseId
      email
      firstName
      lastName
      username
    }
    customer {
      id
      databaseId
      email
      firstName
      lastName
      username
      billing {
        ...AddressFields
      }
      shipping {
        ...AddressFields
      }
    }
  }
`;

// Query to get viewer's orders
export const VIEWER_ORDERS_QUERY = `
  ${ORDER_FIELDS_FRAGMENT}
  query ViewerOrders($first: Int = 10, $after: String) {
    customer {
      orders(first: $first, after: $after) {
        nodes {
          ...OrderFields
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  }
`;

// Query to get a single order by ID
export const ORDER_BY_ID_QUERY = `
  ${ORDER_FIELDS_FRAGMENT}
  ${ADDRESS_FIELDS_FRAGMENT}
  query OrderById($id: ID!) {
    order(id: $id, idType: DATABASE_ID) {
      ...OrderFields
      billing {
        ...AddressFields
      }
      shipping {
        ...AddressFields
      }
      shippingLines {
        nodes {
          methodTitle
          total
        }
      }
      customerNote
    }
  }
`;

// Query to get viewer's downloadable products
export const VIEWER_DOWNLOADS_QUERY = `
  query ViewerDownloads {
    customer {
      downloadableItems {
        nodes {
          download {
            downloadId
            name
            file
          }
          accessExpires
          downloadsRemaining
          product {
            ... on SimpleProduct {
              id
              name
              slug
            }
            ... on VariableProduct {
              id
              name
              slug
            }
          }
        }
      }
    }
  }
`;

// Mutation to update customer billing and shipping addresses
export const UPDATE_CUSTOMER_MUTATION = `
  ${ADDRESS_FIELDS_FRAGMENT}
  mutation UpdateCustomer($input: UpdateCustomerInput!) {
    updateCustomer(input: $input) {
      customer {
        id
        billing {
          ...AddressFields
        }
        shipping {
          ...AddressFields
        }
      }
    }
  }
`;

// Mutation to update user account details (name, email, password)
export const UPDATE_USER_MUTATION = `
  mutation UpdateUser($input: UpdateUserInput!) {
    updateUser(input: $input) {
      user {
        id
        databaseId
        email
        firstName
        lastName
      }
    }
  }
`;

// Query to get saved payment methods (if supported by WooGraphQL)
// Note: This may require additional plugins or custom implementation
export const VIEWER_PAYMENT_METHODS_QUERY = `
  query ViewerPaymentMethods {
    customer {
      metaData {
        key
        value
      }
    }
  }
`;

// Types for TypeScript

export type CustomerAddress = {
  address1?: string | null;
  address2?: string | null;
  city?: string | null;
  company?: string | null;
  country?: string | null;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  phone?: string | null;
  postcode?: string | null;
  state?: string | null;
};

export type ViewerAccount = {
  viewer: {
    id: string;
    databaseId: number;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    username: string;
  } | null;
  customer: {
    id: string;
    databaseId: number;
    email: string;
    firstName?: string | null;
    lastName?: string | null;
    username: string;
    billing?: CustomerAddress | null;
    shipping?: CustomerAddress | null;
  } | null;
};

export type OrderLineItem = {
  product?: {
    node?: {
      id?: string;
      name?: string;
      slug?: string;
    } | null;
  } | null;
  quantity?: number | null;
  total?: string | null;
};

export type ViewerOrder = {
  id: string;
  databaseId: number;
  orderNumber?: string | null;
  date?: string | null;
  status?: string | null;
  total?: string | null;
  subtotal?: string | null;
  totalTax?: string | null;
  shippingTotal?: string | null;
  paymentMethodTitle?: string | null;
  lineItems?: {
    nodes?: OrderLineItem[];
  } | null;
};

export type OrderDetails = ViewerOrder & {
  billing?: CustomerAddress | null;
  shipping?: CustomerAddress | null;
  shippingLines?: {
    nodes?: Array<{
      methodTitle?: string | null;
      total?: string | null;
    }>;
  } | null;
  customerNote?: string | null;
};

export type ViewerOrdersResponse = {
  customer: {
    orders: {
      nodes: ViewerOrder[];
      pageInfo: {
        hasNextPage: boolean;
        endCursor?: string | null;
      };
    } | null;
  } | null;
};

export type OrderByIdResponse = {
  order: OrderDetails | null;
};

export type ProductDownload = {
  downloadId: string;
  name?: string | null;
  file?: string | null;
};

export type DownloadableItem = {
  download?: ProductDownload | null;
  accessExpires?: string | null;
  downloadsRemaining?: number | null;
  product?: {
    node?: {
      id?: string;
      name?: string;
      slug?: string;
    } | null;
  } | null;
};

export type ViewerDownloadsResponse = {
  customer: {
    downloadableItems: {
      nodes: DownloadableItem[];
    } | null;
  } | null;
};

export type UpdateCustomerInput = {
  id: number;
  billing?: Partial<CustomerAddress>;
  shipping?: Partial<CustomerAddress>;
};

export type UpdateCustomerResponse = {
  updateCustomer: {
    customer: {
      id: string;
      billing?: CustomerAddress | null;
      shipping?: CustomerAddress | null;
    } | null;
  } | null;
};

export type UpdateUserInput = {
  id: number;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
};

export type UpdateUserResponse = {
  updateUser: {
    user: {
      id: string;
      databaseId: number;
      email: string;
      firstName?: string | null;
      lastName?: string | null;
    } | null;
  } | null;
};

export type ViewerPaymentMethodsResponse = {
  customer: {
    metaData?: Array<{
      key?: string | null;
      value?: string | null;
    }> | null;
  } | null;
};
