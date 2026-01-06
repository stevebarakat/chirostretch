<?php
/**
 * Plugin Name: Headless Link Rewriter
 * Description: Rewrites internal WordPress URLs to point to the Next.js frontend in GraphQL/REST responses
 * Author: ChiroStretch Dev
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Rewrite internal WordPress URLs to frontend URLs in post content
 *
 * Only runs during GraphQL or REST API requests to avoid modifying
 * content in wp-admin or other WordPress contexts.
 *
 * @param string $content Post content
 * @return string Modified content with rewritten URLs
 */
function chirostretch_rewrite_content_links(string $content): string {
    $is_graphql_request = function_exists('is_graphql_request') && is_graphql_request();
    $is_rest_request = defined('REST_REQUEST') && REST_REQUEST;

    // Only modify content for API requests (GraphQL or REST)
    if (!$is_graphql_request && !$is_rest_request) {
        return $content;
    }

    // Use the centralized frontend URL getter from headless-password-reset.php
    if (!function_exists('chirostretch_get_frontend_url')) {
        // Fallback if that mu-plugin isn't loaded yet
        error_log('chirostretch_rewrite_content_links: chirostretch_get_frontend_url() not available');
        return $content;
    }

    $frontend_url = chirostretch_get_frontend_url();
    $wordpress_url = untrailingslashit(site_url());

    // Replace WordPress URLs with frontend URLs
    // Add data-internal-link attribute for potential client-side handling
    $content = str_replace(
        'href="' . $wordpress_url,
        'data-internal-link="true" href="' . $frontend_url,
        $content
    );

    return $content;
}
add_filter('the_content', 'chirostretch_rewrite_content_links', 20);

/**
 * Rewrite URLs in excerpt as well
 */
add_filter('the_excerpt', 'chirostretch_rewrite_content_links', 20);

/**
 * Rewrite URLs in ALL WPGraphQL string fields (content, ACF, meta, etc.)
 */
add_filter('graphql_resolve_field', function($result, $source, $args, $context, $info) {
    // Only process string values
    if (!is_string($result)) {
        return $result;
    }

    // Skip if result doesn't contain any links
    if (strpos($result, 'href="') === false) {
        return $result;
    }

    return chirostretch_rewrite_content_links($result);
}, 10, 5);

/**
 * Rewrite URLs in ACF fields (covers CPTs, posts, pages, options pages)
 * This runs when ACF formats values for output
 */
add_filter('acf/format_value', function($value, $post_id, $field) {
    // Only process string values that might contain HTML
    if (!is_string($value) || empty($value)) {
        return $value;
    }

    // Only process if value contains links
    if (strpos($value, 'href="') === false) {
        return $value;
    }

    return chirostretch_rewrite_content_links($value);
}, 20, 3);

/**
 * Rewrite URLs in Yoast SEO meta descriptions and other meta fields
 */
add_filter('wpseo_metadesc', 'chirostretch_rewrite_content_links', 20);
add_filter('wpseo_opengraph_desc', 'chirostretch_rewrite_content_links', 20);
add_filter('wpseo_twitter_description', 'chirostretch_rewrite_content_links', 20);

/**
 * Rewrite URLs in WordPress core sitemap
 */
add_filter('wp_sitemaps_posts_entry', function($entry, $post) {
    if (!function_exists('chirostretch_get_frontend_url')) {
        return $entry;
    }

    $frontend_url = chirostretch_get_frontend_url();
    $wordpress_url = untrailingslashit(site_url());

    // Replace WordPress URL with frontend URL
    $entry['loc'] = str_replace($wordpress_url, $frontend_url, $entry['loc']);

    return $entry;
}, 10, 2);

add_filter('wp_sitemaps_taxonomies_entry', function($entry, $term, $taxonomy) {
    if (!function_exists('chirostretch_get_frontend_url')) {
        return $entry;
    }

    $frontend_url = chirostretch_get_frontend_url();
    $wordpress_url = untrailingslashit(site_url());

    $entry['loc'] = str_replace($wordpress_url, $frontend_url, $entry['loc']);

    return $entry;
}, 10, 3);

add_filter('wp_sitemaps_users_entry', function($entry, $user) {
    if (!function_exists('chirostretch_get_frontend_url')) {
        return $entry;
    }

    $frontend_url = chirostretch_get_frontend_url();
    $wordpress_url = untrailingslashit(site_url());

    $entry['loc'] = str_replace($wordpress_url, $frontend_url, $entry['loc']);

    return $entry;
}, 10, 2);

/**
 * Rewrite Yoast sitemap URLs (if using Yoast sitemap instead of WP core)
 */
add_filter('wpseo_sitemap_entry', function($url, $type, $post) {
    if (!function_exists('chirostretch_get_frontend_url')) {
        return $url;
    }

    $frontend_url = chirostretch_get_frontend_url();
    $wordpress_url = untrailingslashit(site_url());

    // Rewrite the loc URL
    if (isset($url['loc'])) {
        $url['loc'] = str_replace($wordpress_url, $frontend_url, $url['loc']);
    }

    return $url;
}, 10, 3);

/**
 * Rewrite robots.txt sitemap URL
 */
add_filter('robots_txt', function($output, $public) {
    if (!function_exists('chirostretch_get_frontend_url')) {
        return $output;
    }

    $frontend_url = chirostretch_get_frontend_url();
    $wordpress_url = untrailingslashit(site_url());

    // Replace WordPress sitemap URLs with frontend URLs
    $output = str_replace($wordpress_url, $frontend_url, $output);

    return $output;
}, 10, 2);

/**
 * Rewrite llms.txt URLs (Yoast SEO feature)
 */
add_filter('wpseo_llms_txt_output', function($output) {
    if (!function_exists('chirostretch_get_frontend_url')) {
        return $output;
    }

    $frontend_url = chirostretch_get_frontend_url();
    $wordpress_url = untrailingslashit(site_url());

    // Replace all WordPress URLs with frontend URLs
    $output = str_replace($wordpress_url, $frontend_url, $output);

    return $output;
}, 10);
