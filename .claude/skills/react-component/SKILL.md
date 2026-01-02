---
name: react-component
description: Use when creating or modifying React components. Enforces modern patterns including CSS-first solutions, Server Component defaults, and proper useEffect usage.
---

## Before Writing Code

1. **Server or Client?**

   - Default to Server Component (no directive)
   - Only add `'use client'` if component needs: hooks, event handlers, browser APIs
   - If only children need interactivity, keep parent as Server Component

2. **Check if JS is needed at all**
   - Modal? → Use `<dialog>`
   - Accordion? → Use `<details>`
   - Dropdown/tooltip? → Use Popover API
   - Responsive layout? → Use CSS Container Queries
   - Parent-aware styling? → Use `:has()`
   - Scroll animation? → Use CSS scroll-driven animations

## Component Rules

- Max 200 lines per component
- Max 50 lines per function
- Colocate: `ComponentName.tsx`, `ComponentName.module.css`, `index.ts`
- No inline styles except dynamic values from props/data

## useEffect Checklist

Before adding `useEffect`, ask:

1. Is this for data fetching? → Use Server Component or React Query
2. Is this for subscriptions/external APIs? → OK, but cleanup properly
3. Is this for DOM measurement? → Probably wrong, use CSS
4. Is this for derived state? → Use `useMemo` or compute during render
5. Is this for syncing with props? → Remove it, you don't need it

**useEffect is for synchronizing with external systems, not for UI logic.**

## Cleanup Patterns (When Effects Are Needed)

When `useEffect` is justified (external subscriptions, WebSockets, etc.):

### Event listeners

```js
useEffect(() => {
  const controller = new AbortController();
  window.addEventListener("resize", handleResize, {
    signal: controller.signal,
  });
  return () => controller.abort();
}, []);
```

### Closures over large data

Don't close over large objects—extract only the properties you need, so the original can be GC'd.

### Module-level caches

- Use `WeakMap` for object-keyed caches (auto-releases)
- Use bounded LRU for string-keyed caches
- Clear on route change if navigation-scoped

### Store subscriptions

- Always return unsubscribe: `return store.subscribe(...)`
- Prefer `useSyncExternalStore` over manual subscriptions
- Zustand/Redux hooks handle this—only manual `.subscribe()` leaks

## CSS Module Patterns

```css
/* Use logical properties */
margin-block: var(--spacing-md);
padding-inline: var(--spacing-lg);

/* Use container queries for responsive */
@container (min-width: 400px) {
}

/* Use :has() for parent-aware styling */
.card:has(.image) {
}

/* Use native nesting */
.component {
  & .child {
  }
  &:hover {
  }
}
```

## Anti-Patterns to Reject

- `ResizeObserver` for layout → container queries
- `scroll` event listeners → scroll-driven animations
- `useEffect` + `getBoundingClientRect` → CSS handles layout
- JS accordion/tabs → `<details>` or URL state
- Manual focus trapping → `<dialog>`
- Class toggling for themes → `light-dark()`
- Manual `removeEventListener` cleanup → `{ signal }` option with AbortController
