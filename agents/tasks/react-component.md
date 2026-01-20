# React Component

## Assumptions

- Next.js App Router
- Server Components by default
- CSS Modules for styling
- Modern CSS before JS solutions

## Before Writing Code

1. **Server or Client?**
   - Default to Server Component (no directive)
   - Only add `'use client'` if component needs: hooks, event handlers, browser APIs
   - If only children need interactivity, keep parent as Server Component

2. **Check if JS is needed at all**
   - Modal? → `<dialog>`
   - Accordion? → `<details>`
   - Dropdown/tooltip? → Popover API
   - Responsive layout? → Container queries
   - Parent-aware styling? → `:has()`
   - Scroll animation? → Scroll-driven animations

## Steps

1. Create component directory
2. Write `.tsx` file with typed props
3. Write `.module.css` file
4. Create `index.ts` export
5. Import and use

## Files Involved

```
src/components/{Domain}/{Name}/
├── {Name}.tsx
├── {Name}.module.css
└── index.ts
```

## Component Template

```tsx
import styles from './ComponentName.module.css';

type ComponentNameProps = {
  title: string;
  children?: React.ReactNode;
};

export function ComponentName({ title, children }: ComponentNameProps) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{title}</h2>
      {children}
    </div>
  );
}
```

## CSS Module Template

```css
.container {
  /* Use logical properties */
  padding-block: var(--spacing-md);
  padding-inline: var(--spacing-lg);
}

/* Use native nesting */
.title {
  margin-block-end: var(--spacing-sm);
}

/* Use container queries for responsive */
@container (min-width: 400px) {
  .container {
    display: grid;
  }
}

/* Use :has() for parent-aware styling */
.container:has(.image) {
  grid-template-columns: auto 1fr;
}
```

## Component Rules

- Max 200 lines per component
- Max 50 lines per function
- No inline styles except dynamic values
- Descriptive names: `ProductCard`, not `Card`

## useEffect Rules

Before adding `useEffect`, ask:

1. Data fetching? → Server Component or React Query
2. Subscriptions? → OK, cleanup properly
3. DOM measurement? → Use CSS
4. Derived state? → `useMemo` or compute during render
5. Syncing with props? → Remove it

## useEffectEvent

When an effect needs current values but shouldn't re-run when they change:

```tsx
const onMessage = useEffectEvent((msg) => {
  console.log('Message for', user.name); // Always current
});

useEffect(() => {
  const connection = createConnection();
  connection.on('message', onMessage);
  return () => connection.disconnect();
}, []); // No dependency on user.name
```

- Effect runs once, event handler always sees latest state
- Solves the "dependency array vs stale closure" tradeoff
- Replaces many `useCallback` + dependency hacks

## Gotchas

- Don't use `forwardRef` — React 19 treats `ref` as normal prop
- Don't use `ResizeObserver` for layout — use container queries
- Don't use scroll listeners for animation — use scroll-driven animations
- Don't create custom modals — use `<dialog>`
- Don't create custom accordions — use `<details>`
- Cleanup event listeners with AbortController
