<?php
/**
 * Plugin Name: WooCommerce Headless Checkout Redirect
 * Description: Redirects WooCommerce order completion to Next.js frontend success page
 * Version: 1.0.0
 *
 * For headless Next.js checkout pattern:
 * 1. Order created via REST API from Next.js
 * 2. User redirected to WP payment_url for payment
 * 3. After payment, redirect back to Next.js success page
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get frontend URL from constant, environment, or helper function
 */
function chs_get_headless_checkout_url() {
    // Use existing helper if available (defined in headless-password-reset.php)
    if (function_exists('chirostretch_get_frontend_url')) {
        return chirostretch_get_frontend_url();
    }

    // Fallback: check constant directly (wp-config.php)
    if (defined('NEXT_PUBLIC_FRONTEND_URL') && NEXT_PUBLIC_FRONTEND_URL) {
        return rtrim(NEXT_PUBLIC_FRONTEND_URL, '/');
    }

    // Fallback: environment variable
    $frontend_url = getenv('NEXT_PUBLIC_FRONTEND_URL');
    if ($frontend_url) {
        return rtrim($frontend_url, '/');
    }

    // Default for local development
    return 'https://localhost:3000';
}

/**
 * Hide "guest order" warning notice on payment page
 *
 * For headless checkout, all orders are created as guest orders via REST API.
 * The warning appears when:
 * - User is logged in (e.g., admin testing)
 * - Order has no customer_id (guest order)
 * - Billing email doesn't match logged-in user
 *
 * The warning is confusing for our headless flow since users just filled out checkout.
 * Customer accounts are created after payment via woocommerce-auto-customer-accounts.php
 */
add_action('wp_footer', function() {
    if (is_checkout() && is_wc_endpoint_url('order-pay')) {
        ?>
        <script>
        (function() {
            // Remove the guest order warning notice
            const notices = document.querySelectorAll('.woocommerce-error, .woocommerce-message');
            notices.forEach(function(notice) {
                if (notice.textContent.includes('You are paying for a guest order')) {
                    notice.style.display = 'none';
                }
            });
        })();
        </script>
        <?php
    }
});

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
 * After payment is completed in WordPress, users are normally shown
 * WP's order-received page. This redirects them to Next.js instead.
 * This is a backup in case the payment redirect filter doesn't catch it.
 */
add_action('template_redirect', function() {
    // Only proceed if this is an order-received page
    if (!is_checkout() || !is_wc_endpoint_url('order-received')) {
        return;
    }

    global $wp;

    // Get order ID and key from URL
    $order_id = isset($wp->query_vars['order-received']) ? absint($wp->query_vars['order-received']) : 0;
    $order_key = isset($_GET['key']) ? wc_clean($_GET['key']) : '';

    if (!$order_id) {
        return;
    }

    // Verify order exists and key matches
    $order = wc_get_order($order_id);
    if (!$order || $order->get_order_key() !== $order_key) {
        return;
    }

    // Build Next.js success URL with order details
    $frontend_url = chs_get_headless_checkout_url();
    $success_url = add_query_arg([
        'order_id' => $order_id,
        'order_key' => $order_key,
        'status' => $order->get_status(),
    ], "{$frontend_url}/checkout/success");

    // Log redirect for debugging
    error_log(sprintf(
        '[Headless Checkout] Redirecting order %d to Next.js: %s',
        $order_id,
        $success_url
    ));

    // Redirect to Next.js
    wp_safe_redirect($success_url);
    exit;
}, 1);

/**
 * Modify WooCommerce email "View Order" links to point to Next.js
 *
 * Order confirmation emails contain a link to view the order.
 * This ensures those links point to Next.js instead of WordPress.
 */
add_filter('woocommerce_get_view_order_url', function($view_order_url, $order) {
    $frontend_url = chs_get_headless_checkout_url();

    // Build Next.js order view URL
    $next_url = add_query_arg([
        'order_id' => $order->get_id(),
        'order_key' => $order->get_order_key(),
    ], "{$frontend_url}/account/orders/{$order->get_id()}");

    return $next_url;
}, 10, 2);

/**
 * Modify checkout redirect URL for failed payments
 *
 * If payment fails, redirect back to Next.js checkout with error
 */
add_filter('woocommerce_get_checkout_payment_url', function($pay_url, $order) {
    // Only modify if order is pending/failed (needs payment)
    if (!$order->needs_payment()) {
        return $pay_url;
    }

    $frontend_url = chs_get_headless_checkout_url();

    // Build Next.js checkout URL with order for retry
    $checkout_url = add_query_arg([
        'order_id' => $order->get_id(),
        'order_key' => $order->get_order_key(),
        'pay_for_order' => 'true',
    ], "{$frontend_url}/checkout");

    return $checkout_url;
}, 10, 2);

/**
 * Handle payment cancellation - redirect to Next.js checkout with error
 */
add_action('woocommerce_cancelled_order', function($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) {
        return;
    }

    $frontend_url = chs_get_headless_checkout_url();

    // Redirect to Next.js checkout with cancel message
    $checkout_url = add_query_arg([
        'order_id' => $order_id,
        'payment_error' => urlencode('Payment was cancelled. Please try again.'),
    ], "{$frontend_url}/checkout");

    wp_safe_redirect($checkout_url);
    exit;
});

/**
 * Handle failed payment - redirect to Next.js checkout with error
 */
add_action('woocommerce_order_status_failed', function($order_id) {
    // Only redirect if this is a direct payment failure (not from admin)
    if (is_admin() && !wp_doing_ajax()) {
        return;
    }

    $order = wc_get_order($order_id);
    if (!$order) {
        return;
    }

    $frontend_url = chs_get_headless_checkout_url();

    // Redirect to Next.js checkout with failure message
    $checkout_url = add_query_arg([
        'order_id' => $order_id,
        'payment_error' => urlencode('Payment failed. Please check your payment details and try again.'),
    ], "{$frontend_url}/checkout");

    wp_safe_redirect($checkout_url);
    exit;
});
