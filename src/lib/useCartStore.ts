import { create } from "zustand";

const WORDPRESS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://chirostretch-copy.local";

type CartItem = {
  key: string;
  id?: number;
  productId?: number;
  product_id?: number;
  quantity: number;
  name: string;
  price?: string;
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
};

type CartState = {
  items: CartItem[];
  itemsCount: number;
  totals: {
    total_price: string;
    total_items: string;
    total_items_tax: string;
    total_fees: string;
    total_discount: string;
    total_shipping: string;
    total_tax: string;
    total_price_display: string;
  } | null;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  updateCartItem: (key: string, quantity: number) => Promise<void>;
  removeCartItem: (key: string) => Promise<void>;
  fetchCart: () => Promise<void>;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemsCount: 0,
  totals: null,
  loading: false,

  fetchCart: async () => {
    set({ loading: true });

    try {
      const res = await fetch(`${WORDPRESS_URL}/wp-json/wc/store/v1/cart`, {
        credentials: "include",
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch cart: ${res.status} ${res.statusText}`);
      }

      const data = await res.json();

      console.log("Cart data received:", data);
      console.log("Cart items:", data.items);
      if (data.items && data.items.length > 0) {
        console.log("First item structure:", data.items[0]);
      }
      console.log("Items count:", data.items_count);

      const currentState = get();
      const newItems = data.items || [];

      if (newItems.length > 0 || currentState.items.length === 0) {
        set({
          items: newItems,
          itemsCount: data.items_count || newItems.length || 0,
          totals: data.totals || null,
          loading: false,
        });
      } else {
        set({ loading: false });
      }
    } catch (error) {
      console.error("Error fetching cart:", error);
      set({ loading: false });
    }
  },

  addToCart: async (productId: number, quantity = 1) => {
    if (!productId) {
      console.error("Cannot add to cart: productId is required");
      return;
    }

    set({ loading: true });

    try {
      const currentState = get();

      const existingItem = currentState.items.find(
        (item) => {
          const itemId = item.id || item.productId || item.product_id || (item as any).variation?.id;
          return itemId === productId;
        }
      );

      if (currentState.items.length > 0) {
        console.log("Current cart items:", currentState.items.map(item => ({
          id: item.id,
          productId: item.productId,
          product_id: item.product_id,
          name: item.name,
          quantity: item.quantity
        })));
      }

      const quantityToAdd = existingItem
        ? existingItem.quantity + quantity
        : quantity;

      console.log(
        `Adding product ${productId}: ${existingItem ? `existing quantity ${existingItem.quantity} + ${quantity} = ${quantityToAdd}` : `new item quantity ${quantity}`
      }`
      );

      const res = await fetch(
        `${WORDPRESS_URL}/wp-json/wc/store/v1/cart/add-item`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: productId,
            quantity: quantityToAdd,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error("Add to cart API error:", res.status, res.statusText, errorData);
        throw new Error(
          `Failed to add to cart: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      const addItemData = await res.json();
      console.log("Add to cart response:", addItemData);
      console.log("Response items:", addItemData.items);

      if (addItemData.items && Array.isArray(addItemData.items)) {
        set({
          items: addItemData.items || [],
          itemsCount: addItemData.items_count || addItemData.items?.length || 0,
          totals: addItemData.totals || null,
          loading: false,
        });
      } else {
        await get().fetchCart();
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      set({ loading: false });
      throw error;
    }
  },

  updateCartItem: async (key: string, quantity: number) => {
    if (!key || quantity < 1) {
      console.error("Cannot update cart item: key and quantity (>=1) are required");
      return;
    }

    set({ loading: true });

    try {
      const res = await fetch(
        `${WORDPRESS_URL}/wp-json/wc/store/v1/cart/update-item`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key,
            quantity,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `Failed to update cart item: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      const updateData = await res.json();
      if (updateData.items && Array.isArray(updateData.items)) {
        set({
          items: updateData.items || [],
          itemsCount: updateData.items_count || updateData.items?.length || 0,
          totals: updateData.totals || null,
          loading: false,
        });
      } else {
        await get().fetchCart();
      }
    } catch (error) {
      console.error("Error updating cart item:", error);
      set({ loading: false });
      throw error;
    }
  },

  removeCartItem: async (key: string) => {
    if (!key) {
      console.error("Cannot remove cart item: key is required");
      return;
    }

    set({ loading: true });

    try {
      const res = await fetch(
        `${WORDPRESS_URL}/wp-json/wc/store/v1/cart/remove-item`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `Failed to remove cart item: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      const removeData = await res.json();
      if (removeData.items && Array.isArray(removeData.items)) {
        set({
          items: removeData.items || [],
          itemsCount: removeData.items_count || removeData.items?.length || 0,
          totals: removeData.totals || null,
          loading: false,
        });
      } else {
        await get().fetchCart();
      }
    } catch (error) {
      console.error("Error removing cart item:", error);
      set({ loading: false });
      throw error;
    }
  },
}));

