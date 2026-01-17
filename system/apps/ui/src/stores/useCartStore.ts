import { create } from "zustand";

// localStorage key for cart persistence
const CART_STORAGE_KEY = "chirostretch-cart";

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

type CartState = {
  items: StoreCartItem[];
  itemsCount: number;
  totals: StoreCartTotals | null;
  loading: boolean;
  error: string | null;
  isHydrated: boolean;

  hydrateFromLocalStorage: () => void;
  fetchCart: () => Promise<void>;
  addToCart: (productId: number, quantity?: number, productData?: Partial<StoreCartItem>) => Promise<void>;
  updateCartItem: (key: string, quantity: number) => Promise<void>;
  removeCartItem: (key: string) => Promise<void>;
  clearCart: () => void;
};

// ---- helpers ---------------------------------------------------------------

/**
 * Load cart from localStorage
 */
function loadCartFromStorage(): StoreCartItem[] {
  if (typeof window === "undefined") return [];

  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (!stored) return [];

    const items = JSON.parse(stored);
    return Array.isArray(items) ? items : [];
  } catch (error) {
    console.error("Failed to load cart from localStorage:", error);
    return [];
  }
}

/**
 * Save cart to localStorage
 */
function saveCartToStorage(items: StoreCartItem[]): void {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (error) {
    console.error("Failed to save cart to localStorage:", error);
  }
}

/**
 * Calculate cart totals from items
 */
function calculateTotals(items: StoreCartItem[]): StoreCartTotals {
  let totalItems = 0;
  let totalPrice = 0;

  items.forEach((item) => {
    const quantity = item.quantity || 0;
    totalItems += quantity;

    // Get price from item.prices.price or item.totals.line_total
    const priceStr = item.prices?.price || item.totals?.line_total || "0";

    // Remove any non-numeric characters except decimal point
    const cleanPrice = priceStr.replace(/[^0-9.]/g, "");
    const price = parseFloat(cleanPrice) || 0;

    totalPrice += price * quantity;
  });

  return {
    total_items: totalItems.toString(),
    total_price: totalPrice.toFixed(2),
    total_items_tax: "0",
    total_fees: "0",
    total_discount: "0",
    total_shipping: null,
    total_tax: "0",
  };
}

/**
 * Generate unique cart item key
 */
function generateCartKey(productId: number, variationId?: number): string {
  const base = variationId ? `${productId}-${variationId}` : `${productId}`;
  return `cart-${base}-${Date.now()}`;
}

// ---- store -----------------------------------------------------------------

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemsCount: 0,
  totals: null,
  loading: false,
  error: null,
  isHydrated: false,

  /**
   * Hydrate cart from localStorage on mount
   */
  hydrateFromLocalStorage: () => {
    const items = loadCartFromStorage();
    const itemsCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totals = calculateTotals(items);

    set({
      items,
      itemsCount,
      totals,
      isHydrated: true,
    });
  },

  /**
   * Fetch cart (no-op for localStorage, but kept for compatibility)
   */
  fetchCart: async () => {
    // For localStorage cart, just reload from storage
    const items = loadCartFromStorage();
    const itemsCount = items.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const totals = calculateTotals(items);

    set({
      items,
      itemsCount,
      totals,
    });
  },

  /**
   * Add a product to the cart
   * productData should include at minimum: { name, prices: { price } }
   */
  addToCart: async (
    productId: number,
    quantity = 1,
    productData?: Partial<StoreCartItem>
  ) => {
    if (!productId || quantity < 1) {
      console.error("addToCart: invalid productId or quantity", {
        productId,
        quantity,
      });
      return;
    }

    set({ loading: true, error: null });

    try {
      const currentItems = get().items;

      // Check if product already exists in cart
      const existingItemIndex = currentItems.findIndex(
        (item) => (item.product_id || item.id) === productId
      );

      let updatedItems: StoreCartItem[];

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        updatedItems = currentItems.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new item
        const newItem: StoreCartItem = {
          key: generateCartKey(productId),
          id: productId,
          product_id: productId,
          quantity,
          name: productData?.name || `Product ${productId}`,
          prices: productData?.prices || { price: "0" },
          totals: productData?.totals,
          ...productData,
        };

        updatedItems = [...currentItems, newItem];
      }

      // Save to localStorage
      saveCartToStorage(updatedItems);

      // Update state
      const itemsCount = updatedItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      const totals = calculateTotals(updatedItems);

      set({
        items: updatedItems,
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

  /**
   * Update cart item quantity
   */
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
      const currentItems = get().items;
      const updatedItems = currentItems.map((item) =>
        item.key === key ? { ...item, quantity } : item
      );

      // Save to localStorage
      saveCartToStorage(updatedItems);

      // Update state
      const itemsCount = updatedItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      const totals = calculateTotals(updatedItems);

      set({
        items: updatedItems,
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

  /**
   * Remove cart item
   */
  removeCartItem: async (key: string) => {
    if (!key) {
      console.error("removeCartItem: key is required");
      return;
    }

    set({ loading: true, error: null });

    try {
      const currentItems = get().items;
      const updatedItems = currentItems.filter((item) => item.key !== key);

      // Save to localStorage
      saveCartToStorage(updatedItems);

      // Update state
      const itemsCount = updatedItems.reduce(
        (sum, item) => sum + (item.quantity || 0),
        0
      );
      const totals = calculateTotals(updatedItems);

      set({
        items: updatedItems,
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

  /**
   * Clear the entire cart
   */
  clearCart: () => {
    saveCartToStorage([]);

    set({
      items: [],
      itemsCount: 0,
      totals: null,
      loading: false,
      error: null,
    });
  },
}));
