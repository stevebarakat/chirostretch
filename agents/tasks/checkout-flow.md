<!-- Scope: task runbook for checkout flow changes. -->
# Checkout Flow Implementation

## Overview

ChiroStretch uses a **hybrid headless checkout pattern** that balances Next.js UI control with WordPress payment processing expertise.

**Pattern:**
1. **Cart browsing** → Next.js (localStorage, no server sessions)
2. **Checkout form** → Next.js (billing collection)
3. **Order creation** → Next.js → WooCommerce REST API
4. **Payment processing** → WordPress (Stripe/PayPal via WooCommerce)
5. **Customer account creation** → WordPress (auto-created on payment success)
6. **Order confirmation** → Next.js (redirect from WordPress)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                          Next.js Frontend                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  1. User adds to cart                                            │
│     └─> localStorage (Zustand store)                             │
│                                                                   │
│  2. User fills out checkout form                                 │
│     └─> /checkout page (billing info)                            │
│                                                                   │
│  3. User submits checkout                                        │
│     └─> POST /api/checkout/create-order                          │
│         ├─> WooCommerce REST API v3                              │
│         │   POST /wp-json/wc/v3/orders                           │
│         │   (guest order, no customer_id)                        │
│         ├─> Response: { order_id, payment_url }                  │
│         └─> clearCart() immediately                              │
│                                                                   │
│  4. Redirect to WordPress payment                                │
│     └─> window.location.href = payment_url                       │
│         /checkout/order-pay/{order_id}/?key={order_key}          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                       WordPress Backend                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  5. User completes payment                                       │
│     └─> Stripe/PayPal gateway                                    │
│         ├─> Payment succeeds                                     │
│         └─> woocommerce_payment_complete hook fires              │
│                                                                   │
│  6. Auto-create customer account (if new)                        │
│     └─> woocommerce-auto-customer-accounts.php                   │
│         ├─> Check if billing_email exists                        │
│         ├─> Create WordPress user (customer role)                │
│         ├─> Link order to new user                               │
│         └─> Send welcome email with password reset               │
│                                                                   │
│  7. Redirect to Next.js success page                             │
│     └─> woocommerce_payment_successful_result filter             │
│         └─> {frontend_url}/checkout/success?order_id=X&key=Y     │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│                          Next.js Frontend                        │
├─────────────────────────────────────────────────────────────────┤
│                                                                   │
│  8. Show order confirmation                                      │
│     └─> /checkout/success page                                   │
│         └─> Fetch order details via GraphQL (read-only)          │
│                                                                   │
│  9. Customer sets password (first time)                          │
│     └─> Email link → /account/set-password?key=X&login=Y         │
│         ├─> Validate key via WordPress REST API                  │
│         ├─> User sets password                                   │
│         └─> Password saved to WordPress                          │
│                                                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 1. Cart Management (localStorage + Zustand)

**Strategy:** No server-side sessions. Cart lives entirely in browser localStorage.

**Why localStorage:**
- No session cookies required
- Works for guest users
- Fast (no API calls for cart operations)
- Simple state management
- No stale cart issues

### Implementation

**File:** `system/apps/ui/src/stores/useCartStore.ts`

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface CartItem {
  key: string;
  id: number;
  product_id: number;
  name: string;
  quantity: number;
  prices: {
    price: string;
  };
  type?: 'booking' | 'simple' | 'variable';
  item_data?: Array<{ name: string; value: string }>;
  variation?: {
    id: number;
    attributes: Array<{ name: string; value: string }>;
  };
}

interface CartState {
  items: CartItem[];
  totals: {
    total_price: string;
    total_items: number;
  } | null;
  isHydrated: boolean;
  addItem: (item: CartItem) => void;
  removeItem: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
  clearCart: () => void;
  setHydrated: (hydrated: boolean) => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      totals: null,
      isHydrated: false,

      addItem: (item) => {
        const existingItem = get().items.find(i => i.key === item.key);
        if (existingItem) {
          // Update quantity for existing item
          set(state => ({
            items: state.items.map(i =>
              i.key === item.key
                ? { ...i, quantity: i.quantity + item.quantity }
                : i
            )
          }));
        } else {
          // Add new item
          set(state => ({ items: [...state.items, item] }));
        }

        // Recalculate totals
        const state = get();
        const total_price = state.items.reduce(
          (sum, item) => sum + parseFloat(item.prices.price) * item.quantity,
          0
        ).toFixed(2);
        const total_items = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        set({ totals: { total_price, total_items } });
      },

      removeItem: (key) => {
        set(state => ({
          items: state.items.filter(i => i.key !== key)
        }));

        // Recalculate totals
        const state = get();
        const total_price = state.items.reduce(
          (sum, item) => sum + parseFloat(item.prices.price) * item.quantity,
          0
        ).toFixed(2);
        const total_items = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        set({ totals: { total_price, total_items } });
      },

      updateQuantity: (key, quantity) => {
        if (quantity <= 0) {
          get().removeItem(key);
          return;
        }

        set(state => ({
          items: state.items.map(i =>
            i.key === key ? { ...i, quantity } : i
          )
        }));

        // Recalculate totals
        const state = get();
        const total_price = state.items.reduce(
          (sum, item) => sum + parseFloat(item.prices.price) * item.quantity,
          0
        ).toFixed(2);
        const total_items = state.items.reduce(
          (sum, item) => sum + item.quantity,
          0
        );
        set({ totals: { total_price, total_items } });
      },

      clearCart: () => {
        set({ items: [], totals: null });
      },

      setHydrated: (hydrated) => {
        set({ isHydrated: hydrated });
      },
    }),
    {
      name: 'cart-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    }
  )
);
```

**Key Points:**
- Use `persist` middleware for localStorage
- Generate unique `key` for each cart item (handles variations)
- Recalculate totals on every cart mutation
- Track `isHydrated` to prevent hydration mismatches
- `clearCart()` called immediately after order creation

---

## 2. Checkout Form (Next.js)

**File:** `system/apps/ui/src/app/(site)/(commerce)/checkout/page.tsx`

### Billing Info Collection

```typescript
type BillingInfo = {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address_1: string;
  address_2: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

const [billing, setBilling] = useState<BillingInfo>({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  address_1: "",
  address_2: "",
  city: "",
  state: "",
  postcode: "",
  country: "US",
});
```

### Form Submission Handler

```typescript
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  setError(null);

  try {
    // Format cart items for WooCommerce REST API
    const line_items = items.map((item) => {
      const lineItem: {
        product_id: number;
        quantity: number;
        variation_id?: number;
        meta_data?: Array<{ key: string; value: string | number }>;
      } = {
        product_id: item.product_id || item.id || 0,
        quantity: item.quantity,
        variation_id: item.variation?.id,
      };

      // Include booking metadata if this is a booking product
      if (item.type === "booking" && item.item_data) {
        lineItem.meta_data = item.item_data.map((data: any) => ({
          key: data.name || data.key,
          value: data.value || data.display,
        }));
      }

      return lineItem;
    });

    // Create order via REST API
    const response = await fetch("/api/checkout/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        billing,
        shipping: billing, // Use same address for shipping
        line_items,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(
        errorData.message || "Failed to create order. Please try again."
      );
    }

    const data = await response.json();

    // Clear cart immediately after order creation
    // Cart items are now captured in the WooCommerce order
    console.log(`[Checkout] Order ${data.order_id} created, clearing cart`);
    clearCart();

    // Redirect to WordPress payment URL
    console.log(`[Checkout] Redirecting to payment URL: ${data.payment_url}`);
    window.location.href = data.payment_url;
  } catch (err) {
    console.error("[Checkout] Error:", err);
    setError(
      err instanceof Error ? err.message : "An unexpected error occurred"
    );
    setLoading(false);
  }
};
```

**Critical Timing:**
1. Create order via API
2. **Clear cart immediately** (order is now in WooCommerce)
3. Redirect to WordPress payment URL

This prevents cart from appearing non-empty if user backs out of payment.

---

## 3. Order Creation (REST API)

**File:** `system/apps/ui/src/app/api/checkout/create-order/route.ts`

```typescript
import { NextRequest, NextResponse } from 'next/server';

const WC_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/wp-json/wc/v3`;
const WC_CONSUMER_KEY = process.env.WC_CONSUMER_KEY!;
const WC_CONSUMER_SECRET = process.env.WC_CONSUMER_SECRET!;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { billing, shipping, line_items } = body;

    // Validate required fields
    if (!billing || !line_items || line_items.length === 0) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Create order via WooCommerce REST API v3
    const orderData = {
      payment_method: 'stripe', // or 'paypal', configurable
      payment_method_title: 'Credit Card',
      set_paid: false, // Order is unpaid (pending payment)
      billing,
      shipping,
      line_items,
      status: 'pending', // Will change to 'processing' after payment
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

    if (!response.ok) {
      const errorData = await response.json();
      console.error('[Create Order] WooCommerce API error:', errorData);
      return NextResponse.json(
        { message: errorData.message || 'Failed to create order' },
        { status: response.status }
      );
    }

    const order = await response.json();

    // Build WordPress payment URL
    const payment_url = `${process.env.NEXT_PUBLIC_BACKEND_URL}/checkout/order-pay/${order.id}/?pay_for_order=true&key=${order.order_key}`;

    return NextResponse.json({
      order_id: order.id,
      order_key: order.order_key,
      payment_url,
      status: order.status,
    });
  } catch (error) {
    console.error('[Create Order] Error:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}
```

**Environment Variables:**
```env
NEXT_PUBLIC_BACKEND_URL=https://chirostretch-copy.local
WC_CONSUMER_KEY=ck_xxxxx
WC_CONSUMER_SECRET=cs_xxxxx
```

**WooCommerce REST API Authentication:**
- Generate keys in WP Admin → WooCommerce → Settings → Advanced → REST API
- Use Basic Auth with consumer key/secret
- Store credentials in `.env.local` (never commit!)

---

## 4. Payment Processing (WordPress)

User is redirected to WordPress at `/checkout/order-pay/{order_id}/?pay_for_order=true&key={order_key}`.

WordPress:
1. Validates order key
2. Shows payment gateway (Stripe/PayPal)
3. Processes payment
4. Fires `woocommerce_payment_complete` hook
5. Redirects back to Next.js

**No code needed in Next.js for this step.** WordPress handles everything.

---

## 5. Customer Auto-Creation (mu-plugin)

**File:** `system/apps/cms/wp-content/mu-plugins/woocommerce-auto-customer-accounts.php`

```php
<?php
/**
 * Plugin Name: WooCommerce Auto Customer Accounts
 * Description: Automatically creates customer accounts for guest orders after payment
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Create customer account automatically after successful payment
 *
 * Hook: woocommerce_payment_complete (fires after payment succeeds)
 *
 * Pattern:
 * 1. Check if order already has customer_id (skip if yes)
 * 2. Check if user with billing_email exists (link order if yes)
 * 3. If new email, create WordPress user with customer role
 * 4. Generate secure random password
 * 5. Link order to new user
 * 6. Send welcome email with password reset link
 */
add_action('woocommerce_payment_complete', 'chs_auto_create_customer_account', 10, 1);

function chs_auto_create_customer_account($order_id) {
    $order = wc_get_order($order_id);

    if (!$order) {
        return;
    }

    // Skip if order already has a customer
    if ($order->get_customer_id() > 0) {
        error_log("[Auto Customer] Order {$order_id} already has customer ID: " . $order->get_customer_id());
        return;
    }

    $billing_email = $order->get_billing_email();
    $billing_first_name = $order->get_billing_first_name();
    $billing_last_name = $order->get_billing_last_name();

    if (empty($billing_email)) {
        error_log("[Auto Customer] Order {$order_id} has no billing email");
        return;
    }

    // Check if user already exists
    $existing_user = get_user_by('email', $billing_email);

    if ($existing_user) {
        // Link order to existing user
        $order->set_customer_id($existing_user->ID);
        $order->save();
        error_log("[Auto Customer] Linked order {$order_id} to existing user {$existing_user->ID}");
        return;
    }

    // Create new customer account
    $username = sanitize_user($billing_first_name . '.' . $billing_last_name, true);

    // Ensure unique username
    $base_username = $username;
    $counter = 1;
    while (username_exists($username)) {
        $username = $base_username . $counter;
        $counter++;
    }

    // Generate secure random password
    $password = wp_generate_password(24, true, true);

    // Create user
    $user_id = wp_create_user($username, $password, $billing_email);

    if (is_wp_error($user_id)) {
        error_log("[Auto Customer] Failed to create user: " . $user_id->get_error_message());
        return;
    }

    // Set user role to customer
    $user = new WP_User($user_id);
    $user->set_role('customer');

    // Update user meta with billing info
    update_user_meta($user_id, 'first_name', $billing_first_name);
    update_user_meta($user_id, 'last_name', $billing_last_name);
    update_user_meta($user_id, 'billing_first_name', $billing_first_name);
    update_user_meta($user_id, 'billing_last_name', $billing_last_name);
    update_user_meta($user_id, 'billing_email', $billing_email);
    update_user_meta($user_id, 'billing_phone', $order->get_billing_phone());
    update_user_meta($user_id, 'billing_address_1', $order->get_billing_address_1());
    update_user_meta($user_id, 'billing_address_2', $order->get_billing_address_2());
    update_user_meta($user_id, 'billing_city', $order->get_billing_city());
    update_user_meta($user_id, 'billing_state', $order->get_billing_state());
    update_user_meta($user_id, 'billing_postcode', $order->get_billing_postcode());
    update_user_meta($user_id, 'billing_country', $order->get_billing_country());

    // Link order to new user
    $order->set_customer_id($user_id);
    $order->save();

    // Generate password reset key
    $reset_key = get_password_reset_key($user);

    if (is_wp_error($reset_key)) {
        error_log("[Auto Customer] Failed to generate reset key: " . $reset_key->get_error_message());
    } else {
        // Send welcome email with password reset link
        $frontend_url = function_exists('chirostretch_get_frontend_url')
            ? chirostretch_get_frontend_url()
            : 'https://localhost:3000';

        $reset_url = add_query_arg([
            'key' => $reset_key,
            'login' => rawurlencode($user->user_login),
        ], "{$frontend_url}/account/set-password");

        $subject = 'Welcome to ChiroStretch - Set Your Password';
        $message = "Hi {$billing_first_name},\n\n";
        $message .= "Thank you for your purchase! We've created an account for you.\n\n";
        $message .= "To set your password and access your account, click the link below:\n";
        $message .= "{$reset_url}\n\n";
        $message .= "This link will expire in 24 hours.\n\n";
        $message .= "Best regards,\nChiroStretch Team";

        wp_mail($billing_email, $subject, $message);
    }

    error_log("[Auto Customer] Created user {$user_id} ({$username}) for order {$order_id}");
}
```

**Key Points:**
- Fires on `woocommerce_payment_complete` (after payment succeeds)
- Creates user only if billing email is new
- Links order to existing user if email exists
- Generates 24-character random password
- Sends welcome email with password reset link (expires in 24 hours)
- Follows "identity is earned" principle (purchase = explicit event)

---

## 6. Password Reset Flow (Hybrid)

### WordPress REST API Endpoints

**File:** `system/apps/cms/wp-content/mu-plugins/headless-password-reset.php`

```php
<?php
/**
 * Plugin Name: Headless Password Reset
 * Description: WordPress REST API endpoints for password reset in headless Next.js frontend
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Validate password reset key
 *
 * Endpoint: POST /wp-json/chirostretch/v1/auth/validate-reset-key
 * Body: { "login": "username", "key": "reset_key" }
 */
add_action('rest_api_init', function() {
    register_rest_route('chirostretch/v1', '/auth/validate-reset-key', [
        'methods' => 'POST',
        'callback' => 'chs_validate_reset_key',
        'permission_callback' => '__return_true',
    ]);
});

function chs_validate_reset_key($request) {
    $login = $request->get_param('login');
    $key = $request->get_param('key');

    if (empty($login) || empty($key)) {
        return new WP_Error('missing_params', 'Missing login or key', ['status' => 400]);
    }

    $user = check_password_reset_key($key, $login);

    if (is_wp_error($user)) {
        return new WP_Error('invalid_key', $user->get_error_message(), ['status' => 400]);
    }

    return [
        'valid' => true,
        'user_login' => $user->user_login,
        'user_email' => $user->user_email,
    ];
}

/**
 * Reset password with new password
 *
 * Endpoint: POST /wp-json/chirostretch/v1/auth/reset-password
 * Body: { "login": "username", "key": "reset_key", "password": "new_password" }
 */
add_action('rest_api_init', function() {
    register_rest_route('chirostretch/v1', '/auth/reset-password', [
        'methods' => 'POST',
        'callback' => 'chs_reset_password',
        'permission_callback' => '__return_true',
    ]);
});

function chs_reset_password($request) {
    $login = $request->get_param('login');
    $key = $request->get_param('key');
    $password = $request->get_param('password');

    if (empty($login) || empty($key) || empty($password)) {
        return new WP_Error('missing_params', 'Missing required parameters', ['status' => 400]);
    }

    // Validate password length (minimum 8 characters)
    if (strlen($password) < 8) {
        return new WP_Error('weak_password', 'Password must be at least 8 characters', ['status' => 400]);
    }

    // Validate reset key
    $user = check_password_reset_key($key, $login);

    if (is_wp_error($user)) {
        return new WP_Error('invalid_key', $user->get_error_message(), ['status' => 400]);
    }

    // Reset password
    reset_password($user, $password);

    return [
        'success' => true,
        'message' => 'Password reset successfully',
    ];
}
```

### Next.js Password Reset Page

**File:** `system/apps/ui/src/app/(site)/(commerce)/account/set-password/page.tsx`

```typescript
"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import styles from "./set-password.module.css";

export default function SetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const key = searchParams.get("key");
  const login = searchParams.get("login");

  // Validate reset key on mount
  useEffect(() => {
    if (!key || !login) {
      setError("Invalid password reset link");
      setLoading(false);
      return;
    }

    validateKey();
  }, [key, login]);

  const validateKey = async () => {
    try {
      const response = await fetch("/api/auth/validate-reset-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, key }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Invalid or expired reset link");
      }

      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to validate reset link");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login, key, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || "Failed to reset password");
      }

      setSuccess(true);

      // Redirect to My Account after 2 seconds
      setTimeout(() => {
        window.location.href = `${process.env.NEXT_PUBLIC_BACKEND_URL}/my-account`;
      }, 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password");
      setLoading(false);
    }
  };

  if (loading && !error) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Validating Reset Link...</h1>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Password Set Successfully!</h1>
          <p>Redirecting you to your account...</p>
        </div>
      </div>
    );
  }

  if (error && !key) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Invalid Link</h1>
          <p className={styles.error}>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Set Your Password</h1>

        {error && (
          <div className={styles.error}>
            <p>{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="password" className={styles.label}>
              New Password *
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
              minLength={8}
            />
            <span className={styles.hint}>Minimum 8 characters</span>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="confirmPassword" className={styles.label}>
              Confirm Password *
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={styles.input}
              required
              minLength={8}
            />
          </div>

          <button
            type="submit"
            className={styles.submitButton}
            disabled={loading}
          >
            {loading ? "Setting Password..." : "Set Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
```

**API Route Proxies:**

`system/apps/ui/src/app/api/auth/validate-reset-key/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/wp-json/chirostretch/v1/auth/validate-reset-key`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to validate reset key' },
      { status: 500 }
    );
  }
}
```

`system/apps/ui/src/app/api/auth/reset-password/route.ts`:
```typescript
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/wp-json/chirostretch/v1/auth/reset-password`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to reset password' },
      { status: 500 }
    );
  }
}
```

---

## 7. Success & Redirect Handling

### WordPress Redirects to Next.js

**File:** `system/apps/cms/wp-content/mu-plugins/woocommerce-headless-checkout-redirect.php`

```php
<?php
/**
 * Plugin Name: WooCommerce Headless Checkout Redirect
 * Description: Redirects WooCommerce order completion to Next.js frontend success page
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

function chs_get_headless_checkout_url() {
    if (function_exists('chirostretch_get_frontend_url')) {
        return chirostretch_get_frontend_url();
    }

    $frontend_url = getenv('NEXTJS_URL');
    if ($frontend_url) {
        return rtrim($frontend_url, '/');
    }

    return 'https://localhost:3000';
}

/**
 * Override WooCommerce payment complete redirect
 *
 * WooCommerce redirects to different places after payment:
 * - wp-admin if user is logged in
 * - order-received page if guest
 *
 * We want all payments to redirect to Next.js success page.
 */
add_filter('woocommerce_payment_successful_result', function($result, $order_id) {
    $order = wc_get_order($order_id);
    if (!$order) {
        return $result;
    }

    $frontend_url = chs_get_headless_checkout_url();
    $success_url = add_query_arg([
        'order_id' => $order_id,
        'order_key' => $order->get_order_key(),
        'status' => $order->get_status(),
    ], "{$frontend_url}/checkout/success");

    error_log("[Headless Checkout] Payment complete, redirecting to Next.js: {$success_url}");

    return [
        'result' => 'success',
        'redirect' => $success_url,
    ];
}, 10, 2);

/**
 * Redirect WooCommerce "Order Received" page to Next.js success page
 *
 * Backup in case the payment redirect filter doesn't catch it.
 */
add_action('template_redirect', function() {
    if (!is_checkout() || !is_wc_endpoint_url('order-received')) {
        return;
    }

    global $wp;

    $order_id = isset($wp->query_vars['order-received']) ? absint($wp->query_vars['order-received']) : 0;
    $order_key = isset($_GET['key']) ? wc_clean($_GET['key']) : '';

    if (!$order_id) {
        return;
    }

    $order = wc_get_order($order_id);
    if (!$order || $order->get_order_key() !== $order_key) {
        return;
    }

    $frontend_url = chs_get_headless_checkout_url();
    $success_url = add_query_arg([
        'order_id' => $order_id,
        'order_key' => $order_key,
        'status' => $order->get_status(),
    ], "{$frontend_url}/checkout/success");

    wp_safe_redirect($success_url);
    exit;
}, 1);
```

### Next.js Success Page

**File:** `system/apps/ui/src/app/(site)/(commerce)/checkout/success/page.tsx`

```typescript
"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import styles from "./success.module.css";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const orderId = searchParams.get("order_id");
  const orderKey = searchParams.get("order_key");

  useEffect(() => {
    if (orderId && orderKey) {
      fetchOrderDetails();
    }
  }, [orderId, orderKey]);

  const fetchOrderDetails = async () => {
    try {
      // Fetch via GraphQL (read-only, no mutations)
      const response = await fetch("/api/graphql", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: `
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
          `,
          variables: { orderId },
        }),
      });

      const data = await response.json();
      setOrder(data.data.order);
      setLoading(false);
    } catch (err) {
      console.error("[Success] Failed to fetch order:", err);
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <h1>Loading order details...</h1>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <h1 className={styles.title}>Thank You for Your Order!</h1>

        {order && (
          <>
            <div className={styles.orderInfo}>
              <p>Order Number: <strong>#{order.orderNumber}</strong></p>
              <p>Status: <strong>{order.status}</strong></p>
              <p>Total: <strong>${order.total}</strong></p>
            </div>

            <div className={styles.notice}>
              <p>A confirmation email has been sent to <strong>{order.billing.email}</strong></p>
              <p>Check your email for password reset instructions to access your account.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
```

---

## 8. Files Involved

### Next.js Files

**Cart & Checkout:**
- `system/apps/ui/src/stores/useCartStore.ts` — Zustand cart store
- `system/apps/ui/src/app/(site)/(commerce)/cart/page.tsx` — Cart page
- `system/apps/ui/src/app/(site)/(commerce)/checkout/page.tsx` — Checkout form
- `system/apps/ui/src/app/(site)/(commerce)/checkout/success/page.tsx` — Success page

**API Routes:**
- `system/apps/ui/src/app/api/checkout/create-order/route.ts` — Order creation
- `system/apps/ui/src/app/api/auth/validate-reset-key/route.ts` — Validate reset key
- `system/apps/ui/src/app/api/auth/reset-password/route.ts` — Reset password

**Password Reset:**
- `system/apps/ui/src/app/(site)/(commerce)/account/set-password/page.tsx` — Set password UI

### WordPress MU-Plugins

**Checkout Flow:**
- `system/apps/cms/wp-content/mu-plugins/woocommerce-auto-customer-accounts.php` — Auto account creation
- `system/apps/cms/wp-content/mu-plugins/woocommerce-headless-checkout-redirect.php` — Payment redirects
- `system/apps/cms/wp-content/mu-plugins/headless-password-reset.php` — Password reset API

**Admin Cleanup:**
- `system/apps/cms/wp-content/mu-plugins/admin-cleanup.php` — Hide Yoast from customers

**Environment Config:**
- `system/apps/cms/wp-content/mu-plugins/chirostretch-environment.php` — Frontend URL helper

---

## 9. Testing Checklist

### Cart Testing
- [ ] Add item to cart (product, booking, variation)
- [ ] Update quantity
- [ ] Remove item
- [ ] Cart persists on page reload
- [ ] Cart displays in header badge
- [ ] Cart calculates totals correctly

### Checkout Testing
- [ ] Empty cart redirects to cart page
- [ ] Form validates required fields
- [ ] Form submits and creates order
- [ ] Cart clears after order creation
- [ ] Redirect to WordPress payment page works
- [ ] Payment URL contains order_id and order_key

### Payment Testing
- [ ] WordPress shows payment page correctly
- [ ] Stripe/PayPal payment succeeds
- [ ] After payment, redirects to Next.js success page
- [ ] Success page shows order details

### Customer Account Testing
- [ ] New email creates customer account
- [ ] Existing email links order to existing user
- [ ] Welcome email sent with password reset link
- [ ] Password reset link works (/account/set-password)
- [ ] Password validation (8+ characters)
- [ ] After password set, user can log in to My Account

### Error Handling
- [ ] Invalid payment (declined card) shows error
- [ ] Expired reset link shows error
- [ ] Duplicate username handled gracefully
- [ ] API failures show user-friendly errors

### Security
- [ ] WooCommerce API keys in .env.local (not committed)
- [ ] Password reset keys expire after 24 hours
- [ ] Order key validated before showing order details
- [ ] No sensitive data in client-side code

---

## 10. Common Issues & Solutions

### Cart Not Clearing

**Problem:** Cart still shows items after checkout.

**Solution:** Call `clearCart()` immediately after order creation, before redirect:

```typescript
const data = await response.json();
clearCart(); // Clear before redirect!
window.location.href = data.payment_url;
```

### Redirected to wp-admin After Payment

**Problem:** Logged-in users see wp-admin instead of success page.

**Solution:** Use `woocommerce_payment_successful_result` filter (priority over default redirect):

```php
add_filter('woocommerce_payment_successful_result', function($result, $order_id) {
    $order = wc_get_order($order_id);
    $success_url = "{$frontend_url}/checkout/success?order_id={$order_id}&order_key={$order->get_order_key()}";
    return ['result' => 'success', 'redirect' => $success_url];
}, 10, 2);
```

### Password Reset Link Doesn't Work

**Problem:** User clicks link but gets "invalid key" error.

**Causes:**
- Key expired (24-hour expiry)
- Key already used
- URL encoding issue with login parameter

**Solution:** Use `rawurlencode()` for login parameter:

```php
$reset_url = add_query_arg([
    'key' => $reset_key,
    'login' => rawurlencode($user->user_login),
], "{$frontend_url}/account/set-password");
```

### Duplicate Customer Accounts

**Problem:** Multiple accounts created for same email.

**Solution:** Check for existing user before creating:

```php
$existing_user = get_user_by('email', $billing_email);
if ($existing_user) {
    $order->set_customer_id($existing_user->ID);
    $order->save();
    return; // Don't create new user
}
```

---

## Summary

**Hybrid Checkout Pattern:**
- Next.js owns UI/UX (cart, checkout form)
- WordPress owns payments (battle-tested gateways)
- Auto customer creation (frictionless onboarding)
- Password reset via Next.js (branded experience)

**Key Benefits:**
- No payment code in Next.js (reduced risk)
- No server sessions required (scales easily)
- Clean separation of concerns
- Event-driven identity creation (purchase = earned identity)

**Critical Timing:**
1. Create order → 2. Clear cart → 3. Redirect to payment

**Files to Reference:**
- This guide for implementation details
- `agents/architecture.md` for system boundaries
- `agents/identity-charter.md` for identity rules
- `agents/woocommerce.md` for WooCommerce patterns
