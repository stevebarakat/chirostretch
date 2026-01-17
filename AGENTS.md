# ChiroStretch

Headless WordPress → Next.js App Router with WooCommerce, Algolia, and Gravity Forms.

## Ownership Model

```
WooCommerce → commerce (payments, orders, customer accounts)
WordPress   → operations (auth, dashboards, workflows)
Next.js     → presentation + cart + checkout UI (marketing, browsing, cart, billing form)
```

**Guiding rule:** Next.js may initiate intent (browsing, cart, order creation). WordPress finalizes transactions (payment processing, account creation).

**Hybrid Checkout Exception:** Next.js collects billing info and creates unpaid orders via WooCommerce REST API. WordPress handles payment processing and completion. See [Checkout Pattern](#checkout-pattern) below.

## Checkout Pattern

ChiroStretch uses a **hybrid checkout approach**:

- **Cart management:** Next.js (localStorage, no sessions)
- **Checkout UI:** Next.js (billing form, order creation)
- **Payment processing:** WordPress (Stripe/PayPal via WooCommerce)
- **Customer accounts:** Auto-created on first purchase (follows Identity Charter)

**Flow:**
1. User fills out checkout form in Next.js
2. Next.js creates order via WooCommerce REST API (guest order, unpaid)
3. Cart clears immediately
4. User redirected to WordPress for payment
5. Payment succeeds → customer account auto-created (if new email)
6. User redirected back to Next.js success page

**Why this pattern:**
- Next.js owns modern UI/UX (fast, type-safe checkout form)
- WordPress owns payments (battle-tested, PCI compliant)
- No payment code in Next.js (reduces attack surface)
- Event-driven identity creation (purchase = earned identity)

See [agents/tasks/checkout-flow.md](agents/tasks/checkout-flow.md) for complete implementation details.

## Non-Negotiables

- CSS-first, JS-last
- Server Components by default
- No custom auth (WordPress handles login/logout)
- Checkout UI in Next.js, payment processing in WordPress (hybrid pattern)
- No Tailwind
- Leads are not users
- Blocks are data schemas, not templates

## Package Manager

This repository uses **pnpm** exclusively.

- pnpm is required
- npm and yarn are not supported
- `pnpm-lock.yaml` is authoritative
- `package-lock.json` and `yarn.lock` must not exist

All installs, scripts, and CI workflows must use pnpm.
Do not assume a flat `node_modules` structure.

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
- MU-plugin patterns

Read [agents/woocommerce.md](agents/woocommerce.md) for:

- Headless checkout architecture
- REST API usage (orders, products)
- Cart storage strategy (localStorage)
- Payment gateways and redirects
- Customer account management
- GraphQL integration (WooGraphQL)

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

- [Checkout Flow](agents/tasks/checkout-flow.md) — Hybrid checkout, cart management, auto customer accounts, password reset
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
