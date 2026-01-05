# Testing Strategy

## Philosophy

Test the contract, not the plumbing. Don't test that WordPress fires hooks or Algolia saves objects — those are other people's problems.

**Test that:**
- Given a webhook payload, your code produces the correct Algolia command
- Status transitions map to correct intent (index vs delete)
- Object identity is stable (the objectID format)

## Setup

```bash
npm test          # Watch mode
npm run test:run  # Single run (CI)
```

Config: `vitest.config.ts`
Setup: `src/test/setup.ts`

## Test Categories

### 1. Webhook Intent Mapping (most important)

"If WordPress sends this, do we do the right thing?"

```typescript
it("deletes when action=delete", async () => {
  const req = createWebhookRequest({ post_id: 123, action: "delete" });
  await POST(req);
  expect(mockDeleteObject).toHaveBeenCalledWith({
    indexName: "locations",
    objectID: "location_123",
  });
});
```

### 2. ObjectID Stability

Prevents duplicate record bugs.

```typescript
it("uses post_id from webhook, not GraphQL databaseId", async () => {
  mockFetchGraphQL.mockResolvedValueOnce({
    location: { databaseId: 99999, ... }
  });

  const req = createWebhookRequest({ post_id: 555, action: "update" });
  await POST(req);

  expect(mockSaveObject).toHaveBeenCalledWith(
    expect.objectContaining({
      body: expect.objectContaining({ objectID: "location_555" }),
    })
  );
});
```

### 3. Record Builder Sanity

```typescript
it("transforms data correctly", async () => {
  mockFetchGraphQL.mockResolvedValueOnce({ location: {...} });
  await POST(req);

  expect(mockSaveObject).toHaveBeenCalledWith({
    indexName: "locations",
    body: expect.objectContaining({
      title: "Downtown SF",
      city: "San Francisco",
    }),
  });
});
```

## What NOT to Test

- WordPress hook execution
- Algolia ranking rules
- GraphQL schema correctness
- Exact payload schemas beyond your own fields
- Block composition or editorial layout

## Mock Pattern

```typescript
const { mockSaveObject, mockDeleteObject, mockFetchGraphQL } = vi.hoisted(
  () => ({
    mockSaveObject: vi.fn(),
    mockDeleteObject: vi.fn(),
    mockFetchGraphQL: vi.fn(),
  })
);

vi.mock("@/lib/search/client", () => ({
  adminClient: { saveObject: mockSaveObject, deleteObject: mockDeleteObject },
}));

vi.mock("@/lib/graphql/client", () => ({
  fetchGraphQL: mockFetchGraphQL,
}));
```

## Test File Structure

```
src/
├── test/
│   ├── setup.ts
│   ├── mocks/algolia.ts
│   └── helpers/request.ts
└── app/api/algolia/
    ├── index-locations/route.test.ts
    ├── index-products/route.test.ts
    └── index-events/route.test.ts

e2e/
└── search.spec.ts
```

## E2E Tests

```bash
npm run test:e2e     # Run E2E tests
npm run test:e2e:ui  # Run with Playwright UI
```

Search sanity test: Visit `/locations` → Open search → Type query → Assert results appear.

Don't test indexing E2E — it's async and flaky.

## CI

GitHub Actions runs on push/PR:

1. Lint (`npm run lint`)
2. Unit tests (`npm run test:run`)
3. Build (`npm run build`)
