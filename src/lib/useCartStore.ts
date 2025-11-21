import { create } from "zustand";

const WORDPRESS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "https://chirostretch.local";

type StoreCartItem = {
  key: string;
  id?: number;
  product_id?: number;
  quantity: number;
  name: string;

  prices?: {
    price?: string;
    regular_price?: string;
    sale_price?: string;
  };

  totals?: {
    line_subtotal?: string;
    line_total?: string;
  };

  variation?: {
    id?: number;
  };

  // Allow Woo extras without breaking typing
  [key: string]: unknown;
};

type StoreCartTotals = {
  total_price?: string;
  total_items?: string;
  total_items_tax?: string;
  total_fees?: string;
  total_discount?: string;
  total_shipping?: string | null;
  total_tax?: string;
  [key: string]: unknown;
};

type StoreCartResponse = {
  items?: StoreCartItem[];
  items_count?: number;
  totals?: StoreCartTotals | null;
  [key: string]: unknown;
};

type CartState = {
  items: StoreCartItem[];
  itemsCount: number;
  totals: StoreCartTotals | null;
  loading: boolean;
  error: string | null;

  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (key: string, quantity: number) => Promise<void>;
  removeCartItem: (key: string) => Promise<void>;
  clearCart: () => Promise<void>;
};

// ---- helpers ---------------------------------------------------------------

function getCartFromResponse(data: StoreCartResponse) {
  const items = Array.isArray(data.items) ? data.items : [];
  const itemsCountFromApi =
    typeof data.items_count === "number" ? data.items_count : undefined;

  const itemsCount =
    itemsCountFromApi ??
    items.reduce((sum, item) => sum + (item.quantity || 0), 0);

  return {
    items,
    itemsCount,
    totals: data.totals ?? null,
  };
}

async function fetchJson(
  path: string,
  options: RequestInit = {}
): Promise<StoreCartResponse> {
  const res = await fetch(`${WORDPRESS_URL}/wp-json/wc/store/v1${path}`, {
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(options.headers ?? {}),
    },
    ...options,
  });

  let body: unknown = null;

  try {
    body = await res.json();
  } catch {
    // Some WC endpoints can return 204 or non-JSON on error; fail gracefully.
  }

  if (!res.ok) {
    // Surface something useful in dev; keep it generic in state.
    console.error(
      "WooCommerce Store API error:",
      res.status,
      res.statusText,
      body
    );
    throw new Error(
      `Store API error: ${res.status} ${res.statusText}${
        body ? ` – ${JSON.stringify(body)}` : ""
      }`
    );
  }

  return (body ?? {}) as StoreCartResponse;
}

// ---- store -----------------------------------------------------------------

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemsCount: 0,
  totals: null,
  loading: false,
  error: null,

  // Get the current cart from Woo session
  fetchCart: async () => {
    set({ loading: true, error: null });

    try {
      const data = await fetchJson("/cart", { method: "GET" });
      const { items, itemsCount, totals } = getCartFromResponse(data);

      set({
        items,
        itemsCount,
        totals,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error fetching cart:", err);
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Failed to fetch cart",
      });
    }
  },

  // Add a product to the cart. Quantity is exactly what the user is adding now.
  addToCart: async (productId: number, quantity = 1) => {
    if (!productId || quantity < 1) {
      console.error("addToCart: invalid productId or quantity", {
        productId,
        quantity,
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      const data = await fetchJson("/cart/add-item", {
        method: "POST",
        body: JSON.stringify({
          id: productId,
          quantity, // <-- the only correct thing to send
        }),
      });

      const { items, itemsCount, totals } = getCartFromResponse(data);

      set({
        items,
        itemsCount,
        totals,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Failed to add to cart",
      });
      throw err;
    }
  },

  // Update an existing line item by key (not productId).
  updateCartItem: async (key: string, quantity: number) => {
    if (!key || quantity < 1) {
      console.error("updateCartItem: invalid key or quantity", {
        key,
        quantity,
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      const data = await fetchJson("/cart/update-item", {
        method: "POST",
        body: JSON.stringify({ key, quantity }),
      });

      const { items, itemsCount, totals } = getCartFromResponse(data);

      set({
        items,
        itemsCount,
        totals,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error updating cart item:", err);
      set({
        loading: false,
        error:
          err instanceof Error ? err.message : "Failed to update cart item",
      });
      throw err;
    }
  },

  // Remove a line item by key.
  removeCartItem: async (key: string) => {
    if (!key) {
      console.error("removeCartItem: key is required");
      return;
    }

    set({ loading: true, error: null });

    try {
      const data = await fetchJson("/cart/remove-item", {
        method: "POST",
        body: JSON.stringify({ key }),
      });

      const { items, itemsCount, totals } = getCartFromResponse(data);

      set({
        items,
        itemsCount,
        totals,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error removing cart item:", err);
      set({
        loading: false,
        error:
          err instanceof Error ? err.message : "Failed to remove cart item",
      });
      throw err;
    }
  },

  // Clear the entire cart (if you want this in the UI later)
  clearCart: async () => {
    set({ loading: true, error: null });

    try {
      const data = await fetchJson("/cart/items", {
        method: "DELETE",
      });

      const { items, itemsCount, totals } = getCartFromResponse(data);

      set({
        items,
        itemsCount,
        totals,
        loading: false,
        error: null,
      });
    } catch (err) {
      console.error("Error clearing cart:", err);
      set({
        loading: false,
        error: err instanceof Error ? err.message : "Failed to clear cart",
      });
      throw err;
    }
  },
}));
