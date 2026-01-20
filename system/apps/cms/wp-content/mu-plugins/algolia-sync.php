<?php
/**
 * Plugin Name: Algolia Sync
 * Description: Sends webhooks to Next.js for Algolia indexing on content save/delete
 * Version: 2.0.0
 *
 * Syncs: locations, articles (posts), events, products
 * Delegates all Algolia indexing to Next.js API routes
 *
 * Required constants in wp-config.php:
 *   WP_NEXT_API_URL   - Base URL for Next.js (e.g., http://localhost:3000)
 *   WP_WEBHOOK_SECRET - Shared secret for webhook authentication
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Check if webhook is configured
 */
function chs_webhook_is_configured() {
    $base_url = defined('WP_NEXT_API_URL') ? WP_NEXT_API_URL : '';
    $secret = defined('WP_WEBHOOK_SECRET') ? WP_WEBHOOK_SECRET : '';
    return !empty($base_url) && !empty($secret);
}

/**
 * Send webhook to Next.js API
 */
function chs_send_webhook($endpoint, $post_id, $action = 'save') {
    $base_url = defined('WP_NEXT_API_URL') ? WP_NEXT_API_URL : '';
    $secret = defined('WP_WEBHOOK_SECRET') ? WP_WEBHOOK_SECRET : '';

    if (!$base_url || !$secret) {
        error_log('[Algolia Sync] Not configured - missing WP_NEXT_API_URL or WP_WEBHOOK_SECRET');
        return false;
    }

    $url = rtrim($base_url, '/') . $endpoint;

    $response = wp_remote_post($url, [
        'headers' => [
            'Content-Type' => 'application/json',
            'X-Webhook-Secret' => $secret,
        ],
        'body' => json_encode(['post_id' => $post_id, 'action' => $action]),
        'timeout' => 10,
        'sslverify' => false,
        'httpversion' => '1.1',
    ]);

    if (is_wp_error($response)) {
        error_log("[Algolia Sync] Webhook failed: " . $response->get_error_message());
        return false;
    }

    $status = wp_remote_retrieve_response_code($response);
    if ($status >= 400) {
        $body = wp_remote_retrieve_body($response);
        error_log("[Algolia Sync] Webhook error ({$status}): {$body}");
        return false;
    }

    error_log("[Algolia Sync] Webhook sent: {$endpoint} post_id={$post_id} action={$action}");
    return true;
}

// =============================================================================
// LOCATION SYNC
// =============================================================================

add_action('save_post_location', function($post_id, $post, $update) {
    $action = $post->post_status === 'publish' ? 'save' : 'delete';
    chs_send_webhook('/api/algolia/index-locations', $post_id, $action);
}, 20, 3);

add_action('trash_post', function($post_id) {
    $post = get_post($post_id);
    if ($post && $post->post_type === 'location') {
        chs_send_webhook('/api/algolia/index-locations', $post_id, 'delete');
    }
});

// =============================================================================
// ARTICLE (POST) SYNC
// =============================================================================

add_action('save_post_post', function($post_id, $post, $update) {
    $action = $post->post_status === 'publish' ? 'save' : 'delete';
    chs_send_webhook('/api/algolia/index-articles', $post_id, $action);
}, 20, 3);

add_action('trash_post', function($post_id) {
    $post = get_post($post_id);
    if ($post && $post->post_type === 'post') {
        chs_send_webhook('/api/algolia/index-articles', $post_id, 'delete');
    }
});

// =============================================================================
// EVENT SYNC
// =============================================================================

add_action('save_post_tribe_events', function($post_id, $post, $update) {
    $action = $post->post_status === 'publish' ? 'save' : 'delete';
    chs_send_webhook('/api/algolia/index-events', $post_id, $action);
}, 20, 3);

add_action('trash_post', function($post_id) {
    $post = get_post($post_id);
    if ($post && $post->post_type === 'tribe_events') {
        chs_send_webhook('/api/algolia/index-events', $post_id, 'delete');
    }
});

// =============================================================================
// PRODUCT SYNC (WooCommerce)
// =============================================================================

add_action('woocommerce_update_product', function($product_id) {
    $product = wc_get_product($product_id);
    $action = ($product && $product->get_status() === 'publish') ? 'save' : 'delete';
    chs_send_webhook('/api/algolia/index-products', $product_id, $action);
}, 20, 1);

add_action('woocommerce_new_product', function($product_id) {
    $product = wc_get_product($product_id);
    if ($product && $product->get_status() === 'publish') {
        chs_send_webhook('/api/algolia/index-products', $product_id, 'save');
    }
}, 20, 1);

add_action('before_delete_post', function($post_id) {
    $post = get_post($post_id);
    if ($post && $post->post_type === 'product') {
        chs_send_webhook('/api/algolia/index-products', $post_id, 'delete');
    }
});

// =============================================================================
// ADMIN NOTICE
// =============================================================================

add_action('admin_notices', function() {
    if (!chs_webhook_is_configured()) {
        $screen = get_current_screen();
        if ($screen && in_array($screen->post_type, ['location', 'post', 'tribe_events', 'product'])) {
            echo '<div class="notice notice-warning"><p>';
            echo '<strong>Algolia Sync:</strong> Not configured. Add <code>WP_NEXT_API_URL</code> and <code>WP_WEBHOOK_SECRET</code> to wp-config.php to enable automatic search indexing.';
            echo '</p></div>';
        }
    }
});
