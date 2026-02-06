<!-- Scope: task runbook for general web development tasks. -->
# Web Development

## Assumptions

- Next.js App Router with Server Components
- TypeScript with strict mode
- CSS Modules, mobile-first
- Modern CSS before JS

## CSS-First Approach

See [agents/css.md](../css.md) for the CSS-first decision checklist, modern CSS features, and anti-patterns to avoid.

## Component Structure

```
ComponentName/
├── ComponentName.tsx
├── ComponentName.module.css
└── index.ts
```

## TypeScript Pattern

```tsx
type ButtonProps = {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
};

export function Button({ variant = 'primary', children }: ButtonProps) {
  return <button className={styles[variant]}>{children}</button>;
}
```

## Server vs Client

Default to Server Components. Add `'use client'` only for:
- `useState`, `useEffect`, `useContext`
- Browser APIs (`window`, `localStorage`)
- Event handlers (`onClick`, `onChange`)

## Modern CSS Patterns

### Container Queries

```css
.card {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: grid;
    grid-template-columns: auto 1fr;
  }
}
```

### Parent-Aware Styling

```css
.card:has(.image) {
  padding-left: 0;
}

.form:has(:invalid) .submit {
  opacity: 0.5;
}
```

### Scroll-Driven Animations

```css
.hero {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 40%;
}
```

### Native Nesting

```css
.component {
  padding: var(--spacing-md);

  & .title {
    font-weight: bold;
  }

  &:hover {
    background: var(--color-hover);
  }
}
```

## Gotchas

- Don't use `100vh` — use `60vh` for heroes or `dvh` units
- Don't animate properties other than `transform` and `opacity`
- Don't use Tailwind — CSS Modules only
- Don't reach for JS before checking modern CSS
- Test with JS disabled to verify CSS-first design
