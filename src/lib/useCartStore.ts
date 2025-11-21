import { create } from "zustand";

const WORDPRESS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ?? "http://chirostretch-copy.local";

type CartItem = {
  key: string;
  productId: number;
  quantity: number;
  name: string;
  price: string;
};

type CartState = {
  items: CartItem[];
  itemsCount: number;
  loading: boolean;
  addToCart: (productId: number, quantity?: number) => Promise<void>;
  fetchCart: () => Promise<void>;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],
  itemsCount: 0,
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

      set({
        items: data.items || [],
        itemsCount: data.items_count || 0,
        loading: false,
      });
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
      const res = await fetch(
        `${WORDPRESS_URL}/wp-json/wc/store/v1/cart/add-item`,
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: productId,
            quantity,
          }),
        }
      );

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(
          `Failed to add to cart: ${res.status} ${res.statusText} - ${JSON.stringify(errorData)}`
        );
      }

      await get().fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      set({ loading: false });
      throw error;
    }
  },
}));

