# Debugging Guide

The "help I'm on fire" doc. Common errors, their causes, and fixes.

## Quick Diagnostic Commands

```bash
# Check if WordPress is responding
curl --insecure https://chirostretch-copy.local/graphql -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ generalSettings { title } }"}'

# Check if Next.js is running
curl --insecure https://localhost:3000/api/algolia/check-status

# Check WooCommerce API
curl --insecure -u "$WC_CONSUMER_KEY:$WC_CONSUMER_SECRET" \
  https://chirostretch-copy.local/wp-json/wc/v3/system_status

# Check Algolia index counts
curl --insecure https://localhost:3000/api/algolia/check-status
```

## Error Categories

- [GraphQL Errors](#graphql-errors)
- [Algolia/Search Errors](#algoliasearch-errors)
- [Authentication Errors](#authentication-errors)
- [Checkout/WooCommerce Errors](#checkoutwoocommerce-errors)
- [Build/Deploy Errors](#builddeploy-errors)
- [CORS Errors](#cors-errors)

---

## GraphQL Errors

### "ECONNREFUSED" or "Connection refused"

**Symptom:** Next.js cannot connect to WordPress GraphQL.

**Causes:**
1. WordPress not running
2. Wrong endpoint URL
3. LocalWP not started

**Fixes:**
```bash
# 1. Start WordPress
# Open LocalWP and start the site

# 2. Verify endpoint
echo $NEXT_PUBLIC_WPGRAPHQL_ENDPOINT
# Should output: https://chirostretch-copy.local/graphql

# 3. Test endpoint directly
curl --insecure https://chirostretch-copy.local/graphql -X POST \
  -H "Content-Type: application/json" \
  -d '{"query": "{ generalSettings { title } }"}'
```

### "UNABLE_TO_VERIFY_LEAF_SIGNATURE"

**Symptom:** SSL certificate validation error.

**Cause:** Self-signed certificate from LocalWP not trusted.

**Fix for development:**
```env
# In .env.local
NODE_TLS_REJECT_UNAUTHORIZED=0
```

**Fix properly:** Trust LocalWP certificate in system keychain.

### "Cannot query field X on type Y"

**Symptom:** GraphQL query fails with field error.

**Causes:**
1. Field name typo
2. ACF field not exposed to GraphQL
3. Plugin not installed/activated
4. Types changed after codegen

**Fixes:**
```bash
# 1. Verify field exists in GraphQL Playground
# Go to: https://chirostretch-copy.local/graphql

# 2. Check ACF field settings
# In WordPress admin: ACF > Field Groups > [Your Group]
# Verify "Show in GraphQL" is enabled

# 3. Regenerate types
pnpm codegen
```

### "null" data for published content

**Symptom:** Query returns null even though content exists.

**Causes:**
1. Content is draft, not published
2. Wrong post type in query
3. Case sensitivity in field names

**Fixes:**
1. Publish the content in WordPress
2. Check post status in database
3. Verify exact field names in GraphQL Playground

---

## Algolia/Search Errors

### Search returns no results

**Symptom:** Search modal shows empty results.

**Causes:**
1. Indices not populated
2. Wrong index name
3. Algolia credentials invalid

**Fixes:**
```bash
# 1. Check index status
curl --insecure https://localhost:3000/api/algolia/check-status

# 2. Re-index all content
curl --insecure -X POST https://localhost:3000/api/algolia/index-products
curl --insecure -X POST https://localhost:3000/api/algolia/index-locations
curl --insecure -X POST https://localhost:3000/api/algolia/index-articles
curl --insecure -X POST https://localhost:3000/api/algolia/index-events

# 3. Verify credentials in .env.local
echo $NEXT_PUBLIC_ALGOLIA_APP_ID
echo $NEXT_PUBLIC_ALGOLIA_SEARCH_KEY
```

### "Index does not exist"

**Symptom:** Algolia API error about missing index.

**Fix:**
1. Log into Algolia dashboard
2. Create the missing index (products, events, articles, locations)
3. Re-run indexing

### Stale search results

**Symptom:** New/updated content not appearing in search.

**Causes:**
1. Auto-sync not working
2. WordPress webhook failed
3. Content not published

**Fixes:**
```bash
# 1. Check WordPress error log
# In LocalWP: Database > Open Adminer > Select wp_options > debug.log

# 2. Manually trigger sync
curl --insecure -X POST https://localhost:3000/api/algolia/index-products

# 3. Verify MU-plugin is active
# Check: /wp-content/mu-plugins/algolia-sync.php exists
```

### Webhook sync failing

**Symptom:** Content saves but doesn't update in Algolia.

**Causes:**
1. `WP_WEBHOOK_SECRET` mismatch
2. Next.js not running
3. Network error

**Fixes:**
```bash
# 1. Verify secrets match
# In .env.local and wp-config.php, WP_WEBHOOK_SECRET must be identical

# 2. Check Next.js is running and accessible from WordPress
curl --insecure https://localhost:3000/api/algolia/index-products

# 3. Check WordPress error logs for webhook failures
```

---

## Authentication Errors

### "Invalid JWT token"

**Symptom:** Authenticated requests fail with 401.

**Causes:**
1. Token expired
2. Wrong JWT secret
3. Token from different environment

**Fixes:**
1. Refresh the token
2. Re-authenticate (login again)
3. Verify `GRAPHQL_JWT_AUTH_SECRET_KEY` in wp-config.php

### Password reset link invalid

**Symptom:** "This password reset link is invalid or has expired"

**Causes:**
1. Link expired (24 hours default)
2. Link already used
3. Wrong user

**Fixes:**
1. Request a new password reset
2. Check user exists in WordPress

### CORS on auth requests

**Symptom:** Login/auth requests blocked by CORS.

**Fix:** Verify WordPress CORS headers in mu-plugins:
```php
// headless-link-rewriter.php should include:
header('Access-Control-Allow-Origin: https://localhost:3000');
header('Access-Control-Allow-Credentials: true');
```

---

## Checkout/WooCommerce Errors

### "401 Unauthorized" on WooCommerce API

**Symptom:** Order creation or cart operations fail.

**Causes:**
1. Invalid API keys
2. Keys don't have permissions
3. Wrong endpoint

**Fixes:**
```bash
# 1. Verify keys work
curl --insecure -u "$WC_CONSUMER_KEY:$WC_CONSUMER_SECRET" \
  https://chirostretch-copy.local/wp-json/wc/v3/system_status

# 2. Regenerate keys in WordPress
# WooCommerce > Settings > Advanced > REST API
# Create new key with Read/Write permissions

# 3. Update .env.local with new keys
```

### Cart not persisting

**Symptom:** Cart items disappear on refresh.

**Causes:**
1. localStorage blocked
2. Zustand store not hydrating
3. Cart key changed

**Fixes:**
1. Check browser allows localStorage
2. Look for console errors related to Zustand
3. Clear localStorage and re-add items

### Order creation fails

**Symptom:** Checkout submit returns error.

**Causes:**
1. Invalid product data
2. Out of stock
3. API error

**Debug:**
```javascript
// Add to checkout API route temporarily
console.log('Order data:', JSON.stringify(orderData, null, 2));
```

Check WooCommerce > Status > Logs for API errors.

### Payment page not loading

**Symptom:** Redirect to WordPress payment page fails.

**Causes:**
1. Wrong redirect URL
2. Order not created
3. WooCommerce payment gateway issue

**Fixes:**
1. Verify order exists in WooCommerce admin
2. Check redirect URL format
3. Test payment gateway in WordPress directly

---

## Build/Deploy Errors

### "Module not found" during build

**Symptom:** Build fails with import error.

**Causes:**
1. Missing dependency
2. Wrong import path
3. Case sensitivity

**Fixes:**
```bash
# 1. Install dependencies
pnpm install

# 2. Check import path case sensitivity
# Files: src/Components/Button.tsx
# Import: import Button from './components/Button' // WRONG case

# 3. Clear cache and rebuild
rm -rf .next && pnpm build
```

### TypeScript errors in build

**Symptom:** Build fails with type errors.

**Fixes:**
```bash
# 1. Run type check locally
npx tsc --noEmit

# 2. Regenerate GraphQL types
pnpm codegen

# 3. Fix errors shown in output
```

### Build works locally, fails on Vercel

**Symptom:** Local build succeeds but Vercel fails.

**Causes:**
1. Missing environment variables
2. Different Node.js version
3. Case sensitivity (macOS vs Linux)

**Fixes:**
1. Verify all env vars in Vercel dashboard
2. Match Node.js version (20.x)
3. Check file path case sensitivity

---

## CORS Errors

### "Access-Control-Allow-Origin" missing

**Symptom:** Browser blocks cross-origin requests.

**Causes:**
1. WordPress not sending CORS headers
2. Wrong origin in headers
3. Preflight request failing

**Fix in mu-plugin:**
```php
add_action('init', function() {
    $allowed_origins = [
        'https://localhost:3000',
        'https://chirostretch.com',
    ];

    $origin = $_SERVER['HTTP_ORIGIN'] ?? '';

    if (in_array($origin, $allowed_origins, true)) {
        header("Access-Control-Allow-Origin: $origin");
        header('Access-Control-Allow-Credentials: true');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Authorization');
    }

    if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
        exit(0);
    }
});
```

---

## Log Locations

| Service | Log Location |
|---------|--------------|
| Next.js (local) | Terminal output |
| Next.js (Vercel) | Vercel dashboard > Deployments > Logs |
| WordPress | `/wp-content/debug.log` |
| WPEngine | WPEngine dashboard > Logs |
| Browser | Developer Tools > Console |

### Enable WordPress Debug Logging

In `wp-config.php`:
```php
define('WP_DEBUG', true);
define('WP_DEBUG_LOG', true);
define('WP_DEBUG_DISPLAY', false);
```

---

## Emergency Procedures

### Site completely down

1. Check Vercel status: https://www.vercel-status.com/
2. Check WPEngine status
3. Check DNS propagation
4. Verify SSL certificates

### Data loss suspected

1. **Do not panic**
2. Check WPEngine backup points
3. Export current database state
4. Identify what's missing
5. Restore from backup if needed

### Security incident

1. Rotate all secrets immediately
2. Check access logs
3. Review recent deployments
4. Update WordPress admin passwords
5. Notify team

---

## Getting Help

1. Check this guide first
2. Search existing issues
3. Check logs for specific errors
4. Create detailed bug report with:
   - Steps to reproduce
   - Expected vs actual behavior
   - Error messages
   - Environment (local/staging/prod)
