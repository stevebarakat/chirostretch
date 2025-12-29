import { wpGraphQLFetch } from "@/lib/wpgraphql";
import { getValidAuthToken } from "@/lib/auth/server";
import {
  VIEWER_ACCOUNT_QUERY,
  VIEWER_ORDERS_QUERY,
  VIEWER_DOWNLOADS_QUERY,
  ORDER_BY_ID_QUERY,
  UPDATE_CUSTOMER_MUTATION,
  UPDATE_USER_MUTATION,
  type ViewerAccount,
  type ViewerOrder,
  type ViewerOrdersResponse,
  type ViewerDownloadsResponse,
  type DownloadableItem,
  type OrderByIdResponse,
  type OrderDetails,
  type UpdateCustomerInput,
  type UpdateCustomerResponse,
  type UpdateUserInput,
  type UpdateUserResponse,
  type CustomerAddress,
} from "@/lib/graphql/queries/account";

type ViewerAccountResult = {
  viewer: ViewerAccount["viewer"];
  customer: ViewerAccount["customer"];
};

/**
 * Get the current viewer's account details
 * Requires authentication (JWT/cookie-based)
 *
 * @returns Viewer and customer account data, or null if not authenticated
 */
export async function getViewerAccount(): Promise<ViewerAccountResult | null> {
  try {
    const data = await wpGraphQLFetch<ViewerAccount>({
      query: VIEWER_ACCOUNT_QUERY,
      auth: true,
    });

    if (!data.customer) return null;

    return {
      viewer: data.viewer,
      customer: data.customer,
    };
  } catch (error) {
    console.error("Failed to fetch viewer account:", error);
    return null;
  }
}

/**
 * Get the current viewer's orders
 * Requires authentication
 *
 * @param first - Number of orders to fetch (default: 10)
 * @returns Array of orders
 */
export async function getViewerOrders(first = 10): Promise<ViewerOrder[]> {
  try {
    const data = await wpGraphQLFetch<ViewerOrdersResponse>({
      query: VIEWER_ORDERS_QUERY,
      variables: { first },
      auth: true,
    });

    return data.customer?.orders?.nodes ?? [];
  } catch (error) {
    console.error("Failed to fetch viewer orders:", error);
    return [];
  }
}

/**
 * Get a specific order by database ID
 * Requires authentication
 *
 * @param id - Order database ID
 * @returns Order details or null
 */
export async function getOrderById(id: number): Promise<OrderDetails | null> {
  try {
    const data = await wpGraphQLFetch<OrderByIdResponse>({
      query: ORDER_BY_ID_QUERY,
      variables: { id },
      auth: true,
    });

    return data.order;
  } catch (error) {
    console.error(`Failed to fetch order ${id}:`, error);
    return null;
  }
}

/**
 * Get the current viewer's downloadable products
 * Requires authentication
 *
 * @returns Array of downloadable items
 */
export async function getViewerDownloads(): Promise<DownloadableItem[]> {
  try {
    const data = await wpGraphQLFetch<ViewerDownloadsResponse>({
      query: VIEWER_DOWNLOADS_QUERY,
      auth: true,
    });

    return data.customer?.downloadableItems?.nodes ?? [];
  } catch (error) {
    console.error("Failed to fetch viewer downloads:", error);
    return [];
  }
}

/**
 * Update customer billing and shipping addresses
 * Requires authentication
 *
 * @param customerId - Customer database ID
 * @param billing - Updated billing address (optional)
 * @param shipping - Updated shipping address (optional)
 * @returns Updated customer data or null on error
 */
export async function updateCustomerAddresses(
  customerId: number,
  billing?: Partial<CustomerAddress>,
  shipping?: Partial<CustomerAddress>
) {
  try {
    const input: UpdateCustomerInput = {
      id: customerId,
    };

    if (billing) {
      input.billing = billing;
    }

    if (shipping) {
      input.shipping = shipping;
    }

    const data = await wpGraphQLFetch<UpdateCustomerResponse>({
      query: UPDATE_CUSTOMER_MUTATION,
      variables: { input },
      auth: true,
      revalidate: 0, // Don't cache mutations
    });

    return data.updateCustomer?.customer ?? null;
  } catch (error) {
    console.error("Failed to update customer addresses:", error);
    throw error;
  }
}

/**
 * Update user account details (name, email, password)
 * Requires authentication
 *
 * @param userId - User database ID
 * @param updates - Fields to update
 * @returns Updated user data or null on error
 */
export async function updateUserAccount(
  userId: number,
  updates: Omit<UpdateUserInput, "id">
): Promise<NonNullable<UpdateUserResponse["updateUser"]>["user"]> {
  try {
    const input: UpdateUserInput = {
      id: userId,
      ...updates,
    };

    const data = await wpGraphQLFetch<UpdateUserResponse>({
      query: UPDATE_USER_MUTATION,
      variables: { input },
      auth: true,
      revalidate: 0, // Don't cache mutations
    });

    return data.updateUser?.user ?? null;
  } catch (error) {
    console.error("Failed to update user account:", error);
    throw error;
  }
}

/**
 * Update user profile fields via WP REST API (nickname, description, url, meta)
 * Note: arbitrary user meta (like `job_title`) requires REST API support on the WP side.
 */
export async function updateUserMeta(
  userId: number,
  meta: {
    nickname?: string;
    description?: string;
    url?: string;
    job_title?: string;
  }
) {
  try {
    const token = await getValidAuthToken();

    const WP_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

    const endpoint = `${WP_URL!.replace(
      /\/$/,
      ""
    )}/wp-json/wp/v2/users/${userId}`;

    const body: Record<string, unknown> = {};
    if (meta.nickname !== undefined) body.nickname = meta.nickname;
    if (meta.description !== undefined) body.description = meta.description;
    if (meta.url !== undefined) body.url = meta.url;

    // Try to write arbitrary meta under `meta` - this requires the WP REST API to expose/allow meta updates
    if (meta.job_title !== undefined) {
      body.meta = { ...(body.meta || {}), job_title: meta.job_title };
    }

    const headers: HeadersInit = { "Content-Type": "application/json" };
    if (token) headers.Authorization = `Bearer ${token}`;

    const res = await fetch(endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify(body),
      credentials: "include",
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(
        `Failed to update user meta: ${res.status} ${res.statusText} - ${text}`
      );
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("updateUserMeta failed:", error);
    throw error;
  }
}

/**
 * Re-export formatting utilities for backward compatibility
 * These can be safely imported in client components
 */
export {
  formatOrderStatus,
  formatOrderDate,
  formatPrice,
} from "@/lib/utils/format";
