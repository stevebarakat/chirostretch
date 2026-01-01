---
name: web-dev
description: Web development with Next.js, React, and TypeScript. Use for building components, pages, layouts, and UI features. Covers responsive navigation, modals, dark mode, interactive elements, and any frontend development task. Emphasizes modern CSS solutions over JavaScript.
---

# Web Development

## Stack

- **Framework**: Next.js (App Router, Server Components by default)
- **Language**: TypeScript with `type` aliases for props
- **Styling**: CSS Modules, mobile-first, modern CSS before JS
- **Components**: Functional with hooks

## Component Structure

```
ComponentName/
├── index.tsx
└── styles.module.css
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

## CSS-First Decision Tree

Before reaching for JavaScript, check if modern CSS can solve it:

| Task | CSS Solution |
|------|-------------|
| Responsive component sizing | Container queries (`@container`) |
| Style based on child/sibling state | `:has()` selector |
| Tooltips, popovers, dropdowns | Anchor positioning + `popover` |
| Page/state transitions | View Transitions API |
| Scroll-linked animations | `animation-timeline: scroll()` |
| Animate to/from `display: none` | `@starting-style` + `allow-discrete` |
| Dark mode | `prefers-color-scheme` + CSS custom properties |
| Show/hide content | `<details>` element |

Only use JS when CSS cannot achieve the behavior (complex state, data fetching, event handling beyond `:hover/:focus`).

## Server vs Client Components

Default to Server Components. Add `'use client'` only when using:
- `useState`, `useEffect`, `useContext`
- Browser APIs (`window`, `localStorage`)
- Event handlers (`onClick`, `onChange`)

## Modern CSS Reference

For detailed patterns and examples of container queries, `:has()`, anchor positioning, view transitions, and scroll-driven animations, see [references/modern-css-patterns.md](references/modern-css-patterns.md).
