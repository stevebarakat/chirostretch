# WooCommerce Integration Patterns

## Overview

ChiroStretch uses WooCommerce in a **headless architecture** where WordPress handles commerce logic and Next.js handles presentation.

**Integration Points:**
- **GraphQL** (via WooGraphQL) — Product catalog, read-only queries
- **REST API v3** — Order creation, write operations
- **WordPress Hooks** — Auto customer accounts, redirects, email customization
- **MU-Plugins** — Behavior modifications for headless architecture

**Separation of Concerns:**
- Next.js: Browse products, build cart, collect billing info
- WordPress: Process payments, manage orders, handle customer accounts

---

## Headless Checkout Pattern

See [agents/tasks/checkout-flow.md](tasks/checkout-flow.md) for the complete hybrid checkout implementation including architecture diagrams, cart management, order creation, and redirect handling.

---

## REST API Usage

### Authentication

WooCommerce REST API v3 uses **Basic Auth** with consumer keys.

**Generate Keys:**
1. WP Admin → WooCommerce → Settings → Advanced → REST API
2. Click "Add key"
3. Description: "Next.js Frontend"
4. User: Select admin user
5. Permissions: Read/Write
6. Generate

**Environment Variables:**
```env
# .env.local (Next.js)
WC_CONSUMER_KEY=ck_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
WC_CONSUMER_SECRET=cs_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NEXT_PUBLIC_BACKEND_URL=https://chirostretch-copy.local
```

**Usage:**
```typescript
const auth = Buffer.from(
  `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
).toString('base64');

const response = await fetch(`${WC_API_URL}/orders`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Authorization: `Basic ${auth}`,
  },
  body: JSON.stringify(orderData),
});
```

**Security Notes:**
- Never commit API keys to git
- Use `.env.local` (ignored by git)
- Proxy API calls through Next.js API routes (never expose keys to browser)
- Use HTTPS only (enforced by WooCommerce)

---

### Order Creation

**Endpoint:** `POST /wp-json/wc/v3/orders`

**Payload Structure:**
```json
{
  "payment_method": "stripe",
  "payment_method_title": "Credit Card",
  "set_paid": false,
  "billing": {
    "first_name": "John",
    "last_name": "Doe",
    "email": "john@example.com",
    "phone": "555-1234",
    "address_1": "123 Main St",
    "address_2": "Apt 4B",
    "city": "San Francisco",
    "state": "CA",
    "postcode": "94102",
    "country": "US"
  },
  "shipping": {
    "first_name": "John",
    "last_name": "Doe",
    "address_1": "123 Main St",
    "address_2": "Apt 4B",
    "city": "San Francisco",
    "state": "CA",
    "postcode": "94102",
    "country": "US"
  },
  "line_items": [
    {
      "product_id": 123,
      "quantity": 1
    },
    {
      "product_id": 456,
      "variation_id": 789,
      "quantity": 2
    },
    {
      "product_id": 999,
      "quantity": 1,
      "meta_data": [
        {"key": "Booking Date", "value": "2024-01-15"},
        {"key": "Booking Time", "value": "10:00 AM"}
      ]
    }
  ],
  "status": "pending"
}
```

**Response:**
```json
{
  "id": 1234,
  "order_key": "wc_order_xyz123",
  "status": "pending",
  "total": "149.99",
  "billing": { ... },
  "line_items": [ ... ]
}
```

**Implementation:**
```typescript
// system/apps/ui/src/app/api/checkout/create-order/route.ts
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { billing, shipping, line_items } = body;

  const orderData = {
    payment_method: 'stripe',
    payment_method_title: 'Credit Card',
    set_paid: false,
    billing,
    shipping,
    line_items,
    status: 'pending',
  };

  const auth = Buffer.from(
    `${WC_CONSUMER_KEY}:${WC_CONSUMER_SECRET}`
  ).toString('base64');

  const response = await fetch(`${WC_API_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${auth}`,
    },
    body: JSON.stringify(orderData),
  });

  const order = await response.json();

  // Build WordPress payment URL
  const payment_url = `${BACKEND_URL}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;

  return NextResponse.json({
    order_id: order.id,
    order_key: order.order_key,
    payment_url,
    status: order.status,
  });
}
```

**Key Points:**
- `set_paid: false` — Order is unpaid (requires payment)
- `status: "pending"` — Will change to "processing" after payment
- Guest order (no `customer_id`) — Customer account created after payment
- `payment_url` — WordPress URL for payment processing
- `order_key` — Required for guest order access

---

### Product Queries

**Use GraphQL (WooGraphQL) for product catalog:**

```graphql
query GetProducts {
  products(first: 10) {
    nodes {
      databaseId
      name
      slug
      type
      description
      shortDescription
      price
      regularPrice
      salePrice
      stockStatus
      image {
        sourceUrl
        altText
      }
      ... on SimpleProduct {
        price
      }
      ... on VariableProduct {
        variations {
          nodes {
            databaseId
            name
            price
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
    }
  }
}
```

**Why GraphQL for Products:**
- Type-safe queries (with codegen)
- Fetch only needed fields
- Nested data (variations, attributes, images)
- Cached by Next.js (static/ISR)

**Why REST API for Orders:**
- Write operations (create order)
- Returns `payment_url` (not in GraphQL schema)
- Simpler error handling for mutations

---

## Session Management

### No Server Sessions Required

**Traditional WooCommerce:**
- Server-side sessions (PHP `$_SESSION`)
- Session cookies (`woocommerce_session_*`)
- Cart stored in `wp_woocommerce_sessions` table

**Headless ChiroStretch:**
- **No sessions needed** (cart lives in localStorage)
- No session cookies required for browsing/checkout
- Session cookies only used for WordPress-rendered pages (My Account, wp-admin)

### When Sessions Are Used

**WordPress My Account:**
- User logs in → WordPress sets `wordpress_logged_in_*` cookie
- Cookie scoped to WordPress domain only
- Next.js doesn't read or validate this cookie

**Payment Page:**
- Guest checkout → no session
- If user logged in (testing as admin) → WordPress session active
- After payment → session used for redirect logic

### Session Cleanup

WooCommerce auto-clears expired sessions via cron.

**Manual cleanup:**
```sql
DELETE FROM wp_woocommerce_sessions WHERE session_expiry < UNIX_TIMESTAMP();
```

**MU-Plugin for extended session lifetime:**
```php
// system/apps/cms/wp-content/mu-plugins/woocommerce-session-config.php
add_filter('wc_session_expiration', function() {
    return 60 * 60 * 24 * 7; // 7 days (default: 2 days)
});
```

---

## Cart Storage Strategy

### localStorage-Only Cart

**Why:**
- No API calls for cart operations (instant UX)
- Works for guest users (no login required)
- Scales infinitely (no database load)
- Persists across page reloads
- Simple state management

**Tradeoffs:**
- Cart not synced across devices (acceptable for most users)
- No cart recovery emails (can add separately if needed)
- Price changes not reflected until checkout (acceptable)

### Implementation

**Zustand with persist middleware:**
```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totals: null,
      isHydrated: false,

      addItem: (item) => { /* ... */ },
      removeItem: (key) => { /* ... */ },
      updateQuantity: (key, quantity) => { /* ... */ },
      clearCart: () => set({ items: [], totals: null }),
      setHydrated: (hydrated) => set({ isHydrated: hydrated }),
    }),
    {
      name: 'cart-storage', // localStorage key
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
```

**Usage:**
```typescript
const { items, addItem, clearCart, isHydrated } = useCartStore();

// Wait for hydration before rendering
if (!isHydrated) {
  return <div>Loading...</div>;
}

// Add to cart
addItem({
  key: `${productId}_${variationId || 0}`,
  id: productId,
  product_id: productId,
  name: "Product Name",
  quantity: 1,
  prices: { price: "29.99" },
  type: "simple",
});

// Clear cart after order creation
clearCart();
```

**Critical: Clear cart BEFORE redirect to payment:**
```typescript
const data = await response.json(); // { order_id, payment_url }
clearCart(); // Clear immediately!
window.location.href = data.payment_url; // Then redirect
```

---

## Payment Gateways

### Supported Gateways

**Default:**
- Stripe (via WooCommerce Stripe plugin)
- PayPal (via WooCommerce PayPal Payments plugin)

**How It Works:**
1. Next.js creates order with `payment_method: "stripe"`
2. User redirected to WordPress `/checkout/order-pay/{order_id}/`
3. WordPress renders payment form (Stripe Elements)
4. User enters card → Stripe processes payment
5. Payment succeeds → `woocommerce_payment_complete` hook fires
6. WordPress redirects to Next.js success page

**No Next.js code required** — WordPress handles all payment logic.

### Payment Method Configuration

**WordPress Admin:**
- WooCommerce → Settings → Payments
- Enable Stripe and/or PayPal
- Configure API keys
- Set default payment method

**Order Creation:**
```typescript
const orderData = {
  payment_method: 'stripe', // or 'paypal'
  payment_method_title: 'Credit Card', // or 'PayPal'
  // ...
};
```

### Testing Payments

**Stripe Test Mode:**
1. WooCommerce → Settings → Payments → Stripe
2. Enable "Test mode"
3. Add test API keys
4. Use test card: `4242 4242 4242 4242`, any future expiry, any CVC

**Test Flow:**
1. Add item to cart (Next.js)
2. Checkout (Next.js)
3. Redirects to WordPress payment page
4. Enter test card
5. Payment succeeds
6. Redirects to Next.js success page
7. Check WP Admin → WooCommerce → Orders (order status: "Processing")

---

## Webhooks & Hooks

### WordPress Hooks (Not Webhooks)

**Webhooks** = HTTP callbacks (external services)
**Hooks** = PHP action/filter system (internal WP)

ChiroStretch uses **hooks** for internal behavior:

**Common Hooks:**
```php
// After payment succeeds
add_action('woocommerce_payment_complete', 'my_function', 10, 1);

// After order status changes
add_action('woocommerce_order_status_changed', 'my_function', 10, 4);

// Modify redirect after payment
add_filter('woocommerce_payment_successful_result', 'my_function', 10, 2);

// Modify order data before save
add_filter('woocommerce_checkout_create_order', 'my_function', 10, 2);

// Modify email content
add_filter('woocommerce_email_recipient_new_order', 'my_function', 10, 2);
```

### Auto Customer Account Hook

Customer accounts are auto-created on first purchase via `woocommerce_payment_complete` hook. See [agents/tasks/checkout-flow.md](tasks/checkout-flow.md#5-customer-auto-creation-mu-plugin) for the full implementation.

### Payment Redirect Hook

**File:** `system/apps/cms/wp-content/mu-plugins/woocommerce-headless-checkout-redirect.php`

```php
add_filter('woocommerce_payment_successful_result', function($result, $order_id) {
    $order = wc_get_order($order_id);
    $frontend_url = chirostretch_get_frontend_url();

    $success_url = add_query_arg([
        'order_id' => $order_id,
        'order_key' => $order->get_order_key(),
        'status' => $order->get_status(),
    ], "{$frontend_url}/checkout/success");

    return [
        'result' => 'success',
        'redirect' => $success_url,
    ];
}, 10, 2);
```

**Priority 10** = Runs before WooCommerce's default redirect (priority 20+).

---

## Customer Account Management

### Account Creation Pattern

Accounts are auto-created on first purchase following the [Access & Identity Charter](identity-charter.md). See [agents/tasks/checkout-flow.md](tasks/checkout-flow.md#5-customer-auto-creation-mu-plugin) for implementation.

### My Account Pages

**Owned by WordPress:**
- `/my-account` — Dashboard
- `/my-account/orders` — Order history
- `/my-account/edit-account` — Profile settings
- `/my-account/edit-address` — Shipping/billing addresses

**Next.js does NOT render these pages** — links go directly to WordPress.

**Why:**
- WordPress My Account is feature-rich (order details, downloads, subscriptions)
- Rebuilding in Next.js = high maintenance burden
- Users expect consistent "account" experience
- Payment/order data stays in WordPress (security)

**Link from Next.js:**
```typescript
<a href={`${process.env.NEXT_PUBLIC_BACKEND_URL}/my-account`}>
  My Account
</a>
```

### Password Reset Flow

**Hybrid Approach:**
- WordPress generates reset key (via `get_password_reset_key()`)
- Email contains Next.js URL: `/account/set-password?key=X&login=Y`
- Next.js renders branded password reset page
- Form submits to WordPress REST API
- Password saved in WordPress

**Why Hybrid:**
- WordPress owns user data (canonical source)
- Next.js owns branded UI (consistent UX)
- Best of both: security + experience

**Implementation:**
See [`agents/tasks/checkout-flow.md`](tasks/checkout-flow.md#6-password-reset-flow-hybrid) for details.

---

## GraphQL Integration (WooGraphQL)

### Plugin: WPGraphQL WooCommerce (WooGraphQL)

**Installed:** `wpgraphql-woocommerce` plugin

**Enables:**
- Product queries (products, variations, categories, tags)
- Cart queries (read-only, not used in ChiroStretch)
- Order queries (read-only, for success page)
- Customer queries (read-only, for account pages)

**NOT Used For:**
- Order creation (use REST API instead)
- Cart mutations (localStorage cart)
- Payment processing (WordPress only)

### Product Catalog Query

```graphql
query GetAllProducts {
  products(first: 100, where: { type: [SIMPLE, VARIABLE] }) {
    nodes {
      databaseId
      slug
      name
      type
      description
      shortDescription
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        variations {
          nodes {
            databaseId
            name
            price
            stockStatus
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
      image {
        sourceUrl
        altText
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

### Order Query (Success Page)

```graphql
query GetOrder($orderId: ID!) {
  order(id: $orderId, idType: DATABASE_ID) {
    databaseId
    orderNumber
    status
    total
    date
    billing {
      firstName
      lastName
      email
    }
    lineItems {
      nodes {
        productId
        quantity
        total
        product {
          node {
            name
          }
        }
      }
    }
  }
}
```

**Note:** Validate `order_key` before showing order (security):
```typescript
const orderKey = searchParams.get('order_key');
// Only fetch order if valid key (prevents unauthorized access)
```

### Custom GraphQL Types

**Booking Products:**
```php
// system/apps/cms/wp-content/mu-plugins/wpgraphql-woocommerce-bookings.php

register_graphql_object_type('BookingProduct', [
    'fields' => [
        'databaseId' => ['type' => ['non_null' => 'Int']],
        'name' => ['type' => 'String'],
        'slug' => ['type' => 'String'],
        'bookingDuration' => ['type' => 'Int'],
        'bookingDurationUnit' => ['type' => 'String'],
        // ...
    ],
]);

register_graphql_field('RootQuery', 'bookingProducts', [
    'type' => ['list_of' => 'BookingProduct'],
    'resolve' => function() {
        $args = ['post_type' => 'product', 'meta_key' => '_product_type', 'meta_value' => 'booking'];
        return get_posts($args);
    },
]);
```

---

## MU-Plugin Patterns

See [agents/wordpress.md](wordpress.md#mu-plugin-patterns) for MU-plugin patterns, naming conventions, and documentation requirements.

**WooCommerce-specific MU-plugins:**
- `woocommerce-auto-customer-accounts.php` — Auto account creation on purchase
- `woocommerce-headless-checkout-redirect.php` — Payment redirects to Next.js
- `wpgraphql-woocommerce-bookings.php` — Bookings GraphQL schema

---

## Security Considerations

### API Key Management

**Never commit API keys:**
```bash
# .gitignore
.env.local
.env*.local
```

**Use environment variables:**
```env
# .env.local (Next.js)
WC_CONSUMER_KEY=ck_xxxxx
WC_CONSUMER_SECRET=cs_xxxxx
```

**Proxy via Next.js API routes:**
```typescript
// ❌ Bad: Exposes keys to browser
const response = await fetch(`${WC_API_URL}/orders`, {
  headers: { Authorization: `Basic ${btoa(`${key}:${secret}`)}` },
});

// ✅ Good: Keys stay on server
const response = await fetch('/api/checkout/create-order', {
  method: 'POST',
  body: JSON.stringify(orderData),
});
```

### Order Key Validation

**Always validate order key before showing order:**
```typescript
// URL: /checkout/success?order_id=123&order_key=wc_order_xyz

const orderId = searchParams.get('order_id');
const orderKey = searchParams.get('order_key');

// Fetch order with key validation (WordPress validates key)
const order = await fetchOrder(orderId, orderKey);

if (!order) {
  // Invalid key or unauthorized access
  return <div>Order not found</div>;
}
```

**WordPress-side validation:**
```php
$order = wc_get_order($order_id);
if ($order->get_order_key() !== $order_key) {
    wp_die('Unauthorized');
}
```

### Password Reset Security

**Key expiration:**
- Default: 24 hours (WordPress core)
- One-time use (key invalidated after password reset)
- Timing-safe comparison (`hash_equals()`)

**Implementation:**
```php
$user = check_password_reset_key($key, $login);

if (is_wp_error($user)) {
    return new WP_Error('invalid_key', 'Invalid or expired reset link');
}

// Key is valid, allow password reset
reset_password($user, $new_password);
```

### HTTPS Enforcement

**All production environments must use HTTPS:**
- WordPress: `define('FORCE_SSL_ADMIN', true);` in `wp-config.php`
- Next.js: Reverse proxy (Nginx, Vercel) handles SSL
- WooCommerce REST API: Refuses HTTP connections in production

### Session Security

**WordPress sessions:**
- `COOKIEHASH` unique per site (prevents session fixation)
- `SECURE` flag on cookies (HTTPS only)
- `HTTPONLY` flag (prevents XSS access)
- `SAMESITE=Lax` (CSRF protection)

**Next.js:**
- No authentication cookies (uses WordPress cookies)
- Cart in localStorage (no sensitive data)
- API routes validate WordPress session for authenticated requests

---

## Summary

**WooCommerce in Headless Architecture:**
- **GraphQL** for product catalog (read-only)
- **REST API** for order creation (write operations)
- **WordPress Hooks** for behavior modifications
- **MU-Plugins** for headless customizations
- **localStorage Cart** (no server sessions)
- **Auto Customer Accounts** (event-driven identity)
- **Hybrid Password Reset** (WordPress API + Next.js UI)

**Key Principles:**
- Next.js initiates intent, WordPress finalizes transactions
- No payment code in Next.js (security)
- No cart sessions (scalability)
- Identity is earned (purchase = explicit event)

**Files to Reference:**
- This doc for WooCommerce patterns
- `agents/tasks/checkout-flow.md` for implementation details
- `agents/architecture.md` for system boundaries
- `agents/identity-charter.md` for identity rules
