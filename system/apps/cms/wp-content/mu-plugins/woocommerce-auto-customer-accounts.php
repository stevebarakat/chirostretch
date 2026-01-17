<?php
/**
 * Plugin Name: WooCommerce Auto Customer Accounts
 * Description: Automatically creates WordPress user accounts for guest customers on first purchase
 * Version: 1.0.0
 *
 * Follows Access & Identity Charter:
 * - Identity creation is event-driven (purchase = explicit event)
 * - Guest checkout allowed, but first-time buyers get accounts
 * - Does not create speculative accounts
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Create customer account when payment is completed
 *
 * Hook: woocommerce_payment_complete
 * Priority: 20 (after WooCommerce core processing)
 *
 * @param int $order_id Order ID
 */
add_action('woocommerce_payment_complete', 'chirostretch_create_customer_account_on_purchase', 20, 1);

function chirostretch_create_customer_account_on_purchase($order_id) {
    // Get order object
    $order = wc_get_order($order_id);
    if (!$order) {
        error_log("[Auto Customer] Invalid order ID: {$order_id}");
        return;
    }

    // Skip if order already has a user linked
    $existing_customer_id = $order->get_customer_id();
    if ($existing_customer_id && $existing_customer_id > 0) {
        error_log("[Auto Customer] Order {$order_id} already has customer_id: {$existing_customer_id}");
        return;
    }

    // Get billing email
    $email = $order->get_billing_email();
    if (!$email || !is_email($email)) {
        error_log("[Auto Customer] Order {$order_id} has invalid email: {$email}");
        return;
    }

    // Check if user with this email already exists
    $existing_user = get_user_by('email', $email);
    if ($existing_user) {
        // User exists - link order to existing user
        $order->set_customer_id($existing_user->ID);
        $order->save();

        error_log("[Auto Customer] Linked order {$order_id} to existing user {$existing_user->ID}");
        return;
    }

    // Create new user account
    $first_name = $order->get_billing_first_name();
    $last_name = $order->get_billing_last_name();

    // Generate unique username from email
    $username = chirostretch_generate_customer_username($email, $first_name, $last_name);

    // Generate secure password
    $password = wp_generate_password(24, true, true);

    // Create WordPress user
    $user_id = wp_insert_user([
        'user_login'   => $username,
        'user_email'   => $email,
        'user_pass'    => $password,
        'first_name'   => $first_name,
        'last_name'    => $last_name,
        'display_name' => trim("{$first_name} {$last_name}") ?: $email,
        'role'         => 'customer',
    ]);

    // Handle errors
    if (is_wp_error($user_id)) {
        error_log("[Auto Customer] Failed to create user for order {$order_id}: " . $user_id->get_error_message());
        return;
    }

    // Link order to new user
    $order->set_customer_id($user_id);
    $order->save();

    // Send welcome email with password reset link
    chirostretch_send_customer_welcome_email($user_id, $order);

    error_log("[Auto Customer] Created user {$user_id} ({$email}) for order {$order_id}");
}

/**
 * Generate unique username for customer
 *
 * Pattern: email prefix, or firstname.lastname, with numeric suffix for uniqueness
 * Examples: john.smith, john.smith2, john.doe3
 *
 * @param string $email Customer email
 * @param string $first_name Customer first name
 * @param string $last_name Customer last name
 * @return string Unique username
 */
function chirostretch_generate_customer_username($email, $first_name = '', $last_name = '') {
    // Try firstname.lastname first
    if ($first_name && $last_name) {
        $base_username = sanitize_user(
            strtolower($first_name . '.' . $last_name),
            true
        );
    } else {
        // Fall back to email prefix
        $email_parts = explode('@', $email);
        $base_username = sanitize_user($email_parts[0], true);
    }

    // Ensure uniqueness (reuse existing helper if available)
    if (function_exists('chirostretch_ensure_unique_username')) {
        return chirostretch_ensure_unique_username($base_username);
    }

    return chirostretch_ensure_unique_username_customer($base_username);
}

/**
 * Ensure username is unique by appending counter if needed
 *
 * Local implementation in case global helper doesn't exist
 *
 * @param string $username Base username
 * @return string Unique username
 */
function chirostretch_ensure_unique_username_customer($username) {
    $base_username = $username ?: 'customer';
    $username = $base_username;
    $counter = 2;

    while (username_exists($username)) {
        $username = $base_username . $counter;
        $counter++;
    }

    return $username;
}

/**
 * Send welcome email to new customer with password reset link
 *
 * Custom email instead of default wp_send_new_user_notifications
 * to provide better customer experience
 *
 * @param int $user_id WordPress user ID
 * @param WC_Order $order WooCommerce order object
 */
function chirostretch_send_customer_welcome_email($user_id, $order) {
    $user = get_userdata($user_id);
    if (!$user) {
        return;
    }

    // Generate password reset key
    $reset_key = get_password_reset_key($user);
    if (is_wp_error($reset_key)) {
        error_log("[Auto Customer] Failed to generate reset key for user {$user_id}: " . $reset_key->get_error_message());
        // Fall back to standard notification
        wp_send_new_user_notifications($user_id, 'user');
        return;
    }

    // Build password reset URL (headless-aware)
    $frontend_url = chirostretch_get_customer_frontend_url();
    $reset_url = "{$frontend_url}/account/set-password?key={$reset_key}&login=" . rawurlencode($user->user_login);

    // Email subject
    $site_name = wp_specialchars_decode(get_bloginfo('name'), ENT_QUOTES);
    $subject = sprintf('[%s] Your account has been created', $site_name);

    // Email body
    $message = sprintf(
        "Hi %s,\n\n" .
        "Thank you for your recent purchase! We've created an account for you.\n\n" .
        "Your username is: %s\n\n" .
        "To set your password and access your account, please click the link below:\n" .
        "%s\n\n" .
        "This link will expire in 24 hours.\n\n" .
        "With your account, you can:\n" .
        "- View your order history\n" .
        "- Track shipments\n" .
        "- Manage your billing and shipping addresses\n" .
        "- Reorder previous purchases easily\n\n" .
        "If you have any questions, please contact us.\n\n" .
        "Thanks,\n%s",
        $user->first_name ?: 'Customer',
        $user->user_login,
        $reset_url,
        $site_name
    );

    // Send email
    $sent = wp_mail(
        $user->user_email,
        $subject,
        $message,
        ['Content-Type: text/plain; charset=UTF-8']
    );

    if ($sent) {
        error_log("[Auto Customer] Sent welcome email to user {$user_id} ({$user->user_email})");
    } else {
        error_log("[Auto Customer] Failed to send welcome email to user {$user_id}");
    }
}

/**
 * Helper to get frontend URL for headless setup
 * Reuses existing pattern from other plugins
 *
 * @return string Frontend URL
 */
function chirostretch_get_customer_frontend_url() {
    // Check for existing helper
    if (function_exists('chs_get_headless_checkout_url')) {
        return chs_get_headless_checkout_url();
    }

    if (function_exists('chirostretch_get_frontend_url')) {
        return chirostretch_get_frontend_url();
    }

    // Fallback to environment
    $url = getenv('NEXTJS_URL') ?: 'https://localhost:3000';
    return rtrim($url, '/');
}
