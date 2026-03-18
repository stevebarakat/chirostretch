# ChiroStretch — Upwork & Portfolio Copy

> Copy derived from code-audited evidence. All feature claims are backed by inspected files.
> Do not claim the system is currently live — infrastructure was decommissioned for cost reasons.
> Date: 2026-03-18

---

## Resume / Portfolio Bullets (10)

1. **Built a headless WordPress + Next.js 16.1 franchise platform** for a chiropractic network: 48+ custom mu-plugins, 17 WPGraphQL query files, 17 ACF field groups, and a CSS Modules design system with custom tokens — replacing a monolithic WP theme with a fully decoupled architecture on Vercel + Cloudways.

2. **Designed and implemented a bidirectional Algolia search sync pipeline** across 4 content types (locations, events, articles, products): WordPress save/delete hooks fire webhooks to Next.js API routes with shared-secret authentication, which transform and index records in real time; unit-tested API routes with bulk re-index capability.

3. **Implemented headless WooCommerce checkout with payment URL handoff**: Zustand cart with localStorage persistence, WooCommerce Store API session management via cookie forwarding, custom `createCheckoutOrder` GraphQL mutation returning a `paymentUrl`, and a mu-plugin that enforces the headless boundary by intercepting WordPress checkout access.

4. **Built a dual-entry Zoho CRM integration**: WooCommerce order completion triggers automatic lead-to-contact promotion in Zoho (Initial Consultation purchase); Gravity Forms franchise inquiries route through a separate CRM feed mapping. OAuth2 client with in-memory token caching (50-minute TTL) implemented in Next.js.

5. **Developed a custom OpenAI RAG chat feature**: full ingest pipeline (WPGraphQL → chunk → embed via `text-embedding-3-small` → pgvector), streaming retrieval via `gpt-4o-mini`, and an in-memory fallback for stateless deployments — built on site-specific content without a third-party RAG framework.

6. **Integrated WooCommerce Bookings into a headless frontend**: custom REST API endpoints for real-time slot availability, GraphQL type registration for booking products/resources/availability, and a React BookingWidget with service selection, date strip, and time slot grid — with "in-cart" reservation that holds slots until checkout completion or cart removal.

7. **Created a headless Gravity Forms React integration**: dynamically fetches form schema from WordPress via GraphQL, generates Zod validation schemas from field definitions at runtime, and submits to custom Next.js API routes with form-specific post-submit workflows (coupon generation, CRM routing, GA tracking) — enabling form management in WP admin without frontend deploys.

8. **Architected a multi-location franchise content model**: Location, Practitioner, and Testimonial CPTs with 3 taxonomies (Discipline, Services, Specialty), auto-user provisioning on staff publish, role-based WordPress dashboards for franchisees and staff, and computed relationships (location → services offered, derived from assigned practitioners' taxonomy terms).

9. **Engineered ISR-driven cache invalidation with tag-based precision**: WordPress publish/update hooks across 11 content types POST to a Next.js `/api/revalidate` route that calls `revalidateTag()`, ensuring editors see content changes reflected in seconds without a full rebuild — secured by shared-secret webhook authentication.

10. **Established a CI/CD pipeline with quality gates and agentic development workflow**: GitHub Actions running ESLint, Vitest, and Next.js build on every push; Lighthouse CI with Core Web Vitals budgets (LCP ≤2500ms, A11y ≥90%); WordPress auto-deployed via SSH rsync; and structured agent task playbooks with Claude Code integration for AI-assisted development.

---

## Upwork Proposal Bullets (5)

1. I've built full-stack headless WordPress systems at this complexity level before — 48+ custom mu-plugins, WPGraphQL mutations for headless auth and checkout, ISR revalidation across 11 content types, and bidirectional Algolia sync. I understand where these architectures break (session management, cache staleness, webhook reliability) and how to prevent it.

2. My integration work goes beyond scaffolding: the Zoho CRM pipeline I built has two distinct entry points (WooCommerce purchase and Gravity Forms submission), a custom OAuth2 client with token caching, and maps cleanly to the business's lead-to-patient conversion flow — from form submission to coupon generation to checkout to CRM promotion.

3. I build headless checkout end-to-end — not just the cart UI. The WooCommerce integration covers Store API session management with cookie forwarding, a custom order creation GraphQL mutation that returns a payment URL, WP-side redirect enforcement via mu-plugin, and a new-patient coupon system with email-locked validation and 30-day expiry.

4. I've implemented production-ready RAG from scratch: WPGraphQL content ingest, text chunking, embedding via OpenAI, pgvector storage with an in-memory fallback, and streaming chat responses — without a framework like LangChain. I also integrated WooCommerce Bookings into a headless frontend with real-time slot availability and cart-based reservation.

5. My work is auditable: TypeScript throughout (strict mode), GraphQL types generated from the live schema (45k+ lines), CSS design tokens applied consistently across component modules, Vitest + Playwright test coverage, Lighthouse CI performance budgets, and 17 documentation files. I write code that other engineers can maintain.

---

## Project Summaries

### 1-Sentence Summary

Designed and built a headless WordPress + Next.js 16.1 franchise platform for a chiropractic network, integrating Algolia search, Zoho CRM, WooCommerce headless checkout with Bookings, and an OpenAI RAG chat feature across 48+ custom WordPress plugins and 20 Next.js API routes.

---

### 3-Sentence Summary

ChiroStretch is a headless franchise platform for a chiropractic network, built on Next.js 16.1 App Router (Vercel) with WordPress as the CMS and commerce backend (Cloudways). The frontend consumes a WPGraphQL API extended with custom mutations for headless authentication, coupon generation, booking management, and order creation, while 48+ custom mu-plugins handle content sync, CRM integration, ISR cache invalidation, and WooCommerce session management for the decoupled checkout. Key integrations include a bidirectional Algolia search pipeline across 4 content types, a dual-entry Zoho CRM lead capture system, WooCommerce Bookings with real-time slot availability, and a custom OpenAI RAG chat widget with pgvector storage — all instrumented with a CI/CD pipeline, Lighthouse performance budgets, and an agentic development workflow.

---

### ~150-Word Summary

ChiroStretch is a headless WordPress + Next.js 16.1 platform built for a multi-location chiropractic franchise network. The architecture separates the CMS and commerce backend (WordPress on Cloudways, 48+ custom mu-plugins, 17 ACF field groups) from the frontend (Next.js on Vercel, CSS Modules design system, 17 WPGraphQL query files), connected via WPGraphQL and WooCommerce Store API.

Key technical scope:

- **Headless WooCommerce checkout**: Zustand cart, Store API session management, custom `createCheckoutOrder` GraphQL mutation returning payment URL, WP-side redirect enforcement
- **WooCommerce Bookings**: REST API for real-time slot availability, GraphQL type exposure, "in-cart" reservation system, BookingWidget with date/time selection
- **Algolia search**: bidirectional sync pipeline across locations, events, articles, and products; webhook-triggered with unit-tested API routes
- **Zoho CRM**: dual entry points — WooCommerce purchase conversion and Gravity Forms franchise inquiry
- **OpenAI RAG chat**: WPGraphQL ingest → pgvector → streaming gpt-4o-mini, with in-memory fallback
- **New patient conversion pipeline**: form → coupon generation ($70 discount, email-locked) → discounted booking → CRM promotion
- **ISR revalidation**: tag-based invalidation across 11 content types via WordPress webhooks

CI/CD: GitHub Actions with lint, Vitest, Lighthouse CI (A11y ≥90%, LCP ≤2500ms); WordPress auto-deployed via SSH rsync. Structured agent task playbooks for AI-assisted development.
