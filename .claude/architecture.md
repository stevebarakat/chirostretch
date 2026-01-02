# Hybrid Architecture

This project follows a **hybrid headless** pattern. Understand these boundaries before making changes.

```
WooCommerce → owns commerce (orders, billing, addresses, checkout, payments)
WordPress   → owns operations (authentication, dashboards, internal workflows)
Next.js     → owns public presentation only (marketing, browsing, content)
```

## System Boundaries

| Concern | Owner | Next.js Role |
|---------|-------|--------------|
| Authentication | WordPress | None — links to WP login |
| Checkout | WooCommerce | None — links to WC checkout |
| Customer Account | WooCommerce | None — links to WC My Account |
| Staff/Franchisee Dashboards | WordPress plugin | None |
| Cart Browsing | Next.js | Full — presentation layer |
| Product Browsing | Next.js | Full — presentation layer |
| Content Pages | Next.js | Full — presentation layer |

## What Next.js Does NOT Do

- **No custom authentication** — users log in via WordPress/WooCommerce
- **No checkout flow** — cart links to WooCommerce checkout
- **No account management** — links to WooCommerce My Account
- **No operational dashboards** — staff/franchisee tools live in WordPress

## Why This Architecture

Commerce and authentication are transactional, stateful, and security-sensitive systems — not presentation concerns. Attempting full headless auth/checkout would require permanently owning PCI compliance, payment gateway drift, order lifecycle correctness, and WooCommerce plugin compatibility.

The hybrid model delegates those responsibilities to WordPress/WooCommerce where they are battle-tested.

## Gravity Forms

Gravity Forms creates and manages users in WordPress for franchise applicants, staff, and other custom user types. This is unchanged — it's WordPress-native functionality.

## Rendering Validation Checklist

Before implementing any feature, verify:

| Question | If YES | If NO |
|----------|--------|-------|
| Does this involve payment processing? | → WordPress | ✓ Next.js |
| Does this create/modify orders? | → WordPress | ✓ Next.js |
| Does this require user authentication state? | → WordPress | ✓ Next.js |
| Does this access/modify account data? | → WordPress | ✓ Next.js |
| Does this involve role/capability checks? | → WordPress | ✓ Next.js |
| Is this an operational dashboard? | → WordPress | ✓ Next.js |
| Is failure here financially consequential? | → WordPress | ✓ Next.js |

**Route ownership:**

```
Next.js renders:        WordPress renders:
────────────────        ──────────────────
/shop                   /checkout
/products/*             /order-received
/cart                   /my-account
/locations              /dashboard/*
/events                 /wp-admin
/articles               Login/logout
Marketing pages         Password reset
```

**Domain boundary (intentional):**

```
NEXT_PUBLIC_FRONTEND_URL  → Next.js (shop, cart, public UX)
NEXT_PUBLIC_BACKEND_URL   → WordPress (checkout, account, dashboard)
```

**Guiding rule:** Next.js may initiate intent (browsing, cart). WordPress must finalize transactions (checkout, payment, orders, accounts).

**Red flags (stop and reconsider):**

- Building a login form in Next.js
- Handling payment callbacks in Next.js API routes
- Storing order state in Zustand
- Proxying `/checkout` through Next.js
- Building "My Orders" in Next.js
