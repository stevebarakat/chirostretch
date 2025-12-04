import { wpGraphQLFetch } from "@/lib/wpgraphql";
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

/**
 * Get the current viewer's account details
 * Requires authentication (JWT/cookie-based)
 *
 * @returns Customer account object with user info and WooCommerce data, or null if not authenticated
 */
export async function getViewerAccount(): Promise<ViewerAccount["customer"]> {
  try {
    const data = await wpGraphQLFetch<ViewerAccount>({
      query: VIEWER_ACCOUNT_QUERY,
      auth: true,
    });

    // Return the customer data which includes billing and shipping
    return data.customer;
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
 * @param after - Cursor for pagination
 * @returns Array of orders
 */
export async function getViewerOrders(
  first = 10,
  after?: string
): Promise<ViewerOrder[]> {
  try {
    const data = await wpGraphQLFetch<ViewerOrdersResponse>({
      query: VIEWER_ORDERS_QUERY,
      variables: { first, after },
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
): Promise<UpdateCustomerResponse["updateCustomer"]["customer"]> {
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
): Promise<UpdateUserResponse["updateUser"]["user"]> {
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
 * Format order status for display
 */
export function formatOrderStatus(status?: string | null): string {
  if (!status) return "Unknown";

  // Remove "wc-" prefix if present
  const cleanStatus = status.replace(/^wc-/, "");

  // Convert to title case with spaces
  return cleanStatus
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

/**
 * Format order date for display
 */
export function formatOrderDate(date?: string | null): string {
  if (!date) return "";

  try {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return date;
  }
}

/**
 * Format price string (e.g., "$100.00")
 */
export function formatPrice(price?: string | null): string {
  if (!price) return "$0.00";

  // If already formatted, return as-is
  if (price.includes("$")) return price;

  // Parse and format
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) return price;

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numPrice);
}
