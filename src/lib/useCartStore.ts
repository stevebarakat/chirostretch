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

    const res = await fetch(`${WORDPRESS_URL}/wp-json/wc/store/v1/cart`, {
      credentials: "include",
    });

    const data = await res.json();

    set({
      items: data.items || [],
      itemsCount: data.items_count || 0,
      loading: false,
    });
  },

  addToCart: async (productId: number, quantity = 1) => {
    set({ loading: true });

    await fetch(`${WORDPRESS_URL}/wp-json/wc/store/v1/cart/add-item`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: productId,
        quantity,
      }),
    });

    await get().fetchCart();
  },
}));

