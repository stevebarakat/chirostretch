# ChiroStretch

Headless WordPress → Next.js App Router with WooCommerce, Algolia, and Gravity Forms.

## Ownership Model

```
WooCommerce → commerce (checkout, payments, orders)
WordPress   → operations (auth, dashboards, workflows)
Next.js     → presentation only (marketing, browsing, content)
```

**Guiding rule:** Next.js may initiate intent (browsing, cart). WordPress finalizes transactions (checkout, payment, orders, accounts).

## Non-Negotiables

- CSS-first, JS-last
- Server Components by default
- No custom auth or checkout (hybrid architecture)
- No Tailwind
- Leads are not users
- Blocks are data schemas, not templates

## Before You Write Code

Read [agents/architecture.md](agents/architecture.md) for:
- System boundaries and ownership
- What Next.js does NOT do
- Lead handling rules
- Route ownership

Read [agents/frontend.md](agents/frontend.md) for:
- TypeScript and React patterns
- Component rules and structure
- useEffect guidelines
- Forbidden JS patterns

## Styling

Read [agents/css.md](agents/css.md) for:
- Modern CSS features to use by default
- Native UI primitives (dialog, details, popover)
- CSS-first decision checklist
- Anti-patterns to avoid

## WordPress Integration

Read [agents/wordpress.md](agents/wordpress.md) for:
- CPT registration patterns
- ACF field rules
- Block rendering model
- Schema-first vs block-first pages

## Testing

Read [agents/testing.md](agents/testing.md) for:
- What to test (webhook intent, objectID stability)
- What NOT to test
- Mock patterns
- CI workflow

## Identity & Access

Read [agents/identity-charter.md](agents/identity-charter.md) for:
- Lead vs Applicant vs User distinctions
- When user accounts are created
- Tokenized status flow rules
- Prohibited patterns

## Task Playbooks

When implementing specific features:

- [Algolia Indexing](agents/tasks/algolia-index.md) — Webhook handlers, record transformation, objectID stability
- [WordPress CPT](agents/tasks/wp-cpt.md) — MU-plugin registration, GraphQL exposure, ACF integration
- [WordPress Block](agents/tasks/wp-block.md) — Headless blocks, whitelist pattern, BlockRenderer
- [React Component](agents/tasks/react-component.md) — Server/client decisions, CSS-first patterns
- [Web Development](agents/tasks/web-dev.md) — CSS-first decision tree, modern patterns

## Local Development

```bash
# Dev server (HTTPS required)
npm run dev
# https://localhost:3000

# Use --insecure with curl for local HTTPS
curl --insecure https://localhost:3000/api/health
```

## Preferred Packages

**Use:** `zustand`, `zod`, `react-hook-form`, `date-fns`, `lucide-react`

**Avoid:** `tailwindcss`, custom auth/checkout libraries

## Content Strategy

This project uses a **hybrid content strategy**:

- **Schema-first pages:** Fixed structure, data varies (locations, operational pages)
- **Block-first pages:** Governed composition (marketing, campaigns)

Do not attempt to "standardize" this. Different pages require different flexibility.

## Entropy Rule

Entropy is allowed **only** in composition.

Entropy is never allowed in:
- Global chrome (header/footer)
- Core layouts
- Motion and interaction
- Accessibility
- Data contracts
