import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWebhookRequest } from "@/test/helpers/request";

// Hoist mock functions
const { mockSaveObject, mockDeleteObject, mockSaveObjects, mockClearObjects, mockFetchGraphQL } = vi.hoisted(() => ({
  mockSaveObject: vi.fn(),
  mockDeleteObject: vi.fn(),
  mockSaveObjects: vi.fn(),
  mockClearObjects: vi.fn(),
  mockFetchGraphQL: vi.fn(),
}));

// Mock Algolia client
vi.mock("@/lib/search/client", () => ({
  adminClient: {
    saveObject: mockSaveObject,
    deleteObject: mockDeleteObject,
    saveObjects: mockSaveObjects,
    clearObjects: mockClearObjects,
  },
  searchClient: null,
  isAlgoliaConfigured: () => true,
}));

// Mock GraphQL client
vi.mock("@/lib/graphql/client", () => ({
  fetchGraphQL: mockFetchGraphQL,
}));

import { POST } from "./route";

describe("Algolia Events Webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Webhook Authentication", () => {
    it("rejects requests with invalid webhook secret", async () => {
      const req = createWebhookRequest(
        { post_id: 123 },
        {
          webhookSecret: "wrong-secret",
          url: "http://localhost:3000/api/algolia/index-events",
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
          url: "http://localhost:3000/api/algolia/index-events",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deleted).toBe(true);
      expect(mockDeleteObject).toHaveBeenCalledWith({
        indexName: "events",
        objectID: "event_456",
      });
      expect(mockSaveObject).not.toHaveBeenCalled();
    });

    it("calls saveObject when action=update", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        event: {
          id: "graphql-id",
          databaseId: 789,
          title: "Wellness Workshop",
          slug: "wellness-workshop",
          startDate: "2025-01-15",
          endDate: "2025-01-15",
        },
      });

      const req = createWebhookRequest(
        { post_id: 789, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-events",
        }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.indexed).toBe(true);
      expect(mockSaveObject).toHaveBeenCalledTimes(1);
      expect(mockDeleteObject).not.toHaveBeenCalled();
    });

    it("skips indexing when event not found", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({ event: null });

      const req = createWebhookRequest(
        { post_id: 999, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-events",
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
    it("uses consistent event_${post_id} format", async () => {
      const req = createWebhookRequest(
        { post_id: 42, action: "delete" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-events",
        }
      );

      await POST(req);

      expect(mockDeleteObject).toHaveBeenCalledWith(
        expect.objectContaining({
          objectID: "event_42",
        })
      );
    });

    it("objectID uses post_id from webhook, not GraphQL databaseId", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        event: {
          id: "different-id",
          databaseId: 99999,
          title: "Test Event",
          slug: "test-event",
        },
      });

      const req = createWebhookRequest(
        { post_id: 123, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-events",
        }
      );

      await POST(req);

      expect(mockSaveObject).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            objectID: "event_123",
          }),
        })
      );
    });
  });

  describe("Record Builder Sanity", () => {
    it("transforms event data correctly", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        event: {
          id: "graphql-id",
          databaseId: 100,
          title: "Annual Chiropractic Conference",
          slug: "annual-chiropractic-conference",
          content: "<p>Join us for our annual conference</p>",
          startDate: "2025-03-15",
          endDate: "2025-03-17",
          venue: {
            title: "Convention Center",
            city: "San Francisco",
            state: "CA",
          },
          featuredImage: {
            node: {
              sourceUrl: "https://example.com/conference.jpg",
              altText: "Conference hall",
            },
          },
        },
      });

      const req = createWebhookRequest(
        { post_id: 100, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-events",
        }
      );

      await POST(req);

      expect(mockSaveObject).toHaveBeenCalledWith({
        indexName: "events",
        body: expect.objectContaining({
          objectID: "event_100",
          title: "Annual Chiropractic Conference",
          slug: "annual-chiropractic-conference",
          content: "Join us for our annual conference",
          startDate: "2025-03-15",
          endDate: "2025-03-17",
          venue: "Convention Center",
          venueCity: "San Francisco",
          venueState: "CA",
          image: "https://example.com/conference.jpg",
          imageAlt: "Conference hall",
          type: "event",
        }),
      });
    });

    it("handles missing optional fields gracefully", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        event: {
          id: "id",
          databaseId: 200,
          title: "Simple Event",
          slug: "simple-event",
        },
      });

      const req = createWebhookRequest(
        { post_id: 200, action: "update" },
        {
          webhookSecret: "test-webhook-secret",
          url: "http://localhost:3000/api/algolia/index-events",
        }
      );

      const response = await POST(req);
      expect(response.status).toBe(200);

      expect(mockSaveObject).toHaveBeenCalledWith({
        indexName: "events",
        body: expect.objectContaining({
          objectID: "event_200",
          title: "Simple Event",
          slug: "simple-event",
          content: "",
          startDate: "",
          endDate: "",
          venue: "",
          venueCity: "",
          venueState: "",
          type: "event",
        }),
      });
    });
  });
});
