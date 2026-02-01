<?php
/**
 * Plugin Name: WooCommerce Session for All Users
 * Description: Ensures WooCommerce treats all logged-in WordPress users as valid customers, regardless of role.
 * Version: 1.1.0
 *
 * Problem: WooCommerce does not automatically initialize sessions for non-customer roles
 * (e.g., franchisee, staff, lead). This causes checkout to prompt "create an account"
 * even when the user is logged in.
 *
 * Solution: Initialize WooCommerce session infrastructure for ANY logged-in WordPress user,
 * and ensure Gravity Forms-registered users are logged in immediately after registration.
 *
 * Also includes headless/CORS configuration for Next.js frontend.
 */

if (!defined('ABSPATH')) {
    exit;
}


/**
 * =============================================================================
 * HEADLESS / CORS CONFIGURATION
 * Required for Next.js frontend to communicate with WooCommerce APIs
 * =============================================================================
 */

/**
 * Cookie settings for cross-origin requests
 */
add_filter('woocommerce_cookie_secure', '__return_true');
add_filter('woocommerce_session_use_secure_cookie', '__return_true');
add_filter('woocommerce_cookie_httponly', '__return_true');

add_filter('woocommerce_cookie_samesite', function () {
    return 'None';
});

/**
 * CORS headers for REST API requests
 */
add_action('rest_api_init', function () {
    // Get the frontend URL from centralized helper
    $frontend_url = function_exists('chirostretch_get_frontend_url')
        ? chirostretch_get_frontend_url()
        : (getenv('NEXT_PUBLIC_FRONTEND_URL') ?: 'https://localhost:3000');

    header("Access-Control-Allow-Origin: {$frontend_url}");
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Authorization, Content-Type, X-WP-Nonce, X-WC-Store-API-Nonce");
    header("Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE");
}, 15);

/**
 * Store API configuration for headless usage
 */
add_filter('woocommerce_store_api_disable_nonce_check', '__return_true');
add_filter('woocommerce_store_api_require_nonce', '__return_false');

/**
 * Force WooCommerce session initialization for Store API requests
 *
 * The Store API doesn't automatically create sessions for guest users.
 * This ensures a session is initialized before any Store API request is processed.
 */
add_action('woocommerce_store_api_before_callbacks', function () {
    if (!WC()->session) {
        WC()->initialize_session();
    }

    // Ensure session cookie is set
    if (WC()->session && !WC()->session->get_customer_id()) {
        WC()->session->set_customer_session_cookie(true);
    }
}, 1);

/**
 * Force session cookies to be sent in Store API responses
 *
 * Even if WooCommerce initializes the session, it may not send the cookie
 * header in REST API responses. This hook ensures cookies are always sent
 * using WooCommerce's own session cookie method.
 */
add_filter('rest_post_dispatch', function ($response, $server, $request) {
    // Only apply to Store API endpoints
    if (strpos($request->get_route(), '/wc/store') === false) {
        return $response;
    }

    if (!WC()->session) {
        return $response;
    }

    // Use WooCommerce's own method to set the session cookie
    if (WC()->session->get_customer_id()) {
        WC()->session->set_customer_session_cookie(true);
    }

    return $response;
}, 10, 3);

add_filter('woocommerce_store_api_cors_allowed_origins', function ($origins) {
    // Allow Next.js frontend origin
    $frontend_url = function_exists('chirostretch_get_frontend_url')
        ? chirostretch_get_frontend_url()
        : (getenv('NEXT_PUBLIC_FRONTEND_URL') ?: 'https://localhost:3000');

    if (!in_array($frontend_url, $origins, true)) {
        $origins[] = $frontend_url;
    }

    // Also allow current origin for dynamic requests
    $origin = get_http_origin();
    if ($origin && !in_array($origin, $origins, true)) {
        $origins[] = $origin;
    }

    return $origins;
});


/**
 * =============================================================================
 * SESSION HANDLING FOR NON-CUSTOMER ROLES
 * =============================================================================
 */

/**
 * Step 1: Auto-login users created via Gravity Forms User Registration
 *
 * When Gravity Forms creates a user, they are not automatically logged in.
 * WooCommerce will not initialize a session for an unauthenticated user.
 * This hook runs AFTER the user is created and logs them in immediately.
 *
 * Priority 20 ensures this runs after the franchise-application-cpt.php hook (priority 10).
 */
add_action('gform_user_registered', function ($user_id, $feed, $entry, $user_pass) {
    // Don't override if someone else already logged in
    if (is_user_logged_in() && get_current_user_id() !== $user_id) {
        return;
    }

    // Set the user as current
    wp_set_current_user($user_id);

    // Create persistent auth cookie
    wp_set_auth_cookie($user_id, true);

    // Initialize WooCommerce session immediately if available
    if (function_exists('WC') && WC()->session) {
        WC()->session->init_session_cookie();
        WC()->session->set_customer_session_cookie(true);
    }
}, 20, 4);


/**
 * Step 2: Force WooCommerce session initialization for ALL users (logged-in and guests)
 *
 * WooCommerce only auto-initializes sessions for users with the 'customer' role.
 * This ensures ANY user (guest or logged-in) gets a valid WooCommerce session.
 *
 * Runs on 'wp_loaded' which is after 'init' but before any template rendering.
 * This timing ensures WooCommerce is fully loaded.
 */
add_action('wp_loaded', function () {
    // Skip admin context
    if (is_admin()) {
        return;
    }

    // Skip if WooCommerce is not active
    if (!function_exists('WC')) {
        return;
    }

    // Ensure WooCommerce session exists for ALL users (guests and logged-in)
    if (!WC()->session) {
        WC()->initialize_session();
    }

    // For logged-in users, associate session with user
    if (is_user_logged_in()) {
        $user_id = get_current_user_id();

        // Associate session with user
        if (WC()->session) {
            // Set the customer ID on the session (critical for non-guest treatment)
            $session_customer_id = WC()->session->get_customer_id();

            // If session has an anonymous/guest customer ID, associate with logged-in user
            if (!$session_customer_id || $session_customer_id !== $user_id) {
                // This handles cart merging: anonymous cart -> user logs in -> cart merges
                WC()->session->set_customer_session_cookie(true);
            }
        }

        // Ensure customer object is initialized and linked to user
        if (!WC()->customer) {
            WC()->customer = new WC_Customer($user_id, true);
        } elseif (WC()->customer->get_id() !== $user_id) {
            // Customer object exists but is for wrong user - reinitialize
            WC()->customer = new WC_Customer($user_id, true);
        }
    }

    // Ensure cart is initialized for ALL users
    if (!WC()->cart) {
        WC()->cart = new WC_Cart();
    }
}, 10);


/**
 * Step 3: Ensure logged-in users are never treated as guests at checkout
 *
 * WooCommerce may flag users as guests if the session originated anonymously.
 * This filter ensures is_customer_logged_in() returns true for logged-in WordPress users.
 */
add_filter('woocommerce_checkout_customer_id', function ($customer_id) {
    if (is_user_logged_in()) {
        return get_current_user_id();
    }
    return $customer_id;
});


/**
 * Step 4: Force customer session cookie when user is logged in
 *
 * The session cookie normally uses an anonymous hash. For logged-in users,
 * we ensure the session is properly associated with their user ID.
 */
add_action('woocommerce_set_cart_cookies', function () {
    if (!is_user_logged_in()) {
        return;
    }

    if (WC()->session) {
        WC()->session->set_customer_session_cookie(true);
    }
}, 20);


/**
 * Step 5: Prevent "is_registration_required" from forcing account creation
 *
 * Even with all session fixes, WooCommerce checkout may still show the
 * registration form if certain conditions aren't met. This ensures
 * logged-in users are never asked to create an account.
 */
add_filter('woocommerce_checkout_registration_required', function ($required) {
    if (is_user_logged_in()) {
        return false;
    }
    return $required;
});

add_filter('woocommerce_checkout_registration_enabled', function ($enabled) {
    // Keep registration enabled for guests, but logged-in users don't see it
    return $enabled;
});


/**
 * Step 6: Associate order with user even if session was wonky
 *
 * Final safety net: when an order is created, ensure it's associated
 * with the logged-in user regardless of session state.
 */
add_action('woocommerce_checkout_create_order', function ($order, $data) {
    if (is_user_logged_in() && !$order->get_user_id()) {
        $order->set_customer_id(get_current_user_id());
    }
}, 10, 2);
