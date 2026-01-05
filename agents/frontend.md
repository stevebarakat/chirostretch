# Frontend Constraints

## Stack

- **Framework:** Next.js App Router
- **Language:** TypeScript (strict mode)
- **Styling:** CSS Modules
- **State:** Zustand for cart presentation

## TypeScript

- Prefer `type` over `interface`
- Use function declarations for top-level functions
- Avoid `any`; use `unknown` if necessary
- Use GraphQL Codegen types for all API data

## React

- **Server Components by default**
- Add `'use client'` only when using: hooks, event handlers, browser APIs
- If only children need interactivity, keep parent as Server Component

## Component Rules

- Max 200 lines per component
- Max 50 lines per function
- Colocate: `ComponentName.tsx`, `ComponentName.module.css`, `index.ts`
- Export via `index.ts`
- Descriptive names: `ProductCard`, not `Card`

## useEffect Checklist

Before adding `useEffect`, ask:

1. Data fetching? → Use Server Component or React Query
2. Subscriptions/external APIs? → OK, but cleanup properly
3. DOM measurement? → Probably wrong, use CSS
4. Derived state? → Use `useMemo` or compute during render
5. Syncing with props? → Remove it, you don't need it

**useEffect is for synchronizing with external systems, not for UI logic.**

## Refs (React 19)

- Do NOT use `React.forwardRef`
- React 19 treats `ref` as a normal prop
- Accept `ref` directly in component props
- Use `useImperativeHandle` only when unavoidable

```tsx
function Input({ ref, ...props }: ComponentProps<'input'> & { ref?: Ref<HTMLInputElement> }) {
  return <input ref={ref} {...props} />
}
```

## Native UI First

Check if native HTML can solve it before writing JS:

| Task | Native Solution |
|------|-----------------|
| Modal | `<dialog>` |
| Accordion | `<details>` |
| Dropdown/tooltip | Popover API |
| Responsive layout | Container queries |
| Parent-aware styling | `:has()` |
| Scroll animation | Scroll-driven animations |

## Forbidden JS Patterns

- `ResizeObserver` for layout → container queries
- `getBoundingClientRect` for layout → CSS handles this
- `scroll` event listeners for animation → scroll-driven animations
- Manual focus trapping → `<dialog>`
- JS-driven accordions/modals/tabs → native HTML
- Theme toggling only via JS → `light-dark()`
- Pure class or style toggling → CSS

## Allowed JS Intent

- Data fetching and mutations (GraphQL, webhooks)
- Application state (cart, optimistic updates)
- Form submission, validation, error handling
- URL state (filters, pagination, tabs)
- Progressive enhancement of native HTML
- Non-visual business logic (pricing, permissions)
- Third-party integrations (isolated, lazy-loaded)

## Polymorphism Rule

The `as` prop answers "What kind of element is this?" — not "How should it behave?"

- Constrain to semantically equivalent elements
- `type`, `variant`, `size` are props, not polymorphic axis
- Avoid unconstrained `as?: React.ElementType`

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (site)/
│   │   ├── (marketing)/   # CMS pages, promos
│   │   ├── (commerce)/    # Shop, cart (NOT checkout)
│   │   └── (content)/     # Blog, articles
│   └── api/
├── components/
│   ├── UI/                # Design system
│   ├── CMS/               # Block renderers
│   └── [Domain]/          # Feature components
├── lib/                   # By responsibility, not vendor
│   ├── search/            # Algolia
│   ├── commerce/          # WooCommerce cart
│   ├── cms/               # WordPress
│   └── graphql/           # Queries and client
├── stores/                # Zustand
└── hooks/
```

## Route Groups

- **(marketing):** CMS-driven pages, flexible layouts
- **(commerce):** Shop, cart — browsing only, checkout redirects to WooCommerce
- **(content):** Blog, articles — SEO-heavy long-form content

## Cleanup Patterns

When effects are justified (external subscriptions):

```js
// Event listeners with AbortController
useEffect(() => {
  const controller = new AbortController();
  window.addEventListener("resize", handleResize, { signal: controller.signal });
  return () => controller.abort();
}, []);
```

- Don't close over large objects — extract only what you need
- Use `WeakMap` for object-keyed caches
- Always return unsubscribe from store subscriptions
- Prefer `useSyncExternalStore` over manual subscriptions
