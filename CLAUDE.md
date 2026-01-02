# ChiroStretch

High-performance Headless WordPress → Next.js App Router build with WooCommerce integration, Algolia search, and Gravity Forms.

## Hybrid Architecture (Critical)

```
WooCommerce → owns commerce (orders, billing, checkout, payments)
WordPress   → owns operations (authentication, dashboards, workflows)
Next.js     → owns public presentation only (marketing, browsing, content)
```

**Guiding rule:** Next.js may initiate intent (browsing, cart). WordPress must finalize transactions (checkout, payment, orders, accounts).

See [.claude/architecture.md](.claude/architecture.md) for full boundaries and validation checklist.

## Directory Structure

```
src/
├── app/                    # Next.js App Router
│   ├── (site)/            # Public routes
│   │   ├── (marketing)/   # CMS pages, promos
│   │   ├── (commerce)/    # Shop, cart, products (NOT checkout)
│   │   └── (content)/     # Blog, articles
│   └── api/               # API routes
├── components/
│   ├── UI/                # Design system
│   ├── CMS/               # Block renderers
│   └── [Domain]/          # Feature components
├── lib/                   # By responsibility, not vendor
│   ├── search/            # Algolia
│   ├── commerce/          # WooCommerce cart
│   ├── forms/             # Gravity Forms
│   ├── cms/               # WordPress
│   └── graphql/           # Queries and client
├── stores/                # Zustand (cart presentation)
├── hooks/
├── config/
├── styles/
└── test/
```

## Local Development

- Dev server: `https://localhost:3000` (HTTPS)
- Use `--insecure` with curl for local HTTPS

## Code Style

### TypeScript

- Prefer `type` over `interface`
- Prefer function declarations over arrow functions
- No comments unless logic is non-obvious

### React

- Server Components by default
- `'use client'` only when required
- One concern per `useEffect`
- `useEffect` for external APIs, not UI logic

### Components

- Max 200 lines per component
- Max 50 lines per function
- Descriptive names: `ProductCard`, not `Card`
- Colocate files, export via `index.ts`

### CSS

CSS Modules, HSL colors, modern features by default. See [.claude/css.md](.claude/css.md).

## Performance

### Images

- First visible: `priority={true}` + `fetchPriority="high"`
- Below-fold: no priority (auto lazy-load)
- Always provide `width`/`height` or use `fill` + `sizes`

### Data Fetching

- Use `fetch` with `{ next: { revalidate: 300 } }`
- Avoid `cache: 'no-store'` unless required
- Minimal queries—only fetch fields you use

### Bundle

- Dynamic imports for below-fold sections
- `optimizePackageImports: ['lucide-react']`

## Preferred Packages

**Use:** `radix-ui`, `zustand`, `zod`, `react-hook-form`, `date-fns`, `lucide-react`

**Avoid:** `tailwindcss`, custom auth/checkout libraries

## URL State

Prefer URL search params for filters, sort, pagination, tabs.
Use Zustand only for temporary UI state.

## Detailed Documentation

- [Architecture & Rendering Boundaries](.claude/architecture.md)
- [CSS & JavaScript Philosophy](.claude/css.md)
- [WordPress Integration](.claude/wordpress.md)
- [Testing Strategy](.claude/testing.md)
