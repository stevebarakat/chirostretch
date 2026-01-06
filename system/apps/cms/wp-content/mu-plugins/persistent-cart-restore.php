<?php
/**
 * Plugin Name: Persistent Cart for Headless
 * Description: Save cart on logout, restore on login
 */

if (!defined('ABSPATH')) exit;

add_action('rest_api_init', function () {
    register_rest_route('chirostretch/v1', '/cart/restore', [
        'methods' => 'POST',
        'callback' => 'chirostretch_restore_cart',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('chirostretch/v1', '/cart/save', [
        'methods' => 'POST',
        'callback' => 'chirostretch_save_cart',
        'permission_callback' => '__return_true',
    ]);

    register_rest_route('chirostretch/v1', '/cart/clear', [
        'methods' => 'POST',
        'callback' => 'chirostretch_clear_cart',
        'permission_callback' => '__return_true',
    ]);
});

/**
 * Validate JWT and get user ID
 */
function chirostretch_get_user_from_jwt($request) {
    $auth_header = $request->get_header('Authorization');
    if (!$auth_header || !preg_match('/Bearer\s+(.+)$/i', $auth_header, $matches)) {
        return new WP_Error('no_token', 'Authorization required', ['status' => 401]);
    }

    $token = $matches[1];

    // Load JWT library from Headless Login plugin
    if (!class_exists('Firebase\JWT\JWT')) {
        $jwt_path = WP_PLUGIN_DIR . '/wp-graphql-headless-login/vendor/autoload.php';
        if (file_exists($jwt_path)) {
            require_once $jwt_path;
        }
    }

    if (!class_exists('Firebase\JWT\JWT')) {
        return new WP_Error('jwt_missing', 'JWT library not available', ['status' => 500]);
    }

    // Get secret key
    $secret = '';
    if (class_exists('WPGraphQL\Login\Auth\TokenManager')) {
        $secret = \WPGraphQL\Login\Auth\TokenManager::get_secret_key();
    }
    if (empty($secret) && defined('GRAPHQL_LOGIN_JWT_SECRET_KEY')) {
        $secret = GRAPHQL_LOGIN_JWT_SECRET_KEY;
    }

    if (empty($secret)) {
        return new WP_Error('jwt_secret', 'JWT secret not configured', ['status' => 500]);
    }

    try {
        \Firebase\JWT\JWT::$leeway = 60;
        $decoded = \Firebase\JWT\JWT::decode($token, new \Firebase\JWT\Key($secret, 'HS256'));
        return (int) $decoded->data->user->id;
    } catch (\Exception $e) {
        return new WP_Error('invalid_token', $e->getMessage(), ['status' => 401]);
    }
}

/**
 * POST /cart/restore - Load persistent cart into session after login
 */
function chirostretch_restore_cart(WP_REST_Request $request) {
    $user_id = chirostretch_get_user_from_jwt($request);
    if (is_wp_error($user_id)) {
        return $user_id;
    }

    if (!function_exists('WC')) {
        return new WP_Error('wc_missing', 'WooCommerce not active', ['status' => 500]);
    }

    // Set WordPress user context so WooCommerce recognizes the user
    wp_set_current_user($user_id);

    // Initialize WC session and cart
    wc_load_cart();

    // Get persistent cart from user meta
    $blog_id = get_current_blog_id();
    $saved_cart = get_user_meta($user_id, "_woocommerce_persistent_cart_{$blog_id}", true);

    if (empty($saved_cart['cart'])) {
        // No saved cart - just ensure session cookie is set
        if (WC()->session) {
            WC()->session->set_customer_session_cookie(true);
        }
        return rest_ensure_response([
            'success' => true,
            'message' => 'No saved cart',
            'items' => 0,
        ]);
    }

    // Clear current cart and load saved items
    WC()->cart->empty_cart(false);

    $restored = 0;
    foreach ($saved_cart['cart'] as $item) {
        $product_id = $item['product_id'] ?? 0;
        $quantity = $item['quantity'] ?? 1;
        $variation_id = $item['variation_id'] ?? 0;
        $variation = $item['variation'] ?? [];

        if ($product_id && WC()->cart->add_to_cart($product_id, $quantity, $variation_id, $variation)) {
            $restored++;
        }
    }

    // Ensure session is properly saved with the new cart data
    if (WC()->session) {
        WC()->session->set_customer_session_cookie(true);
        // Force save the session to ensure cart items have proper keys
        WC()->session->save_data();
    }

    // Calculate totals to ensure cart is in a consistent state
    WC()->cart->calculate_totals();

    return rest_ensure_response([
        'success' => true,
        'message' => 'Cart restored',
        'items' => $restored,
    ]);
}

/**
 * POST /cart/save - Save current session cart to user meta before logout
 */
function chirostretch_save_cart(WP_REST_Request $request) {
    $user_id = chirostretch_get_user_from_jwt($request);
    if (is_wp_error($user_id)) {
        return $user_id;
    }

    if (!function_exists('WC')) {
        return new WP_Error('wc_missing', 'WooCommerce not active', ['status' => 500]);
    }

    // Set WordPress user context so WooCommerce recognizes the user
    wp_set_current_user($user_id);

    // Initialize WC to load cart from session cookies
    wc_load_cart();

    $cart_contents = WC()->cart ? WC()->cart->get_cart() : [];
    $blog_id = get_current_blog_id();

    if (empty($cart_contents)) {
        delete_user_meta($user_id, "_woocommerce_persistent_cart_{$blog_id}");
        return rest_ensure_response([
            'success' => true,
            'message' => 'Cart empty, cleared saved cart',
            'items' => 0,
        ]);
    }

    // Save cart data - include 'key' field as Store API requires it
    $cart_data = [];
    foreach ($cart_contents as $key => $item) {
        $cart_data[$key] = [
            'key' => $key,
            'product_id' => $item['product_id'],
            'quantity' => $item['quantity'],
            'variation_id' => $item['variation_id'] ?? 0,
            'variation' => $item['variation'] ?? [],
            'line_tax_data' => $item['line_tax_data'] ?? [],
            'line_subtotal' => $item['line_subtotal'] ?? 0,
            'line_subtotal_tax' => $item['line_subtotal_tax'] ?? 0,
            'line_total' => $item['line_total'] ?? 0,
            'line_tax' => $item['line_tax'] ?? 0,
        ];
    }

    update_user_meta($user_id, "_woocommerce_persistent_cart_{$blog_id}", ['cart' => $cart_data]);

    return rest_ensure_response([
        'success' => true,
        'message' => 'Cart saved',
        'items' => count($cart_data),
    ]);
}

/**
 * POST /cart/clear - Clear current session cart and destroy session
 */
function chirostretch_clear_cart(WP_REST_Request $request) {
    if (!function_exists('WC')) {
        return new WP_Error('wc_missing', 'WooCommerce not active', ['status' => 500]);
    }

    // Initialize WC to access session
    wc_load_cart();

    // Empty the cart completely
    if (WC()->cart) {
        WC()->cart->empty_cart(true);
    }

    // Destroy the session
    if (WC()->session) {
        WC()->session->destroy_session();
    }

    return rest_ensure_response([
        'success' => true,
        'message' => 'Cart and session cleared',
    ]);
}
