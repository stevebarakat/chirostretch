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

## Local Development

- Next.js dev server: `https://localhost:3000` (HTTPS, not HTTP)
- Always use `--insecure` flag with curl for local HTTPS

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

### CSS (Modern CSS First – 2025)

CSS is a first-class system. Prefer native browser features over JavaScript or preprocessors.

**Baseline rules**

- CSS Modules for component scoping (no Tailwind)
- HSL color space
- No `100vh`—use `60vh` for heroes
- Animate only `transform` and `opacity`

**Actively encourage modern CSS features**

Use these _by default_ when applicable:

- **Container Queries** (`@container`) for responsive components instead of viewport media queries
- **CSS Subgrid** for nested layouts that must align with parent grids
- **Native Nesting** (`&`) instead of Sass
- **Cascade Layers** (`@layer`) for predictable global style ordering
- **`:has()` selector** for parent-aware styling instead of JS DOM queries
- **Logical Properties** (`margin-inline`, `padding-block`) instead of left/right/top/bottom
- **Scroll-driven animations** (`scroll-timeline`, `animation-timeline`) instead of JS scroll listeners
- **`light-dark()`**, `color-mix()`, and relative color syntax for theme-aware color systems
- **`@property`** for animatable, type-safe custom properties
- **`content-visibility: auto`** for large, below-the-fold sections
- **`accent-color`** for branding native form controls
- **`backdrop-filter`** for glass effects (avoid JS blur hacks)

**Typography & layout niceties**

- Use `text-wrap: balance` or `pretty` for headings
- Prefer `align-content: center` on blocks for vertical centering before reaching for Flex/Grid

**Scoped styles**

- CSS Modules are the default scoping mechanism
- `@scope` is optional and only appropriate for styling unowned markup (MDX, CMS content)

### Components

- Max 200 lines per component
- Max 50 lines per function
- Descriptive names: `ProductCard`, not `Card`
- Colocate related files (component, styles, hooks, types)
- Export via `index.ts`

## Native UI & Accessibility (Prefer HTML over JS)

Prefer built-in platform primitives before introducing JavaScript abstractions:

- **`<dialog>`** for modals (focus trapping, escape handling, accessibility)
- **Popover API** (`popover` attribute) for menus, tooltips, dropdowns
- **`<details>` + `name`** for exclusive accordions
- **`:focus-visible`** for keyboard-only focus styling

JavaScript may _open or close_ these primitives, but must not reimplement their behavior.

## JavaScript You Don’t Need Anymore (2025)

Avoid writing JS for problems now solved natively:

- Scroll position listeners → use scroll-driven animations
- Parent-state styling → use `:has()`
- Theme toggling CSS variables → use `light-dark()` where possible
- Manual focus trapping → use `<dialog>`
- Resize observers for layout → use container queries
- JS-powered accordions → use `<details>`
- Color math utilities → use `color-mix()` / relative color syntax

JavaScript is for **state, data, and intent** — not layout, appearance, or geometry.

---

## Before Adding JavaScript: A Mandatory Checklist

Before introducing new client-side JavaScript for UI behavior, verify that the problem cannot be solved with native platform features.

Ask, in this order:

1. **Is this a layout or styling problem?**
   → Use CSS Grid, Subgrid, Container Queries, logical properties, or `:has()`.

2. **Is this a visibility or disclosure problem?**
   → Use `<details>`, Popover API, or `<dialog>`.

3. **Is this an animation tied to scroll or state?**
   → Use scroll-driven animations or CSS transitions before JS timelines.

4. **Is this about focus, keyboard, or accessibility?**
   → Prefer native semantics (`<button>`, `<dialog>`, `:focus-visible`) over custom handlers.

5. **Is JavaScript only being used to toggle classes or inline styles?**
   → Stop. Re-evaluate with modern CSS.

JavaScript should express **intent** (open, close, submit, select), not **mechanics** (measure, calculate, reposition).

## Common 2025 Anti‑Patterns (Avoid These)

The following patterns indicate outdated assumptions and should trigger refactoring:

- `ResizeObserver` used solely for responsive layout → use **container queries**
- `scroll` event listeners for animations → use **scroll-driven animations**
- `useEffect` measuring DOM sizes (`getBoundingClientRect`) → layout belongs in CSS
- JS-driven accordions or tabs → use **`<details>`** or URL state
- Manual focus traps → use **`<dialog>`**
- Theme toggles implemented only via JS variables → use **`light-dark()`** where possible
- Color utility functions in JS → use **`color-mix()`** or relative color syntax
- Parent/child state coordination via JS → use **`:has()`**

If a feature works with JS disabled (or minimal JS), it is probably designed correctly.

---

## JavaScript Is Allowed When (Explicit Whitelist)

JavaScript is appropriate — and encouraged — when it is used to express **application intent**, not UI mechanics.

Allowed use cases:

- **Data fetching and mutations**

  - GraphQL queries and mutations
  - Webhook handling, revalidation, cache invalidation

- **Application state**

  - Auth state, cart state, user session
  - Optimistic updates, async transitions

- **Form handling**

  - Validation logic that cannot be expressed declaratively
  - Submission state, error handling, success flows

- **Navigation & URL state**

  - Search params, pagination, filters, tabs
  - Shareable, bookmarkable UI state

- **Progressive enhancement**

  - Enhancing native HTML (opening `<dialog>`, toggling popovers)
  - Never replacing native semantics

- **Non-visual business logic**

  - Pricing rules, availability checks
  - Permission gating, feature flags

- **Third-party integrations**

  - Analytics, payments, maps, embeds
  - Isolated behind adapters and loaded lazily

If JavaScript exists primarily to:

- measure
- calculate layout
- synchronize DOM state
- toggle visual classes

…it is probably doing the wrong job.

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

CPTs: `events`, `registrations`, `locations`, `staff`

**Separation of concerns:**

- **MU-plugin** = CPT registration (schema: slug, rewrite rules, GraphQL exposure)
- **ACF** = fields (editorial structure: content, images, toggles)

**The rule:** If deleting an ACF field group would break production logic, fields belong in PHP.

**Editorial CPTs (MU-plugin + ACF):**

- `locations`, `events`, `staff` — content evolves, fields iterate

**System CPTs (full MU-plugin, fields in PHP):**

- `registrations` — programmatic, tied to form logic
- Any sync artifacts, logs, or computed records

### Custom Blocks

Blocks follow the same separation, with stricter stakes.

**Separation of concerns:**

- **MU-plugin** = block registration + `render_callback`
- **ACF** = block fields (editor-facing configuration)
- **Next.js** = React component mapped to block name

**The rule:** If misconfiguration breaks runtime behavior, fields belong in code. If it only affects presentation, use ACF.

**Critical headless requirement:** Blocks must be dynamic blocks.

```
Editor → ACF fields → GraphQL → Next.js → React component
```

Never:

```
Editor → serialized HTML → parse → pray
```

- Never query `innerHTML` — always query structured ACF data via GraphQL
- Blocks are data schemas, not templates

### Block Rendering Rules

The BlockRenderer follows a strict separation:

| Category | Blocks | Data Source | Renderer |
|----------|--------|-------------|----------|
| **Structured** | `core/image`, `core/columns`, `b-chart/chart`, `gravityforms/form` | `block.attributes` (JSON) | React component |
| **Rich text** | `core/paragraph`, `core/heading` | `block.innerHTML` | `parseHtml()` → React |
| **Fallback** | Unknown blocks | `block.innerHTML` | `dangerouslySetInnerHTML` |

**The rules:**

- Prose blocks (paragraph, heading) render from HTML via `parseHtml`
- UI blocks render from structured attributes
- Block HTML is never trusted as layout or behavior
- `dangerouslySetInnerHTML` is a fallback, not a pattern
- `parseHtml` converts links only — it is not an interpreter or mini-renderer

**If you need more control, the answer is: "That needs a real block."**

**Paragraph vs Stretchy (the key distinction):**

| | Paragraph Block | Stretchy Block |
|---|---|---|
| **Purpose** | Prose / content | Controlled typography |
| **Storage** | HTML | Structured attributes |
| **Question it answers** | "What is being said?" | "How should this look?" |
| **Rendering** | HTML → parseHtml → React | JSON → React |
| **Ownership** | Author | Design system |

**Use Paragraph** for body copy, blog prose, inline links/emphasis — when semantics are purely textual.

**Use Stretchy** for hero titles, section headers, callouts, UI labels — when typography conveys meaning and consistency matters more than flexibility.

The test: *"Can I point at this and say it's part of the UI, not just words?"* → Stretchy.

**Paragraph blocks are for language. Stretchy blocks are for design.**

**Red flags (architectural regressions):**

- Parsing HTML from Columns or Groups
- Rendering `block.innerHTML` for known UI blocks
- Letting chart/form blocks output WordPress markup
- Adding styling logic to `parseHtml`

### Options Pages

Same pattern, one nuance.

**Separation of concerns:**

- **MU-plugin** = options page registration (slug, menu position, GraphQL exposure)
- **ACF** = fields on the options page

**The rule:** If code breaks when an option is missing or misconfigured, define it in PHP with sensible defaults.

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
- JS-only UI libraries that duplicate native HTML/CSS behavior
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

vi.mock("@/lib/search/client", () => ({
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
