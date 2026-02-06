<!-- Scope: CSS conventions, tokens, and styling rules. Do not merge content from other agent docs. -->
# CSS Philosophy

CSS is a first-class system. Prefer native browser features over JavaScript.


## Baseline Rules

- CSS Modules for component scoping (no Tailwind)
- HSL color space
- No `100vh` — use `60vh` for heroes
- Animate only `transform` and `opacity`
- No vendor prefixes — autoprefixer handles them automatically

## Tokens & Duplication Rules

Design consistency comes from **tokens**, not shared classnames.

### Token Rule (Required)

All design values must come from CSS custom properties (tokens), not hard-coded literals.

Applies to:
- color (required)
- spacing (required)
- radii (required)
- typography scale (recommended)
- shadows (recommended)
- motion (durations/easing) (recommended)
- z-index (recommended)

✅ Good
- `color: var(--color-text);`
- `padding-block: var(--space-4);`
- `border-radius: var(--radius-2);`

❌ Bad
- `color: #222;`
- `padding: 18px;`
- `border-radius: 6px;`

**Exception:** One-off values are allowed only when they are truly content-driven or browser-quirk-driven (and should be rare). Prefer adding a token.

### No Global “Component Classes”

Global CSS may define only:
- tokens (`:root` and theme scopes)
- minimal element defaults/reset
- global typography primitives (very restrained)
- cascade layers ordering

Do NOT create global reusable classes like:
- `.card`, `.button`, `.stack`, `.grid`, `.container`

Those belong in **UI primitives** or local component modules.

### Duplication Promotion Rule (3-strikes)

If the same styling pattern appears in **3+ components**, promote it to one of:

1) **A UI primitive** (preferred)
   - Example: `Card`, `Button`, `Field`, `Stack`, `Cluster`
2) **A shared utility module**
   - Example: `src/styles/utilities.module.css`
   - Use sparingly; keep utilities semantic (layout patterns), not visual theming
3) **A tokenized pattern**
   - Use custom properties to express the variation without duplicating selectors

Do not abstract on first usage. Abstract on repetition.

### Enforcement Guidance

Start enforcement with **colors** (highest drift risk). Expand to spacing/radii once the token set is stable.

## Modern CSS Features (Use by Default)

- **Container Queries** (`@container`) for responsive components
- **CSS Subgrid** for nested layouts aligned with parent grids
- **Native Nesting** (`&`) instead of Sass
- **Cascade Layers** (`@layer`) for predictable global style ordering
- **`:has()` selector** for parent-aware styling
- **Logical Properties** (`margin-inline`, `padding-block`)
- **Scroll-driven animations** instead of JS scroll listeners
- **`light-dark()`**, `color-mix()` for theme-aware colors
- **`@property`** for animatable custom properties
- **`content-visibility: auto`** for below-fold sections
- **`accent-color`** for branding form controls
- **`backdrop-filter`** for glass effects

## Typography & Layout

- Use `text-wrap: balance` or `pretty` for headings
- Prefer `align-content: center` for vertical centering before Flex/Grid

## Native UI Primitives (Prefer HTML over JS)

- **`<dialog>`** for modals
- **Popover API** for menus, tooltips, dropdowns
- **`<details>` + `name`** for exclusive accordions
- **`:focus-visible`** for keyboard-only focus styling

JavaScript may open or close these primitives, but must not reimplement their behavior.

## JavaScript You Don't Need Anymore

| Problem | CSS Solution |
|---------|--------------|
| Scroll position listeners | Scroll-driven animations |
| Parent-state styling | `:has()` |
| Theme toggling | `light-dark()` |
| Manual focus trapping | `<dialog>` |
| Resize observers for layout | Container queries |
| JS-powered accordions | `<details>` |
| Color math utilities | `color-mix()` |

## Before Adding JavaScript

Ask in this order:

1. **Layout or styling problem?** → CSS Grid, Container Queries, `:has()`
2. **Visibility or disclosure?** → `<details>`, Popover API, `<dialog>`
3. **Animation tied to scroll?** → Scroll-driven animations
4. **Focus or keyboard?** → Native semantics
5. **Only toggling classes?** → Stop. Use CSS.

JavaScript should express **intent** (open, close, submit), not **mechanics** (measure, calculate, reposition).

## Anti-Patterns (Avoid These)

- `ResizeObserver` for responsive layout → container queries
- `scroll` event listeners for animations → scroll-driven animations
- `useEffect` measuring DOM sizes → layout belongs in CSS
- JS-driven accordions or tabs → `<details>` or URL state
- Manual focus traps → `<dialog>`
- Theme toggles only via JS → `light-dark()`
- Color utility functions in JS → `color-mix()`

If a feature works with JS disabled, it is probably designed correctly.

## When JavaScript Is Allowed

- Data fetching and mutations
- Application state (cart, optimistic updates)
- Form validation and submission
- URL state (filters, pagination, tabs)
- Progressive enhancement of native HTML
- Non-visual business logic
- Third-party integrations (isolated, lazy-loaded)

If JavaScript exists primarily to measure, calculate layout, or toggle visual classes — it is doing the wrong job.
