import { describe, it, expect, vi, beforeEach } from "vitest";
import { createWebhookRequest } from "@/test/helpers/request";

// Hoist mock functions so they're available before module loading
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

// Import route handler after mocks are set up
import { POST } from "./route";

describe("Algolia Locations Webhook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Webhook Authentication", () => {
    it("rejects requests with invalid webhook secret", async () => {
      const req = createWebhookRequest(
        { post_id: 123 },
        { webhookSecret: "wrong-secret" }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(401);
      expect(data.error).toBe("Unauthorized");
    });

    it("accepts requests with valid webhook secret", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        location: {
          id: "cG9zdDoxMjM=",
          databaseId: 123,
          title: "Test Location",
          slug: "test-location",
        },
      });

      const req = createWebhookRequest(
        { post_id: 123, action: "update" },
        { webhookSecret: "test-webhook-secret" }
      );

      const response = await POST(req);
      expect(response.status).toBe(200);
    });
  });

  describe("Webhook Intent Mapping (delete vs index)", () => {
    it("calls deleteObject when action=delete", async () => {
      const req = createWebhookRequest(
        { post_id: 456, action: "delete" },
        { webhookSecret: "test-webhook-secret" }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.deleted).toBe(true);
      expect(mockDeleteObject).toHaveBeenCalledTimes(1);
      expect(mockDeleteObject).toHaveBeenCalledWith({
        indexName: "locations",
        objectID: "location_456",
      });
      expect(mockSaveObject).not.toHaveBeenCalled();
    });

    it("calls saveObject when action=update", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        location: {
          id: "cG9zdDo3ODk=",
          databaseId: 789,
          title: "Union Square",
          slug: "union-square",
          content: "<p>A great location</p>",
          locationDetails: {
            city: "San Francisco",
            state: "CA",
          },
        },
      });

      const req = createWebhookRequest(
        { post_id: 789, action: "update" },
        { webhookSecret: "test-webhook-secret" }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.indexed).toBe(true);
      expect(mockSaveObject).toHaveBeenCalledTimes(1);
      expect(mockDeleteObject).not.toHaveBeenCalled();
    });

    it("calls saveObject when action=create", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        location: {
          id: "cG9zdDoxMDA=",
          databaseId: 100,
          title: "New Location",
          slug: "new-location",
        },
      });

      const req = createWebhookRequest(
        { post_id: 100, action: "create" },
        { webhookSecret: "test-webhook-secret" }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.indexed).toBe(true);
      expect(mockSaveObject).toHaveBeenCalledTimes(1);
    });

    it("skips indexing when location not found in WordPress", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({ location: null });

      const req = createWebhookRequest(
        { post_id: 999, action: "update" },
        { webhookSecret: "test-webhook-secret" }
      );

      const response = await POST(req);
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.skipped).toBe(true);
      expect(data.reason).toBe("not_found");
      expect(mockSaveObject).not.toHaveBeenCalled();
      expect(mockDeleteObject).not.toHaveBeenCalled();
    });
  });

  describe("ObjectID Stability", () => {
    it("uses consistent location_${post_id} format for delete", async () => {
      const req = createWebhookRequest(
        { post_id: 42, action: "delete" },
        { webhookSecret: "test-webhook-secret" }
      );

      await POST(req);

      expect(mockDeleteObject).toHaveBeenCalledWith(
        expect.objectContaining({
          objectID: "location_42",
        })
      );
    });

    it("uses consistent location_${post_id} format for index", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        location: {
          id: "some-graphql-id",
          databaseId: 42,
          title: "Test",
          slug: "test",
        },
      });

      const req = createWebhookRequest(
        { post_id: 42, action: "update" },
        { webhookSecret: "test-webhook-secret" }
      );

      await POST(req);

      expect(mockSaveObject).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            objectID: "location_42",
          }),
        })
      );
    });

    it("objectID is derived from post_id, not GraphQL id", async () => {
      // The GraphQL id is base64 encoded and different from post_id
      // This test ensures we use post_id for stability
      mockFetchGraphQL.mockResolvedValueOnce({
        location: {
          id: "cG9zdDoxMjM0NTY3ODk=", // Different from post_id
          databaseId: 123456789,
          title: "Mission",
          slug: "mission",
        },
      });

      const req = createWebhookRequest(
        { post_id: 555, action: "update" },
        { webhookSecret: "test-webhook-secret" }
      );

      await POST(req);

      // Should use post_id from webhook, not databaseId from GraphQL
      expect(mockSaveObject).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            objectID: "location_555",
          }),
        })
      );
    });
  });

  describe("Record Builder Sanity", () => {
    it("transforms location data correctly", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        location: {
          id: "graphql-id",
          databaseId: 123,
          title: "Downtown SF",
          slug: "downtown-sf",
          content: "<p>Visit our downtown location</p>",
          featuredImage: {
            node: {
              sourceUrl: "https://example.com/image.jpg",
              altText: "Downtown office",
            },
          },
          locationDetails: {
            city: "San Francisco",
            state: "CA",
            streetAddress: "123 Main St",
            zip: "94102",
            phone: "555-1234",
            email: "sf@example.com",
            shortDescription: "Our flagship location",
            services: ["Chiropractic", "Massage"],
          },
        },
      });

      const req = createWebhookRequest(
        { post_id: 123, action: "update" },
        { webhookSecret: "test-webhook-secret" }
      );

      await POST(req);

      expect(mockSaveObject).toHaveBeenCalledWith({
        indexName: "locations",
        body: expect.objectContaining({
          objectID: "location_123",
          title: "Downtown SF",
          slug: "downtown-sf",
          city: "San Francisco",
          state: "CA",
          streetAddress: "123 Main St",
          zip: "94102",
          phone: "555-1234",
          email: "sf@example.com",
          shortDescription: "Our flagship location",
          services: ["Chiropractic", "Massage"],
          image: "https://example.com/image.jpg",
          imageAlt: "Downtown office",
          type: "location",
        }),
      });
    });

    it("handles missing optional fields gracefully", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        location: {
          id: "id",
          databaseId: 456,
          title: "Minimal Location",
          slug: "minimal",
          // No content, no featuredImage, no locationDetails
        },
      });

      const req = createWebhookRequest(
        { post_id: 456, action: "update" },
        { webhookSecret: "test-webhook-secret" }
      );

      const response = await POST(req);
      expect(response.status).toBe(200);

      expect(mockSaveObject).toHaveBeenCalledWith({
        indexName: "locations",
        body: expect.objectContaining({
          objectID: "location_456",
          title: "Minimal Location",
          slug: "minimal",
          city: "",
          state: "",
          services: [],
          type: "location",
        }),
      });
    });

    it("strips HTML from content field", async () => {
      mockFetchGraphQL.mockResolvedValueOnce({
        location: {
          id: "id",
          databaseId: 789,
          title: "Test",
          slug: "test",
          content: "<h1>Heading</h1><p>Paragraph with <strong>bold</strong></p>",
        },
      });

      const req = createWebhookRequest(
        { post_id: 789, action: "update" },
        { webhookSecret: "test-webhook-secret" }
      );

      await POST(req);

      expect(mockSaveObject).toHaveBeenCalledWith(
        expect.objectContaining({
          body: expect.objectContaining({
            content: "HeadingParagraph with bold",
          }),
        })
      );
    });
  });
});
