# ChiroStretch

High-performance Headless WordPress → Next.js App Router build with WooCommerce integration, Algolia search, and Gravity Forms.

## Architecture

```
WordPress (Headless)
├── WPGraphQL + Extensions (ACF, WooCommerce, Gravity Forms, JWT Auth)
├── Content: Pages, Posts, Products, Events, Locations
└── Webhooks → Next.js API routes → Algolia

Next.js (App Router)
├── Server Components (default)
├── ISR with 300s revalidation
├── CSS Modules (no Tailwind)
└── Zustand for client state
```

## Directory Structure

```
src/
├── app/                          # Next.js App Router pages and API routes
│   ├── (dashboard)/             # Protected dashboard routes
│   │   ├── addresses/           # Address management
│   │   ├── dashboard/           # Dashboard home
│   │   ├── downloads/           # Digital downloads
│   │   ├── franchisee/          # Franchisee management
│   │   ├── orders/              # Order history
│   │   ├── payment-methods/     # Payment method management
│   │   ├── profile/             # User profile
│   │   └── staff/               # Staff management
│   ├── (site)/                  # Public site routes
│   │   ├── (marketing)/         # CMS-driven pages, promotional content
│   │   │   ├── page.tsx         # Homepage
│   │   │   ├── [...slug]/      # Dynamic CMS pages
│   │   │   ├── franchise/      # Franchise page
│   │   │   ├── locations/      # Location pages
│   │   │   └── events/         # Events listing and detail
│   │   ├── (commerce)/         # Shop, cart, checkout, products
│   │   │   ├── shop/           # Shop/product listing
│   │   │   ├── products/       # Product pages
│   │   │   ├── cart/           # Shopping cart
│   │   │   ├── checkout/       # Checkout flow
│   │   │   └── category/       # Product categories
│   │   ├── (content)/          # Blog, articles, SEO content
│   │   │   ├── articles/       # Blog/articles
│   │   │   └── tag/            # Article tags
│   │   ├── login/              # Authentication (shared)
│   │   ├── forgot-password/   # Password reset
│   │   └── set-password/      # Set new password
│   └── api/                     # API routes
│       ├── algolia/             # Algolia indexing
│       ├── auth/                # Authentication
│       ├── bookings/            # Booking system
│       ├── cart/                # Cart operations
│       ├── checkout/            # Checkout processing
│       ├── franchisee/         # Franchisee API
│       ├── gravity-forms/      # Gravity Forms integration
│       └── revalidate/          # Cache revalidation
│
├── components/                  # React components
│   ├── UI/                      # Design system components
│   │   ├── Primitives/          # Button, Input, Container, Text, Divider
│   │   ├── Forms/               # FormField, FormErrors
│   │   ├── Layout/              # PageHeader, SectionHeading
│   │   ├── Feedback/             # Alert, ErrorState, Modal
│   │   ├── Media/               # ImageWrapper, NoImage
│   │   ├── Display/             # StarRating, Pagination
│   │   └── Utility/              # VisuallyHidden, BackToTop, FlipMotion
│   ├── Account/                 # Account management components
│   ├── Articles/                # Article/blog components
│   ├── Auth/                    # Authentication components
│   ├── CMS/                     # WordPress block renderers (adapters)
│   ├── Bookings/                # Booking system components
│   ├── Cart/                    # Shopping cart components
│   ├── Checkout/                # Checkout components
│   ├── Dashboard/               # Dashboard components
│   ├── Events/                  # Event components
│   ├── Franchise/               # Franchise page components
│   ├── GravityForms/            # Gravity Forms components
│   ├── Header/                  # Header/navigation components
│   ├── Homepage/                # Homepage sections
│   ├── Layout/                  # Layout components (Footer, Menu, etc.)
│   ├── Locations/                # Location components
│   ├── Products/                # Product components
│   └── Search/                  # Search components
│
├── lib/                         # Library code and utilities
│   ├── auth/                    # Authentication utilities
│   ├── commerce/                # Commerce integration (WooCommerce)
│   ├── cms/                     # CMS integration (WordPress)
│   │   ├── fetch.ts             # WordPress fetch with timeout
│   │   ├── graphql.ts           # wpQuery helper
│   │   └── wpgraphql.ts         # Authenticated GraphQL client
│   ├── forms/                   # Forms integration (Gravity Forms)
│   ├── graphql/                 # GraphQL queries and client
│   │   ├── queries/             # All GraphQL queries organized by domain
│   └── search/                  # Search integration (Algolia)
│
├── hooks/                       # Reusable React hooks
│   ├── useOnClickOutside.ts     # Click outside detection
│   └── useOnScreen.ts           # IntersectionObserver hook
│
├── stores/                      # Zustand state stores
│   └── cartStore.ts             # Shopping cart state
│
├── config/                      # Configuration files
│   ├── algolia.config.ts        # Algolia configuration
│   ├── site.config.ts           # Site configuration
│   └── wordpress.config.ts      # WordPress configuration
│
├── styles/                      # Global styles
│   ├── globals.css              # Global styles
│   ├── reset.css                # CSS reset
│   ├── tokens.css               # Design tokens (CSS variables)
│   └── forms.css                # Form styles
│
├── utils/                       # Utility functions
│   ├── image-helpers.ts         # Image processing utilities
│   └── constants.ts             # App constants
│
└── test/                        # Test utilities and setup
    ├── helpers/                 # Test helpers
    ├── mocks/                   # Mock data
    └── setup.ts                 # Test configuration
```

## Component Organization

### UI Components (`src/components/UI/`)

Organized by functionality:

- **Primitives**: Basic building blocks (Button, Input, Container, Text, Divider)
- **Forms**: Form-related components (FormField, FormErrors)
- **Layout**: Layout components (PageHeader, SectionHeading)
- **Feedback**: User feedback (Alert, ErrorState, Modal)
- **Media**: Image/media handling (ImageWrapper, NoImage)
- **Display**: Display components (StarRating, Pagination)
- **Utility**: Helper components (VisuallyHidden, BackToTop, FlipMotion)

### Domain Components (`src/components/`)

Organized by feature/domain:

- Each domain has its own folder with components, styles, and index.ts
- Examples: `Account/`, `Products/`, `Events/`, `Locations/`, `Homepage/`, `Dashboard/`
- **CMS/**: WordPress block renderers (adapters, not UI components)

### Route Groups (`src/app/(site)/`)

Organized by responsibility and layout needs:

- **(marketing)**: CMS-driven pages, promotional content, flexible layouts
  - Homepage, dynamic CMS pages (`[...slug]`), franchise, locations, events
  - Editorial layouts, landing pages
- **(commerce)**: Shop, cart, checkout, products
  - Performance-critical routes, stricter caching rules
  - Different layouts from marketing/content
- **(content)**: Blog, articles, SEO-heavy long-form content
  - Reading-optimized layouts, pagination, category/tag routes

Route groups enable:

- Scoped layouts per group
- Scoped metadata strategies
- Scoped loading states and error boundaries
- Clear separation of concerns without URL changes

### Library Organization (`src/lib/`)

Organized by responsibility, not vendor:

- **search/**: Search integration (Algolia implementation)
- **commerce/**: Commerce integration (WooCommerce implementation)
- **forms/**: Forms integration (Gravity Forms implementation)
- **cms/**: CMS integration (WordPress implementation)
- **auth/**: Authentication utilities
- **graphql/**: GraphQL queries and client

### State Management (`src/stores/`)

Zustand stores for application state:

- **cartStore.ts**: Shopping cart state management
