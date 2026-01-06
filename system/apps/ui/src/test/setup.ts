import { vi, beforeEach } from "vitest";

// Mock environment variables
process.env.NEXT_PUBLIC_ALGOLIA_APP_ID = "test-app-id";
process.env.NEXT_PUBLIC_ALGOLIA_SEARCH_KEY = "test-search-key";
process.env.ALGOLIA_ADMIN_API_KEY = "test-admin-key";
process.env.WP_WEBHOOK_SECRET = "test-webhook-secret";
process.env.GRAVITY_FORMS_WEBHOOK_SECRET = "test-franchise-webhook-secret";
process.env.NEXT_PUBLIC_ALGOLIA_INDEX_LOCATIONS = "locations";
process.env.NEXT_PUBLIC_ALGOLIA_INDEX_PRODUCTS = "products";
process.env.NEXT_PUBLIC_ALGOLIA_INDEX_ARTICLES = "articles";
process.env.NEXT_PUBLIC_ALGOLIA_INDEX_EVENTS = "events";

// Reset all mocks before each test
beforeEach(() => {
  vi.clearAllMocks();
});
