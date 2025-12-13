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

describe("Algolia Articles Webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Webhook Authentication", () => {
    it("rejects requests with invalid webhook secret", async () => {
      const req = createWebhookRequest(
        { post_id: 123 },
        {
          webhookSecret: "wrong-secret",
          url: "http://localhost:3000/api/algolia/index-articles",
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
          url: "http://localhost:3000/api/algolia/index-articles",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deleted).toBe(true);
      expect(mockDeleteObject).toHaveBeenCalledWith({
        indexName: "articles",
        objectID: "article_456",
      });
      expect(mockSaveObject).not.toHaveBeenCalled();
    });

    it("calls saveObject when action=update", async () => {
      mockWpQuery.mockResolvedValueOnce({
        post: {
          id: "graphql-id",
          databaseId: 789,
          title: "How to Stretch Properly",
          slug: "how-to-stretch-properly",
          excerpt: "<p>Learn the basics of stretching</p>",
        },
      });

      const req = createWebhookRequest(
        { post_id: 789, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-articles",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.indexed).toBe(true);
      expect(mockSaveObject).toHaveBeenCalledTimes(1);
      expect(mockDeleteObject).not.toHaveBeenCalled();
    });

    it("skips indexing when post not found", async () => {
      mockWpQuery.mockResolvedValueOnce({ post: null });

      const req = createWebhookRequest(
        { post_id: 999, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-articles",
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
    it("uses consistent article_${post_id} format", async () => {
      const req = createWebhookRequest(
        { post_id: 42, action: "delete" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-articles",
        }
      );

      await POST(req);

      expect(mockDeleteObject).toHaveBeenCalledWith(
        expect.objectContaining({
          objectID: "article_42",
        })
      );
    });

    it("objectID uses post_id from webhook, not GraphQL databaseId", async () => {
      mockWpQuery.mockResolvedValueOnce({
        post: {
          id: "different-id",
          databaseId: 99999,
          title: "Test Article",
          slug: "test-article",
        },
      });

      const req = createWebhookRequest(
        { post_id: 123, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-articles",
        }
      );

      await POST(req);

      expect(mockSaveObject).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            objectID: "article_123",
          }),
        })
      );
    });
  });

  describe("Record Builder Sanity", () => {
    it("transforms article data correctly", async () => {
      mockWpQuery.mockResolvedValueOnce({
        post: {
          id: "graphql-id",
          databaseId: 100,
          title: "5 Tips for Better Posture",
          slug: "5-tips-better-posture",
          excerpt: "<p>Improve your posture with these simple tips</p>",
          featuredImage: {
            node: {
              sourceUrl: "https://example.com/posture.jpg",
              altText: "Good posture illustration",
            },
          },
          categories: {
            nodes: [
              { name: "Health", slug: "health" },
              { name: "Wellness", slug: "wellness" },
            ],
          },
        },
      });

      const req = createWebhookRequest(
        { post_id: 100, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-articles",
        }
      );

      await POST(req);

      expect(mockSaveObject).toHaveBeenCalledWith({
        indexName: "articles",
        body: expect.objectContaining({
          objectID: "article_100",
          title: "5 Tips for Better Posture",
          slug: "5-tips-better-posture",
          excerpt: "Improve your posture with these simple tips",
          image: "https://example.com/posture.jpg",
          imageAlt: "Good posture illustration",
          categories: "Health, Wellness",
          type: "article",
        }),
      });
    });

    it("falls back to content when excerpt is missing", async () => {
      mockWpQuery.mockResolvedValueOnce({
        post: {
          id: "id",
          databaseId: 200,
          title: "Article Without Excerpt",
          slug: "no-excerpt",
          content: "<p>This is the full content of the article that will be used as excerpt</p>",
        },
      });

      const req = createWebhookRequest(
        { post_id: 200, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-articles",
        }
      );

      await POST(req);

      expect(mockSaveObject).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            excerpt: "This is the full content of the article that will be used as excerpt",
          }),
        })
      );
    });

    it("handles missing optional fields gracefully", async () => {
      mockWpQuery.mockResolvedValueOnce({
        post: {
          id: "id",
          databaseId: 300,
          title: "Minimal Article",
          slug: "minimal",
        },
      });

      const req = createWebhookRequest(
        { post_id: 300, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-articles",
        }
      );

      const response = await POST(req);
      expect(response.status).toBe(200);

      expect(mockSaveObject).toHaveBeenCalledWith({
        indexName: "articles",
        body: expect.objectContaining({
          objectID: "article_300",
          title: "Minimal Article",
          slug: "minimal",
          excerpt: "",
          categories: "",
          type: "article",
        }),
      });
    });
  });
});
