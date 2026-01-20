# Local Development

Complete guide to setting up and running ChiroStretch locally.

## Prerequisites

| Requirement | Version | Notes |
|-------------|---------|-------|
| Node.js | 20.18.0 | Managed via Volta |
| pnpm | 10.27.0 | Required package manager |
| LocalWP | Latest | WordPress local environment |

### Installing Volta (Recommended)

Volta automatically manages Node.js versions per project:

```bash
curl https://get.volta.sh | bash
```

After installation, Volta reads the `volta` section in `package.json` and installs the correct versions automatically.

### Installing pnpm

```bash
volta install pnpm@10.27.0
```

Or without Volta:

```bash
npm install -g pnpm@10.27.0
```

## WordPress Setup (LocalWP)

1. Download and install [LocalWP](https://localwp.com/)

2. Create a new site:
   - Site name: `chirostretch-copy`
   - Domain: `chirostretch-copy.local`
   - PHP version: 8.2+
   - Web server: nginx

3. Enable SSL:
   - Right-click site in LocalWP
   - Select "Trust" to install SSL certificate

4. Import database and uploads (if provided) or start fresh

5. Symlink mu-plugins:
   ```bash
   # From the WordPress site directory
   cd ~/Local\ Sites/chirostretch-copy/app/public/wp-content
   ln -s /path/to/chirostretch/system/apps/cms/wp-content/mu-plugins mu-plugins
   ```

### Required WordPress Plugins

Install and activate these plugins via WP Admin:

- **WPGraphQL** — GraphQL API
- **WPGraphQL for ACF** — ACF field exposure
- **WPGraphQL JWT Authentication** — JWT auth tokens
- **WPGraphQL WooCommerce** — WooCommerce GraphQL support
- **Advanced Custom Fields Pro** — Custom fields
- **WooCommerce** — E-commerce
- **WooCommerce Bookings** — Appointment scheduling
- **Gravity Forms** — Form builder
- **The Events Calendar** — Event management

## Next.js Setup

1. Navigate to the UI directory:
   ```bash
   cd system/apps/ui
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env.local
   ```

4. Update `.env.local` with your local values (see [env-vars.md](env-vars.md))

5. Generate design tokens:
   ```bash
   pnpm tokens:generate
   ```

## Running the Development Server

### Start WordPress

1. Open LocalWP
2. Start the `chirostretch-copy` site

### Start Next.js

```bash
cd system/apps/ui
pnpm dev
```

This starts the development server at `https://localhost:3000` with:
- HTTPS enabled (required for auth cookies)
- Hot module replacement
- Automatic design token generation

### Expected URLs

| Service | URL |
|---------|-----|
| Next.js | https://localhost:3000 |
| WordPress | https://chirostretch-copy.local |
| GraphQL Playground | https://chirostretch-copy.local/graphql |
| WP Admin | https://chirostretch-copy.local/wp-admin |
| WooCommerce | https://chirostretch-copy.local/wp-admin/admin.php?page=wc-admin |

## Common Gotchas

### CORS Errors

**Symptom:** Browser console shows CORS errors when fetching from WordPress.

**Fix:** Ensure the WordPress site has proper CORS headers. The mu-plugin `headless-link-rewriter.php` should handle this, but verify:

```php
// In wp-config.php or mu-plugin
header('Access-Control-Allow-Origin: https://localhost:3000');
header('Access-Control-Allow-Credentials: true');
```

### GraphQL Connection Refused

**Symptom:** `ECONNREFUSED` or timeout errors when querying GraphQL.

**Fixes:**
1. Verify WordPress is running in LocalWP
2. Check the GraphQL endpoint: `https://chirostretch-copy.local/graphql`
3. Verify SSL certificate is trusted
4. Check `NEXT_PUBLIC_WPGRAPHQL_ENDPOINT` in `.env.local`

### SSL Certificate Errors

**Symptom:** `UNABLE_TO_VERIFY_LEAF_SIGNATURE` or certificate errors.

**Fix for development:** The `.env.local` includes:
```env
NODE_TLS_REJECT_UNAUTHORIZED=0
```

This disables SSL verification for local development only. Never use in production.

**Fix properly:** Trust the LocalWP SSL certificate in your system keychain.

### Algolia Index Empty

**Symptom:** Search returns no results.

**Fix:** Run the indexing script:
```bash
# Ensure dev server is running first
curl --insecure -X POST https://localhost:3000/api/algolia/index-products
curl --insecure -X POST https://localhost:3000/api/algolia/index-locations
curl --insecure -X POST https://localhost:3000/api/algolia/index-articles
curl --insecure -X POST https://localhost:3000/api/algolia/index-events
```

Or use the convenience script:
```bash
./scripts/index-algolia.sh
```

### WooCommerce REST API 401

**Symptom:** Order creation or cart operations fail with 401 Unauthorized.

**Fixes:**
1. Generate new REST API keys in WooCommerce > Settings > Advanced > REST API
2. Update `WC_CONSUMER_KEY` and `WC_CONSUMER_SECRET` in `.env.local`
3. Ensure keys have Read/Write permissions

### GraphQL Queries Return Null

**Symptom:** Queries work in GraphQL Playground but return null in Next.js.

**Fixes:**
1. Check if content is published (not draft)
2. Verify ACF fields are exposed to GraphQL (Show in GraphQL = Yes)
3. Run `pnpm codegen` to regenerate types
4. Check for typos in field names (GraphQL is case-sensitive)

### Images Not Loading

**Symptom:** Images show broken or 404.

**Fixes:**
1. Check `next.config.js` has the WordPress domain in `images.remotePatterns`
2. Verify image URLs use HTTPS
3. Check WordPress media library has the files

### Hot Reload Not Working

**Symptom:** Changes don't appear without manual refresh.

**Fixes:**
1. Check for syntax errors in modified files
2. Restart dev server: `pnpm dev`
3. Clear `.next` directory: `rm -rf .next && pnpm dev`

## Useful Commands

```bash
# Start development server
pnpm dev

# Run linting
pnpm lint

# Run tests
pnpm test

# Run e2e tests (requires dev server running)
pnpm test:e2e

# Generate GraphQL types
pnpm codegen

# Watch mode for GraphQL codegen
pnpm codegen:watch

# Build for production
pnpm build

# Analyze bundle size
pnpm analyze
```

## Database Sync

To sync content between environments:

1. Export WordPress database from source (via LocalWP or phpMyAdmin)
2. Import into local WordPress
3. Run search-replace for URLs:
   ```sql
   UPDATE wp_options SET option_value = 'https://chirostretch-copy.local' WHERE option_name IN ('siteurl', 'home');
   ```
4. Re-index Algolia after importing

## Troubleshooting Checklist

When something breaks:

1. [ ] Is WordPress running in LocalWP?
2. [ ] Is the Next.js dev server running?
3. [ ] Are environment variables set correctly?
4. [ ] Is SSL trusted for both localhost and LocalWP?
5. [ ] Are all required WordPress plugins activated?
6. [ ] Has `pnpm codegen` been run recently?
7. [ ] Is content published (not draft)?

For persistent issues, see [debugging.md](debugging.md).
