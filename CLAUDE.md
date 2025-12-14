# CLAUDE.md

Project context and conventions for Claude Code.

## Project Overview

High-performance Headless WordPress → Next.js App Router build with WooCommerce integration, Algolia search, and Gravity Forms.

## Architecture

```
WordPress (Headless)
├── WPGraphQL + Extensions (ACF, WooCommerce, Gravity Forms, JWT Auth)
├── Content: Pages, Posts, Products, Events, Locations
└── Webhooks → Next.js API routes → Algolia

Next.js (App Router)
├── Server Components (default)
├── ISR with 300s revalidation
├── CSS Modules (no Tailwind)
└── Zustand for client state
```

## Code Style

### TypeScript

- Prefer `type` over `interface`
- Prefer function declarations over arrow functions
- No comments unless logic is non-obvious

### React

- Server Components by default
- `'use client'` only when required (interactivity, hooks, browser APIs)
- One concern per `useEffect`
- `useEffect` is for external APIs, not UI logic—prefer event handlers

### CSS

- CSS Modules, not Tailwind
- HSL colors
- No `100vh`—use `60vh` for heroes
- Animate only `transform` and `opacity`

### Components

- Max 200 lines per component
- Max 50 lines per function
- Descriptive names: `ProductCard`, not `Card`
- Colocate related files (component, styles, hooks, types)
- Export via `index.ts`

## WordPress Integration

### Media

- Use WordPress `sourceUrl` directly—never normalize URLs
- Pass to `<Image>` without transformation
- Next.js handles WebP/AVIF conversion

### WooCommerce

- Backend data source only
- All rendering via Next.js
- Fetch via WPGraphQL for WooCommerce
- Never use PHP templates or theme hooks

### Custom Post Types

- `events`, `registrations`, `locations`

### Preview

- Route: `/api/preview`
- Supports drafts and revisions

## Performance Rules

### Images

- First visible image: `priority={true}` + `fetchPriority="high"`
- Below-fold images: no priority (auto lazy-load)
- Provide `width`/`height` or use `fill` + `sizes`

### Data Fetching

- Use `fetch` with `{ next: { revalidate: 300 } }`
- Avoid `cache: 'no-store'` unless required
- Minimal queries—only fetch fields you use

### Bundle

- Dynamic imports for below-fold sections
- `optimizePackageImports: ['lucide-react']`
- Remove unused imports

## Preferred Packages

**Use:**

- `radix-ui`, `zustand`, `zod`, `react-hook-form`, `date-fns`
- `postcss`, `autoprefixer`, `postcss-preset-env`
- `stylelint`, `stylelint-order`
- `lucide-react` for icons

**Avoid:**

- `tailwindcss`
- Custom image URL normalizers

## URL State

Prefer URL search params over client state for:

- Filters, sort, pagination, tabs
- Anything shareable or bookmarkable

Use `useState`/Zustand only for:

- Temporary UI state
- Form inputs before submission
- Animation states

---

## Testing Strategy

### Philosophy

Test the contract, not the plumbing. Don't test that WordPress fires hooks or Algolia saves objects—those are other people's problems.

**Test that:**

- Given a webhook payload, your code produces the correct Algolia command
- Status transitions map to correct intent (index vs delete)
- Object identity is stable (the objectID format)

### Vitest Setup

```bash
npm test          # Watch mode
npm run test:run  # Single run (CI)
```

Config: `vitest.config.ts`
Setup: `src/test/setup.ts`

### Test Categories

#### 1. Webhook Intent Mapping (most important)

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

it("indexes when action=update", async () => {
  mockFetchGraphQL.mockResolvedValueOnce({ location: {...} });
  const req = createWebhookRequest({ post_id: 123, action: "update" });
  await POST(req);
  expect(mockSaveObject).toHaveBeenCalled();
});
```

#### 2. ObjectID Stability

Prevents duplicate record bugs (like the Mission bug).

```typescript
it("uses post_id from webhook, not GraphQL databaseId", async () => {
  mockFetchGraphQL.mockResolvedValueOnce({
    location: { databaseId: 99999, ... }  // Different from post_id
  });

  const req = createWebhookRequest({ post_id: 555, action: "update" });
  await POST(req);

  // Must use post_id (555), not databaseId (99999)
  expect(mockSaveObject).toHaveBeenCalledWith(
    expect.objectContaining({
      body: expect.objectContaining({ objectID: "location_555" }),
    })
  );
});
```

#### 3. Record Builder Sanity

```typescript
it("transforms data correctly", async () => {
  mockFetchGraphQL.mockResolvedValueOnce({ location: {...} });
  await POST(req);

  expect(mockSaveObject).toHaveBeenCalledWith({
    indexName: "locations",
    body: expect.objectContaining({
      title: "Downtown SF",
      city: "San Francisco",
      type: "location",
    }),
  });
});

it("handles missing optional fields", async () => {
  // Location with no content, no image, no details
  mockFetchGraphQL.mockResolvedValueOnce({ location: { title: "Minimal" } });
  await POST(req);
  // Should not throw, should default to empty strings
});
```

### What NOT to Test

- WordPress hook execution
- Algolia ranking rules
- GraphQL schema correctness
- Exact payload schemas beyond your own fields

### Mock Pattern

```typescript
// Hoist mocks for module loading
const { mockSaveObject, mockDeleteObject, mockFetchGraphQL } = vi.hoisted(
  () => ({
    mockSaveObject: vi.fn(),
    mockDeleteObject: vi.fn(),
    mockFetchGraphQL: vi.fn(),
  })
);

vi.mock("@/lib/algolia/client", () => ({
  adminClient: {
    saveObject: mockSaveObject,
    deleteObject: mockDeleteObject,
  },
}));

vi.mock("@/lib/graphql/client", () => ({
  fetchGraphQL: mockFetchGraphQL,
}));
```

### Test Files

```
src/
├── test/
│   ├── setup.ts              # Env vars, beforeEach reset
│   ├── mocks/algolia.ts      # Reusable Algolia mocks
│   └── helpers/request.ts    # createWebhookRequest()
└── app/api/algolia/
    ├── index-locations/route.test.ts
    ├── index-products/route.test.ts
    ├── index-articles/route.test.ts
    └── index-events/route.test.ts

e2e/
└── search.spec.ts            # Playwright search sanity test
```

### Playwright E2E Tests

```bash
npm run test:e2e     # Run E2E tests (starts dev server)
npm run test:e2e:ui  # Run with Playwright UI
```

Config: `playwright.config.ts`

**Search sanity test:**

1. Visit `/locations`
2. Click search input to open modal
3. Type a query
4. Assert results appear

Catches frontend caching mistakes, wrong index names, env var regressions.

Don't test indexing E2E—it's async and flaky.

### CI

GitHub Actions runs on push/PR to `main` and `develop`:

1. Lint (`npm run lint`)
2. Unit tests (`npm run test:run`)
3. Build (`npm run build`)

See `.github/workflows/ci.yml`
