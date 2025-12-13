import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWebhookRequest } from "@/test/helpers/request";

// Hoist mock functions
const { mockSaveObject, mockDeleteObject, mockSaveObjects, mockWpQuery } = vi.hoisted(() => ({
  mockSaveObject: vi.fn(),
  mockDeleteObject: vi.fn(),
  mockSaveObjects: vi.fn(),
  mockWpQuery: vi.fn(),
}));

// Mock Algolia client
vi.mock("@/lib/algolia/client", () => ({
  adminClient: {
    saveObject: mockSaveObject,
    deleteObject: mockDeleteObject,
    saveObjects: mockSaveObjects,
  },
  searchClient: null,
  isAlgoliaConfigured: () => true,
}));

// Mock GraphQL client
vi.mock("@app/_lib/wp/graphql", () => ({
  wpQuery: mockWpQuery,
}));

import { POST } from "./route";

describe("Algolia Products Webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Webhook Authentication", () => {
    it("rejects requests with invalid webhook secret", async () => {
      const req = createWebhookRequest(
        { post_id: 123 },
        {
          webhookSecret: "wrong-secret",
          url: "http://localhost:3000/api/algolia/index-products"
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });
  });

  describe("Webhook Intent Mapping (delete vs index)", () => {
    it("calls deleteObject when action=delete", async () => {
      const req = createWebhookRequest(
        { post_id: 456, action: "delete" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-products"
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deleted).toBe(true);
      expect(mockDeleteObject).toHaveBeenCalledWith({
        indexName: "products",
        objectID: "product_456",
      });
      expect(mockSaveObject).not.toHaveBeenCalled();
    });

    it("calls saveObject when action=update", async () => {
      mockWpQuery.mockResolvedValueOnce({
        product: {
          id: "graphql-id",
          databaseId: 789,
          name: "Stretch Band",
          slug: "stretch-band",
          price: "$29.99",
          regularPrice: "$39.99",
          salePrice: "$29.99",
          stockStatus: "IN_STOCK",
        },
      });

      const req = createWebhookRequest(
        { post_id: 789, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-products"
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.indexed).toBe(true);
      expect(mockSaveObject).toHaveBeenCalledTimes(1);
      expect(mockDeleteObject).not.toHaveBeenCalled();
    });

    it("skips indexing when product not found", async () => {
      mockWpQuery.mockResolvedValueOnce({ product: null });

      const req = createWebhookRequest(
        { post_id: 999, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-products"
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.skipped).toBe(true);
      expect(data.reason).toBe("not_found");
    });
  });

  describe("ObjectID Stability", () => {
    it("uses consistent product_${post_id} format", async () => {
      const req = createWebhookRequest(
        { post_id: 42, action: "delete" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-products"
        }
      );

      await POST(req);

      expect(mockDeleteObject).toHaveBeenCalledWith(
        expect.objectContaining({
          objectID: "product_42",
        })
      );
    });

    it("objectID uses post_id from webhook, not GraphQL databaseId", async () => {
      // This catches the Mission bug pattern - where databaseId differs from post_id
      mockWpQuery.mockResolvedValueOnce({
        product: {
          id: "completely-different-id",
          databaseId: 99999, // Different from post_id
          name: "Test Product",
          slug: "test-product",
        },
      });

      const req = createWebhookRequest(
        { post_id: 123, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-products"
        }
      );

      await POST(req);

      // Should use post_id (123), not databaseId (99999)
      expect(mockSaveObject).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            objectID: "product_123",
          }),
        })
      );
    });
  });

  describe("Record Builder Sanity", () => {
    it("transforms product data correctly", async () => {
      mockWpQuery.mockResolvedValueOnce({
        product: {
          id: "graphql-id",
          databaseId: 100,
          name: "Premium Foam Roller",
          slug: "premium-foam-roller",
          price: "$49.99",
          regularPrice: "$59.99",
          salePrice: "$49.99",
          stockStatus: "IN_STOCK",
          featuredImage: {
            node: {
              sourceUrl: "https://example.com/roller.jpg",
              altText: "Foam roller product image",
            },
          },
          productCategories: {
            nodes: [
              { name: "Recovery", slug: "recovery" },
              { name: "Equipment", slug: "equipment" },
            ],
          },
          shortDescription: "<p>High-density foam roller</p>",
        },
      });

      const req = createWebhookRequest(
        { post_id: 100, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-products"
        }
      );

      await POST(req);

      expect(mockSaveObject).toHaveBeenCalledWith({
        indexName: "products",
        body: expect.objectContaining({
          objectID: "product_100",
          name: "Premium Foam Roller",
          slug: "premium-foam-roller",
          price: "$49.99",
          regularPrice: "$59.99",
          salePrice: "$49.99",
          stockStatus: "IN_STOCK",
          image: "https://example.com/roller.jpg",
          imageAlt: "Foam roller product image",
          categories: "Recovery, Equipment",
          excerpt: "High-density foam roller",
          type: "product",
        }),
      });
    });

    it("handles missing optional fields gracefully", async () => {
      mockWpQuery.mockResolvedValueOnce({
        product: {
          id: "id",
          databaseId: 200,
          name: "Simple Product",
          slug: "simple-product",
          // No price, no image, no categories
        },
      });

      const req = createWebhookRequest(
        { post_id: 200, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-products"
        }
      );

      const response = await POST(req);
      expect(response.status).toBe(200);

      expect(mockSaveObject).toHaveBeenCalledWith({
        indexName: "products",
        body: expect.objectContaining({
          objectID: "product_200",
          name: "Simple Product",
          slug: "simple-product",
          price: "",
          categories: "",
          excerpt: "",
          type: "product",
        }),
      });
    });
  });
});
