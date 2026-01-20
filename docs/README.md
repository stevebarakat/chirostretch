# ChiroStretch Documentation

Documentation hub for the ChiroStretch headless WordPress + Next.js platform.

## Getting Started

| Document | Description |
|----------|-------------|
| [Local Development](local-development.md) | Environment setup, prerequisites, common gotchas |
| [Environment Variables](env-vars.md) | Complete variable reference for Next.js and WordPress |
| [Architecture](architecture.md) | System boundaries, data flow, source of truth rules |

## Operations

| Document | Description |
|----------|-------------|
| [Deployment](deployment.md) | Environments, domain mapping, deployment checklist |
| [Debugging](debugging.md) | Common errors, troubleshooting guides, incident response |
| [Authentication](auth.md) | JWT flow, token refresh, server-to-server calls |

## Integrations

| Document | Description |
|----------|-------------|
| [Algolia Setup](algolia-setup.md) | Search indexing, configuration, automatic sync |
| [Forms](forms.md) | Gravity Forms + React Hook Form + Zod integration |
| [WordPress Admin](wordpress-admin-structure.md) | Admin structure, ACF naming, route mapping |

## Development

| Document | Description |
|----------|-------------|
| [Scripts](scripts.md) | System tooling and npm scripts |
| [Pull Request Template](pull-request-template.md) | PR checklist for ACF/WPGraphQL changes |

## Related Resources

- [AGENTS.md](../AGENTS.md) — Project rules and non-negotiables
- [agents/](../agents/) — Coding standards and architecture decisions
  - [architecture.md](../agents/architecture.md) — System boundaries
  - [frontend.md](../agents/frontend.md) — TypeScript and React patterns
  - [css.md](../agents/css.md) — CSS-first styling rules
  - [wordpress.md](../agents/wordpress.md) — WordPress integration patterns
  - [woocommerce.md](../agents/woocommerce.md) — Headless checkout architecture
  - [testing.md](../agents/testing.md) — Test strategy and patterns

## Quick Reference

### Tech Stack

| Service | Role |
|---------|------|
| Next.js 16 | User interface (App Router, Server Components) |
| WordPress | Headless CMS (content, auth, operations) |
| WooCommerce | E-commerce (payments, orders, accounts) |
| WPGraphQL | Data transport layer |
| Algolia | Site search |
| Gravity Forms | Form builder |
| Zoho CRM | Marketing automation |

### Key URLs (Local Development)

| Service | URL |
|---------|-----|
| Next.js | `https://localhost:3000` |
| WordPress | `https://chirostretch-copy.local` |
| GraphQL | `https://chirostretch-copy.local/graphql` |
| WP Admin | `https://chirostretch-copy.local/wp-admin` |

### Ownership Rules

```
WordPress owns: content, auth, payments, customer accounts
Next.js owns:   UI, cart state, checkout form, search queries
```

WordPress finalizes transactions. Next.js initiates intent.
