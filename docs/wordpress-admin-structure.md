# ChiroStretch — WordPress Admin Structure (Headless)

This document defines how the WordPress Admin is structured for the ChiroStretch headless architecture.

For MU-plugin coding patterns and CPT registration, see [agents/wordpress.md](../agents/wordpress.md).

> **Purpose of WordPress Admin**
> WordPress is responsible for **content creation, global configuration, and system governance**.
> It is **not** responsible for layout, UI composition, or presentation logic.

---

## Guiding Principles

- WordPress stores **content and intent**, not UI
- React / Next.js owns **layout, behavior, and performance**
- Global decisions live in **Options Pages**
- Reusable UI components are **not editable in the CMS**
- Editors should feel confident, not overwhelmed

---

## Dashboard

Dashboard
├── At-a-glance metrics (optional)
├── Editorial reminders (optional)
└── System health (plugins, updates)

**Rules**

- Informational only
- No workflow logic
- No content editing

---

## Content (Primary Editorial Area)

### Pages (CMS-driven marketing pages)

Pages
├── Homepage
├── Franchise Opportunities
├── About
├── Contact
├── Legal / Policies
└── Landing Pages

**Rules**

- Uses Page Templates
- Content only (copy, media, metadata)
- No UI configuration
- No layout controls
- No per-page component settings

---

### Articles (Blog / Editorial Content)

Articles
├── All Articles
├── Categories
├── Tags
└── Authors

**Rules**

- Long-form SEO content
- Minimal ACF usage (metadata only)
- No layout or presentation fields

---

### Events

Events
├── All Events
├── Event Categories
└── Event Locations

**Rules**

- Structured data only
- Used for listings, calendars, and marketing
- No visual configuration

---

### Locations (Franchise Locations)

Locations
├── All Locations
├── Location Types
└── Regions / Cities

**Rules**

- Canonical business data
- Shared across site, search, booking, and checkout
- High data integrity
- No styling or layout options

---

### Products (WooCommerce)

Products
├── All Products
├── Categories
├── Tags
└── Attributes

**Rules**

- Commerce data only
- Product display handled entirely in Next.js
- No design customization in WP Admin

---

## Global Configuration (Options Pages)

> **Tier-2 decisions**: centralized, intentional, reviewed, and consistent.

Settings (Custom)
├── Brand & Identity
│ ├── Site Name
│ ├── Tagline
│ └── Logo Assets
│
├── Navigation & CTAs
│ ├── Primary Location Search CTA
│ ├── Header CTA Label
│ └── Footer CTA Label
│
├── Contact & Legal
│ ├── Support Email
│ ├── Phone Number
│ └── Legal Copy
│
├── Feature Toggles
│ ├── Enable Booking
│ ├── Enable Events
│ └── Enable Franchise Applications
│
└── SEO Defaults
├── Default Meta Title
├── Default Meta Description
└── Social Share Image

**Rules**

- One field = one global decision
- No per-page overrides
- No styling or layout controls
- Repeaters only when the concept is truly plural
- Defaults must exist in code

---

## Forms (Gravity Forms)

Forms
├── Contact Form
├── Franchise Application
├── Lead Capture
└── Newsletter Signup

**Rules**

- Data capture and validation only
- Frontend controls layout and styling
- No visual customization responsibilities

---

## Media Library

Media
├── Images
├── Documents
└── Video

**Rules**

- Asset storage only
- No semantic meaning inferred from folders
- No layout responsibility

---

## Users & Roles

Users
├── Administrators
├── Editors
├── Authors
├── Franchisees
└── Customers

**Rules**

- Roles map to responsibility, not power
- Editors manage content
- Admins manage configuration
- Franchisees manage only their own data

---

## System / Developer Area (Restricted Access)

Tools / Developer
├── ACF Field Groups
├── WPGraphQL Settings
├── Webhooks
├── Import / Export
└── Logs

**Rules**

- Not accessible to editors
- Changes imply code-level consequences
- Treated as infrastructure, not content

---

## What Is Intentionally Excluded

There is **no**:

- Page builder
- Component selector
- Layout chooser
- Button style editor
- Grid configuration
- Animation toggles

All presentation logic lives in **Next.js**.

---

## Editor Mental Model

Editors should think:

> “I’m editing information and messages.”

Not:

> “I’m assembling a webpage.”

This distinction is fundamental to the headless architecture.

---

## Relationship to Next.js

- WordPress defines **content and intent**
- GraphQL defines the **contract**
- Next.js defines **layout, behavior, and performance**
- Options Pages define **global decisions**

This symmetry keeps the system scalable and predictable.

---

## Document Status

This document is a **living specification**.

Any change here implies:

- A CMS behavior change
- A frontend contract update
- Possible migration work

Treat updates intentionally.

---

## ACF Field Naming Conventions

Consistent field naming is critical in a headless architecture.
Field names are part of the **API contract**, not internal CMS details.

### Core Principles

- Field names must describe **content**, not presentation
- Field names must be **stable** over time
- Field names must map cleanly to GraphQL
- Avoid page names, layout names, or component names
- Avoid UI terminology (button, grid, column, animation)

---

### Field Group Naming

**Format**

{Domain} – {Content Purpose}

**Examples**

- `Hero – Content`
- `CTA – Primary`
- `Promotion – New Patient`
- `Metrics – Key Stats`
- `SEO – Page Metadata`
- `Navigation – Header`

**Avoid**

- `Homepage – Hero`
- `Component – Hero Unit`
- `Two Column Image Left`
- `Animated Stats Section`

Field groups describe _what the data is_, not _where it appears_.

---

### Field Names (Individual Fields)

**Rules**

- Use `snake_case`
- Use nouns, not verbs
- Describe meaning, not rendering
- No abbreviations unless universally obvious

**Good**

```text
headline
subheadline
body
eyebrow
cta_label
cta_url
media
metrics
price
availability
```

**Bad**

```text
hero_title
button_text
left_column_image
section_3_description
animate_on_scroll
```

---

### Repeater Fields

Repeaters are allowed only when the concept is intrinsically plural.

**Good**

- `metrics`
- `benefits`
- `testimonials`
- `faq_items`

**Bad**

- `buttons`
- `columns`
- `rows`
- `sections`

If a repeater exists to build layout, it is a smell.

---

### Flexible Content Fields

Flexible Content should be rare and bounded.

If used:

- Allowed layouts must map to content types, not components
- Layout names should be semantic

**Acceptable**

- `promotion`
- `testimonial_group`
- `feature_list`

**Not acceptable**

- `hero_left_image`
- `two_column_grid`
- `carousel_slider`

---

### Options Page Fields

Options Pages are for Tier-2 global decisions.

**Naming Rules**

- Prefix with the domain or feature name
- One field = one global decision

**Examples**

```text
location_search_cta_label
header_primary_cta_label
support_email
booking_enabled
default_meta_title
```

**Rules**

- No per-page overrides
- No repeaters unless unavoidable
- Always provide a code default fallback

---

## WordPress → Next.js Route Mapping

This section defines how WordPress Admin areas map directly to Next.js App Router route groups.

This mapping is intentional and enforced.

---

### Pages → (site)/(marketing)

**WordPress**

```
Pages
├── Homepage
├── Franchise Opportunities
├── About
├── Contact
├── Legal Pages
└── Landing Pages
```

**Next.js**

```
app/
└── (site)/
    └── (marketing)/
        ├── page.tsx
        ├── [...slug]/
        └── layout.tsx
```

**Rules**

- Pages are CMS-driven
- Rendered via `[...slug]`
- Layout decided by Page Template
- No UI logic in WP

---

### Articles → (site)/(content)

**WordPress**

```
Articles
├── Posts
├── Categories
├── Tags
└── Authors
```

**Next.js**

```
app/
└── (site)/
    └── (content)/
        ├── articles/
        ├── categories/
        └── tags/
```

**Rules**

- SEO-first rendering
- Static or ISR pages
- No layout customization via CMS

---

### Events → (site)/(content)

**WordPress**

```
Events
├── All Events
├── Categories
└── Locations
```

**Next.js**

```
app/
└── (site)/
    └── (marketing)/
        └── events/
```

**Rules**

- Structured data only
- Presentation determined by route
- Calendar and list logic lives in React

---

### Locations → (site)/(marketing) + (dashboard)

**WordPress**

```
Locations
├── Franchise Locations
├── Regions
└── Types
```

**Next.js**

```
app/
├── (site)/
│   └── (marketing)/
│       └── locations/
└── (dashboard)/
    └── locations/
```

**Rules**

- Locations are canonical business entities
- Marketing pages are public
- Franchisee editing is protected

---

### Products → (site)/(commerce)

**WordPress**

```
Products (WooCommerce)
├── Products
├── Categories
└── Attributes
```

**Next.js**

```
app/
└── (site)/
    └── (commerce)/
        ├── shop/
        ├── products/
        ├── cart/
        └── checkout/
```

**Rules**

- Commerce logic owned by Next.js
- WP is data source only
- No product layout configuration in CMS

---

### Forms → API Routes + Components

**WordPress**

```
Forms (Gravity Forms)
```

**Next.js**

```
app/
├── api/
│   └── gravity-forms/
└── components/
    └── GravityForms/
```

**Rules**

- WP handles validation + storage
- React controls UX
- Forms are referenced by ID, not embedded markup

---

### Options Pages → Global App Configuration

**WordPress**

```
Settings (Custom Options Pages)
```

**Next.js**

```
lib/
├── config/
│   └── site.config.ts
└── components/
    └── Layout/
```

**Rules**

- Read once at render time
- Defaults exist in code
- No page-specific overrides

---

## Contract Summary

- WordPress defines **what exists**
- GraphQL defines **what is available**
- Next.js defines **how it behaves**
- Options Pages define **global intent**

If a decision affects layout or behavior, it does not belong in WordPress.

---

## Enforcement Rule

Any new ACF field or Options Page must answer:

> "Is this content, or is this UI?"

If the answer is UI, it belongs in Next.js.

This document is authoritative.
