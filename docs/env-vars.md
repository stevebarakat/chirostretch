# Environment Variables

Complete reference for all environment variables required by ChiroStretch.

## Next.js Variables (`.env.local`)

Create this file at `system/apps/ui/.env.local`. See `.env.example` for a template.

### URLs

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_FRONTEND_URL` | Yes | Next.js app URL (e.g., `https://localhost:3000`) |
| `NEXT_PUBLIC_BACKEND_URL` | Yes | WordPress site URL (e.g., `https://chirostretch-copy.local`) |
| `NEXT_PUBLIC_WPGRAPHQL_ENDPOINT` | Yes | GraphQL endpoint (e.g., `https://chirostretch-copy.local/graphql`) |
| `NEXT_PUBLIC_SITE_URL` | No | Production site URL for metadata (defaults to config) |

### WooCommerce REST API

| Variable | Required | Description |
|----------|----------|-------------|
| `WC_CONSUMER_KEY` | Yes | WooCommerce REST API consumer key |
| `WC_CONSUMER_SECRET` | Yes | WooCommerce REST API consumer secret |

Generate keys in WordPress: WooCommerce > Settings > Advanced > REST API.

**Required permissions:** Read/Write

### Algolia Search

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_ALGOLIA_APP_ID` | Yes | Algolia application ID |
| `NEXT_PUBLIC_ALGOLIA_SEARCH_KEY` | Yes | Algolia search-only API key (safe for browser) |
| `ALGOLIA_ADMIN_API_KEY` | Yes | Algolia admin API key (server-side only) |
| `NEXT_PUBLIC_ALGOLIA_INDEX_PRODUCTS` | No | Products index name (default: `products`) |
| `NEXT_PUBLIC_ALGOLIA_INDEX_EVENTS` | No | Events index name (default: `events`) |
| `NEXT_PUBLIC_ALGOLIA_INDEX_ARTICLES` | No | Articles index name (default: `articles`) |
| `NEXT_PUBLIC_ALGOLIA_INDEX_LOCATIONS` | No | Locations index name (default: `locations`) |

### Google Maps

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` | Yes | Google Maps JavaScript API key |

Enable these APIs in Google Cloud Console:
- Maps JavaScript API
- Places API
- Geocoding API

### Webhook Secrets

| Variable | Required | Description |
|----------|----------|-------------|
| `WP_WEBHOOK_SECRET` | Yes | Secret for validating WordPress webhooks (Algolia sync) |
| `REVALIDATE_SECRET` | Yes | Secret for on-demand ISR revalidation |
| `GRAVITY_FORMS_WEBHOOK_SECRET` | No | Secret for Gravity Forms webhooks |

Generate secure secrets:
```bash
openssl rand -base64 32
```

### Internal Communication

| Variable | Required | Description |
|----------|----------|-------------|
| `CHIROSTRETCH_INTERNAL_SECRET` | No | Secret for server-to-server calls (coupon validation, etc.) |

### Zoho CRM

| Variable | Required | Description |
|----------|----------|-------------|
| `ZOHO_CLIENT_ID` | No | Zoho OAuth client ID |
| `ZOHO_CLIENT_SECRET` | No | Zoho OAuth client secret |
| `ZOHO_REFRESH_TOKEN` | No | Zoho OAuth refresh token |
| `ZOHO_API_DOMAIN` | No | Zoho API domain (default: `https://www.zohoapis.com`) |
| `ZOHO_ACCOUNTS_DOMAIN` | No | Zoho accounts domain (default: `https://accounts.zoho.com`) |

### Design Tokens

| Variable | Required | Description |
|----------|----------|-------------|
| `DESIGN_TOKEN_PRIMARY` | No | Primary brand color as H,S,L (e.g., `200,70,52`) |
| `DESIGN_TOKEN_SECONDARY` | No | Secondary brand color as H,S,L |
| `DESIGN_TOKEN_NEUTRAL` | No | Neutral/grayscale base as H,S,L |
| `DESIGN_TOKEN_SUCCESS` | No | Success state color as H,S,L |
| `DESIGN_TOKEN_WARNING` | No | Warning state color as H,S,L |
| `DESIGN_TOKEN_ERROR` | No | Error state color as H,S,L |

Format: Hue (0-360), Saturation (0-100), Lightness (0-100) without percent signs.

### Site Information

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_CONTACT_EMAIL` | No | Contact email for site |
| `NEXT_PUBLIC_ADDRESS_STREET` | No | Business street address |
| `NEXT_PUBLIC_ADDRESS_CITY` | No | Business city |
| `NEXT_PUBLIC_ADDRESS_STATE` | No | Business state |
| `NEXT_PUBLIC_ADDRESS_ZIP` | No | Business ZIP code |

### Development Only

| Variable | Required | Description |
|----------|----------|-------------|
| `NODE_TLS_REJECT_UNAUTHORIZED` | Dev only | Set to `0` to allow self-signed certificates |

**Warning:** Never set `NODE_TLS_REJECT_UNAUTHORIZED=0` in production.

## WordPress Variables (`wp-config.php`)

These constants are defined in WordPress `wp-config.php`:

### Algolia

```php
define('ALGOLIA_APP_ID', 'your_app_id');
define('ALGOLIA_ADMIN_API_KEY', 'your_admin_api_key');
define('ALGOLIA_INDEX_PREFIX', ''); // Optional prefix
```

### Webhook Secrets

```php
define('WP_WEBHOOK_SECRET', 'your_webhook_secret');
define('REVALIDATE_SECRET', 'your_revalidate_secret');
```

### JWT Authentication

```php
define('GRAPHQL_JWT_AUTH_SECRET_KEY', 'your-strong-secret-key');
```

Generate a strong secret:
```bash
openssl rand -base64 64
```

### Frontend URL

```php
define('FRONTEND_URL', 'https://localhost:3000'); // or production URL
```

Used by mu-plugins for redirects and link rewriting.

## Public vs Private Variables

### Public (Browser-Safe)

Variables prefixed with `NEXT_PUBLIC_` are exposed to the browser. Only use this prefix for:
- URLs
- API keys that are meant to be public (Algolia search key, Google Maps)
- Non-sensitive configuration

### Private (Server-Only)

Variables without `NEXT_PUBLIC_` prefix are server-only:
- API secrets
- Admin API keys
- Webhook secrets
- Internal communication tokens

**Never expose private variables to the browser.**

## Environment-Specific Values

| Variable | Local | Staging | Production |
|----------|-------|---------|------------|
| `NEXT_PUBLIC_FRONTEND_URL` | `https://localhost:3000` | `https://staging.chirostretch.com` | `https://chirostretch.com` |
| `NEXT_PUBLIC_BACKEND_URL` | `https://chirostretch-copy.local` | `https://cms-staging.chirostretch.com` | `https://cms.chirostretch.com` |
| `NODE_TLS_REJECT_UNAUTHORIZED` | `0` | Not set | Not set |

## Vercel Environment Variables

For production deployment on Vercel:

1. Go to Project Settings > Environment Variables
2. Add all required variables
3. Set appropriate environment scopes (Production, Preview, Development)

**Sensitive variables** should be marked as "Sensitive" in Vercel to hide values in logs.

## Secrets Management Rules

1. **Never commit secrets** to version control
2. **Use `.env.local`** for local development (gitignored)
3. **Generate unique secrets** per environment
4. **Rotate secrets** if compromised
5. **Use environment-specific values** — don't share secrets between environments

## Validation

The application will fail to start if required variables are missing. Check the console for errors like:

```
Error: Missing required environment variable: NEXT_PUBLIC_WPGRAPHQL_ENDPOINT
```

To validate your configuration:
```bash
# Check if GraphQL endpoint is reachable
curl --insecure $NEXT_PUBLIC_WPGRAPHQL_ENDPOINT

# Check if WooCommerce API is configured
curl --insecure -u "$WC_CONSUMER_KEY:$WC_CONSUMER_SECRET" \
  "$NEXT_PUBLIC_BACKEND_URL/wp-json/wc/v3/system_status"
```
