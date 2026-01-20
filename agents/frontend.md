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

## Component Patterns

See [agents/tasks/react-component.md](tasks/react-component.md) for:
- Component structure and file organization
- Max lines rules (200/component, 50/function)
- useEffect checklist and gotchas

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

## CSS-First Patterns

See [agents/css.md](css.md) for:
- Native UI primitives (`<dialog>`, `<details>`, Popover API)
- CSS solutions for common JS patterns
- Anti-patterns to avoid

## Allowed JS Intent

- Data fetching and mutations (GraphQL, webhooks)
- Application state (cart, optimistic updates)
- Form submission, validation, error handling
- URL state (filters, pagination, tabs)
- Progressive enhancement of native HTML
- Non-visual business logic (pricing, permissions)
- Third-party integrations (isolated, lazy-loaded)

## Form Handling Patterns

**Checkout/Account Forms:**
- Use controlled components with local state
- Validate on submit, not on change (better UX)
- Clear error messages with specific field context
- Loading states during async operations
- Success states with auto-redirect

**Example: Checkout Form**
```typescript
const [billing, setBilling] = useState<BillingInfo>({ /* ... */ });
const [loading, setLoading] = useState(false);
const [error, setError] = useState<string | null>(null);

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Submit to API
    const response = await fetch('/api/checkout/create-order', {
      method: 'POST',
      body: JSON.stringify({ billing, line_items }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to create order');
    }

    const data = await response.json();

    // Clear cart immediately after order creation
    clearCart();

    // Redirect to WordPress for payment
    window.location.href = data.payment_url;
  } catch (err) {
    setError(err instanceof Error ? err.message : 'An error occurred');
    setLoading(false);
  }
};
```

**Key Patterns:**
- Collect data → Submit to API → Clear local state → Redirect
- Error handling with user-friendly messages
- Loading states prevent double-submission
- Success actions (clear cart, redirect) happen immediately

**Form Libraries:**
- Simple forms: Controlled components with `useState`
- Complex forms: `react-hook-form` with `zod` validation
- Avoid: Form libraries that manage server state (use Server Actions or API routes)

See [agents/tasks/checkout-flow.md](tasks/checkout-flow.md#2-checkout-form-nextjs) for complete implementation.

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

## Proxy (Next.js 16+)

`src/proxy.ts` is Next.js 16's replacement for middleware.

**Key points:**
- Automatically detected at `src/proxy.ts` (or project root)
- Export function named `proxy` (not `middleware`)
- Sets `x-pathname` header for Server Components
- Used in `app/layout.tsx` for conditional cart fetching

Do not delete this file — it's required infrastructure, not dead code.

See: [Next.js Proxy docs](https://nextjs.org/docs/app/getting-started/proxy)

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
