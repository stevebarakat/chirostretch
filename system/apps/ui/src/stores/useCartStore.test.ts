import { describe, it, expect, vi, beforeEach } from "vitest";
import { useCartStore } from "./useCartStore";

// Suppress console.error in tests
beforeEach(() => {
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("useCartStore", () => {
  beforeEach(() => {
    // Reset the store state before each test
    useCartStore.setState({
      items: [],
      itemsCount: 0,
      totals: null,
      loading: false,
      error: null,
      isHydrated: false,
    });
    // Clear localStorage using the real localStorage from happy-dom
    localStorage.clear();
    vi.clearAllMocks();
  });

  describe("initial state", () => {
    it("starts with empty cart", () => {
      const state = useCartStore.getState();

      expect(state.items).toEqual([]);
      expect(state.itemsCount).toBe(0);
      expect(state.totals).toBe(null);
      expect(state.loading).toBe(false);
      expect(state.error).toBe(null);
      expect(state.isHydrated).toBe(false);
    });
  });

  describe("hydrateFromLocalStorage", () => {
    it("hydrates from empty localStorage", () => {
      useCartStore.getState().hydrateFromLocalStorage();

      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.isHydrated).toBe(true);
    });

    it("hydrates cart from localStorage", () => {
      const storedItems = [
        {
          key: "cart-123-1234567890",
          id: 123,
          product_id: 123,
          quantity: 2,
          name: "Test Product",
          prices: { price: "29.99" },
        },
      ];
      localStorage.setItem("chirostretch-cart", JSON.stringify(storedItems));

      useCartStore.getState().hydrateFromLocalStorage();

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].name).toBe("Test Product");
      expect(state.itemsCount).toBe(2);
      expect(state.isHydrated).toBe(true);
    });

    it("calculates totals on hydration", () => {
      const storedItems = [
        {
          key: "cart-1-1",
          id: 1,
          product_id: 1,
          quantity: 2,
          name: "Product 1",
          prices: { price: "10.00" },
        },
        {
          key: "cart-2-2",
          id: 2,
          product_id: 2,
          quantity: 1,
          name: "Product 2",
          prices: { price: "25.00" },
        },
      ];
      localStorage.setItem("chirostretch-cart", JSON.stringify(storedItems));

      useCartStore.getState().hydrateFromLocalStorage();

      const state = useCartStore.getState();
      expect(state.itemsCount).toBe(3); // 2 + 1
      expect(state.totals?.total_items).toBe("3");
      // Total: (10 * 2) + (25 * 1) = 45.00
      expect(state.totals?.total_price).toBe("45.00");
    });

    it("handles malformed localStorage data gracefully", () => {
      localStorage.setItem("chirostretch-cart", "not valid json");

      useCartStore.getState().hydrateFromLocalStorage();

      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.isHydrated).toBe(true);
    });
  });

  describe("addToCart", () => {
    it("adds new item to cart", async () => {
      await useCartStore.getState().addToCart(123, 1, {
        name: "New Product",
        prices: { price: "19.99" },
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product_id).toBe(123);
      expect(state.items[0].name).toBe("New Product");
      expect(state.items[0].quantity).toBe(1);
      expect(state.itemsCount).toBe(1);
    });

    it("updates quantity for existing product", async () => {
      // Add first item
      await useCartStore.getState().addToCart(123, 1, {
        name: "Product",
        prices: { price: "10.00" },
      });

      // Add same product again
      await useCartStore.getState().addToCart(123, 2, {
        name: "Product",
        prices: { price: "10.00" },
      });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].quantity).toBe(3); // 1 + 2
      expect(state.itemsCount).toBe(3);
    });

    it("saves to localStorage after adding", async () => {
      await useCartStore.getState().addToCart(123, 1, {
        name: "Product",
        prices: { price: "10.00" },
      });

      const savedData = localStorage.getItem("chirostretch-cart");
      expect(savedData).not.toBeNull();

      const parsedData = JSON.parse(savedData!);
      expect(parsedData).toHaveLength(1);
      expect(parsedData[0].product_id).toBe(123);
    });

    it("sets loading state during operation", async () => {
      const addPromise = useCartStore.getState().addToCart(123, 1, {
        name: "Product",
        prices: { price: "10.00" },
      });

      // After promise resolves, loading should be false
      await addPromise;

      const state = useCartStore.getState();
      expect(state.loading).toBe(false);
    });

    it("rejects invalid productId", async () => {
      await useCartStore.getState().addToCart(0, 1, { name: "Test" });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(console.error).toHaveBeenCalled();
    });

    it("rejects invalid quantity", async () => {
      await useCartStore.getState().addToCart(123, 0, { name: "Test" });

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(0);
      expect(console.error).toHaveBeenCalled();
    });

    it("uses default product name when not provided", async () => {
      await useCartStore.getState().addToCart(456, 1);

      const state = useCartStore.getState();
      expect(state.items[0].name).toBe("Product 456");
    });
  });

  describe("updateCartItem", () => {
    beforeEach(async () => {
      // Add an item first
      await useCartStore.getState().addToCart(123, 2, {
        name: "Test Product",
        prices: { price: "15.00" },
      });
    });

    it("updates item quantity", async () => {
      const itemKey = useCartStore.getState().items[0].key;

      await useCartStore.getState().updateCartItem(itemKey, 5);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(5);
      expect(state.itemsCount).toBe(5);
    });

    it("recalculates totals after update", async () => {
      const itemKey = useCartStore.getState().items[0].key;

      await useCartStore.getState().updateCartItem(itemKey, 3);

      const state = useCartStore.getState();
      // 15.00 * 3 = 45.00
      expect(state.totals?.total_price).toBe("45.00");
    });

    it("saves to localStorage after update", async () => {
      const itemKey = useCartStore.getState().items[0].key;

      await useCartStore.getState().updateCartItem(itemKey, 10);

      const savedData = localStorage.getItem("chirostretch-cart");
      expect(savedData).not.toBeNull();
      const parsedData = JSON.parse(savedData!);
      expect(parsedData[0].quantity).toBe(10);
    });

    it("rejects empty key", async () => {
      await useCartStore.getState().updateCartItem("", 5);

      expect(console.error).toHaveBeenCalled();
    });

    it("rejects quantity less than 1", async () => {
      const itemKey = useCartStore.getState().items[0].key;

      await useCartStore.getState().updateCartItem(itemKey, 0);

      const state = useCartStore.getState();
      expect(state.items[0].quantity).toBe(2); // Unchanged
      expect(console.error).toHaveBeenCalled();
    });
  });

  describe("removeCartItem", () => {
    beforeEach(async () => {
      await useCartStore.getState().addToCart(123, 2, {
        name: "Product 1",
        prices: { price: "10.00" },
      });
      await useCartStore.getState().addToCart(456, 1, {
        name: "Product 2",
        prices: { price: "20.00" },
      });
    });

    it("removes item from cart", async () => {
      const items = useCartStore.getState().items;
      const itemToRemove = items[0].key;

      await useCartStore.getState().removeCartItem(itemToRemove);

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.items[0].product_id).toBe(456);
    });

    it("updates totals after removal", async () => {
      const items = useCartStore.getState().items;
      const itemToRemove = items[0].key; // Remove Product 1

      await useCartStore.getState().removeCartItem(itemToRemove);

      const state = useCartStore.getState();
      expect(state.itemsCount).toBe(1);
      expect(state.totals?.total_price).toBe("20.00");
    });

    it("saves to localStorage after removal", async () => {
      const itemKey = useCartStore.getState().items[0].key;

      await useCartStore.getState().removeCartItem(itemKey);

      const savedData = localStorage.getItem("chirostretch-cart");
      expect(savedData).not.toBeNull();
      const parsedData = JSON.parse(savedData!);
      expect(parsedData).toHaveLength(1);
    });

    it("rejects empty key", async () => {
      await useCartStore.getState().removeCartItem("");

      expect(console.error).toHaveBeenCalled();
      expect(useCartStore.getState().items).toHaveLength(2); // Unchanged
    });

    it("handles non-existent key gracefully", async () => {
      await useCartStore.getState().removeCartItem("non-existent-key");

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(2); // Unchanged
      expect(state.error).toBe(null);
    });
  });

  describe("clearCart", () => {
    beforeEach(async () => {
      await useCartStore.getState().addToCart(123, 2, {
        name: "Product",
        prices: { price: "10.00" },
      });
    });

    it("clears all items", () => {
      useCartStore.getState().clearCart();

      const state = useCartStore.getState();
      expect(state.items).toEqual([]);
      expect(state.itemsCount).toBe(0);
      expect(state.totals).toBe(null);
    });

    it("saves empty cart to localStorage", () => {
      useCartStore.getState().clearCart();

      const savedData = localStorage.getItem("chirostretch-cart");
      expect(savedData).toBe("[]");
    });

    it("clears error state", () => {
      useCartStore.setState({ error: "Previous error" });

      useCartStore.getState().clearCart();

      expect(useCartStore.getState().error).toBe(null);
    });
  });

  describe("fetchCart", () => {
    it("reloads cart from localStorage", async () => {
      // Set up localStorage with items
      const storedItems = [
        {
          key: "cart-1-1",
          id: 1,
          product_id: 1,
          quantity: 3,
          name: "Product",
          prices: { price: "10.00" },
        },
      ];
      localStorage.setItem("chirostretch-cart", JSON.stringify(storedItems));

      await useCartStore.getState().fetchCart();

      const state = useCartStore.getState();
      expect(state.items).toHaveLength(1);
      expect(state.itemsCount).toBe(3);
    });
  });

  describe("totals calculation", () => {
    it("calculates correct total for multiple items", async () => {
      await useCartStore.getState().addToCart(1, 2, {
        name: "Product A",
        prices: { price: "10.00" },
      });
      await useCartStore.getState().addToCart(2, 3, {
        name: "Product B",
        prices: { price: "15.00" },
      });

      const state = useCartStore.getState();
      // (10 * 2) + (15 * 3) = 20 + 45 = 65
      expect(state.totals?.total_price).toBe("65.00");
      expect(state.totals?.total_items).toBe("5");
    });

    it("handles prices with currency symbols", async () => {
      await useCartStore.getState().addToCart(1, 1, {
        name: "Product",
        prices: { price: "$25.99" },
      });

      const state = useCartStore.getState();
      expect(state.totals?.total_price).toBe("25.99");
    });

    it("uses line_total when prices.price is not available", async () => {
      // When adding to cart, if no prices provided, default is { price: "0" }
      // So line_total fallback is used when prices.price is empty/falsy
      await useCartStore.getState().addToCart(1, 1, {
        name: "Product",
        prices: { price: "" }, // Empty price to trigger fallback
        totals: { line_total: "30.00" },
      });

      const state = useCartStore.getState();
      expect(state.totals?.total_price).toBe("30.00");
    });

    it("initializes other totals fields", async () => {
      await useCartStore.getState().addToCart(1, 1, {
        name: "Product",
        prices: { price: "10.00" },
      });

      const state = useCartStore.getState();
      expect(state.totals?.total_items_tax).toBe("0");
      expect(state.totals?.total_fees).toBe("0");
      expect(state.totals?.total_discount).toBe("0");
      expect(state.totals?.total_shipping).toBe(null);
      expect(state.totals?.total_tax).toBe("0");
    });
  });
});
