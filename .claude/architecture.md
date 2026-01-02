# Hybrid System Architecture

This document defines **system-level ownership boundaries**.
Read this before making architectural changes.

---

## Ownership Model

```
WooCommerce → owns commerce (orders, billing, addresses, checkout, payments)
WordPress   → owns operations (authentication, dashboards, workflows)
Next.js     → owns public presentation only (marketing, browsing, content)
```

---

## System Boundaries

| Concern | Owner | Next.js Role |
|---------|-------|--------------|
| Authentication | WordPress | None — link to WP login |
| Checkout | WooCommerce | None — link to WC checkout |
| Customer Account | WooCommerce | None — link to My Account |
| Dashboards | WordPress plugins | None |
| Cart Browsing | Next.js | Full presentation |
| Product Browsing | Next.js | Full presentation |
| Content Pages | Next.js | Full presentation |

---

## What Next.js Does NOT Do

- No authentication flows
- No checkout logic
- No account management
- No operational dashboards
- No payment callbacks
- No role/capability enforcement

If a feature requires security, money, or identity → it belongs in WordPress/WooCommerce.

---

## Content Boundary (Important)

Next.js owns all public rendering, but **not all content is equally flexible**.

Within the presentation layer:

- Some pages are **schema-locked**
- Some pages are **block-composed**

This is intentional and enforced elsewhere.
Do not attempt to "standardize" this.

---

## Route Ownership

```
Next.js renders:          WordPress renders:
────────────────          ──────────────────
/shop                     /checkout
/products/*               /order-received
/cart                     /my-account
/locations                /dashboard/*
/events                   /wp-admin
/articles                 login/logout
Marketing pages           password reset
```

---

## Lead Handling (Critical)

Leads are **not users**.

Rules:
- Do NOT create WP users for leads
- Do NOT create WC customers for leads
- Do NOT assign roles or credentials

Leads are stored as data only:
- Gravity Forms entries
- Coupon meta

A lead becomes a user **only** when:
- They create an account
- They book
- They purchase

User creation is event-driven, never speculative.

---

## Red Flags (Stop Immediately)

- Login forms in Next.js
- Checkout logic in Next.js
- Storing order state in Zustand
- Proxying `/checkout`
- "My Orders" in Next.js
