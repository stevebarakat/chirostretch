# ChiroStretch — Claude Guidance

This document defines how Claude should reason about this project.
It explains intent, tradeoffs, and non-obvious architectural decisions.

Claude must follow this guidance when generating code, schemas, ACF JSON,
WP-CLI scripts, or proposing changes.

---

## System Context

ChiroStretch is a high-performance headless WordPress → Next.js App Router build
with WooCommerce, Gravity Forms, and Algolia.

This is not a theme, page builder, or visual editor.
It is a **designed system with strict ownership boundaries**.

---

## Content Strategy (Critical)

This project uses a **Hybrid Content Strategy**.

Different types of pages require different levels of flexibility.
Do NOT assume one content model fits everything.

### Schema-First Content (Locked Structure)

Used when consistency, trust, SEO, and predictability matter.

Examples:
- Franchise location pages
- Core service pages
- Repeated operational content

Rules:
- Structure and section order are fixed
- Content varies, layout does not
- Editors provide data, not layout decisions
- No block composition at the page level

### Block-First Content (Governed Composition)

Used when persuasion, narrative flow, or marketing variety matters.

Examples:
- Marketing pages
- Campaign pages
- Investor pages
- Contact and form pages

Rules:
- Editors compose pages from **approved blocks**
- Layout freedom exists only at the **section level**
- No freeform HTML
- No arbitrary styling
- Blocks select structure, never behavior

---

## Entropy Rule (Non-Negotiable)

Entropy is allowed **only** in composition.

Entropy is never allowed in:
- Global chrome (header/footer)
- Core layouts
- Motion and interaction
- Accessibility
- Data contracts

If a change introduces uncontrolled variation, stop and reconsider.

---

## Blocks vs Components

- Blocks are **content schemas**
- Components own **rendering, behavior, motion, and accessibility**
- Editors never configure animation, timing, or interaction

Blocks decide *what exists*.
Components decide *how it behaves*.

---

## Defaults vs Rules (Important)

- **Defaults** fill gaps when editors do nothing
- **Rules** define what is allowed or forbidden

Rules must:
- Be visible at the point of input
- Live in ACF field instructions
- Never be editable content
- Never be serialized to GraphQL

If ignoring guidance breaks meaning, it is a rule.

---

## Instruction Style

ACF field instructions must be:
- Single-line
- Plain text
- Instantly scannable

Standard format:

| Good: A • B • C | Bad: X • Y • Z

Do not invent new formats.

---

## Claude Operating Rules

When generating schemas, fields, or blocks:

- Respect the content strategy above
- Do not "make things flexible" by default
- Do not introduce layout fields to solve UI problems
- Do not move behavior into the CMS
- Prefer fewer, stronger blocks over many weak ones

When in doubt, choose:
**clarity > flexibility**
