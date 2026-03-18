# ChiroStretch — Case Study Research Notes

> **Purpose**: Raw research document. Architecture notes, file path references, integration details, and unresolved ambiguities. Source material for the project brief and Upwork bullets.
> **Accuracy note**: All observations are from static code analysis. No running environment was inspected.
> **Date**: 2026-03-18

---

## Repo Structure Notes

```
chirostretch/
├── system/
│   ├── pnpm-workspace.yaml         # Monorepo root
│   └── apps/
│       ├── ui/                     # Next.js 16.1 app
│       │   ├── src/
│       │   │   ├── app/            # App Router
│       │   │   │   ├── (site)/     # 3 route groups
│       │   │   │   │   ├── (marketing)/
│       │   │   │   │   ├── (content)/
│       │   │   │   │   └── (commerce)/
│       │   │   │   └── api/        # 20 API endpoints
│       │   │   ├── components/     # 27+ component directories
│       │   │   ├── lib/            # Core libraries
│       │   │   │   ├── ai/         # RAG pipeline
│       │   │   │   ├── cms/        # WPGraphQL client
│       │   │   │   ├── commerce/   # Store API wrapper
│       │   │   │   ├── forms/      # GF + Zod integration
│       │   │   │   ├── graphql/    # Queries, mutations, generated types
│       │   │   │   ├── search/     # Algolia client
│       │   │   │   ├── zoho/       # CRM client
│       │   │   │   ├── redirects/  # Redirect matching
│       │   │   │   └── utils/      # formatPrice, etc.
│       │   │   ├── stores/         # Zustand (useCartStore)
│       │   │   ├── hooks/          # Custom hooks
│       │   │   ├── styles/         # tokens.css, reset.css, globals.css
│       │   │   ├── config/         # site, algolia, wordpress configs
│       │   │   ├── utils/          # formatBusinessHours, image-helpers
│       │   │   └── test/           # Test helpers & mocks
│       │   ├── scripts/
│       │   │   ├── ai/             # ingest.ts, reset.ts
│       │   │   ├── cms/seed/       # Demo data generators
│       │   │   ├── generate-tokens.ts
│       │   │   └── generate-redirects.ts
│       │   ├── e2e/                # Playwright tests (4 specs)
│       │   ├── migrations/         # 001_ai_documents.sql
│       │   └── public/             # Static assets
│       └── cms/
│           └── wp-content/         # WordPress content only (no core)
│               ├── mu-plugins/     # 48+ files
│               ├── acf-json/       # 17 field group JSON files
│               └── themes/chirostretch-theme/
├── agents/                         # 6 agent docs + 5 task playbooks
├── docs/                           # 17 documentation files
├── AGENTS.md                       # 261-line project rules
├── README.md                       # Project readme
└── .github/workflows/              # ci.yml, deploy-wordpress.yml, claude.yml
```

**Package manager**: pnpm (workspaces)
**Script runner**: tsx (TypeScript execution via `pnpm exec tsx`)
**ESM**: `"type": "module"` in package.json
**Path aliases**: `@/*` → `src/*` in Next.js; scripts use relative `../../src/` paths with `.js` extensions
**Version pinning**: Volta — Node 20.18.0, pnpm 10.27.0

---

## Frontend Architecture Notes

### Next.js App Router Structure

Three route groups under `src/app/(site)/`:

**`(marketing)`** — public-facing, mostly ISR/SSG:
- `/` (home) — Introduction, FeaturedProducts, LatestInsights, UpcomingEvents, CallToAction
- `/locations` — location index page
- `/locations/[slug]` — location detail with LocationMap, PractitionerCard, ServicesTabs, Testimonials, BookingWidget
- `/events` — events index
- `/events/[slug]` — event detail with EventRegistration
- `/pricing` — InitialConsultation, PricingTabs (SingleSessionCard, ValuePackageCard), BenefitsSection, PricingFAQ
- `/franchise` — franchise inquiry with Gravity Form
- `/thank-you/[type]` — post-form-submit confirmation pages, includes NewPatientContent component
- `[...slug]` — catch-all for WP pages (generic page builder output via BlockRenderer)

**`(content)`** — editorial content, ISR:
- `/articles` — article listing
- `/articles/[slug]` — article detail
- `/tag/[slug]` — articles by tag

**`(commerce)`** — dynamic/authenticated:
- `/shop` — ShopHomepage component
- `/shop/[slug]` — product detail (ProductGallery, ProductInfo, RelatedProducts)
- `/products` — products listing
- `/category/[slug]` — products by category
- `/cart` — shopping cart
- `/checkout` — checkout form with coupon validation
- `/checkout/success` — order confirmation
- `/account/orders` — order listing
- `/account/orders/[id]` — order detail
- `/account/set-password` — password reset flow

### API Routes (20 endpoints)

Located in `src/app/api/`:

```
ai/
  chat/route.ts               — OpenAI streaming chat with RAG context

algolia/
  check-status/route.ts       — index record counts
  index-articles/route.ts     — article indexing (unit tested)
  index-events/route.ts       — event indexing (unit tested)
  index-locations/route.ts    — location indexing (unit tested)
  index-products/route.ts     — product indexing (unit tested)

auth/
  reset-password/route.ts     — password reset
  validate-reset-key/route.ts — validate reset token

bookings/
  products/route.ts            — get bookable products
  slots/route.ts               — get available time slots
  add-to-cart/route.ts         — add booking to cart

checkout/
  create-order/route.ts       — WC order creation → returns paymentUrl

coupons/
  validate/route.ts            — coupon validation with email matching (unit tested)

gravity-forms/
  [formId]/route.ts            — fetch form schema
  submit/route.ts              — submit form (form 17: coupon gen, form 16/18: GA tracking)

orders/
  [id]/route.ts                — order detail by ID + order_key

redirects/route.ts             — WP redirect table lookup
revalidate/route.ts            — ISR cache purge via tag

zoho/
  callback/route.ts            — OAuth2 callback
  test/route.ts                — dev verification
```

### State Management

- **Zustand**: `src/stores/useCartStore.ts` — cart items, quantities, nonce, localStorage persistence (`chirostretch-cart` key). Methods: hydrateFromLocalStorage, fetchCart, addToCart, updateCartItem, removeCartItem, clearCart. Unit tested.
- **React Context**: EventsContext for event state management across components

### Styling Architecture

- CSS Module files across all components
- Global tokens: `src/styles/tokens.css` — CSS custom properties:
  - Colors: Primary (HSL 200,70,52), Secondary (HSL 324,80,59), Neutral grayscale, Success, Warning, Error, Info
  - Spacing: xs (4px) through 5xl (128px)
  - Typography: font sizes, weights, line heights
  - Radius, shadows, transitions
  - Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Tokens are environment-configurable via `scripts/generate-tokens.ts` and HSL env vars
- No Tailwind, no CSS-in-JS
- PostCSS: preset-env (Stage 3 features), autoprefixer
- Stylelint for CSS consistency

### Primitive Component System

`src/components/Primitives/` — foundational component library:

```
Base/
  Button/Button.tsx, ButtonIcon.tsx   — interactive elements
  Input/Input.tsx                     — form inputs (input, textarea, select)
  Text/Text.tsx                       — polymorphic text element
Display/
  StarRating/StarRating.tsx           — star rating display
Feedback/
  Alert/Alert.tsx                     — alert messages
  Modal/Modal.tsx                     — dialog/modal
  Toast/Toast.tsx                     — toast notifications
  Skeleton/Skeleton.tsx               — loading states
Forms/
  FormField/FormField.tsx             — labeled form field wrapper
  FormErrors/FormErrors.tsx           — error display
Layout/
  Container/Container.tsx             — content container
  Divider/                            — visual dividers
  SectionHeading/                     — section headers
Media/
  ImageWrapper/                       — image with optimization
  NoImage/                            — placeholder when no image
Utility/
  Flex/                               — flexbox layout
  FlipMotion/                         — flip animation
  VisuallyHidden/                     — accessibility utility
```

### GraphQL Layer

**Query files** (`src/lib/graphql/queries/` — 17 files):
- `bookings.ts` — booking products, pricing, availability
- `events.ts` — event queries (index, by slug)
- `footer-content.ts` — footer data
- `fragments.ts` — reusable fragments (media, author, taxonomy)
- `franchise.ts` — franchise info
- `gravity-forms.ts` — form schema queries
- `homepage.ts` — featured products, events, posts, introduction
- `layout-query.ts` — header menu, logo, announcement bar
- `locations.ts` — all locations, by slug, slugs for static gen
- `menu.ts` — menu items
- `pages.ts` — page by URI, all slugs
- `posts.ts` — blog posts, by slug
- `products.ts` — all products, by slug, by category, by tag, shop featured
- `services.ts` — service taxonomy
- `testimonials.ts` — location testimonials
- `value-propositions.ts` — location benefits

**Mutations** (`src/lib/graphql/mutations.ts`):
- `REQUEST_PASSWORD_RESET`
- `VALIDATE_PASSWORD_RESET_KEY`
- `RESET_PASSWORD`
- `GENERATE_NEW_PATIENT_COUPON`
- `CREATE_CHECKOUT_ORDER`
- `VALIDATE_COUPON`

**Codegen**: Types generated into `src/lib/graphql/generated/graphql.ts` (45,274 lines) from WP schema. Strict typing, skip typename, avoid optionals.

**Client**: `src/lib/cms/graphql.ts` — `wpQuery()` function, server-side only with ISR caching. `src/lib/cms/fetch.ts` — fetch wrapper.

### Search (Algolia InstantSearch)

- Config: `src/config/algolia.config.ts` — 4 indices (configurable via env vars): products, events, articles, locations
- Client: `src/lib/search/client.ts` — Algolia JS client initialization (search + admin)
- Components:
  - `Products/ProductsSearch/ProductsSearch.tsx`
  - `Articles/ArticlesSearch/ArticlesSearch.tsx` + `InfiniteArticlesHits.tsx`
  - `Events/EventsSearch/EventsSearch.tsx`
  - `Locations/LocationsSearch/LocationsSearch.tsx`
- Search UI:
  - `Search/SearchModal.tsx` — context-aware, switches index by current page
  - `Search/SearchBox.tsx` — search input
  - `Search/LocationSearchModal.tsx` — location-specific search
  - `Search/EventSearchModal.tsx` — event-specific search

### Forms

- `src/components/GravityForm/GravityForm.tsx` — React component that:
  1. Fetches form schema from WordPress via GraphQL
  2. Generates Zod validation schema from field definitions (`src/lib/forms/schema-generator.ts`)
  3. Renders form fields dynamically (`GravityFormField.tsx`)
  4. Maps GF validation errors to React Hook Form format (`src/lib/forms/error-mapper.ts`)
  5. Submits to `/api/gravity-forms/submit`
- `src/lib/forms/checkout-schema.ts` — Zod schema for checkout form
- `useGravityForm.ts` — custom hook for GF integration
- Unit tests: `checkout-schema.test.ts`, `schema-generator.test.ts`, `error-mapper.test.ts`

### Commerce

- `src/lib/commerce/storeApi.ts` — WooCommerce Store API wrapper with cookie forwarding
- `src/lib/commerce/getServerCart.ts` — server-side cart fetching
- Cart: `src/stores/useCartStore.ts` — Zustand with localStorage
- CartProvider: `src/components/Cart/CartProvider.tsx`
- CartBadge: `src/components/Cart/CartBadge.tsx`

### Booking System

- `src/components/Bookings/BookingWidget.tsx` — main booking interface
- `src/components/Bookings/ServiceSelect.tsx` — service picker
- `src/components/Bookings/DateStrip.tsx` — date selection
- `src/components/Bookings/TimeSlotGrid.tsx` — time slot picker
- `src/components/Bookings/useBookingParams.ts` — URL-based state management
- API routes proxy to WooCommerce Bookings REST endpoints

---

## WordPress / CMS Notes

### mu-plugins Directory (48+ files)

**CPT / Taxonomy Registration**:
- `locations-cpt.php`: Location CPT — address, coordinates, hours, phone, email, franchisee (user), short_description. GraphQL: `Location`/`Locations`. Computed `servicesOffered` from staff. Computed `practitioners` (public) and `allPractitioners` (all).
- `staff-cpt.php`: Practitioner CPT — assigned_location, job_title, credentials, bio, headshot, accepting_patients, is_public, staff_email, user_account. GraphQL: `Practitioner`/`Practitioners`. Auto-creates WP user on publish, sends password reset email. Staff can edit own profiles.
- `testimonials-cpt.php`: Testimonial CPT — rating (1-5), review_text, location (optional). GraphQL: `Testimonial`/`Testimonials`.
- `practitioner-taxonomies.php`: discipline (single-select), service (multi-select), specialty (multi-select) — all assigned to Practitioner CPT.

**WooCommerce Extensions** (7 plugins):
- `woocommerce-headless-checkout-redirect.php` — intercepts WP checkout, redirects to payment URL
- `woocommerce-session-for-all-users.php` — enables sessions for unauthenticated users
- `woocommerce-auto-customer-accounts.php` — auto-creates accounts on checkout
- `woocommerce-account-settings.php` — locks account creation checkbox
- `persistent-cart-restore.php` — restores cart state for headless architecture
- `bookings-slots-api.php` — REST API for WC Bookings (slots, add-to-cart). Handles date rules, time slots, resource assignment, "in-cart" booking status. Cart item removal cancels reservation.
- `wpgraphql-woocommerce-bookings.php` — GraphQL types for `chsBookingProduct` (duration, cost, persons, resources, confirmation/cancellation rules, calendar display), `bookingAvailability`, `bookingResources`

**WPGraphQL Extensions** (5 plugins):
- `graphql-mutations.php` — `updateFranchiseLocation`, `createStaff`, `updateStaff`, `deleteStaff` (role-based auth)
- `graphql-auth-coupon-mutations.php` — `requestPasswordReset`, `validatePasswordResetKey`, `resetPassword`, `generateNewPatientCoupon` ($70 discount, 30-day expiry, email-locked, single-use), `validateCoupon` (email matching), `createCheckoutOrder` (returns paymentUrl). Protected by `X-Internal-Secret` header.
- `headless-link-rewriter.php` — rewrites WP URLs to Next.js URLs in GraphQL/REST responses
- `graphql-data-loaders-compat.php` — data loader compatibility
- `ql-events-resolve-post-object-compat.php`, `ql-events-fix.php` — Events Calendar GraphQL fixes

**External Integration Plugins** (3):
- `algolia-sync.php` — hooks `save_post_location`, `save_post_post`, `save_post_product`, `trash_post`. Fires webhooks to Next.js `/api/algolia/index-*` with `X-Webhook-Secret` header. Payload: `{ post_id, action: 'save'|'delete' }`.
- `zoho-lead-converter.php` — hooks `woocommerce_order_status_completed` (priority 25). If order contains product 7149 (Initial Consultation), searches Zoho for lead by email, updates status, converts to contact.
- `setup-zoho-crm-feed.php` — Gravity Forms form 17 field mapping to Zoho CRM lead fields

**Infrastructure** (6):
- `nextjs-revalidation.php` — hooks post/term/menu/media/product changes → POST to `/api/revalidate` with `X-Revalidate-Secret`. Tags: locations, events, practitioners, products, posts, pages, testimonials, services, options, menus, media.
- `_env-loader.php` — blocks dev-only plugins in production
- `headless-password-reset.php` — REST API for password reset (WP does NOT send email)
- `user-registration-api.php` — REST API for GF user registration
- `location-organizer-sync.php` — syncs locations to The Events Calendar organizers
- `headless-link-rewriter.php` — URL rewriting (listed above too)

**Coupon System** (2):
- `coupon-validation.php` — REST API coupon validation with email verification
- `new-patient-coupon.php` — coupon generation from Gravity Forms

**Admin/Dashboard** (5+):
- `chirostretch-dashboards.php` — role-based admin dashboards
- `templates/dashboard-franchisee.php` — franchisee dashboard template
- `templates/dashboard-staff.php` — staff dashboard template
- `chirostretch-bulk-importer.php` — bulk import utilities
- `admin-cleanup.php` — removes unnecessary WP admin UI elements
- `acf-admin-styles.php` — ACF field layout improvements
- `block-whitelist.php` — restricts available Gutenberg blocks

**Options Pages** (4):
- `feature-options.php` — feature toggles
- `services-options.php` — services configuration
- `business-info-options.php` — business information
- `redirect-options.php` — redirect management

**Dev-Only** (blocked in production by `_env-loader.php`):
- `mailhog-smtp.php` — local email testing
- `chirostretch-locations-seeder.php` — WP-CLI location seeding
- `chirostretch-services-seeder.php` — WP-CLI services seeding
- `chirostretch-staff-seeder.php` — WP-CLI staff seeding

### ACF Field Groups (17 JSON files in `acf-json/`)

Named groups:
- `group_chiro_location.json` — Location fields
- `group_feature.json` — Feature content
- `group_testimonial.json` — Testimonial fields
- `group_announcement_bar.json` — Announcement bar config
- `group_business_info.json` — Business info (global options)
- `group_services_settings.json` — Services config
- `ui_options_page_site_settings.json` — Site settings options page
- 10 additional numbered groups for editorial/configuration fields

### Theme

`chirostretch-theme` — custom theme:
- `functions.php`: Registers 8 menus (Header 1-4, Footer 1-4), enqueues CSS (reset, fonts, tokens, header, footer), removes legacy "Lead" role
- CSS: `css/reset.css`, `css/tokens.css`, `css/header.css`, `css/footer.css`
- Templates: `single.php`, `page.php`, `archive.php`, `search.php`, `404.php` — present but rendering is primarily headless
- Includes: `customizer.php`, `custom-header.php`, `jetpack.php`, `template-tags.php`, `template-functions.php`

### Expected WP Plugins (NOT in repo)

Confirmed by code references:
- **WooCommerce**: Store API client, product queries, order creation
- **WooCommerce Bookings**: `WC_Product_Booking` class referenced in `bookings-slots-api.php` and `wpgraphql-woocommerce-bookings.php`
- **WPGraphQL**: GraphQL endpoint, custom type/mutation registration
- **WPGraphQL for WooCommerce**: WC schema extension
- **WPGraphQL JWT Authentication**: `GRAPHQL_JWT_AUTH_SECRET_KEY` referenced
- **Gravity Forms**: Form IDs 16, 17, 18 referenced in submit handler
- **ACF Pro**: 17 field groups in `acf-json/`
- **The Events Calendar**: `ql-events-*.php` compatibility plugins, `location-organizer-sync.php`

---

## Integration Notes

### Algolia Sync Pipeline

**WordPress side** (`algolia-sync.php`):
```
save_post_location / save_post_post / save_post_product hook
  → determine content type
  → POST to /api/algolia/index-{type} with X-Webhook-Secret header
  → payload: { post_id, action: 'save' }

trash_post hook
  → POST to /api/algolia/index-{type} with action: 'delete'
```

**Next.js side** (5 API routes — 4 with unit tests):
- Validates `X-Webhook-Secret` header
- Fetches post data (from WP)
- Transforms to Algolia record (ID format: `{type}_{post_id}`)
- Calls Algolia index/delete API
- `/api/algolia/check-status` — reports record counts per index

**Bulk re-index**: `pnpm algolia:reindex`

### Zoho CRM Pipeline

**Entry point 1 — WooCommerce purchase** (`zoho-lead-converter.php`):
- Hook: `woocommerce_order_status_completed` (priority 25)
- Condition: order contains product ID 7149 (Initial Consultation)
- Actions: search Zoho for lead by email, update status, convert to contact
- Product ID is hardcoded — would need updating if product changes

**Entry point 2 — Gravity Forms** (`setup-zoho-crm-feed.php`):
- Registers GF add-on feed for form 17
- Maps GF field IDs to Zoho lead fields
- Fires on GF form submission

**Next.js Zoho client** (`src/lib/zoho/client.ts`):
- OAuth2 flow: refresh token → access token
- Token caching: in-memory with 50-minute TTL (expires_in minus 60s safety margin)
- Methods: search leads by email, update lead status, convert lead to contact
- API routes: `/api/zoho/callback` (OAuth redirect), `/api/zoho/test` (dev verification)

### OpenAI / RAG Pipeline

**Ingest flow**:
```
scripts/ai/ingest.ts
  → fetch all WP content types via WPGraphQL (src/lib/ai/wpgraphql.ts)
  → chunk content (src/lib/ai/chunk.ts)
  → embed each chunk via text-embedding-3-small (1536-dim) (src/lib/ai/embeddings.ts)
  → store in pgvector (src/lib/ai/db.ts) or in-memory array (src/lib/ai/vectorStore.ts)
```

**Retrieval flow**:
```
POST /api/ai/chat → { message }
  → embed user query (text-embedding-3-small)
  → cosine similarity search in pgvector / memory
  → assemble context from top-k chunks
  → gpt-4o-mini streaming completion with context
  → stream response to client
```

**pgvector schema** (`migrations/001_ai_documents.sql`):
```sql
CREATE EXTENSION IF NOT EXISTS vector;
CREATE TABLE ai_documents (
  -- id, content, embedding vector(1536), metadata JSONB
);
```

**In-memory fallback**: When `DATABASE_URL` is not set, vectorStore.ts uses in-memory array. Stateless — requires fresh ingest per deployment.

**No automatic re-ingest**: Content changes in WordPress do not trigger AI re-ingest. Manual `pnpm ai:ingest` required.

### WooCommerce Bookings Integration

**WordPress side**:
- `bookings-slots-api.php` — REST API:
  - `GET /wp-json/chirostretch/v1/bookings/slots` — date availability, time slot generation, resource filtering
  - `POST /wp-json/chirostretch/v1/bookings/add-to-cart` — creates "in-cart" booking reservation
  - Cart item removal triggers booking cancellation
- `wpgraphql-woocommerce-bookings.php` — GraphQL types:
  - `chsBookingProduct`: duration, unit, cost, block cost, has persons, has resources, requires confirmation, can be cancelled, default availability, calendar display mode
  - `bookingAvailability`
  - `bookingResources` (staff/room assignment)

**Next.js side**:
- BookingWidget: ServiceSelect → DateStrip → TimeSlotGrid
- URL-based state management (useBookingParams hook)
- 3 API routes proxy to WP REST endpoints: `/api/bookings/products`, `/api/bookings/slots`, `/api/bookings/add-to-cart`

### New Patient Coupon Flow

```
1. Patient fills Gravity Form 17 (New Patient Special)
2. /api/gravity-forms/submit detects form 17
3. Calls generateNewPatientCoupon GraphQL mutation
4. WordPress creates WooCommerce coupon:
   - $70 fixed discount
   - 30-day expiry
   - Single-use
   - Email-locked via _new_patient_email meta
5. Coupon code returned to patient
6. At checkout, validateCoupon checks:
   - Coupon code valid
   - Customer email matches _new_patient_email
7. $99 Initial Consultation → $29 after discount
8. Order completion → zoho-lead-converter.php promotes lead to contact
```

### Gravity Forms Integration

**3 forms referenced in code**:
- Form 16: Franchise inquiry → GA tracking
- Form 17: New Patient Special → coupon generation + GA tracking
- Form 18: Contact → GA tracking

**GravityForm component** (`src/components/GravityForm/GravityForm.tsx`):
1. Fetches form schema from WP via GraphQL query
2. Generates Zod validation schema from field definitions at runtime
3. Renders fields dynamically via GravityFormField
4. Handles validation via React Hook Form + Zod
5. Submits to `/api/gravity-forms/submit`
6. Submit handler routes by form ID for post-submit actions

### ISR Revalidation

**WordPress side** (`nextjs-revalidation.php`):
- Hooks: post save, delete, term changes, menu updates, media changes, product changes
- POST to `{WP_NEXT_API_URL}/api/revalidate`
- Header: `X-Revalidate-Secret`
- Payload: `{ tag, reason, timestamp }`
- Tags: locations, events, practitioners, products, posts, pages, testimonials, services, options, menus, media

**Next.js side** (`/api/revalidate`):
- Validates secret (header or query param)
- Calls `revalidateTag(tag)` for targeted ISR invalidation
- Returns success/failure

**Default ISR**: 300 seconds (5 minutes) in production. `cache: "no-store"` in development.

---

## CI/CD Notes

### `ci.yml` Pipeline

- **Trigger**: Push to main/develop, pull requests
- **Environment**: Ubuntu latest, Node 20
- **Package manager**: pnpm with frozen lockfile (corepack enabled)
- **Steps**: Install → Lint (`pnpm lint`) → Test (`pnpm test`) → Build (`pnpm build`)
- **Build env vars** (from secrets): `NEXT_PUBLIC_ALGOLIA_APP_ID`, `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY`, `NEXT_PUBLIC_WPGRAPHQL_ENDPOINT`, `NEXT_PUBLIC_BACKEND_URL`

### `deploy-wordpress.yml`

- **Trigger**: Push to main (path filter: `system/apps/cms/wp-content/**`) + manual dispatch
- **Tool**: `easingthemes/ssh-deploy@v5.1.0` (rsync over SSH)
- **Source**: `system/apps/cms/wp-content/`
- **Excludes**: `.git*`, `.DS_Store`, `*.md`
- **Post-deploy**: `cd $CLOUDWAYS_WP_PATH && wp cache flush --allow-root`
- **Secrets**: `CLOUDWAYS_SSH_KEY`, `CLOUDWAYS_HOST`, `CLOUDWAYS_USER`, `CLOUDWAYS_PORT`, `CLOUDWAYS_WP_PATH`
- **Status**: Cloudways environment decommissioned

### `claude.yml`

- **Trigger**: Issue comments, PR comments, PR reviews containing `@claude`
- **Action**: `anthropics/claude-code-action@v1`
- **Permissions**: Contents read, PRs read, issues read, actions read
- **Secret**: `CLAUDE_CODE_OAUTH_TOKEN`

### Lighthouse CI

- **Config**: `lighthouserc.js`
- **URLs**: `/`, `/locations`, `/shop`, `/cart`
- **Runs**: 3 per URL (averaged)
- **Thresholds**: Performance 70% (warn), Accessibility 90% (error), Best Practices 80% (warn), SEO 80% (warn)
- **Core Web Vitals**: LCP ≤2500ms, FCP ≤1800ms, CLS ≤0.1, TBT ≤300ms

### Testing

- **Unit**: Vitest with happy-dom environment. Coverage: v8, HTML output
- **E2E**: Playwright — 4 specs: `cart-add-product.spec.ts`, `checkout-flow.spec.ts`, `gravity-forms.spec.ts`, `search.spec.ts`
- **Test files throughout codebase**: API route tests, hook tests, utility tests, schema tests

---

## Unresolved Ambiguities

| Question | Impact | How to Resolve |
|---|---|---|
| Payment gateway used? | Can't describe payment flow completely | Gateway is a WP plugin — not in repo. Checkout returns paymentUrl which handles payment. |
| Exact GF field IDs in Zoho feed? | Field mapping accuracy | Read `setup-zoho-crm-feed.php` — but IDs are GF-instance-specific |
| Email delivery provider? | Can't confirm email works | `RESEND_API_KEY` in `.env.example` but client implementation scope unclear |
| GravityForm: file uploads + conditional logic? | Scope of headless GF | Would need to read component in detail |
| Does AI chat re-ingest on WP publish? | Content freshness | No — manual `pnpm ai:ingest` required |
| Are any WP plugins tracked anywhere? | Dependency documentation | No `composer.json` found in CMS app |
| What does the chirostretch-theme render? | WP/Next.js boundary clarity | Theme templates exist but headless rendering dominates |
| Zoho token caching: in-memory only? | Stateless deployment concern | Confirmed in-memory with 50-min TTL — resets per cold start |
| How often does ingest need to run? | RAG freshness | After any WP content change — no automation |
| GraphQL types freshness? | Type safety guarantee | 45k-line generated file — requires running WP to regenerate |
| The Events Calendar version/config? | Event feature scope | Plugin not in repo — compatibility plugins suggest TEC is expected |
| Resend implementation depth? | Can we claim email integration? | `.env.example` has `RESEND_API_KEY` — may be planned but implementation unclear |
| Product catalog beyond ID 7149? | Commerce scope | Seed generators exist; real product data unknown |
| Analytics implementation? | Can we claim analytics? | GA event tracking in form handlers; no dedicated GA setup found |

---

## Data Model Notes

### Location CPT

Fields confirmed from `locations-cpt.php` + ACF:
- Title, slug (public, `locations` slug)
- `franchisee` — User relationship (location owner)
- `street_address`, `city`, `state`, `zip` — address
- `phone`, `email` — contact
- `short_description` — marketing copy
- `coordinates_lat`, `coordinates_lng` — geolocation
- `hours_*_day`, `hours_*_open`, `hours_*_close` — business hours (repeater)
- Computed `servicesOffered` — derived from assigned practitioners' service taxonomies
- Computed `practitioners` — public staff at this location
- Computed `allPractitioners` — all staff (includes non-public)

### Practitioner CPT

Fields confirmed from `staff-cpt.php`:
- Title (not publicly queryable — no slug)
- `assigned_location` — Location relationship
- `job_title`, `credentials` (e.g., DC, CCSP)
- `bio` — biography
- `headshot` — image
- `accepting_patients` — boolean
- `is_public` — boolean (controls frontend visibility)
- `staff_email` — email
- `user_account` — User relationship
- Taxonomies: discipline (single), service (multi), specialty (multi)
- Auto-creates WordPress user on publish with role assignment
- Sends password reset email on user creation
- Privacy rules: staff can edit their own profile fields

### Testimonial CPT

Fields confirmed from `testimonials-cpt.php`:
- `rating` — 1-5 integer
- `review_text` — testimonial content
- `location` — Location ID (optional — can be global)

### Event CPT

- Managed by The Events Calendar plugin
- `location-organizer-sync.php` syncs Location CPTs to TEC organizers
- GraphQL compatibility via `ql-events-*.php` mu-plugins
- Frontend: EventsCalendar, EventsGrid, EventsSearch, ExpandedEventModal, EventRegistration

---

## Seed / Demo Data

`scripts/cms/seed/` contains TypeScript generators:
- EventGenerator
- StaffGenerator
- LocationGenerator
- (likely others based on `index.ts` entry point)

WP-CLI seeders (dev-only mu-plugins):
- `chirostretch-locations-seeder.php`
- `chirostretch-services-seeder.php`
- `chirostretch-staff-seeder.php`

Implication: System designed for demo population. Content in any deployed WP instance may be test data.

---

## Notes on What's NOT in the Codebase

- **Redis**: No redis client. Cart sessions are WooCommerce server-side. Zoho tokens in-memory.
- **Cloudflare**: No CF Workers, KV, API client, or `wrangler.toml`.
- **Docker**: No Dockerfile or docker-compose found.
- **Vercel config**: No `vercel.json` — relies on auto-detection.
- **composer.json**: Not found in CMS app — WP plugins not dependency-managed.
- **Custom email client**: `RESEND_API_KEY` in .env.example but no Resend SDK import confirmed. `headless-password-reset.php` explicitly skips WP email, implying external delivery.
- **Analytics**: GA event tracking in form submit handlers only. No dedicated GA4, Segment, or Mixpanel integration.
- **CDN config**: No Cloudflare, Fastly, or custom CDN. Vercel Edge Network handles frontend CDN.
- **CMS preview mode**: No Next.js draft mode found.
- **Internationalization**: No i18n config. English-only.
- **Feature flags**: No LaunchDarkly, Unleash, or equivalent.
- **SSO/OAuth for users**: JWT only, no social login.
- **Notifications/WebSockets**: No real-time features beyond SSE for AI chat streaming.
