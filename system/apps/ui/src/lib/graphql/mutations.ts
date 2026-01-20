/**
 * GraphQL Mutation Helper
 *
 * Server-side utility for executing GraphQL mutations against WordPress.
 * Supports X-Internal-Secret header injection for protected mutations.
 */

const GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_WPGRAPHQL_ENDPOINT;
const INTERNAL_SECRET = process.env.CHIROSTRETCH_INTERNAL_SECRET;

type MutationOptions = {
  /** Include X-Internal-Secret header for protected mutations */
  includeInternalSecret?: boolean;
};

type GraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
};

export class GraphQLMutationError extends Error {
  public readonly errors: Array<{ message: string; extensions?: Record<string, unknown> }>;

  constructor(errors: Array<{ message: string; extensions?: Record<string, unknown> }>) {
    super(errors[0]?.message || "GraphQL mutation failed");
    this.name = "GraphQLMutationError";
    this.errors = errors;
  }
}

/**
 * Execute a GraphQL mutation
 *
 * @param mutation - GraphQL mutation string
 * @param variables - Variables for the mutation
 * @param options - Additional options (includeInternalSecret for protected mutations)
 * @returns The mutation result data
 * @throws GraphQLMutationError if the mutation returns errors
 *
 * @example
 * // Public mutation
 * const result = await executeMutation<{ resetPassword: { success: boolean } }>(
 *   RESET_PASSWORD_MUTATION,
 *   { key, login, password }
 * );
 *
 * @example
 * // Protected mutation with internal secret
 * const result = await executeMutation<{ validateCoupon: CouponValidation }>(
 *   VALIDATE_COUPON_MUTATION,
 *   { couponCode, email },
 *   { includeInternalSecret: true }
 * );
 */
export async function executeMutation<T>(
  mutation: string,
  variables: Record<string, unknown>,
  options: MutationOptions = {}
): Promise<T> {
  if (!GRAPHQL_ENDPOINT) {
    throw new Error("NEXT_PUBLIC_WPGRAPHQL_ENDPOINT is not configured");
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (options.includeInternalSecret && INTERNAL_SECRET) {
    headers["X-Internal-Secret"] = INTERNAL_SECRET;
  }

  const response = await fetch(GRAPHQL_ENDPOINT, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query: mutation,
      variables,
    }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`GraphQL request failed: ${response.status} ${response.statusText}`);
  }

  const json: GraphQLResponse<T> = await response.json();

  if (json.errors && json.errors.length > 0) {
    throw new GraphQLMutationError(json.errors);
  }

  if (!json.data) {
    throw new Error("GraphQL response missing data");
  }

  return json.data;
}

// =============================================================================
// Mutation Definitions
// =============================================================================

/**
 * Request password reset - generates reset key and returns user data for email
 */
export const REQUEST_PASSWORD_RESET = `
  mutation RequestPasswordReset($email: String!) {
    requestPasswordReset(input: { email: $email }) {
      success
      user {
        key
        login
        email
        firstName
      }
    }
  }
`;

/**
 * Validate password reset key
 */
export const VALIDATE_PASSWORD_RESET_KEY = `
  mutation ValidatePasswordResetKey($key: String!, $login: String!) {
    validatePasswordResetKey(input: { key: $key, login: $login }) {
      valid
      userLogin
      error
      message
    }
  }
`;

/**
 * Reset password with valid key
 */
export const RESET_PASSWORD = `
  mutation ResetPassword($key: String!, $login: String!, $password: String!) {
    resetPassword(input: { key: $key, login: $login, password: $password }) {
      success
      error
      message
    }
  }
`;

/**
 * Generate new patient coupon (requires internal secret)
 */
export const GENERATE_NEW_PATIENT_COUPON = `
  mutation GenerateNewPatientCoupon(
    $email: String!
    $firstName: String
    $userId: Int
    $entryId: String
  ) {
    generateNewPatientCoupon(input: {
      email: $email
      firstName: $firstName
      userId: $userId
      entryId: $entryId
    }) {
      success
      couponCode
      couponId
      discountAmount
      finalPrice
      expires
      existing
      message
      error
    }
  }
`;

/**
 * Validate coupon with email verification (requires internal secret)
 */
export const VALIDATE_COUPON = `
  mutation ValidateCoupon($couponCode: String!, $email: String!) {
    validateCoupon(input: { couponCode: $couponCode, email: $email }) {
      valid
      discountAmount
      discountType
      couponCode
      error
      message
    }
  }
`;

/**
 * Create checkout order from cart data (requires internal secret)
 */
export const CREATE_CHECKOUT_ORDER = `
  mutation CreateCheckoutOrder(
    $billing: CheckoutAddressInput!
    $shipping: CheckoutAddressInput
    $lineItems: [CheckoutLineItemInput]!
    $couponCode: String
    $customerNote: String
  ) {
    createCheckoutOrder(input: {
      billing: $billing
      shipping: $shipping
      lineItems: $lineItems
      couponCode: $couponCode
      customerNote: $customerNote
    }) {
      success
      orderId
      orderKey
      paymentUrl
      total
      status
      error
      message
    }
  }
`;

// =============================================================================
// Type Definitions
// =============================================================================

export type PasswordResetUserData = {
  key: string;
  login: string;
  email: string;
  firstName: string | null;
};

export type RequestPasswordResetResult = {
  requestPasswordReset: {
    success: boolean;
    user: PasswordResetUserData | null;
  };
};

export type ValidatePasswordResetKeyResult = {
  validatePasswordResetKey: {
    valid: boolean;
    userLogin: string | null;
    error: string | null;
    message: string | null;
  };
};

export type ResetPasswordResult = {
  resetPassword: {
    success: boolean;
    error: string | null;
    message: string | null;
  };
};

export type GenerateNewPatientCouponResult = {
  generateNewPatientCoupon: {
    success: boolean;
    couponCode: string | null;
    couponId: number | null;
    discountAmount: number | null;
    finalPrice: number | null;
    expires: string | null;
    existing: boolean | null;
    message: string | null;
    error: string | null;
  };
};

export type ValidateCouponResult = {
  validateCoupon: {
    valid: boolean;
    discountAmount: number | null;
    discountType: string | null;
    couponCode: string | null;
    error: string | null;
    message: string | null;
  };
};

// =============================================================================
// Order Types
// =============================================================================

export type CheckoutAddressInput = {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

export type CheckoutLineItemInput = {
  productId: number;
  quantity: number;
  variationId?: number;
  metaData?: Array<{ key: string; value: string }>;
};

export type CreateCheckoutOrderResult = {
  createCheckoutOrder: {
    success: boolean;
    orderId: number | null;
    orderKey: string | null;
    paymentUrl: string | null;
    total: string | null;
    status: string | null;
    error: string | null;
    message: string | null;
  };
};
