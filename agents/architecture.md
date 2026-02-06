<!-- Scope: system architecture, ownership model, and deployment topology. Do not merge content from other agent docs. -->
# System Architecture

## Ownership Model

```
WooCommerce → owns commerce (payments, orders, customer accounts)
WordPress   → owns operations (authentication, dashboards, workflows)
Next.js     → owns presentation + cart + checkout UI (marketing, browsing, cart, billing form)
```

**Hybrid Checkout Exception:** Next.js collects billing info and creates unpaid orders via WooCommerce REST API. WordPress handles payment processing and completion. This follows the pattern: Next.js initiates intent, WordPress finalizes transactions.

## System Boundaries

| Concern | Owner | Next.js Role |
|---------|-------|--------------|
| Authentication | WordPress | None — link to WP login |
| Checkout | Hybrid | Collect billing, submit to WC REST API |
| Payment Processing | WooCommerce | None — redirect to WP payment page |
| Customer Account Creation | WooCommerce | None — auto-created after payment |
| Customer Account Management | WooCommerce | None — link to My Account |
| Dashboards | WordPress plugins | None |
| Cart Browsing | Next.js | Full presentation + localStorage |
| Product Browsing | Next.js | Full presentation |
| Content Pages | Next.js | Full presentation |

## What Next.js Does NOT Do

- No authentication flows (login/logout handled by WordPress)
- No payment processing (handled by WooCommerce)
- No account management (handled by WooCommerce My Account)
- No operational dashboards
- No payment callbacks
- No role/capability enforcement

**Hybrid Checkout Exception:**
- Next.js collects billing info and creates unpaid orders via WooCommerce REST API
- WordPress handles payment processing and completion
- This follows the pattern: Next.js initiates intent, WordPress finalizes transactions

If a feature requires payment processing, money, or identity → it belongs in WordPress/WooCommerce.

## Route Ownership

```
Next.js renders:          WordPress renders:
────────────────          ──────────────────
/shop                     /checkout/order-pay/* (payment)
/products/*               /order-received (redirects to Next.js)
/cart                     /my-account
/checkout (billing form)  /dashboard/*
/checkout/success         /wp-admin
/locations                login/logout
/events
/articles
/account/set-password
Marketing pages
```

**Note:** Checkout is hybrid — Next.js collects data, WordPress processes payment.

## Customer Account Auto-Creation

Customer accounts are auto-created on first purchase per the [Access & Identity Charter](identity-charter.md). See [agents/tasks/checkout-flow.md](tasks/checkout-flow.md#5-customer-auto-creation-mu-plugin) for implementation.

## Content Boundary

Next.js owns all public rendering, but not all content is equally flexible.

- Some pages are **schema-locked** (fixed structure, data varies)
- Some pages are **block-composed** (governed editorial freedom)

This is intentional. Do not attempt to "standardize" this.

## Lead Handling (Critical)

Leads are **not users**. See [agents/identity-charter.md](identity-charter.md) for the complete Lead vs User distinction and identity creation rules.

## Red Flags (Stop Immediately)

- Login forms in Next.js
- Payment processing in Next.js
- Storing order state in Zustand (localStorage cart is OK)
- Proxying `/checkout/order-pay` (WordPress payment page)
- "My Orders" in Next.js (use WordPress My Account)

## Breadcrumbs Rule

Breadcrumbs describe site structure, not content.

**Allowed on:** Locations, Articles, Events, Shop products (pages with real hierarchy)

**Not allowed on:** Homepage, marketing pages, campaign pages, flat pages

Next.js owns breadcrumbs. They are derived from route segments and relationships, never authored in WordPress.

## Practitioner Capabilities

Do NOT encode practitioner capabilities as user roles.

- **User role:** `practitioner` (permissions only)
- **Discipline:** taxonomy (chiropractor, physical_therapist, etc.)
- **Services:** taxonomy (multi-select, what they provide)
- **Specialties:** taxonomy (areas of focus)

> Roles define what someone **may do** in the system.
> Taxonomies define what someone **is** and what they **offer**.
