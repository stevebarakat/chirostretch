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

---

## Breadcrumbs Rule

Breadcrumbs describe site structure, not content.

### When to Implement

Breadcrumbs are allowed only on pages with real, stable hierarchy:
- Locations (index -> detail)
- Articles (index -> category -> article)
- Events (index -> event)
- Shop products (index -> category -> product)

Breadcrumbs are NOT allowed on:
- Homepage
- One-off marketing pages
- Campaign / promo pages
- Franchise pitch pages
- Any page intended to be structurally flat

If a page answers "what should I do?" rather than "where am I?", breadcrumbs must not be shown.

### Ownership & Data Source (Non-Negotiable)

- Next.js owns breadcrumbs
- Breadcrumbs are derived, never authored
- WordPress does not provide breadcrumb labels or paths
- No ACF fields
- No blocks
- No per-page overrides

Breadcrumbs are computed from:
- Route segments
- CPT relationships
- Taxonomies (if applicable)
- Known parent indexes (/locations, /articles, /events, /shop)

### Markup

- `<nav aria-label="Breadcrumb">`
- Ordered list (`<ol>`)
- All items except the current page are links
- Current page is plain text (no link)

Breadcrumbs must be visually minimal and non-dominant.

### SEO & Structured Data

- Emit JSON-LD BreadcrumbList
- Generated entirely in Next.js
- Must not depend on Yoast or any SEO plugin

### Explicit Prohibitions

- Do not create a "Breadcrumb block"
- Do not store breadcrumb labels in ACF
- Do not allow editors to control breadcrumb paths
- Do not infer breadcrumbs from page layout or blocks
- Do not show breadcrumbs on marketing-only pages

### Guiding Test

Before rendering breadcrumbs, ask:

"If this page were printed on paper, would a reader reasonably ask 'where am I in the site?'"

If yes -> breadcrumbs allowed
If no -> breadcrumbs must not render

---

## Practitioner Capabilities & Expertise Rule

Do NOT encode practitioner capabilities or expertise as user roles or checkbox fields.

### User Roles (Permissions Only)

All clinical providers use a single user role: `practitioner`

User roles exist only to define system permissions.
Occupations or disciplines must NOT be modeled as user roles.

**Forbidden:**
- `chiropractor` role
- `massage_therapist` role
- `physical_therapist` role
- Any role that represents a profession or specialty

### Discipline (What They Are)

Practitioner profession is modeled as taxonomy: `discipline`

- Single-select per practitioner
- Values: chiropractor, physical_therapist, massage_therapist, athletic_therapist
- Used for labeling, filtering, and SEO
- Does NOT affect permissions

### Services Offered (What They Can Provide)

Services are modeled as taxonomy: `service`

- Multi-select per practitioner
- Values: chiropractic, massage, stretch_therapy, sports_medicine
- Shared across practitioners and locations
- May drive booking, pricing, or eligibility logic

### Specialties (What They Focus On)

Areas of focus are modeled as taxonomy: `specialty`

- Multi-select per practitioner
- Values: sports_injuries, back_pain, prenatal_care, posture_correction, etc.
- Descriptive, not gating
- Used for discovery and content grouping

### Field Usage Rules

**Taxonomies required when:**
- Values are shared across records
- Filtering or querying is expected
- The concept is global and reusable

**Fields allowed only for:**
- Free-form content (biography)
- Relationships (assigned location, user account)

**Forbidden patterns:**
- Checkbox fields for services or specialties
- Occupation-based user roles
- Duplicating service/specialty definitions per practitioner

### Guiding Principle

> Roles define what someone **may do** in the system.
> Taxonomies define what someone **is** and what they **offer**.

If a concept describes identity, capability, or expertise → taxonomy
If a concept controls access → role
