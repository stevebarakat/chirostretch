# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Commands

### Development

```bash
npm run dev
```

Runs Next.js dev server on `https://chirostretch.local:4443` with HTTPS enabled.

### Build & Production

```bash
npm run build      # Build for production
npm run start      # Start production server
npm run preview    # Build and start production server
```

### Linting

```bash
npm run lint       # Run ESLint
```

## Architecture Overview

### Stack

- **Frontend**: Next.js 16+ with App Router, TypeScript, React 19
- **Backend**: Headless WordPress (WPGraphQL for content, WooCommerce for products)
- **State Management**: Zustand for client state, URL search params preferred for shareable state
- **Styling**: CSS Modules only (no Tailwind), HSL color format
- **Icons**: lucide-react
- **Image Optimization**: Next.js native (no Cloudinary or custom loaders)

### Data Fetching Strategy

- **WPGraphQL** via native `fetch` (no Apollo Client)
- **ISR by default**: `revalidate: 300` (5 minutes)
- **Server Components by default**: Only use `'use client'` when necessary
- **Dynamic imports**: All below-the-fold sections use `next/dynamic` with `ssr: true`

### WordPress Integration

- **GraphQL Endpoint**: Configured via `WORDPRESS_GRAPHQL_ENDPOINT` env variable
- **Query Functions**: Use `wpQuery<T>(query, variables, revalidate)` from `@app/_lib/wp/graphql` or `@/lib/wp/graphql`
- **Queries**: Stored in `src/lib/wp/queries/` or `src/app/_lib/wp/queries/`
- **WordPress Media**: Always pass `sourceUrl` directly to `<Image>` without transformation

### Custom Post Types & Taxonomies

- **Custom Post Types**: `events`, `registrations`
- **Custom Taxonomies**: `event-category`, `event-tag`, `event-location`

### WooCommerce

- WooCommerce is **data source only** - all rendering happens in Next.js
- Product pages: `app/(site)/products/[slug]/page.tsx`
- Never use WooCommerce PHP templates or theme hooks
- Fetch products via WPGraphQL for WooCommerce

### Project Structure

```
src/
├── app/
│   ├── _lib/wp/          # WordPress integration utilities
│   │   ├── graphql.ts    # wpQuery function
│   │   └── queries/      # GraphQL queries
│   └── (site)/           # Main site route group
│       ├── homepage/     # Homepage sections as colocated components
│       ├── products/     # Product pages
│       ├── blog/         # Blog pages
│       ├── events/       # Events pages
│       └── cart/         # Shopping cart
├── components/
│   ├── layout/           # Layout components (Header, Footer, etc.)
│   └── ui/               # Reusable UI components
├── lib/
│   ├── wp/               # WordPress utilities
│   │   ├── graphql.ts    # Alternative wpQuery location
│   │   └── queries/      # GraphQL queries
│   └── utils/            # General utilities
└── styles/               # Global styles, CSS variables
```

## Key Architectural Patterns

### Image Handling

**Critical Rule**: WordPress `sourceUrl` values must NEVER be transformed or normalized.

```tsx
// ✅ CORRECT
<Image
  src={image.sourceUrl}
  alt={image.altText}
  priority={true}              // First visible image only
  fetchPriority="high"         // First visible image only
/>

// ❌ WRONG - Never use normalizeImageUrl() or transform URLs
<Image src={normalizeImageUrl(image.sourceUrl)} />
```

**Image Priority Rules**:

- First visible image (hero, LCP element): `priority={true}` and `fetchPriority="high"`
- Below-the-fold images: no priority (Next.js auto lazy-loads)
- Swiper first slide: `priority={true}` on first image only

### Server vs Client Components

```tsx
// ✅ Server Component (default) - No state, no interactivity
export default async function ProductPage() {
  const data = await wpQuery(query);
  return <div>{data.product.name}</div>;
}

// ✅ Client Component - Only when necessary
("use client");
export function AddToCartButton() {
  const [loading, setLoading] = useState(false);
  // ... interactive logic
}
```

**Use Client Components only for**:

- Event handlers, state, effects
- Browser APIs (localStorage, window, etc.)
- Third-party libraries requiring DOM (Swiper, etc.)

### Component Colocation

Related files must be colocated in the same directory:

```
components/ProductCard/
├── ProductCard.tsx
├── ProductCard.module.css
├── ProductCard.types.ts
├── useProductCard.ts       # Custom hooks
├── productCard.store.ts    # Zustand stores
└── index.ts                # Re-exports default
```

### URL State Management

Prefer URL search params for shareable state:

```tsx
// ✅ CORRECT - Shareable, bookmarkable
function ProductFilters({ searchParams }: { searchParams: { sort?: string } }) {
  const sort = searchParams.sort || "newest";
  // Use router.push() to update
}

// ⚠️  Client state - Only for temporary UI state
const [isMenuOpen, setIsMenuOpen] = useState(false);
```

### Performance-Critical Rules

#### Dynamic Imports

```tsx
// Critical sections (hero, first content) - static import
import HeroSlider from "./homepage/HeroSlider";

// Below-the-fold sections - dynamic import
const FeaturedProducts = dynamic(() => import("./homepage/FeaturedProducts"), {
  ssr: true, // Always maintain SEO
});
```

#### Swiper Optimization

```tsx
<Swiper
  effect="fade"                    // Always use fade for best performance
  loop={slides.length > 1}         // Only loop if multiple slides
  // Next.js handles lazy loading automatically - no Swiper lazy needed
>
```

#### Font Loading

```tsx
import { Inter } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "600", "700"], // Max 3 weights
  display: "swap", // Always set
  preload: true, // Only for critical fonts
});
```

#### CSS Performance

- Avoid `100vh` - use `60vh` or container heights
- Add `contain: layout paint size;` to animation-heavy elements
- Only animate `transform` and `opacity` (not width/height/top/left)

## Code Style Guidelines

### TypeScript

- Strict mode enabled
- Prefer `type` over `interface`
- Use function declarations for top-level functions
- Never use `any` (use `unknown` if needed)

### React Patterns

- Functional components only
- Explicit prop typing
- Event handlers over `useEffect` for user interactions
- One concern per `useEffect`
- Component max 200 lines, functions max 50 lines

### CSS

- CSS Modules exclusively (no Tailwind, no CSS-in-JS)
- HSL color format: `hsl(210, 100%, 50%)`
- Respect global styles defined in `src/styles/`

### Naming Conventions

- Components: Descriptive, purpose-driven names (avoid generic names like `Box`, `Widget`)
- Good: `ProductCard`, `EventCard`, `HeroBanner`
- Bad: `Card`, `Item`, `Component`

### Documentation

- Minimal code comments (prefer self-documenting code)
- Meaningful variable/function names
- README files for complex modules only

## WordPress Setup

### Required Plugins

- WPGraphQL
- WPGraphQL for ACF
- WPGraphQL for WooCommerce
- WPGraphQL for Gravity Forms (if forms needed)
- Advanced Custom Fields Pro
- Yoast SEO (optional)

### Environment Variables

```env
WORDPRESS_GRAPHQL_ENDPOINT=http://localhost/graphql
```

### GraphQL Development Flow

1. Write query in GraphiQL (WordPress admin)
2. Save to `src/lib/wp/queries/[name].ts`
3. Use with `wpQuery<T>(query, variables, revalidate)`
4. Define TypeScript types for response

## Testing & Validation

### Before Committing

- Run `npm run lint` to check for errors
- Ensure TypeScript strict mode compliance
- Test in dev mode for ISR behavior

### Performance Targets

- Lighthouse Performance: 95+
- LCP: <1.5s
- First visible image must have `priority={true}`
- Hero sections should not exceed 60vh

## Common Pitfalls to Avoid

1. ❌ Never transform WordPress `sourceUrl` values
2. ❌ Never use `normalizeImageUrl()` function (deprecated)
3. ❌ Don't add `'use client'` unless necessary
4. ❌ Don't use Tailwind CSS (use CSS Modules)
5. ❌ Don't animate expensive CSS properties (width, height, top, left)
6. ❌ Don't set `loop={true}` on Swipers with 10+ slides
7. ❌ Don't load more than 3 font weights
8. ❌ Don't use WooCommerce PHP templates or theme hooks
9. ❌ Don't use `cache: 'no-store'` unless absolutely necessary
10. ❌ Don't add `priority` to all images (only first visible)
