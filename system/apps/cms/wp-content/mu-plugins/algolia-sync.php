<?php
/**
 * Plugin Name: Algolia Sync
 * Description: Automatically syncs content to Algolia indices on save/delete
 * Version: 1.0.0
 *
 * Syncs: locations, articles (posts), events, products
 * Uses Algolia REST API directly (no PHP SDK required)
 *
 * Required constants in wp-config.php:
 *   ALGOLIA_APP_ID
 *   ALGOLIA_ADMIN_API_KEY
 *   ALGOLIA_INDEX_PREFIX (optional, defaults to '')
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get Algolia configuration
 */
function chs_algolia_get_config() {
    return [
        'app_id' => defined('ALGOLIA_APP_ID') ? ALGOLIA_APP_ID : '',
        'admin_key' => defined('ALGOLIA_ADMIN_API_KEY') ? ALGOLIA_ADMIN_API_KEY : '',
        'prefix' => defined('ALGOLIA_INDEX_PREFIX') ? ALGOLIA_INDEX_PREFIX : '',
    ];
}

/**
 * Check if Algolia is configured
 */
function chs_algolia_is_configured() {
    $config = chs_algolia_get_config();
    return !empty($config['app_id']) && !empty($config['admin_key']);
}

/**
 * Make Algolia API request
 */
function chs_algolia_request($index, $method, $endpoint = '', $body = null) {
    $config = chs_algolia_get_config();

    if (!chs_algolia_is_configured()) {
        error_log('[Algolia Sync] Not configured - missing ALGOLIA_APP_ID or ALGOLIA_ADMIN_API_KEY');
        return false;
    }

    $index_name = $config['prefix'] . $index;
    $url = "https://{$config['app_id']}-dsn.algolia.net/1/indexes/{$index_name}";

    if ($endpoint) {
        $url .= "/{$endpoint}";
    }

    $args = [
        'method' => $method,
        'headers' => [
            'X-Algolia-API-Key' => $config['admin_key'],
            'X-Algolia-Application-Id' => $config['app_id'],
            'Content-Type' => 'application/json',
        ],
        'timeout' => 30,
    ];

    if ($body !== null) {
        $args['body'] = json_encode($body);
    }

    $response = wp_remote_request($url, $args);

    if (is_wp_error($response)) {
        error_log("[Algolia Sync] Request failed: " . $response->get_error_message());
        return false;
    }

    $status = wp_remote_retrieve_response_code($response);
    if ($status >= 400) {
        $body = wp_remote_retrieve_body($response);
        error_log("[Algolia Sync] API error ({$status}): {$body}");
        return false;
    }

    return json_decode(wp_remote_retrieve_body($response), true);
}

/**
 * Save record to Algolia
 */
function chs_algolia_save_record($index, $record) {
    if (empty($record['objectID'])) {
        error_log('[Algolia Sync] Record missing objectID');
        return false;
    }

    $result = chs_algolia_request($index, 'PUT', $record['objectID'], $record);

    if ($result) {
        error_log("[Algolia Sync] Saved {$index}/{$record['objectID']}");
    }

    return $result;
}

/**
 * Delete record from Algolia
 */
function chs_algolia_delete_record($index, $objectID) {
    $result = chs_algolia_request($index, 'DELETE', $objectID);

    if ($result) {
        error_log("[Algolia Sync] Deleted {$index}/{$objectID}");
    }

    return $result;
}

// =============================================================================
// LOCATION SYNC
// =============================================================================

/**
 * Transform location post to Algolia record
 */
function chs_algolia_transform_location($post) {
    $location_details = get_field('location_details', $post->ID);

    return [
        'objectID' => "location_{$post->ID}",
        'type' => 'location',
        'databaseId' => $post->ID,
        'title' => $post->post_title,
        'slug' => $post->post_name,
        'permalink' => "/locations/{$post->post_name}",
        'city' => $location_details['city'] ?? '',
        'state' => $location_details['state'] ?? '',
        'streetAddress' => $location_details['address'] ?? '',
        'postalCode' => $location_details['zip'] ?? '',
        'phone' => $location_details['phone'] ?? '',
        'shortDescription' => get_field('short_description', $post->ID) ?: '',
        'coordinates' => [
            'lat' => (float) ($location_details['coordinates']['latitude'] ?? 0),
            'lng' => (float) ($location_details['coordinates']['longitude'] ?? 0),
        ],
        'updatedAt' => get_post_modified_time('c', true, $post->ID),
    ];
}

add_action('save_post_location', function($post_id, $post, $update) {
    if ($post->post_status !== 'publish') {
        chs_algolia_delete_record('locations', "location_{$post_id}");
        return;
    }

    $record = chs_algolia_transform_location($post);
    chs_algolia_save_record('locations', $record);
}, 20, 3);

add_action('trash_post', function($post_id) {
    $post = get_post($post_id);
    if ($post && $post->post_type === 'location') {
        chs_algolia_delete_record('locations', "location_{$post_id}");
    }
});

// =============================================================================
// ARTICLE (POST) SYNC
// =============================================================================

/**
 * Transform article post to Algolia record
 */
function chs_algolia_transform_article($post) {
    $categories = wp_get_post_categories($post->ID, ['fields' => 'names']);
    $featured_image = get_the_post_thumbnail_url($post->ID, 'medium');

    return [
        'objectID' => "article_{$post->ID}",
        'type' => 'article',
        'databaseId' => $post->ID,
        'title' => $post->post_title,
        'slug' => $post->post_name,
        'permalink' => "/articles/{$post->post_name}",
        'excerpt' => get_the_excerpt($post),
        'categories' => $categories,
        'featuredImage' => $featured_image ?: null,
        'author' => get_the_author_meta('display_name', $post->post_author),
        'publishedAt' => get_post_time('c', true, $post->ID),
        'updatedAt' => get_post_modified_time('c', true, $post->ID),
    ];
}

add_action('save_post_post', function($post_id, $post, $update) {
    if ($post->post_status !== 'publish') {
        chs_algolia_delete_record('articles', "article_{$post_id}");
        return;
    }

    $record = chs_algolia_transform_article($post);
    chs_algolia_save_record('articles', $record);
}, 20, 3);

add_action('trash_post', function($post_id) {
    $post = get_post($post_id);
    if ($post && $post->post_type === 'post') {
        chs_algolia_delete_record('articles', "article_{$post_id}");
    }
});

// =============================================================================
// EVENT SYNC
// =============================================================================

/**
 * Transform event post to Algolia record
 */
function chs_algolia_transform_event($post) {
    // Adjust field names based on your event CPT/plugin (e.g., The Events Calendar)
    $start_date = get_post_meta($post->ID, '_EventStartDate', true);
    $end_date = get_post_meta($post->ID, '_EventEndDate', true);
    $venue_id = get_post_meta($post->ID, '_EventVenueID', true);
    $venue = $venue_id ? get_the_title($venue_id) : '';

    $categories = wp_get_object_terms($post->ID, 'tribe_events_cat', ['fields' => 'names']);
    if (is_wp_error($categories)) {
        $categories = [];
    }

    $featured_image = get_the_post_thumbnail_url($post->ID, 'medium');

    return [
        'objectID' => "event_{$post->ID}",
        'type' => 'event',
        'databaseId' => $post->ID,
        'title' => $post->post_title,
        'slug' => $post->post_name,
        'permalink' => "/events/{$post->post_name}",
        'content' => wp_strip_all_tags($post->post_content),
        'excerpt' => get_the_excerpt($post),
        'startDate' => $start_date ?: null,
        'endDate' => $end_date ?: null,
        'venue' => $venue,
        'categories' => $categories,
        'featuredImage' => $featured_image ?: null,
        'updatedAt' => get_post_modified_time('c', true, $post->ID),
    ];
}

add_action('save_post_tribe_events', function($post_id, $post, $update) {
    if ($post->post_status !== 'publish') {
        chs_algolia_delete_record('events', "event_{$post_id}");
        return;
    }

    $record = chs_algolia_transform_event($post);
    chs_algolia_save_record('events', $record);
}, 20, 3);

add_action('trash_post', function($post_id) {
    $post = get_post($post_id);
    if ($post && $post->post_type === 'tribe_events') {
        chs_algolia_delete_record('events', "event_{$post_id}");
    }
});

// =============================================================================
// PRODUCT SYNC (WooCommerce)
// =============================================================================

/**
 * Transform product to Algolia record
 */
function chs_algolia_transform_product($product_id) {
    $product = wc_get_product($product_id);
    if (!$product) {
        return null;
    }

    $categories = wp_get_post_terms($product_id, 'product_cat', ['fields' => 'names']);
    if (is_wp_error($categories)) {
        $categories = [];
    }

    $image_id = $product->get_image_id();
    $image_url = $image_id ? wp_get_attachment_image_url($image_id, 'medium') : null;

    return [
        'objectID' => "product_{$product_id}",
        'type' => 'product',
        'databaseId' => $product_id,
        'name' => $product->get_name(),
        'slug' => $product->get_slug(),
        'permalink' => "/products/{$product->get_slug()}",
        'sku' => $product->get_sku(),
        'price' => (float) $product->get_price(),
        'regularPrice' => (float) $product->get_regular_price(),
        'salePrice' => $product->get_sale_price() ? (float) $product->get_sale_price() : null,
        'onSale' => $product->is_on_sale(),
        'stockStatus' => $product->get_stock_status(),
        'categories' => $categories,
        'shortDescription' => wp_strip_all_tags($product->get_short_description()),
        'excerpt' => wp_strip_all_tags($product->get_short_description()),
        'image' => $image_url,
        'updatedAt' => get_post_modified_time('c', true, $product_id),
    ];
}

add_action('woocommerce_update_product', function($product_id) {
    $product = wc_get_product($product_id);

    if (!$product || $product->get_status() !== 'publish') {
        chs_algolia_delete_record('products', "product_{$product_id}");
        return;
    }

    $record = chs_algolia_transform_product($product_id);
    if ($record) {
        chs_algolia_save_record('products', $record);
    }
}, 20, 1);

add_action('woocommerce_new_product', function($product_id) {
    $product = wc_get_product($product_id);

    if (!$product || $product->get_status() !== 'publish') {
        return;
    }

    $record = chs_algolia_transform_product($product_id);
    if ($record) {
        chs_algolia_save_record('products', $record);
    }
}, 20, 1);

add_action('before_delete_post', function($post_id) {
    $post = get_post($post_id);
    if ($post && $post->post_type === 'product') {
        chs_algolia_delete_record('products', "product_{$post_id}");
    }
});

// =============================================================================
// ADMIN NOTICE
// =============================================================================

add_action('admin_notices', function() {
    if (!chs_algolia_is_configured()) {
        $screen = get_current_screen();
        if ($screen && in_array($screen->post_type, ['location', 'post', 'tribe_events', 'product'])) {
            echo '<div class="notice notice-warning"><p>';
            echo '<strong>Algolia Sync:</strong> Not configured. Add <code>ALGOLIA_APP_ID</code> and <code>ALGOLIA_ADMIN_API_KEY</code> to wp-config.php to enable automatic search indexing.';
            echo '</p></div>';
        }
    }
});
