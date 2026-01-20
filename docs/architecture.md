# Architecture Overview

High-level system architecture for ChiroStretch. For detailed ownership rules and coding patterns, see [agents/architecture.md](../agents/architecture.md).

## System Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                              Users                                       │
└─────────────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                         Next.js (Vercel)                                │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐   │
│  │   Pages     │  │ API Routes  │  │    Cart     │  │    Search    │   │
│  │ (SSR/ISR)   │  │ (Webhooks)  │  │(localStorage)│  │  (Algolia)   │   │
│  └─────────────┘  └─────────────┘  └─────────────┘  └──────────────┘   │
└─────────────────────────────────────────────────────────────────────────┘
          │                 │                                   │
          │ GraphQL         │ REST API                         │
          ▼                 ▼                                   ▼
┌─────────────────────────────────────────────────┐  ┌────────────────────┐
│              WordPress (LocalWP/WPEngine)        │  │      Algolia       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │  │  ┌──────────────┐  │
│  │ WPGraphQL│  │   WC     │  │   MU-Plugins │   │  │  │   Indices    │  │
│  │ (Content)│  │(Commerce)│  │  (Sync, Auth)│   │  │  │  products    │  │
│  └──────────┘  └──────────┘  └──────────────┘   │  │  │  events      │  │
└─────────────────────────────────────────────────┘  │  │  articles    │  │
                                                      │  │  locations   │  │
                                                      │  └──────────────┘  │
                                                      └────────────────────┘
```

## Data Flow

### Content Flow (Read Path)

```
WordPress → WPGraphQL → Next.js → Browser
```

1. Editors create/update content in WordPress admin
2. Next.js fetches via WPGraphQL
3. Pages rendered with ISR (300s revalidation)
4. On-demand revalidation via webhook on publish

### Commerce Flow (Cart → Checkout)

```
Browser (localStorage) → Next.js API → WooCommerce REST → WordPress (Payment)
```

1. Cart managed in localStorage (Zustand store)
2. Checkout form submits to Next.js API route
3. API route creates unpaid order via WC REST API
4. Redirect to WordPress for payment processing
5. After payment, redirect back to Next.js success page

### Search Flow

```
WordPress (on save) → MU-Plugin → Algolia
Browser → Algolia (direct)
```

1. Content saved in WordPress
2. MU-plugin transforms and pushes to Algolia
3. Browser queries Algolia directly (no server round-trip)

## Source of Truth

| Data Type | Source of Truth | Consumers |
|-----------|-----------------|-----------|
| Content (pages, posts) | WordPress | Next.js (GraphQL) |
| Products | WooCommerce | Next.js (GraphQL), Algolia |
| Orders | WooCommerce | WordPress dashboards |
| Customer accounts | WooCommerce | WordPress My Account |
| Cart state | Browser localStorage | Next.js UI |
| Search indices | Algolia | Next.js UI |
| User sessions | WordPress | WordPress (cookies) |
| JWT tokens | WordPress | Next.js (auth headers) |

**Rule:** If there's a conflict, the source of truth wins. Next.js never persists state that WordPress owns.

## Integration Points

### WordPress → Next.js

| Integration | Mechanism | Purpose |
|-------------|-----------|---------|
| Content delivery | WPGraphQL | Pages, posts, products, events, locations |
| Order creation | WC REST API | Checkout flow |
| Authentication | JWT tokens | Protected routes |
| Revalidation | Webhook | On-demand ISR |

### Next.js → External Services

| Integration | Mechanism | Purpose |
|-------------|-----------|---------|
| Algolia | REST API (admin) | Index management |
| Algolia | JS SDK (client) | Search queries |
| Google Maps | JS SDK | Location maps |
| Zoho CRM | REST API | Lead capture |

### WordPress → External Services

| Integration | Mechanism | Purpose |
|-------------|-----------|---------|
| Algolia | MU-plugin | Auto-sync on save |
| Payment gateways | WooCommerce | Payment processing |

## High-Risk Integrations

These areas require extra care when modifying:

### 1. Authentication (JWT)

**Risk:** Broken auth = locked out users, security vulnerabilities

**Components:**
- WordPress: WPGraphQL JWT Authentication plugin
- Next.js: Auth context, protected routes
- MU-plugins: Custom auth endpoints

**Test:** Login flow, token refresh, protected route access

See [auth.md](auth.md) for details.

### 2. Checkout Flow

**Risk:** Broken checkout = lost revenue

**Components:**
- Next.js: Cart store, checkout form, API routes
- WooCommerce: REST API, payment gateways
- MU-plugins: Auto account creation, redirect handling

**Test:** Full purchase flow, guest checkout, edge cases

See [agents/tasks/checkout-flow.md](../agents/tasks/checkout-flow.md) for implementation details.

### 3. Algolia Sync

**Risk:** Stale search = bad UX, missing content

**Components:**
- MU-plugin: `algolia-sync.php`
- Next.js: API routes for manual indexing
- Algolia: Index configuration

**Test:** Create/update/delete content, verify index updates

See [algolia-setup.md](algolia-setup.md) for configuration.

### 4. WooCommerce Integration

**Risk:** Cart/product mismatches, pricing errors

**Components:**
- WPGraphQL WooCommerce (WooGraphQL)
- WC REST API
- Cart store (localStorage)

**Test:** Add to cart, price display, inventory sync

## Caching Strategy

| Layer | TTL | Invalidation |
|-------|-----|--------------|
| ISR (pages) | 300s | On-demand via webhook |
| GraphQL | Per-request | N/A |
| Algolia | Real-time | On save (MU-plugin) |
| Browser | localStorage | User action |

### On-Demand Revalidation

WordPress triggers revalidation when content changes:

```
WordPress publish → Webhook → /api/revalidate → revalidatePath()
```

Protected by `REVALIDATE_SECRET` (must match WordPress config).

## Security Boundaries

| Boundary | Enforcement |
|----------|-------------|
| Admin access | WordPress authentication |
| Customer data | WooCommerce + WordPress |
| Payment info | Payment gateway (never in Next.js) |
| API secrets | Server-side env vars only |
| Webhook auth | Shared secrets |

**Rule:** Next.js never handles payment data. Sensitive operations happen in WordPress.

## Deployment Architecture

```
┌─────────────────┐     ┌─────────────────┐
│     Vercel      │     │    WPEngine     │
│   (Next.js)     │────▶│   (WordPress)   │
│                 │◀────│                 │
└─────────────────┘     └─────────────────┘
        │                       │
        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│     Algolia     │     │   Database      │
│   (Search)      │     │   (MySQL)       │
└─────────────────┘     └─────────────────┘
```

See [deployment.md](deployment.md) for environment details.

## Failure Modes

| Failure | Impact | Mitigation |
|---------|--------|------------|
| WordPress down | No content, no orders | ISR cache serves stale |
| Algolia down | Search broken | Graceful degradation |
| Vercel down | Site unavailable | N/A (no fallback) |
| GraphQL errors | Page errors | Error boundaries, fallbacks |
| WC API errors | Checkout fails | Error handling, user messaging |

## Further Reading

- [agents/architecture.md](../agents/architecture.md) — Detailed ownership rules
- [agents/woocommerce.md](../agents/woocommerce.md) — WooCommerce integration
- [agents/identity-charter.md](../agents/identity-charter.md) — User vs lead distinction
- [debugging.md](debugging.md) — Troubleshooting guide
