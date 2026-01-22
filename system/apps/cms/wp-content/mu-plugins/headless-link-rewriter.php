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
 * NOTE:
 * This mu-plugin is about URL normalization (A): ensuring API-delivered HTML/strings don’t leak the WP backend domain.
 * It is NOT an HTTP redirect system.
 */

/**
 * Return true only when serving content via WPGraphQL or REST.
 */
function chirostretch_headless_is_api_request(): bool
{
  $is_graphql_request = function_exists('is_graphql_request') && is_graphql_request();
  $is_rest_request = defined('REST_REQUEST') && REST_REQUEST;

  return $is_graphql_request || $is_rest_request;
}

/**
 * Centralized URL context for rewrites.
 * Cached per request to avoid repeated lookups.
 *
 * @return array{frontend:string,wordpress:string}
 */
function chirostretch_headless_get_url_context(): array
{
  static $ctx = null;

  if (is_array($ctx)) {
    return $ctx;
  }

  // Use the centralized frontend URL getter from headless-password-reset.php
  if (!function_exists('chirostretch_get_frontend_url')) {
    error_log('Headless Link Rewriter: chirostretch_get_frontend_url() not available');
    // Fallback to site_url() to avoid breaking responses.
    $frontend = untrailingslashit(site_url());
  } else {
    $frontend = untrailingslashit(chirostretch_get_frontend_url());
  }

  $ctx = [
    'frontend' => $frontend,
    'wordpress' => untrailingslashit(site_url()),
  ];

  return $ctx;
}

/**
 * Paths that should NOT be rewritten to the headless frontend.
 * Keep WordPress-owned routes (e.g. WooCommerce My Account / Checkout) on WP.
 */
function chirostretch_headless_excluded_path_prefixes(): array
{
  return [
    '/wp-admin',
    '/wp-login.php',
    '/wp-json',
    '/wp-content',
    '/wp-includes',
    '/my-account',
    '/checkout',
    '/cart',
  ];
}

/**
 * Convert a WP-absolute URL to a frontend-relative URL (preferred).
 * Returns null if the URL should not be rewritten.
 */
function chirostretch_headless_to_relative_path(string $url): ?string
{
  $ctx = chirostretch_headless_get_url_context();

  // Only rewrite URLs that start with the WP origin
  if (strpos($url, $ctx['wordpress']) !== 0) {
    return null;
  }

  $pathPlus = substr($url, strlen($ctx['wordpress']));
  if ($pathPlus === '') {
    $pathPlus = '/';
  }

  // Ensure leading slash
  if ($pathPlus[0] !== '/') {
    $pathPlus = '/' . $pathPlus;
  }

  foreach (chirostretch_headless_excluded_path_prefixes() as $prefix) {
    if ($prefix !== '/' && strpos($pathPlus, $prefix) === 0) {
      return null;
    }
  }

  return $pathPlus;
}

/**
 * Rewrite internal <a href="{WP_ORIGIN}/..."> links to relative URLs.
 * Adds data-internal-link="true" only when we actually rewrote the href.
 */
function chirostretch_rewrite_content_links(string $content): string
{
  if (!chirostretch_headless_is_api_request()) {
    return $content;
  }

  if (!is_string($content) || $content === '') {
    return $content;
  }

  // Fast bail-out: nothing to do.
  if (strpos($content, 'href=') === false) {
    return $content;
  }

  $ctx = chirostretch_headless_get_url_context();

  // Prefer WP_HTML_Tag_Processor when available (WP 6.2+), because it is structural.
  if (class_exists('WP_HTML_Tag_Processor')) {
    $p = new WP_HTML_Tag_Processor($content);

    while ($p->next_tag('a')) {
      $href = $p->get_attribute('href');
      if (!is_string($href) || $href === '') {
        continue;
      }

      // Only rewrite absolute internal links pointing at the WP origin.
      $relative = chirostretch_headless_to_relative_path($href);
      if ($relative === null) {
        continue;
      }

      $p->set_attribute('href', $relative);

      // Avoid duplicate attribute.
      if ($p->get_attribute('data-internal-link') === null) {
        $p->set_attribute('data-internal-link', 'true');
      }
    }

    return $p->get_updated_html();
  }

  // Fallback: conservative regex for <a ... href="WP_ORIGIN..."> and <a ... href='WP_ORIGIN...'>.
  // We only rewrite hrefs that begin with the WP origin.
  $wp = preg_quote($ctx['wordpress'], '/');

  $content = preg_replace_callback(
    '/<a\b([^>]*?)\shref=("|\')(' . $wp . ')([^"\'>]*)(\2)([^>]*)>/i',
    function ($m) {
      $beforeAttrs = $m[1];
      $quote = $m[2];
      $wpOrigin = $m[3];
      $rest = $m[4];
      $afterAttrs = $m[6];

      $absolute = $wpOrigin . $rest;
      $relative = chirostretch_headless_to_relative_path($absolute);
      if ($relative === null) {
        return $m[0];
      }

      // Add data-internal-link only if missing.
      $attrs = $beforeAttrs . ' ' . $afterAttrs;
      if (stripos($attrs, 'data-internal-link=') === false) {
        $dataAttr = ' data-internal-link="true"';
      } else {
        $dataAttr = '';
      }

      return '<a' . $beforeAttrs . $dataAttr . ' href=' . $quote . $relative . $quote . $afterAttrs . '>';
    },
    $content
  );

  return is_string($content) ? $content : '';
}
add_filter('the_content', 'chirostretch_rewrite_content_links', 20);

/**
 * Rewrite URLs in excerpt as well
 */
add_filter('the_excerpt', 'chirostretch_rewrite_content_links', 20);

/**
 * Rewrite URLs in selected WPGraphQL string fields.
 * Avoid global string surgery across all fields for performance and correctness.
 */
add_filter('graphql_resolve_field', function ($result, $source, $args, $context, $info) {
  if (!chirostretch_headless_is_api_request()) {
    return $result;
  }

  if (!is_string($result) || $result === '') {
    return $result;
  }

  // Only touch likely-HTML fields.
  $field = isset($info->fieldName) ? (string) $info->fieldName : '';
  $allowed_fields = [
    'content',
    'excerpt',
    'contentRendered',
    'excerptRendered',
  ];

  if (!in_array($field, $allowed_fields, true)) {
    return $result;
  }

  if (strpos($result, 'href=') === false) {
    return $result;
  }

  return chirostretch_rewrite_content_links($result);
}, 10, 5);

/**
 * Rewrite URLs in ACF fields (covers CPTs, posts, pages, options pages)
 * This runs when ACF formats values for output
 */
add_filter('acf/format_value', function ($value, $post_id, $field) {
  // Only process string values that might contain HTML
  if (!is_string($value) || empty($value)) {
    return $value;
  }

  // Only process if value contains links
  if (strpos($value, 'href=') === false) {
    return $value;
  }

  return chirostretch_rewrite_content_links($value);
}, 20, 3);

/**
 * Yoast meta descriptions are typically plain text (not HTML), so we intentionally do not rewrite them here.
 * Keep rewrites focused on HTML-like fields (content/excerpt/ACF WYSIWYG) and explicit sitemap locations.
 */

/**
 * Rewrite URLs in WordPress core sitemap
 */
add_filter('wp_sitemaps_posts_entry', function ($entry, $post) {
  if (!function_exists('chirostretch_get_frontend_url')) {
    return $entry;
  }

  $frontend_url = chirostretch_headless_get_url_context()['frontend'];
  $wordpress_url = chirostretch_headless_get_url_context()['wordpress'];

  // Replace WordPress URL with frontend URL (but keep WP-owned paths on WP)
  $loc = isset($entry['loc']) ? (string) $entry['loc'] : '';
  if ($loc !== '') {
    $relative = chirostretch_headless_to_relative_path($loc);
    if ($relative !== null) {
      $entry['loc'] = $frontend_url . $relative;
    }
  }

  return $entry;
}, 10, 2);

add_filter('wp_sitemaps_taxonomies_entry', function ($entry, $term, $taxonomy) {
  if (!function_exists('chirostretch_get_frontend_url')) {
    return $entry;
  }

  $frontend_url = chirostretch_headless_get_url_context()['frontend'];
  $wordpress_url = chirostretch_headless_get_url_context()['wordpress'];

  $loc = isset($entry['loc']) ? (string) $entry['loc'] : '';
  if ($loc !== '') {
    $relative = chirostretch_headless_to_relative_path($loc);
    if ($relative !== null) {
      $entry['loc'] = $frontend_url . $relative;
    }
  }

  return $entry;
}, 10, 3);

add_filter('wp_sitemaps_users_entry', function ($entry, $user) {
  if (!function_exists('chirostretch_get_frontend_url')) {
    return $entry;
  }

  $frontend_url = chirostretch_headless_get_url_context()['frontend'];
  $wordpress_url = chirostretch_headless_get_url_context()['wordpress'];

  $loc = isset($entry['loc']) ? (string) $entry['loc'] : '';
  if ($loc !== '') {
    $relative = chirostretch_headless_to_relative_path($loc);
    if ($relative !== null) {
      $entry['loc'] = $frontend_url . $relative;
    }
  }

  return $entry;
}, 10, 2);

/**
 * Rewrite Yoast sitemap URLs (if using Yoast sitemap instead of WP core)
 */
add_filter('wpseo_sitemap_entry', function ($url, $type, $post) {
  if (!function_exists('chirostretch_get_frontend_url')) {
    return $url;
  }

  $frontend_url = chirostretch_headless_get_url_context()['frontend'];
  $wordpress_url = chirostretch_headless_get_url_context()['wordpress'];

  // Rewrite the loc URL (but keep WP-owned paths on WP)
  if (isset($url['loc']) && is_string($url['loc']) && $url['loc'] !== '') {
    $relative = chirostretch_headless_to_relative_path($url['loc']);
    if ($relative !== null) {
      $url['loc'] = $frontend_url . $relative;
    }
  }

  return $url;
}, 10, 3);

/**
 * Rewrite robots.txt sitemap URL
 */
add_filter('robots_txt', function ($output, $public) {
  if (!function_exists('chirostretch_get_frontend_url')) {
    return $output;
  }

  // Replace only eligible WordPress URLs with frontend URLs.
  // (Robots output is plain text; we avoid broad replacements that could rewrite WP-owned routes.)
  $ctx = chirostretch_headless_get_url_context();
  $wp = $ctx['wordpress'];

  foreach (chirostretch_headless_excluded_path_prefixes() as $prefix) {
    // If robots contains explicit WP-owned sitemap URLs, leave them alone.
    // We only rewrite non-excluded paths by doing a conservative replacement below.
  }

  // Conservative: rewrite only the exact sitemap index URL if present.
  $output = str_replace($wp . '/wp-sitemap.xml', $ctx['frontend'] . '/wp-sitemap.xml', $output);

  return $output;
}, 10, 2);

/**
 * Rewrite llms.txt URLs (Yoast SEO feature)
 */
add_filter('wpseo_llms_txt_output', function ($output) {
  if (!function_exists('chirostretch_get_frontend_url')) {
    return $output;
  }

  $frontend_url = chirostretch_headless_get_url_context()['frontend'];
  $wordpress_url = chirostretch_headless_get_url_context()['wordpress'];

  // llms.txt is plain text; only rewrite exact occurrences of the WP origin to the frontend origin.
  // (We avoid rewriting WP-owned paths because this is not HTML-aware.)
  $output = str_replace($wordpress_url, $frontend_url, $output);

  return $output;
}, 10);
