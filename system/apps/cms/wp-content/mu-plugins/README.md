# ChiroStretch Must-Use Plugins

This directory contains WordPress must-use plugins that are automatically loaded before regular plugins.

## Environment-Based Loading

The `_env-loader.php` plugin manages which mu-plugins load based on environment.

### Environment Detection

Environments are detected in this order:
1. `wp_get_environment_type()` (WordPress 5.5+)
2. `WP_ENV` constant (Bedrock/modern setups)
3. Defaults to `'production'` for safety

### Environment Types

- **local** - Local development (Local by Flywheel, Docker, etc.)
- **development** - Remote development server
- **staging** - Pre-production staging server
- **production** - Live production site

### Adding Dev-Only Plugins

To prevent a plugin from loading in production, add it to the appropriate array in `_env-loader.php`:

```php
// Blocked in staging and production
const CHS_DEV_ONLY_PLUGINS = [
    'mailhog-smtp.php',
];

// Blocked only in production (OK for staging)
const CHS_NON_PRODUCTION_PLUGINS = [
    'debug-bar.php',
];
```

## Plugin Inventory

### Infrastructure

- **_env-loader.php** - Environment-based plugin loader
- **nextjs-revalidation.php** - Triggers Next.js ISR revalidation on content changes
- **algolia-sync.php** - Auto-syncs content to Algolia on save/delete (locations, articles, events, products)

### Content Types

- **locations-cpt.php** - Clinic locations custom post type
- **staff-cpt.php** - Staff members (practitioners) custom post type
- **testimonials-cpt.php** - Patient testimonials custom post type
- **franchise-application-cpt.php** - Franchise application workflow

### Taxonomies

- **practitioner-taxonomies.php** - Discipline, services, and specialty taxonomies

### Options Pages

- **business-info-options.php** - Business information (phone, email, address)
- **services-options.php** - Services displayed on location pages
- **feature-options.php** - Feature key points for location pages

### WooCommerce Extensions

- **bookings-slots-api.php** - REST API for booking availability slots
- **wpgraphql-woocommerce-bookings.php** - GraphQL integration for bookings
- **woocommerce-session-for-all-users.php** - Session management for all users
- **woocommerce-account-settings.php** - Account page customizations
- **woocommerce-auto-customer-accounts.php** - Automatically creates customer accounts on first purchase
- **persistent-cart-restore.php** - Cart restoration for headless architecture
- **new-patient-coupon.php** - New patient coupon generation from Gravity Forms

### Events Integration

- **location-organizer-sync.php** - Syncs locations to The Events Calendar organizers

### GraphQL & Headless

- **graphql-mutations.php** - Custom GraphQL mutations for CPT management (location, staff)
- **graphql-auth-coupon-mutations.php** - GraphQL mutations for password reset and coupon operations
- **headless-password-reset.php** - Password reset URL rewriting for headless frontend (REST endpoints - deprecated, use GraphQL)
- **headless-link-rewriter.php** - Rewrites internal WordPress URLs to frontend URLs in GraphQL/REST responses

### REST API (Deprecated)

The following REST endpoints are deprecated in favor of GraphQL mutations:

| REST Endpoint | GraphQL Mutation | Status |
|---------------|------------------|--------|
| `POST /chirostretch/v1/auth/request-reset` | `requestPasswordReset` | Deprecated |
| `POST /chirostretch/v1/auth/validate-reset-key` | `validatePasswordResetKey` | Deprecated |
| `POST /chirostretch/v1/auth/reset-password` | `resetPassword` | Deprecated |
| `POST /chirostretch/v1/coupons/new-patient` | `generateNewPatientCoupon` | Deprecated |
| `POST /chirostretch/v1/coupons/validate` | `validateCoupon` | Deprecated |
| `POST /wp-json/wc/v3/orders` | `createCheckoutOrder` | Migrated to GraphQL |

### GraphQL Auth & Coupon Mutations

The `graphql-auth-coupon-mutations.php` plugin provides:

**Public Mutations (no auth required):**
- `requestPasswordReset(email)` - Generate reset key, returns user data for email
- `validatePasswordResetKey(key, login)` - Validate reset link
- `resetPassword(key, login, password)` - Set new password

**Protected Mutations (requires X-Internal-Secret header):**
- `generateNewPatientCoupon(email, firstName?, userId?, entryId?)` - Create coupon for new patient
- `validateCoupon(couponCode, email)` - Validate coupon with email verification
- `createCheckoutOrder(billing, shipping?, lineItems, couponCode?, customerNote?)` - Create WooCommerce order

Example GraphQL mutations:
```graphql
mutation ResetPassword($key: String!, $login: String!, $password: String!) {
  resetPassword(input: { key: $key, login: $login, password: $password }) {
    success
    message
    error
  }
}

mutation CreateCheckoutOrder($billing: CheckoutAddressInput!, $lineItems: [CheckoutLineItemInput]!) {
  createCheckoutOrder(input: { billing: $billing, lineItems: $lineItems }) {
    success
    orderId
    orderKey
    paymentUrl
    total
    status
  }
}
```

### Bulk Operations

- **chirostretch-bulk-importer.php** - WP-CLI commands for importing demo data

### WordPress Admin

- **acf-admin-styles.php** - ACF field layout improvements
- **admin-cleanup.php** - Removes unnecessary admin UI elements (Yoast SEO from customers)
- **block-whitelist.php** - Restricts Gutenberg to approved blocks
- **chirostretch-dashboards.php** - Role-based dashboard routing
- **application-status.php** - Franchise application status page

### Development Only

- **mailhog-smtp.php** - MailHog SMTP for local email testing (auto-disabled in production)
- **chirostretch-locations-seeder.php** - WP-CLI location seeding (CLI-only)
- **chirostretch-services-seeder.php** - WP-CLI services seeding (CLI-only)
- **chirostretch-staff-seeder.php** - WP-CLI staff seeding (CLI-only)

## Deployment

The environment loader ensures dev-only plugins don't run in production. No additional deployment configuration needed.

### Setting Environment Type

In `wp-config.php`:

```php
// WordPress 5.5+
define('WP_ENVIRONMENT_TYPE', 'production');

// Or for Bedrock
define('WP_ENV', 'production');
```

### Verifying Environment

Use WP-CLI:

```bash
wp eval "echo wp_get_environment_type();"
```

## Development Guidelines

### Creating New MU-Plugins

1. Add proper header comment with plugin name and description
2. Include `ABSPATH` check for security
3. Add to environment loader if dev-only
4. Document in this README

### Example Plugin Header

```php
<?php
/**
 * Plugin Name: My Custom Feature
 * Description: Brief description of what this does
 * Author: ChiroStretch Dev
 */

if (!defined('ABSPATH')) {
    exit;
}
```

### WP-CLI Only Plugins

For plugins that should only run via WP-CLI:

```php
if (!defined('WP_CLI') || !WP_CLI) {
    return;
}
```

## Troubleshooting

### Plugin Not Loading

1. Check environment type: `wp eval "echo wp_get_environment_type();"`
2. Verify plugin isn't in blocklist for current environment
3. Check error logs for PHP errors

### Dev Plugin Running in Production

1. Verify `WP_ENVIRONMENT_TYPE` is set to `'production'` in `wp-config.php`
2. Check `_env-loader.php` configuration
3. Clear any object cache
