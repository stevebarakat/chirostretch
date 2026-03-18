# ChiroStretch — Technical Project Brief

> **Purpose**: Factual, evidence-based technical audit for portfolio and case study use.
> **Accuracy standard**: Feature statuses are derived from code inspection, not deployment verification. See Section 14 for caveats.
> **Date**: 2026-03-18

---

## 1. Executive Summary

ChiroStretch is a headless WordPress + Next.js platform designed for a chiropractic franchise network. The system supports multi-location discovery, appointment booking via WooCommerce Bookings, e-commerce, content publishing, and CRM lead capture. The frontend is a Next.js 16.1 App Router application; the CMS is a heavily customized WordPress instance with 48+ mu-plugins, 17 ACF field groups, and a custom theme providing a structured content API via WPGraphQL.

Key technical scope: custom WooCommerce headless checkout with payment URL handoff, bidirectional Algolia search sync across 4 content types, Zoho CRM integration with dual entry points, an OpenAI-powered RAG chat widget with pgvector, WooCommerce Bookings with real-time slot availability, ISR-driven cache invalidation via webhook, Gravity Forms headless integration with dynamic Zod validation, and a CI/CD pipeline with lint/test/build/performance gates.

The system is designed for Vercel (frontend) + Cloudways (WordPress). The Cloudways environment has been decommissioned for cost reasons; no production environment is currently active.

---

## 2. Business Concept

ChiroStretch is a chiropractic franchise concept targeting patients seeking stretch therapy and spinal care. The platform serves three audiences simultaneously:

- **Patients** — find nearby locations, book initial consultations ($99 with $70 new-patient coupon), browse educational content, interact with AI chat assistant
- **Franchisees** — inquiry and onboarding flow via Gravity Forms → Zoho CRM; custom WordPress dashboard for managing location data and staff
- **Clinic operators** — manage location data, staff profiles, events, testimonials, and promotions through WordPress admin with role-based dashboards

The franchise model drives several architectural decisions: location-scoped content (CPTs, taxonomies), per-location practitioner assignment, location-scoped booking, and a Zoho CRM pipeline for tracking both patient conversions and franchise leads.

---

## 3. Primary Use Cases

| Use Case | Implementation Path |
|---|---|
| Patient finds nearby clinic | `/locations/[slug]` → ACF location data + Google Maps + practitioner cards + booking widget |
| Patient books initial consultation | Booking widget → WooCommerce Bookings slots API → cart → checkout → payment URL → Zoho lead creation |
| Patient receives new-patient discount | Gravity Form 17 (New Patient) → `generateNewPatientCoupon` mutation → $70 coupon (30-day expiry, email-locked) |
| Patient searches content/services | Algolia InstantSearch across articles, events, locations, products — context-aware search modal |
| Franchise inquiry | Gravity Form 17 → `/api/gravity-forms/submit` → Zoho CRM lead → follow-up pipeline |
| AI-assisted Q&A | OpenAI chat widget → RAG over WP content via pgvector → streaming `gpt-4o-mini` response |
| Content editor publishes update | WordPress save → ISR revalidation webhook → Next.js `revalidateTag()` cache purge |
| Content editor updates search | WordPress save → `algolia-sync.php` webhook → Next.js `/api/algolia/index-*` → Algolia record update |
| Staff profile management | Staff CPT publish → auto-creates WP user → sends password reset email → practitioner edits own profile |

---

## 4. Architecture Overview

```
┌───────────────────────────────────────────────────────┐
│                Vercel (Next.js 16.1)                  │
│  App Router · ISR · API Routes · React 19             │
│                                                       │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐        │
│  │ Marketing│  │ Content  │  │  Commerce    │        │
│  │  Routes  │  │  Routes  │  │   Routes     │        │
│  └──────────┘  └──────────┘  └──────────────┘        │
│                                                       │
│  API Routes: AI · Algolia(5) · Auth(2) · Bookings(3) │
│  Checkout · Coupons · Forms(2) · Orders · Redirects   │
│  Revalidate · Zoho(2)                                 │
└───────────────────────┬───────────────────────────────┘
                        │ WPGraphQL + WooCommerce REST + Store API
┌───────────────────────▼───────────────────────────────┐
│             Cloudways (WordPress)                     │
│  48+ mu-plugins · 17 ACF field groups · Custom theme  │
│  CPTs: Location, Practitioner, Testimonial            │
│  WooCommerce · WC Bookings · WPGraphQL · Gravity Forms│
│  Algolia sync webhooks · ISR revalidation webhooks    │
└───────────────────────────────────────────────────────┘
        │                    │                │
 ┌──────▼──────┐    ┌───────▼───────┐  ┌─────▼──────┐
 │   Algolia   │    │   Zoho CRM    │  │  Google    │
 │  4 indexes  │    │ Leads/Contacts│  │   Maps     │
 └─────────────┘    └───────────────┘  └────────────┘
        │
 ┌──────▼──────┐
 │ PostgreSQL  │
 │ (pgvector)  │
 │  AI docs    │
 └─────────────┘
```

**Data flow summary**: WordPress is the system of record. WPGraphQL exposes structured content to Next.js at build time (static) and on demand (ISR, 300s default). WooCommerce REST and Store API power the headless cart, booking slots, and checkout. Algolia receives content via webhook-triggered API routes on every WordPress save/delete. Zoho CRM receives leads from both WooCommerce order completion (product purchase) and Gravity Forms submission (franchise inquiry). The checkout creates a WooCommerce order and returns a `paymentUrl` — payment processing happens on the WordPress side via whatever gateway plugin is configured.

---

## 5. Frontend Stack

**Runtime**: Next.js 16.1.6, React 19.2.4, TypeScript (strict mode, ES2020 target)

**Route groups** (`src/app/(site)/`):
- `(marketing)`: `/` (home), `/locations`, `/locations/[slug]`, `/events`, `/events/[slug]`, `/pricing`, `/franchise`, `/thank-you/[type]`, catch-all `[...slug]`
- `(content)`: `/articles`, `/articles/[slug]`, `/tag/[slug]`
- `(commerce)`: `/shop`, `/shop/[slug]`, `/products`, `/category/[slug]`, `/cart`, `/checkout`, `/checkout/success`, `/account/orders`, `/account/orders/[id]`, `/account/set-password`

**API routes (20 endpoints)**:
- `/api/ai/chat` — OpenAI streaming with RAG context
- `/api/algolia/*` — 5 routes: index-articles, index-events, index-locations, index-products, check-status
- `/api/auth/*` — 2 routes: reset-password, validate-reset-key
- `/api/bookings/*` — 3 routes: products, slots, add-to-cart
- `/api/checkout/create-order` — WooCommerce order creation → returns paymentUrl
- `/api/coupons/validate` — coupon validation with email matching
- `/api/orders/[id]` — order detail lookup
- `/api/gravity-forms/*` — 2 routes: `[formId]` (fetch schema), submit
- `/api/redirects` — redirect table lookup
- `/api/revalidate` — ISR cache purge via tag
- `/api/zoho/callback`, `/api/zoho/test` — OAuth callback and dev verification

**Styling**: CSS Modules throughout (no Tailwind, no CSS-in-JS). Design tokens in `src/styles/tokens.css` — CSS custom properties for colors (HSL), spacing (4px–128px scale), typography, radius, shadows, transitions, breakpoints (640px–1536px). Tokens are environment-configurable via `scripts/generate-tokens.ts`.

**Component system**: Primitive components in `src/components/Primitives/`:
- `Base/`: Button, ButtonIcon, Input, Text (polymorphic)
- `Display/`: StarRating
- `Feedback/`: Alert, Modal, Toast, Skeleton
- `Forms/`: FormField, FormErrors
- `Layout/`: Container, Divider, SectionHeading
- `Media/`: ImageWrapper, NoImage
- `Utility/`: Flex, FlipMotion, VisuallyHidden

**State management**:
- Zustand: cart store (`src/stores/useCartStore.ts`) with localStorage persistence, hydration, and full CRUD operations
- React Context: EventsContext for event state

**Data fetching**: `wpQuery()` function (`src/lib/cms/graphql.ts`) — server-side only, Next.js fetch with ISR caching (`revalidate: 300`, cache tags). Development mode uses `cache: "no-store"`.

**GraphQL**: 17 query files in `src/lib/graphql/queries/` covering locations, events, articles, products, bookings, franchise, homepage, layout, menus, pages, posts, services, testimonials, value-propositions, footer-content, gravity-forms. Types codegen'd into `src/lib/graphql/generated/graphql.ts` (45,000+ lines). Mutations in `src/lib/graphql/mutations.ts`: password reset, coupon generation/validation, checkout order creation.

**Search**: Algolia InstantSearch React — 4 faceted search implementations: ProductsSearch, ArticlesSearch, EventsSearch, LocationsSearch. Context-aware SearchModal switches index based on current page. Config in `src/config/algolia.config.ts`.

**Forms**: React Hook Form + Zod validation. `GravityForm` component (`src/components/GravityForm/`) fetches form schema from WordPress via GraphQL, generates Zod validation schemas from field definitions at runtime (`src/lib/forms/schema-generator.ts`), maps errors (`src/lib/forms/error-mapper.ts`), and submits to Next.js API routes. Unit-tested: `checkout-schema.test.ts`, `schema-generator.test.ts`, `error-mapper.test.ts`.

**Commerce client**: WooCommerce Store API wrapper (`src/lib/commerce/storeApi.ts`) with cookie forwarding for session management. Server-side cart fetching (`src/lib/commerce/getServerCart.ts`).

**Booking system**: BookingWidget component (`src/components/Bookings/`) with ServiceSelect, DateStrip, TimeSlotGrid sub-components. URL-based state management via `useBookingParams.ts` hook. API routes proxy to WooCommerce Bookings REST endpoints.

**Maps**: Google Maps integration with LocationMap/LocationMapWrapper components. Requires Maps JavaScript API, Places API, Geocoding API.

**SEO**: `sitemap.ts`, `robots.ts`, JSON-LD structured data component (`src/components/JsonLd/`), per-page `metadata` exports.

**Animation**: `motion` (Framer Motion) for transitions, `hamburger-react` for menu toggle, `swiper` for carousels.

**Testing**: Vitest (unit, happy-dom environment), Playwright (E2E: cart, checkout, gravity-forms, search), Lighthouse CI (performance budgets).

**Custom hooks**: `useInfiniteScroll`, `useOnClickOutside`, `useOnScreen` (intersection observer), `useBookingParams`.

---

## 6. CMS / Backend Stack

**WordPress** with heavily customized `wp-content/` (only tracked artifact — no core files in repo).

**Theme**: `chirostretch-theme` — custom theme (not Storefront, not a starter). Registers 8 navigation menus (Header 1–4, Footer 1–4). Enqueues CSS: reset, fonts, tokens, header, footer. Template files exist (`single.php`, `page.php`, `archive.php`, etc.) but rendering is primarily headless. The theme provides server-side menu registration and basic WP admin styling.

**48+ mu-plugins** organized by function:

*Custom Post Types*:
- `locations-cpt.php`: Location CPT with address, coordinates, hours, phone, email, franchisee (user relationship), short description. WPGraphQL types registered. Computed `servicesOffered` field derived from assigned practitioners.
- `staff-cpt.php`: Practitioner CPT with location assignment, job title, credentials, bio, headshot, `accepting_patients`, `is_public` flags. Auto-creates WordPress user on publish with password reset email. Staff can edit their own profiles.
- `testimonials-cpt.php`: Testimonial CPT with rating (1–5), review text, location ID (can be global or location-specific).

*Custom Taxonomies* (`practitioner-taxonomies.php`):
- `discipline` (single-select): Chiropractor, Physical Therapist, Massage Therapist, Athletic Therapist
- `service` (multi-select): Chiropractic, Stretch Therapy, Massage, Sports Medicine
- `specialty` (multi-select): Sports Injuries, Back Pain, Neck Pain, Headaches, Posture Correction, Wellness, Flexibility, Rehab, Deep Tissue, Swedish, Trigger Point, Myofascial Release, Prenatal Care

*WooCommerce extensions*:
- `woocommerce-headless-checkout-redirect.php`: intercepts WP checkout, redirects to payment URL
- `woocommerce-session-for-all-users.php`: enables sessions for unauthenticated users
- `woocommerce-auto-customer-accounts.php`: auto-creates accounts on checkout
- `woocommerce-account-settings.php`: locks account creation checkbox
- `persistent-cart-restore.php`: restores cart state
- `bookings-slots-api.php`: REST API for WooCommerce Bookings availability (`/wp-json/chirostretch/v1/bookings/slots`) and add-to-cart (`/wp-json/chirostretch/v1/bookings/add-to-cart`). Handles date availability rules, time slot generation, resource assignment, "in-cart" booking status.
- `wpgraphql-woocommerce-bookings.php`: GraphQL types for booking products (`chsBookingProduct`), booking availability, booking resources. Exposes duration, cost, persons, resources, confirmation/cancellation rules, calendar display mode.

*WPGraphQL extensions*:
- `graphql-mutations.php`: Custom mutations — `updateFranchiseLocation`, `createStaff`, `updateStaff`, `deleteStaff` (role-based authorization)
- `graphql-auth-coupon-mutations.php`: `requestPasswordReset`, `validatePasswordResetKey`, `resetPassword`, `generateNewPatientCoupon` ($70 discount, 30-day expiry, email-restricted, single-use), `validateCoupon` (email must match `_new_patient_email` meta), `createCheckoutOrder` (returns `paymentUrl`)
- `headless-link-rewriter.php`: rewrites internal WordPress URLs to Next.js routes in GraphQL/REST responses
- `graphql-data-loaders-compat.php`: data loader compatibility
- `ql-events-resolve-post-object-compat.php`, `ql-events-fix.php`: Events Calendar GraphQL fixes

*External integrations*:
- `algolia-sync.php`: hooks `save_post_location`, `save_post_post`, `save_post_product`, `trash_post` → fires webhooks to Next.js `/api/algolia/index-*` with `X-Webhook-Secret` header
- `zoho-lead-converter.php`: hooks `woocommerce_order_status_completed` → if order contains product ID 7149 (Initial Consultation), promotes Zoho lead to contact
- `setup-zoho-crm-feed.php`: Gravity Forms form 17 field mapping to Zoho CRM lead fields

*Infrastructure*:
- `nextjs-revalidation.php`: hooks post/term/menu/media/product changes → POST to `/api/revalidate` with tag and `X-Revalidate-Secret`. Tags: locations, events, practitioners, products, posts, pages, testimonials, services, options, menus, media
- `_env-loader.php`: blocks dev-only plugins in production
- `headless-password-reset.php`: REST API password reset (no WP email — Next.js sends via external provider)
- `user-registration-api.php`: REST API for Gravity Forms user registration
- `location-organizer-sync.php`: syncs locations to The Events Calendar organizers

*Admin/Dashboard*:
- `chirostretch-dashboards.php`: role-based admin dashboards with templates (`dashboard-franchisee.php`, `dashboard-staff.php`)
- `chirostretch-bulk-importer.php`: bulk import utilities
- Dev-only seeders: `chirostretch-locations-seeder.php`, `chirostretch-services-seeder.php`, `chirostretch-staff-seeder.php`
- `admin-cleanup.php`: removes unnecessary WP admin UI elements
- `acf-admin-styles.php`: ACF field layout improvements
- `block-whitelist.php`: restricts available Gutenberg blocks
- `mailhog-smtp.php`: local email testing (blocked in production by `_env-loader.php`)

*Options pages*:
- `feature-options.php`: feature toggles
- `services-options.php`: services configuration
- `business-info-options.php`: business information
- `redirect-options.php`: redirect management

**17 ACF field groups** (JSON-tracked in `acf-json/`):
- Location details (address, coordinates, hours, booking config)
- Testimonial meta
- Business info (global options page — phone, address, social)
- Announcement bar (site-wide dismissible banner)
- Feature blocks (flexible content for pages)
- Services settings (icons, descriptions)
- Site settings options page
- Various options pages exposed via WPGraphQL

**Custom REST API endpoints**:
| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/wp-json/chirostretch/v1/bookings/slots` | GET | Booking availability |
| `/wp-json/chirostretch/v1/bookings/add-to-cart` | POST | Add booking to cart |
| `/wp-json/chirostretch/v1/coupons/validate` | POST | Validate coupon code |
| `/wp-json/chirostretch/v1/auth/request-reset` | POST | Request password reset |
| `/wp-json/chirostretch/v1/auth/validate-reset-key` | POST | Validate reset key |
| `/wp-json/chirostretch/v1/auth/reset-password` | POST | Reset password |
| `/wp-json/chirostretch/v1/user-registration/process` | POST | GF user registration |

**Expected WP plugins** (not tracked in repo, per `.gitignore`):
- WooCommerce (core commerce)
- WooCommerce Bookings (confirmed by `wpgraphql-woocommerce-bookings.php` and `bookings-slots-api.php` which reference `WC_Product_Booking` class)
- WPGraphQL (GraphQL endpoint)
- WPGraphQL for WooCommerce (WC schema extension)
- WPGraphQL JWT Authentication (`GRAPHQL_JWT_AUTH_SECRET_KEY` referenced)
- Gravity Forms (form IDs 16, 17, 18 referenced)
- ACF Pro (field groups in `acf-json/`)
- The Events Calendar (referenced by `ql-events-*.php` compatibility plugins and `location-organizer-sync.php`)

---

## 7. Key Integrations

### 7.1 Algolia Search — Status: Implemented

**Architecture**: Bidirectional sync pipeline.

*WordPress → Algolia*: `algolia-sync.php` hooks `save_post_*` and `trash_post` → fires HTTP POST to Next.js API routes (`/api/algolia/index-*`) with `X-Webhook-Secret` header and payload `{ post_id, action: 'save'|'delete' }`. Next.js fetches post data, transforms to Algolia record format (ID: `{type}_{post_id}`), and indexes.

*Algolia → Frontend*: `src/config/algolia.config.ts` defines 4 indices (configurable via env vars): `products`, `events`, `articles`, `locations`. `src/lib/search/client.ts` initializes the Algolia JS client. 4 faceted InstantSearch components (ProductsSearch, ArticlesSearch, EventsSearch, LocationsSearch) with infinite scroll. Context-aware SearchModal switches index based on current page.

*Status check*: `/api/algolia/check-status` reports record counts per index.

*Bulk operations*: `pnpm algolia:reindex` for full re-index.

*Test coverage*: Unit tests for index-articles, index-events, index-locations, index-products routes.

**Activation requirements**: `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`, `ALGOLIA_ADMIN_API_KEY`.

### 7.2 Zoho CRM — Status: Implemented

**Two entry points**:

1. *WooCommerce purchase*: `zoho-lead-converter.php` hooks `woocommerce_order_status_completed` (priority 25). If order contains product ID 7149 (Initial Consultation), searches for existing Zoho lead by email, updates status, and converts lead to contact.

2. *Gravity Forms franchise inquiry*: `setup-zoho-crm-feed.php` maps Gravity Form 17 fields to Zoho CRM lead fields. Frontend submits to `/api/gravity-forms/submit` → GF processes → Zoho feed fires.

**Frontend client**: `src/lib/zoho/client.ts` implements OAuth2 with refresh token flow. Token caching: in-memory with 50-minute TTL (expires_in minus 60s margin). Methods: search leads by email, update lead status, convert lead to contact. `/api/zoho/callback` handles OAuth redirect; `/api/zoho/test` is a dev verification route.

**Activation requirements**: `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN`. Optional: `ZOHO_API_DOMAIN` (default: `https://www.zohoapis.com`), `ZOHO_ACCOUNTS_DOMAIN` (default: `https://accounts.zoho.com`).

### 7.3 WPGraphQL — Status: Implemented

Custom types registered for Location, Practitioner, Testimonial, and BookingProduct with all ACF/computed fields exposed.

Custom mutations in `graphql-auth-coupon-mutations.php`:
- `requestPasswordReset(email)` → returns `{ success, user { key, login, email, firstName } }` — does NOT send WP email; Next.js handles email delivery
- `validatePasswordResetKey(key, login)` → `{ valid, userLogin, error }`
- `resetPassword(key, login, password)` → `{ success, error, message }`
- `generateNewPatientCoupon(email, firstName, userId, entryId)` → `{ success, couponCode, discountAmount, finalPrice, expires }` — $70 fixed discount, 30-day expiry, email-locked, single-use
- `validateCoupon(couponCode, email)` → `{ valid, discountAmount, discountType, error }` — email must match `_new_patient_email` meta
- `createCheckoutOrder(billing, shipping, lineItems, couponCode)` → `{ success, orderId, orderKey, paymentUrl }` — returns WP payment URL

Staff/location mutations in `graphql-mutations.php`:
- `updateFranchiseLocation(id, title, phone, email, description, address, hours)` — franchisee authorization
- `createStaff`, `updateStaff`, `deleteStaff` — role-based access

`headless-link-rewriter.php` rewrites all internal WordPress URLs in GraphQL/REST responses to Next.js frontend URLs.

17 query files in `src/lib/graphql/queries/` + fragments file. Types codegen'd from live WP schema.

**Security**: Mutations requiring `X-Internal-Secret` header: `generateNewPatientCoupon`, `validateCoupon`, `createCheckoutOrder`. JWT for authenticated user mutations.

### 7.4 Gravity Forms — Status: Implemented

Three forms referenced in code:
- **Form 16** (Franchise): GA tracking on submit
- **Form 17** (New Patient Special): generates new-patient coupon + GA tracking
- **Form 18** (Contact): GA tracking on submit

`src/components/GravityForm/GravityForm.tsx` fetches form schema from WordPress via GraphQL, generates Zod validation schema from field definitions at runtime (`src/lib/forms/schema-generator.ts`), maps GF validation errors to React Hook Form format (`src/lib/forms/error-mapper.ts`), and submits to `/api/gravity-forms/submit`. Unit-tested with dedicated test files.

### 7.5 OpenAI RAG Chat — Status: Implemented

**Pipeline**:
- `scripts/ai/ingest.ts`: fetches WP content via WPGraphQL (`src/lib/ai/wpgraphql.ts`) → chunks (`src/lib/ai/chunk.ts`) → embeds with `text-embedding-3-small` (1536-dim) → stores in pgvector (`ai_documents` table)
- `src/lib/ai/chat.ts`: user query → embedding → cosine similarity search → context assembly → `gpt-4o-mini` streaming response
- `src/lib/ai/vectorStore.ts`: in-memory fallback when `DATABASE_URL` is not set
- `migrations/001_ai_documents.sql`: pgvector extension + table schema
- `src/components/ai/ChatWidget.tsx`: client-side chat UI

**Commands**: `pnpm ai:ingest`, `pnpm ai:ingest:full`, `pnpm ai:reset`

**Activation requirements**: `OPENAI_API_KEY`. PostgreSQL with pgvector is optional (in-memory fallback available for stateless deployments).

### 7.6 ISR Revalidation — Status: Implemented

`nextjs-revalidation.php` hooks WordPress post save, delete, term changes, menu updates, media changes, and product changes. On content change, sends authenticated POST to `/api/revalidate` with affected cache tag and `X-Revalidate-Secret` header. The Next.js route calls `revalidateTag()` for targeted invalidation.

**Cache tags**: locations, events, practitioners, products, posts, pages, testimonials, services, options, menus, media.

**Default ISR**: 300 seconds. On-demand revalidation supplements the time-based strategy.

### 7.7 Google Maps — Status: Implemented

LocationMap and LocationMapWrapper components render clinic locations. Used on location detail pages and location search. Requires Maps JavaScript API, Places API, and Geocoding API.

**Activation requirements**: `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

### 7.8 WooCommerce Bookings — Status: Implemented

`bookings-slots-api.php` exposes REST endpoints for real-time slot availability. Handles date rules, time slot generation, resource assignment, and "in-cart" status (reserves slot until purchase; cart item removal cancels booking).

`wpgraphql-woocommerce-bookings.php` registers GraphQL types: `chsBookingProduct` (duration, cost, persons, resources, confirmation/cancellation rules, calendar display mode), `bookingAvailability`, `bookingResources`.

Frontend: BookingWidget with ServiceSelect, DateStrip, TimeSlotGrid sub-components. URL-based state management.

**Dependency**: Requires WooCommerce Bookings plugin installed on WordPress (class `WC_Product_Booking` referenced directly).

---

## 8. Content Model

### Custom Post Types
| CPT | Slug | Key Fields | WPGraphQL |
|---|---|---|---|
| Location | `locations` | Address (street, city, state, zip), coordinates (lat/lng), phone, email, hours (repeater), franchisee (user), short_description, computed `servicesOffered` | `Location` / `Locations` |
| Practitioner | (not public) | assigned_location, job_title, credentials, bio, headshot, accepting_patients, is_public, staff_email, user_account | `Practitioner` / `Practitioners` |
| Testimonial | (not public) | rating (1–5), review_text, location (can be global or location-specific) | `Testimonial` / `Testimonials` |
| Event | (via The Events Calendar) | Title, date, location, description, featured image, registration | Via QL Events plugin |

### Taxonomies (assigned to Practitioner)
- **Discipline** (single-select): Chiropractor, Physical Therapist, Massage Therapist, Athletic Therapist
- **Service** (multi-select): Chiropractic, Stretch Therapy, Massage, Sports Medicine
- **Specialty** (multi-select): Sports Injuries, Back Pain, Neck Pain, Headaches, Posture Correction, Wellness, Flexibility, Rehab, Deep Tissue, Swedish, Trigger Point, Myofascial Release, Prenatal Care

### ACF Field Groups (17 total)
- `group_chiro_location.json` — Location details (address, coordinates, hours, booking config)
- `group_testimonial.json` — Testimonial fields
- `group_business_info.json` — Business info (global options page)
- `group_announcement_bar.json` — Announcement bar config
- `group_feature.json` — Feature content
- `group_services_settings.json` — Services settings
- `ui_options_page_site_settings.json` — Site settings options page
- 10 additional numbered groups for editorial/configuration fields

### WooCommerce Products
- Initial Consultation (product ID 7149 — hardcoded in `zoho-lead-converter.php`)
- Booking-type products with duration, cost, resources, and availability rules
- General products browsable in `/shop`

### Relationships
- Practitioner → Location (assigned_location field)
- Testimonial → Location (location field, optional — global if unset)
- Location → Practitioners (computed reverse relationship, filtered by `is_public`)
- Location → Services Offered (computed from practitioners' service taxonomies)
- Event → Location (via The Events Calendar organizer sync)

---

## 9. Commerce Capabilities

**Headless WooCommerce**: Store API wrapper (`src/lib/commerce/storeApi.ts`) with cookie forwarding for session management. Server-side cart fetching (`src/lib/commerce/getServerCart.ts`).

**Cart**: Zustand store (`src/stores/useCartStore.ts`) with localStorage persistence key `chirostretch-cart`. Methods: `hydrateFromLocalStorage`, `fetchCart`, `addToCart`, `updateCartItem`, `removeCartItem`, `clearCart`. CartProvider context + CartBadge component.

**Checkout flow**:
1. Next.js `/cart` page → user reviews items
2. Next.js `/checkout` page → billing/shipping form with Zod validation (`src/lib/forms/checkout-schema.ts`) + coupon code input
3. `POST /api/checkout/create-order` → `createCheckoutOrder` GraphQL mutation → WooCommerce creates pending order → returns `{ orderId, orderKey, paymentUrl }`
4. User redirected to `paymentUrl` (WordPress-hosted payment page — gateway plugin handles payment)
5. On completion → redirect to `/checkout/success` with order key for confirmation

**Headless redirect**: `woocommerce-headless-checkout-redirect.php` intercepts any WP-side checkout access and redirects to the Next.js checkout URL.

**Booking commerce**:
- BookingWidget selects service → date → time slot
- `POST /api/bookings/add-to-cart` → WooCommerce Bookings creates "in-cart" reservation
- Slot removed from availability until checkout completes or cart item removed
- Booking metadata attached to order line items

**New Patient Coupon system**:
- Gravity Form 17 submission triggers `generateNewPatientCoupon` mutation
- Creates WooCommerce coupon: $70 fixed discount, 30-day expiry, single-use, email-restricted via `_new_patient_email` meta
- Validation requires email match: coupon code + customer email must correspond
- Brings $99 Initial Consultation to $29

**Account**: `/account/set-password` (password reset flow), `/account/orders` (order listing), `/account/orders/[id]` (order detail with `order_key` verification).

**CRM sync**: Initial Consultation purchase (product 7149) automatically promotes Zoho CRM lead to contact.

---

## 10. User Experience Features

- **Multi-location discovery**: Location index page with Algolia-powered search. Location detail pages with address, hours, Google Maps embed, practitioner cards, service tabs, testimonials, value propositions, and booking widget
- **Practitioner profiles**: PractitionerCard components showing name, title, credentials, headshot, disciplines, services, specialties, accepting-patients status
- **Appointment booking**: ServiceSelect → DateStrip → TimeSlotGrid → real-time slot availability → add to cart
- **Pricing page**: InitialConsultation component, PricingTabs with SingleSessionCard and ValuePackageCard, BenefitsSection, PricingFAQ
- **AI chat assistant**: Streaming OpenAI responses grounded in site content via RAG with pgvector
- **Multi-context search**: Algolia InstantSearch with SearchModal that adapts index/facets based on current page context. Separate search modals for locations and events
- **Content publishing**: Articles with tag filtering, infinite scroll, ArticleCard previews
- **Events**: EventsCalendar view, EventsGrid view, Algolia-powered EventsSearch, ExpandedEventModal for detail, EventRegistration form
- **E-commerce**: Product gallery with image magnifier, product info, related products, category/tag browsing
- **Announcement bar**: ACF-controlled, site-wide dismissible banner
- **New Patient Special flow**: Gravity Forms → email capture → coupon generation → discounted booking
- **Franchise inquiry**: Dedicated `/franchise` page with Gravity Form → Zoho CRM lead
- **ISR-powered performance**: Static pages with on-demand revalidation; WordPress changes reflect within seconds
- **Headless checkout**: Full WooCommerce commerce without WP frontend — client-side cart persistence, server-side session management
- **SEO**: JSON-LD structured data, sitemap, robots.txt, per-page metadata
- **Password reset**: Custom GraphQL mutations + Next.js routes — full flow without exposing WP admin
- **Order history**: Authenticated account section with order listing and detail views
- **Hero sections**: Configurable Hero component for landing pages
- **Statistics display**: Stats component with react-countup animation
- **Promotional banners**: Promotion component for marketing campaigns
- **Toast notifications**: Global toast system for user feedback
- **Loading states**: Skeleton components and Loader throughout

---

## 11. DevOps / Hosting / Deployment

### Designed Infrastructure
- **Frontend**: Vercel (Next.js auto-detected). Build command: `pnpm build`. Install: `pnpm install`. Node 20.x. Environments: production (`chirostretch.com`), staging (`staging.chirostretch.com`), preview (feature branches).
- **CMS**: Cloudways managed WordPress hosting (documented as `cms.chirostretch.com`). SSH-based deployment via rsync.

### Evidence of Previous Deployment
- `deploy-wordpress.yml` contains SSH rsync deployment to Cloudways with secrets for `CLOUDWAYS_SSH_KEY`, `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_PORT`, `CLOUDWAYS_WP_PATH`. Post-deploy: `wp cache flush`.
- `docs/deployment.md` describes full Vercel + WordPress deployment procedures with environment-specific instructions.
- `.env.example` contains comprehensive variable documentation for all environments.

### Currently Verifiable Active Infrastructure
- **None confirmed**. Cloudways environment decommissioned for cost reduction. No `vercel.json` in repo (Vercel auto-detects Next.js). No deployment logs or URLs verifiable from static analysis.

### CI/CD Pipeline (`.github/workflows/`)
| Workflow | Trigger | Steps |
|---|---|---|
| `ci.yml` | Push/PR to main, develop | Install (pnpm, frozen lockfile) → Lint → Test (Vitest) → Build |
| `deploy-wordpress.yml` | Push to main (`system/apps/cms/wp-content/**`) + manual | SSH rsync to Cloudways → `wp cache flush` |
| `claude.yml` | Issue/PR comments mentioning `@claude` | Claude Code agent-driven task execution |

### Performance Monitoring
Lighthouse CI (`lighthouserc.js`):
- **URLs tested**: `/`, `/locations`, `/shop`, `/cart` (3 runs each, averaged)
- **Thresholds**: Performance 70% (warn), Accessibility 90% (error), Best Practices 80% (warn), SEO 80% (warn)
- **Core Web Vitals**: LCP ≤2500ms, FCP ≤1800ms, CLS ≤0.1, TBT ≤300ms
- **Storage**: Filesystem (`.lighthouseci/`)

### Caching Strategy
- **ISR**: 300s default revalidation + on-demand via webhook tags
- **Static assets**: 1-year immutable cache headers (`/_next/static/*`, `/_next/image`, `/images/*`)
- **Image optimization**: WebP/AVIF with device sizes 640–3840px, image sizes 16–384px
- **Development**: `cache: "no-store"` — no caching

### Bundle Analysis
`ANALYZE=true pnpm build` or `pnpm analyze` — `@next/bundle-analyzer` outputs to console.

### Agent-Driven Operations
`agents/` contains 6 agent documentation files + 5 task playbooks: architecture, CSS, frontend, identity-charter, testing, WordPress, WooCommerce. Task playbooks: algolia-index, checkout-flow, react-component, web-dev, wp-block, wp-cpt. `AGENTS.md` (261 lines) defines project rules, conventions, and coding standards.

### Local Development
- pnpm workspaces (`system/pnpm-workspace.yaml`)
- `tsx` for TypeScript script execution
- HTTPS dev server (`pnpm dev`)
- Volta for Node/pnpm version pinning (Node 20.18.0, pnpm 10.27.0)
- MailHog for local email testing
- Self-signed certs (`NODE_TLS_REJECT_UNAUTHORIZED=0` in dev)
- Seed scripts: `scripts/cms/seed/` (EventGenerator, StaffGenerator, LocationGenerator, etc.)
- `codegen.ts` for GraphQL type generation (requires running WP instance)

---

## 12. Evidence-Based Feature Inventory

| Feature | Status | Evidence | Notes |
|---|---|---|---|
| Headless WordPress frontend | Implemented | `system/apps/ui/` — full Next.js 16.1 app with App Router | — |
| WPGraphQL content API | Implemented | 17 query files, custom mutations, codegen'd types (45k lines), fragments | — |
| Multi-location CPT + ACF | Implemented | `locations-cpt.php`, `group_chiro_location.json`, location routes | — |
| Practitioner CPT + taxonomies | Implemented | `staff-cpt.php`, `practitioner-taxonomies.php`, auto-user creation | — |
| Testimonials CPT | Implemented | `testimonials-cpt.php`, `group_testimonial.json` | — |
| Algolia search (4 types) | Implemented | `algolia-sync.php`, 5 API routes (with tests), 4 search components, config | Requires API keys |
| Zoho CRM — WC purchase | Implemented | `zoho-lead-converter.php` hooks order completion for product 7149 | Product ID hardcoded |
| Zoho CRM — Gravity Forms | Implemented | `setup-zoho-crm-feed.php`, GF form 17 | — |
| Zoho CRM — OAuth client | Implemented | `src/lib/zoho/client.ts` with token caching (50-min TTL) | — |
| Headless WooCommerce checkout | Implemented | Store API client, checkout route, redirect mu-plugin, `createCheckoutOrder` mutation | Payment on WP side |
| Headless cart (Zustand) | Implemented | `src/stores/useCartStore.ts` with localStorage, unit tested | — |
| WooCommerce Bookings | Implemented | `bookings-slots-api.php`, `wpgraphql-woocommerce-bookings.php`, BookingWidget components | Requires WC Bookings plugin |
| New Patient Coupon system | Implemented | `generateNewPatientCoupon` mutation, $70 discount, 30-day expiry, email validation | — |
| ISR revalidation | Implemented | `nextjs-revalidation.php`, `/api/revalidate`, 11 cache tags | — |
| OpenAI RAG chat | Implemented | Full pipeline: ingest, chunk, embed, store, retrieve, stream | Requires `OPENAI_API_KEY` |
| pgvector document store | Implemented | Migration SQL, `db.ts`, `vectorStore.ts`, in-memory fallback | Optional — has fallback |
| Gravity Forms React integration | Implemented | `GravityForm.tsx`, Zod schema gen, error mapper, 2 API routes | 3 forms referenced (16, 17, 18) |
| Password reset (headless) | Implemented | 3 GraphQL mutations + REST endpoints + Next.js API routes | WP does not send email |
| SEO (JSON-LD, sitemap, meta) | Implemented | `sitemap.ts`, `robots.ts`, `JsonLd` component, metadata exports | — |
| Google Maps | Implemented | LocationMap components, API key in env | Requires API key |
| CI/CD (lint/test/build) | Implemented | `.github/workflows/ci.yml` | — |
| WordPress auto-deploy | Implemented | `deploy-wordpress.yml` with SSH + rsync + cache flush | Cloudways env removed |
| Lighthouse CI | Implemented | `lighthouserc.js` with thresholds for 4 pages | — |
| Booking widget | Implemented | BookingWidget, ServiceSelect, DateStrip, TimeSlotGrid, 3 API routes | Requires WC Bookings |
| Primitive component system | Implemented | 15+ primitives: Button, Input, Text, Flex, Modal, Toast, Skeleton, etc. | — |
| Pricing page | Implemented | InitialConsultation, PricingTabs, SingleSessionCard, ValuePackageCard, FAQ | — |
| Events system | Implemented | Events routes, EventsCalendar, EventsGrid, EventsSearch, registration | Requires The Events Calendar |
| Franchise inquiry flow | Implemented | `/franchise` route, GF form 17 → Zoho CRM | — |
| Staff auto-provisioning | Implemented | `staff-cpt.php` auto-creates WP user + password reset on publish | — |
| Role-based dashboards | Implemented | `chirostretch-dashboards.php`, franchisee + staff templates | — |
| Seed/demo data generators | Implemented | `scripts/cms/seed/` + WP-CLI importers (dev-only) | — |
| Agentic task playbooks | Implemented | `agents/` (11 files), `AGENTS.md`, `claude.yml` | — |
| E-commerce (shop) | Implemented | Shop routes, product pages, gallery, related products | Demo catalog |
| Account / order history | Implemented | `/account/orders/[id]`, auth routes | — |
| Coupon validation | Implemented | GraphQL mutation, validate API route, email matching | — |
| Payment processing | Unclear | Checkout creates order + returns paymentUrl | Gateway not visible in code |
| Email notifications | Partial | `RESEND_API_KEY` in .env.example; `headless-password-reset.php` skips WP email | Resend configured but implementation scope unclear |
| Analytics | Partial | GA event tracking in form submit handlers; LHCI performance monitoring | No dedicated GA integration found |
| Events Calendar plugin | Implied | `ql-events-*.php` compatibility plugins, `location-organizer-sync.php` | Plugin not in repo |

---

## 13. Strongest Portfolio Angles

**1. Headless WordPress at production depth**
Full separation of WordPress (CMS/commerce) from Next.js (frontend), including headless checkout with payment URL handoff, headless auth, headless booking, and a 48+ mu-plugin custom integration layer. Not a tutorial implementation — the mu-plugin count alone reflects production-depth architecture.

**2. Bidirectional Algolia sync pipeline**
WP save/delete hooks → webhook → Next.js transform → Algolia index. Four content types. Unit-tested API routes. Bulk re-index. Status check endpoint. This is a common enterprise requirement that most headless WP implementations skip.

**3. WooCommerce Bookings headless integration**
Real-time slot availability via REST API, GraphQL type exposure for booking products, "in-cart" reservation system, and a custom BookingWidget with date/time selection. Demonstrates ability to take a complex WP plugin and expose it cleanly in a headless frontend.

**4. Zoho CRM integration (dual entry points)**
Both a product-purchase-to-contact conversion and a Gravity Forms franchise inquiry flow route into Zoho. OAuth2 client with in-memory token caching. Demonstrates understanding of multi-channel CRM lead capture with real business logic (Initial Consultation purchase → lead promotion).

**5. OpenAI RAG feature with production fallback**
Full ingest-embed-store-retrieve pipeline with pgvector. In-memory fallback makes it deployable without a database. Streaming response. Custom implementation over site-specific content without a third-party RAG framework.

**6. Gravity Forms headless integration with dynamic validation**
Fetches form schema from WP, generates Zod validation schemas at runtime, renders dynamically, submits via API routes. Form management stays in WP admin without frontend deploys. Three forms with distinct post-submit workflows (coupon generation, GA tracking).

**7. Multi-tenant franchise architecture**
Location CPTs, per-location practitioner assignment with taxonomies, location-scoped booking, computed services-offered, role-based dashboards (franchisee, staff), auto-user provisioning on staff publish. The data model scales across clinic locations.

**8. New Patient conversion pipeline**
Gravity Form → coupon generation ($70 discount, email-locked, 30-day expiry) → discounted booking → WooCommerce order → Zoho CRM lead promotion. Full funnel from lead capture to CRM conversion, implemented across WordPress, Next.js, and Zoho.

---

## 14. Risks / Caveats / What Not to Overstate

**Infrastructure is not currently live**
Cloudways environment removed for cost reasons. No production deployment is verifiable. Use language like "designed for," "built for," or "configured for Vercel + Cloudways" — not "currently serving traffic."

**Payment gateway is not visible**
Checkout order creation is implemented and returns a `paymentUrl`. The actual payment processing (Stripe, Square, etc.) is handled by whatever WooCommerce gateway plugin is installed on WordPress. The gateway configuration is not in the codebase.

**WP plugins are not tracked**
WooCommerce, WC Bookings, WPGraphQL, Gravity Forms, ACF Pro, The Events Calendar, and JWT Auth are expected dependencies based on code references, but their versions, configuration, and license status are not auditable from the repo.

**Product catalog is demo-configured**
Product ID 7149 is hardcoded in `zoho-lead-converter.php`. Seed generators exist for locations, staff, services. The system appears populated with demo/test content rather than live clinic data.

**Email provider partially configured**
`RESEND_API_KEY` appears in `.env.example` as optional. `headless-password-reset.php` explicitly does NOT send email via WordPress, implying Next.js handles it externally. The actual Resend client implementation scope is unclear from static analysis. MailHog handles local dev email.

**GraphQL types may be stale**
`generated/graphql.ts` (45k lines) is codegen'd from a running WP schema. Without a running WP instance, type freshness cannot be verified.

**AI chat re-ingest is manual**
No automated trigger for re-ingesting AI content when WordPress publishes. The RAG knowledge base requires manual `pnpm ai:ingest` after content changes.

**The Events Calendar plugin dependency**
Event functionality references The Events Calendar (TEC) via compatibility plugins. TEC is a third-party WordPress plugin with its own licensing. The events data model depends on it.

---

## 15. Recommended Upwork Case Study Framing

**Target framing**: "Headless WordPress + Next.js franchise platform with WooCommerce Bookings, Algolia, Zoho CRM, and OpenAI integration"

**Lead with architecture, not technology names**. Clients on Upwork understand "WordPress content powering a custom Next.js frontend" better than "WPGraphQL with ISR revalidation via webhook-triggered tag invalidation."

**Quantify where possible**:
- 48+ custom WordPress mu-plugins
- 17 WPGraphQL query files with codegen'd types
- 20 Next.js API routes
- 17 ACF field groups
- 4 Algolia-indexed content types
- 3 custom post types with 3 taxonomies
- CSS Modules throughout (no Tailwind dependency)

**Frame integrations as business outcomes**:
- Algolia: "patients can search clinics, events, articles, and products with faceted filtering and instant results"
- Zoho: "every Initial Consultation purchase and franchise inquiry automatically enters the CRM — zero manual data entry"
- WC Bookings: "patients book appointments with real-time slot availability, and slots are reserved the moment they're added to cart"
- OpenAI: "site visitors get instant answers to questions grounded in clinic-specific content, not generic AI responses"
- ISR: "WordPress editors see content changes reflected on the live site within seconds, without triggering a full rebuild"
- Coupons: "new patient discount flow — form submission generates a personalized $70 coupon that auto-validates at checkout"

**Honest scope statement**: "Designed and built the full-stack architecture. WordPress hosting environment was decommissioned to reduce costs; the frontend is Vercel-ready and the entire CMS integration layer (48+ mu-plugins, GraphQL mutations, webhook pipelines) is fully implemented and tracked in version control."

---

## 16. Supporting Evidence Appendix

### Key File Paths

| Artifact | Path |
|---|---|
| Next.js app root | `system/apps/ui/src/` |
| App Router routes | `src/app/(site)/(marketing\|content\|commerce)/` |
| API routes | `src/app/api/` |
| WordPress wp-content | `system/apps/cms/wp-content/` |
| mu-plugins directory | `system/apps/cms/wp-content/mu-plugins/` |
| ACF JSON field groups | `system/apps/cms/wp-content/acf-json/` |
| Custom theme | `system/apps/cms/wp-content/themes/chirostretch-theme/` |
| GraphQL queries | `system/apps/ui/src/lib/graphql/queries/` |
| GraphQL mutations | `system/apps/ui/src/lib/graphql/mutations.ts` |
| GraphQL fragments | `system/apps/ui/src/lib/graphql/queries/fragments.ts` |
| Codegen'd types | `system/apps/ui/src/lib/graphql/generated/graphql.ts` |
| WooCommerce Store API client | `system/apps/ui/src/lib/commerce/storeApi.ts` |
| Server-side cart | `system/apps/ui/src/lib/commerce/getServerCart.ts` |
| Cart store (Zustand) | `system/apps/ui/src/stores/useCartStore.ts` |
| Checkout schema (Zod) | `system/apps/ui/src/lib/forms/checkout-schema.ts` |
| Form schema generator | `system/apps/ui/src/lib/forms/schema-generator.ts` |
| Form error mapper | `system/apps/ui/src/lib/forms/error-mapper.ts` |
| Algolia config | `system/apps/ui/src/config/algolia.config.ts` |
| Algolia search client | `system/apps/ui/src/lib/search/client.ts` |
| Zoho OAuth client | `system/apps/ui/src/lib/zoho/client.ts` |
| AI lib directory | `system/apps/ui/src/lib/ai/` |
| AI chat API route | `system/apps/ui/src/app/api/ai/chat/route.ts` |
| Chat widget | `system/apps/ui/src/components/ai/ChatWidget.tsx` |
| pgvector migration | `system/apps/ui/migrations/001_ai_documents.sql` |
| AI ingest script | `system/apps/ui/scripts/ai/ingest.ts` |
| Booking widget | `system/apps/ui/src/components/Bookings/BookingWidget.tsx` |
| Booking slot API (WP) | `system/apps/cms/wp-content/mu-plugins/bookings-slots-api.php` |
| Booking GraphQL types (WP) | `system/apps/cms/wp-content/mu-plugins/wpgraphql-woocommerce-bookings.php` |
| Algolia sync (WP) | `system/apps/cms/wp-content/mu-plugins/algolia-sync.php` |
| Zoho lead converter (WP) | `system/apps/cms/wp-content/mu-plugins/zoho-lead-converter.php` |
| ISR revalidation (WP) | `system/apps/cms/wp-content/mu-plugins/nextjs-revalidation.php` |
| Auth/coupon mutations (WP) | `system/apps/cms/wp-content/mu-plugins/graphql-auth-coupon-mutations.php` |
| Staff mutations (WP) | `system/apps/cms/wp-content/mu-plugins/graphql-mutations.php` |
| Staff CPT (WP) | `system/apps/cms/wp-content/mu-plugins/staff-cpt.php` |
| Locations CPT (WP) | `system/apps/cms/wp-content/mu-plugins/locations-cpt.php` |
| Taxonomies (WP) | `system/apps/cms/wp-content/mu-plugins/practitioner-taxonomies.php` |
| Headless checkout redirect (WP) | `system/apps/cms/wp-content/mu-plugins/woocommerce-headless-checkout-redirect.php` |
| Dashboards (WP) | `system/apps/cms/wp-content/mu-plugins/chirostretch-dashboards.php` |
| Primitive components | `system/apps/ui/src/components/Primitives/` |
| Pricing components | `system/apps/ui/src/components/Pricing/` |
| Location components | `system/apps/ui/src/components/Locations/` |
| Events components | `system/apps/ui/src/components/Events/` |
| CSS design tokens | `system/apps/ui/src/styles/tokens.css` |
| Site config | `system/apps/ui/src/config/site.config.ts` |
| WordPress config | `system/apps/ui/src/config/wordpress.config.ts` |
| Seed generators | `system/apps/ui/scripts/cms/seed/` |
| Lighthouse CI | `system/apps/ui/lighthouserc.js` |
| E2E tests | `system/apps/ui/e2e/` |
| Agent playbooks | `agents/` |
| Project rules | `AGENTS.md` |
| CI workflow | `.github/workflows/ci.yml` |
| WP deploy workflow | `.github/workflows/deploy-wordpress.yml` |
| Claude workflow | `.github/workflows/claude.yml` |
| Documentation | `docs/` (17 files) |
| Environment template | `system/apps/ui/.env.example` |

### Integration Activation Requirements

| Integration | Required Env Vars / Credentials |
|---|---|
| Algolia | `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`, `ALGOLIA_ADMIN_API_KEY` |
| Zoho CRM | `ZOHO_CLIENT_ID`, `ZOHO_CLIENT_SECRET`, `ZOHO_REFRESH_TOKEN` |
| OpenAI / RAG | `OPENAI_API_KEY` |
| pgvector (optional) | `DATABASE_URL` (PostgreSQL with pgvector extension) |
| WPGraphQL | `NEXT_PUBLIC_WPGRAPHQL_ENDPOINT`, `NEXT_PUBLIC_BACKEND_URL` |
| WooCommerce | `WC_CONSUMER_KEY`, `WC_CONSUMER_SECRET` |
| ISR revalidation | `REVALIDATE_SECRET` shared between WP and Next.js |
| Algolia webhooks | `WP_WEBHOOK_SECRET` shared between WP and Next.js |
| Google Maps | `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` |
| Gravity Forms webhooks | `GRAVITY_FORMS_WEBHOOK_SECRET` |
| Internal server auth | `CHIROSTRETCH_INTERNAL_SECRET` (for coupon/checkout mutations) |
| Email (optional) | `RESEND_API_KEY`, `ADMIN_EMAIL` |
| JWT Auth | `GRAPHQL_JWT_AUTH_SECRET_KEY` (WordPress wp-config.php) |

---

## 17. Infrastructure Dependency Analysis

This section identifies which features require a live backend environment to demonstrate fully, and what alternatives exist for portfolio demonstrations.

| Feature | Backend Required? | Demo Alternative | Notes |
|---|---|---|---|
| GraphQL content queries | Yes — WordPress + WPGraphQL | Local WordPress (Docker/Local), screenshots, static HTML export | All content fetching depends on live WP |
| WooCommerce checkout | Yes — WP + WooCommerce | Screenshots, video walkthrough, local WP | Payment flow requires gateway plugin |
| WooCommerce Bookings | Yes — WP + WC Bookings plugin | Screenshots, mock data in components | Slot availability is real-time |
| Algolia search | Partial — needs indexed data | Algolia free tier with demo data, local indexing | Search UI works with any Algolia account |
| Zoho CRM integration | Yes — Zoho account + WP | Code walkthrough, architecture diagram | OAuth flow requires live credentials |
| Gravity Forms | Yes — WP + GF plugin | Screenshots, mock form rendering | Form schema fetched from WP at runtime |
| AI RAG chat | Partial — needs OpenAI API key | In-memory fallback works without database; needs API key | Demo-able with `OPENAI_API_KEY` alone |
| Google Maps | Partial — needs API key | Screenshots, mock component | Maps API has free tier |
| ISR revalidation | Yes — WordPress → webhook → Vercel | Architecture diagram, code walkthrough | Requires both systems running |
| Authentication/JWT | Yes — WordPress JWT plugin | Code walkthrough | Token generation requires WP |
| Password reset | Yes — WP + email provider | Code walkthrough, flow diagram | Multi-system flow |
| Coupon generation | Yes — WooCommerce | Code walkthrough | Coupon created in WC database |
| Static pages/SSG | No — build output works | `next build` + `next start` locally | Works with cached/mock data |
| CSS/design system | No | Storybook or standalone component demo | Tokens + modules are self-contained |
| Component library | No | Storybook, screenshots | Primitives work standalone |

**Recommendation**: A local WordPress instance (via LocalWP, Docker, or similar) with demo data seeded via the existing `scripts/cms/seed/` generators and WP-CLI importers would enable full-stack demonstration without production hosting costs. The AI chat feature can be demonstrated with just an OpenAI API key. Algolia can be demonstrated with a free-tier account and a single bulk index run.
