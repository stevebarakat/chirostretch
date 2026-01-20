# ChiroStretch

A headless web platform for multi-location chiropractic clinics. WordPress CMS + WooCommerce backend, Next.js App Router frontend.

## Quick Start

```bash
# Prerequisites: Node 20.18.0 (Volta recommended), pnpm 10.27.0, LocalWP

# 1. Start WordPress in LocalWP
# Open LocalWP → Start "chirostretch-copy"

# 2. Set up Next.js
cd system/apps/ui
pnpm install
cp .env.example .env.local
# Edit .env.local with your values

# 3. Start development
pnpm dev
# Open https://localhost:3000
```

See [docs/local-development.md](docs/local-development.md) for complete setup instructions.

## Apps

| App | Location | Purpose |
|-----|----------|---------|
| **UI** | `system/apps/ui/` | Next.js frontend (App Router, Server Components) |
| **CMS** | `system/apps/cms/` | WordPress (content, auth, WooCommerce) |

## Required Environment Variables

Copy `system/apps/ui/.env.example` to `.env.local` and configure:

| Variable | Purpose |
|----------|---------|
| `NEXT_PUBLIC_BACKEND_URL` | WordPress URL |
| `NEXT_PUBLIC_WPGRAPHQL_ENDPOINT` | GraphQL endpoint |
| `WC_CONSUMER_KEY` / `WC_CONSUMER_SECRET` | WooCommerce API |
| `NEXT_PUBLIC_ALGOLIA_*` / `ALGOLIA_ADMIN_API_KEY` | Search |
| `WP_WEBHOOK_SECRET` / `REVALIDATE_SECRET` | Webhooks |

See [docs/env-vars.md](docs/env-vars.md) for complete reference.

## Common Workflows

### Content Editing

1. Edit content in WordPress admin
2. Publish triggers auto-revalidation
3. Changes appear on Next.js site

### Search Indexing

```bash
# Re-index all content (dev server must be running)
curl --insecure -X POST https://localhost:3000/api/algolia/index-products
curl --insecure -X POST https://localhost:3000/api/algolia/index-locations
```

Auto-sync is enabled via `mu-plugins/algolia-sync.php`.

### GraphQL Codegen

```bash
cd system/apps/ui
pnpm codegen        # One-time generation
pnpm codegen:watch  # Watch mode
```

Run after changing GraphQL queries or WordPress schema.

## Danger Zones

These areas are fragile. Extra care required:

| Area | Risk | Documentation |
|------|------|---------------|
| **Checkout flow** | Payment/revenue | [agents/tasks/checkout-flow.md](agents/tasks/checkout-flow.md) |
| **Authentication** | User access | [docs/auth.md](docs/auth.md) |
| **Algolia sync** | Search quality | [docs/algolia-setup.md](docs/algolia-setup.md) |
| **WooCommerce REST** | Order integrity | [agents/woocommerce.md](agents/woocommerce.md) |

## Documentation

### Setup & Operations

- [Local Development](docs/local-development.md) — Environment setup
- [Environment Variables](docs/env-vars.md) — Configuration reference
- [Deployment](docs/deployment.md) — How it ships
- [Debugging](docs/debugging.md) — Troubleshooting guide

### Architecture

- [Architecture Overview](docs/architecture.md) — System diagram, data flow
- [Authentication](docs/auth.md) — JWT flow, password reset

### Coding Standards

- [AGENTS.md](AGENTS.md) — Project rules and patterns
- [agents/architecture.md](agents/architecture.md) — System boundaries
- [agents/frontend.md](agents/frontend.md) — TypeScript/React patterns
- [agents/css.md](agents/css.md) — CSS-first styling
- [agents/wordpress.md](agents/wordpress.md) — WordPress integration
- [agents/woocommerce.md](agents/woocommerce.md) — Commerce patterns

### Task Playbooks

- [Checkout Flow](agents/tasks/checkout-flow.md)
- [Algolia Indexing](agents/tasks/algolia-index.md)
- [React Component](agents/tasks/react-component.md)
- [WordPress CPT](agents/tasks/wp-cpt.md)

## Tech Stack

| Service | Role |
|---------|------|
| Next.js 16 | User interface (App Router, Server Components) |
| WordPress | Content management, authentication |
| WooCommerce | E-commerce, payments, customer accounts |
| WPGraphQL | Data transport |
| Algolia | Site search |
| Gravity Forms | Form builder |

## Non-Negotiables

- **CSS-first, JS-last** — Prefer CSS solutions
- **Server Components by default** — Client only when needed
- **No custom auth** — WordPress handles login/logout
- **No Tailwind** — CSS Modules only
- **Blocks are data schemas** — Not templates
- **Leads are not users** — See [identity-charter.md](agents/identity-charter.md)

## Package Manager

This repository uses **pnpm** exclusively. npm and yarn are not supported.

```bash
pnpm install    # Install dependencies
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm test       # Run tests
```
