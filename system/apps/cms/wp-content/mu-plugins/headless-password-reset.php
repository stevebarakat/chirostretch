<?php
/**
 * Plugin Name: Headless Password Reset
 * Description: REST API endpoints for headless password reset flow
 * Version: 2.0.0
 */

defined('ABSPATH') || exit;

/**
 * Register REST API endpoints for password reset
 */
add_action('rest_api_init', function() {
    // Generate password reset key (no email sent - handled by Next.js/Resend)
    register_rest_route('chirostretch/v1', '/auth/request-reset', [
        'methods' => 'POST',
        'callback' => 'chirostretch_request_reset',
        'permission_callback' => '__return_true',
        'args' => [
            'email' => [
                'required' => true,
                'type' => 'string',
                'format' => 'email',
            ],
        ],
    ]);

    // Validate reset key
    register_rest_route('chirostretch/v1', '/auth/validate-reset-key', [
        'methods' => 'POST',
        'callback' => 'chirostretch_validate_reset_key',
        'permission_callback' => '__return_true',
        'args' => [
            'key' => [
                'required' => true,
                'type' => 'string',
            ],
            'login' => [
                'required' => true,
                'type' => 'string',
            ],
        ],
    ]);

    // Reset password
    register_rest_route('chirostretch/v1', '/auth/reset-password', [
        'methods' => 'POST',
        'callback' => 'chirostretch_reset_password',
        'permission_callback' => '__return_true',
        'args' => [
            'key' => [
                'required' => true,
                'type' => 'string',
            ],
            'login' => [
                'required' => true,
                'type' => 'string',
            ],
            'password' => [
                'required' => true,
                'type' => 'string',
                'minLength' => 8,
            ],
        ],
    ]);
});

/**
 * Generate password reset key and return it (email sent by Next.js via Resend)
 * Returns user data needed for email, or generic success if user not found (prevents enumeration)
 */
function chirostretch_request_reset(WP_REST_Request $request): WP_REST_Response {
    $email = sanitize_email($request->get_param('email'));

    if (!is_email($email)) {
        // Return generic success to prevent enumeration
        return new WP_REST_Response(['success' => true, 'user' => null], 200);
    }

    // Get user by email
    $user = get_user_by('email', $email);

    if (!$user) {
        // Return generic success to prevent enumeration
        return new WP_REST_Response(['success' => true, 'user' => null], 200);
    }

    // Generate password reset key using WordPress's built-in function
    $key = get_password_reset_key($user);

    if (is_wp_error($key)) {
        // Return generic success to prevent enumeration
        return new WP_REST_Response(['success' => true, 'user' => null], 200);
    }

    // Return key and user info for Next.js to send email via Resend
    return new WP_REST_Response([
        'success' => true,
        'user' => [
            'key' => $key,
            'login' => $user->user_login,
            'email' => $user->user_email,
            'firstName' => $user->first_name ?: null,
        ],
    ], 200);
}

/**
 * Validate password reset key
 */
function chirostretch_validate_reset_key(WP_REST_Request $request): WP_REST_Response|WP_Error {
    $key = $request->get_param('key');
    $login = $request->get_param('login');

    // Get user by login (username or email)
    $user = get_user_by('login', $login);
    if (!$user) {
        $user = get_user_by('email', $login);
    }

    if (!$user) {
        return new WP_Error(
            'invalid_user',
            'Invalid username or email.',
            ['status' => 400]
        );
    }

    // Check the reset key
    $check = check_password_reset_key($key, $user->user_login);

    if (is_wp_error($check)) {
        return new WP_Error(
            'invalid_key',
            'This password reset link is invalid or has expired.',
            ['status' => 400]
        );
    }

    return new WP_REST_Response([
        'valid' => true,
        'user_login' => $user->user_login,
    ], 200);
}

/**
 * Reset user password
 */
function chirostretch_reset_password(WP_REST_Request $request): WP_REST_Response|WP_Error {
    $key = $request->get_param('key');
    $login = $request->get_param('login');
    $password = $request->get_param('password');

    // Validate password strength
    if (strlen($password) < 8) {
        return new WP_Error(
            'weak_password',
            'Password must be at least 8 characters long.',
            ['status' => 400]
        );
    }

    // Get user by login (username or email)
    $user = get_user_by('login', $login);
    if (!$user) {
        $user = get_user_by('email', $login);
    }

    if (!$user) {
        return new WP_Error(
            'invalid_user',
            'Invalid username or email.',
            ['status' => 400]
        );
    }

    // Check the reset key
    $check = check_password_reset_key($key, $user->user_login);

    if (is_wp_error($check)) {
        return new WP_Error(
            'invalid_key',
            'This password reset link is invalid or has expired.',
            ['status' => 400]
        );
    }

    // Reset the password
    reset_password($user, $password);

    // Clear any password reset cookies
    if (isset($_COOKIE['wp-resetpass-' . COOKIEHASH])) {
        setcookie('wp-resetpass-' . COOKIEHASH, '', time() - 3600, '/');
    }

    return new WP_REST_Response([
        'success' => true,
        'message' => 'Password has been reset successfully.',
    ], 200);
}

/**
 * Get the frontend URL from constant, environment, or options
 */
function chirostretch_get_frontend_url(): string {
    // 1. Try constant first (defined in wp-config.php)
    // Supports both naming conventions for flexibility
    if (defined('NEXT_PUBLIC_FRONTEND_URL') && NEXT_PUBLIC_FRONTEND_URL) {
        return rtrim(NEXT_PUBLIC_FRONTEND_URL, '/');
    }
    if (defined('CHIROSTRETCH_FRONTEND_URL') && CHIROSTRETCH_FRONTEND_URL) {
        return rtrim(CHIROSTRETCH_FRONTEND_URL, '/');
    }

    // 2. Try environment variable
    $frontend_url = getenv('NEXT_PUBLIC_FRONTEND_URL');
    if ($frontend_url) {
        return rtrim($frontend_url, '/');
    }

    // 3. Fall back to option
    $frontend_url = get_option('chirostretch_frontend_url', '');
    if ($frontend_url) {
        return rtrim($frontend_url, '/');
    }

    // 4. Default for local development
    return 'https://localhost:3000';
}

/**
 * Filter the lost password URL used in various places (for any remaining WP UI references)
 */
add_filter('lostpassword_url', function($url, $redirect) {
    $frontend_url = chirostretch_get_frontend_url();
    return $frontend_url . '/forgot-password';
}, 10, 2);

/**
 * Filter the login URL (for non-admin contexts)
 */
add_filter('login_url', function($url, $redirect, $force_reauth) {
    // Don't redirect if accessing wp-admin
    if ($redirect && strpos($redirect, '/wp-admin') !== false) {
        return $url;
    }

    // Don't redirect if we're on a wp-login.php page with admin action
    if (isset($_GET['action']) && in_array($_GET['action'], ['logout', 'lostpassword', 'rp', 'resetpass'], true)) {
        return $url;
    }

    $frontend_url = chirostretch_get_frontend_url();
    $login_url = $frontend_url . '/login';

    if ($redirect) {
        $login_url = add_query_arg('redirect', urlencode($redirect), $login_url);
    }

    return $login_url;
}, 10, 3);
