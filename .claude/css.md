# CSS & JavaScript Philosophy (2025)

## CSS (Modern CSS First)

CSS is a first-class system. Prefer native browser features over JavaScript or preprocessors.

### Baseline Rules

- CSS Modules for component scoping (no Tailwind)
- HSL color space
- No `100vh`—use `60vh` for heroes
- Animate only `transform` and `opacity`

### Modern CSS Features (Use by Default)

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

### Typography & Layout

- Use `text-wrap: balance` or `pretty` for headings
- Prefer `align-content: center` on blocks for vertical centering before reaching for Flex/Grid

### Scoped Styles

- CSS Modules are the default scoping mechanism
- `@scope` is optional and only appropriate for styling unowned markup (MDX, CMS content)

## Native UI & Accessibility (Prefer HTML over JS)

Prefer built-in platform primitives before introducing JavaScript abstractions:

- **`<dialog>`** for modals (focus trapping, escape handling, accessibility)
- **Popover API** (`popover` attribute) for menus, tooltips, dropdowns
- **`<details>` + `name`** for exclusive accordions
- **`:focus-visible`** for keyboard-only focus styling

JavaScript may _open or close_ these primitives, but must not reimplement their behavior.

## JavaScript You Don't Need Anymore

Avoid writing JS for problems now solved natively:

- Scroll position listeners → use scroll-driven animations
- Parent-state styling → use `:has()`
- Theme toggling CSS variables → use `light-dark()` where possible
- Manual focus trapping → use `<dialog>`
- Resize observers for layout → use container queries
- JS-powered accordions → use `<details>`
- Color math utilities → use `color-mix()` / relative color syntax

JavaScript is for **state, data, and intent** — not layout, appearance, or geometry.

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

## Common 2025 Anti-Patterns (Avoid These)

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

## JavaScript Is Allowed When (Explicit Whitelist)

JavaScript is appropriate — and encouraged — when it is used to express **application intent**, not UI mechanics.

Allowed use cases:

- **Data fetching and mutations**
  - GraphQL queries and mutations
  - Webhook handling, revalidation, cache invalidation

- **Application state**
  - Cart presentation state (not auth — that's WordPress)
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

If JavaScript exists primarily to measure, calculate layout, synchronize DOM state, or toggle visual classes — it is probably doing the wrong job.
