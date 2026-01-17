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
    // Get the frontend URL from environment or use default
    $frontend_url = getenv('NEXTJS_URL') ?: 'https://localhost:3000';

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
    error_log('[WC Session] Store API before_callbacks hook fired');

    if (!WC()->session) {
        error_log('[WC Session] No session exists, initializing...');
        WC()->initialize_session();
    } else {
        error_log('[WC Session] Session already exists');
    }

    // Ensure session cookie is set
    if (WC()->session && !WC()->session->get_customer_id()) {
        error_log('[WC Session] No customer ID, setting session cookie...');
        WC()->session->set_customer_session_cookie(true);
        $customer_id = WC()->session->get_customer_id();
        error_log("[WC Session] Customer ID after set: {$customer_id}");
    } else if (WC()->session) {
        $customer_id = WC()->session->get_customer_id();
        error_log("[WC Session] Customer ID already set: {$customer_id}");
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

    error_log('[WC Session] rest_post_dispatch hook fired for Store API');

    if (!WC()->session) {
        error_log('[WC Session] No session in rest_post_dispatch');
        return $response;
    }

    // Use WooCommerce's own method to set the session cookie
    // This ensures proper hash calculation and cookie attributes
    if (WC()->session->get_customer_id()) {
        error_log('[WC Session] Setting session cookie via WooCommerce method');
        WC()->session->set_customer_session_cookie(true);

        $customer_id = WC()->session->get_customer_id();
        error_log("[WC Session] Session cookie set for customer: {$customer_id}");
    } else {
        error_log('[WC Session] No customer ID to set in cookie');
    }

    return $response;
}, 10, 3);

add_filter('woocommerce_store_api_cors_allowed_origins', function ($origins) {
    // Allow Next.js frontend origin
    $frontend_url = getenv('NEXTJS_URL') ?: 'https://localhost:3000';

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

    error_log("[WC Session] Auto-logged in user $user_id after Gravity Forms registration");
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
    error_log('[WC Session] wp_loaded hook fired');

    // Skip admin context
    if (is_admin()) {
        error_log('[WC Session] Skipping - is_admin()');
        return;
    }

    // Skip if WooCommerce is not active
    if (!function_exists('WC')) {
        error_log('[WC Session] Skipping - WC not available');
        return;
    }

    error_log('[WC Session] Initializing session for front-end request');

    // Ensure WooCommerce session exists for ALL users (guests and logged-in)
    if (!WC()->session) {
        error_log('[WC Session] No session, calling initialize_session()');
        WC()->initialize_session();
    } else {
        $customer_id = WC()->session->get_customer_id();
        error_log("[WC Session] Session already exists: {$customer_id}");
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


/**
 * Debug: Log session state on WooCommerce init (only in WP_DEBUG mode)
 */
add_action('woocommerce_init', function () {
    if (!defined('WP_DEBUG') || !WP_DEBUG) {
        return;
    }

    if (!is_user_logged_in()) {
        return;
    }

    $user_id = get_current_user_id();
    $user = get_userdata($user_id);
    $roles = $user ? implode(', ', $user->roles) : 'unknown';

    $session_exists = WC()->session ? 'yes' : 'no';
    $session_customer_id = WC()->session ? WC()->session->get_customer_id() : 'n/a';
    $customer_exists = WC()->customer ? 'yes' : 'no';
    $customer_id = WC()->customer ? WC()->customer->get_id() : 'n/a';

    error_log(sprintf(
        '[WC Session Debug] user_id=%d, roles=%s, session=%s, session_customer=%s, customer=%s, customer_id=%s',
        $user_id,
        $roles,
        $session_exists,
        $session_customer_id,
        $customer_exists,
        $customer_id
    ));
});
