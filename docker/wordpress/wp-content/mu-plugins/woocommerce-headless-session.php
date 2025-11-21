<?php

/**
 * Plugin Name: WooCommerce Headless Session Fix
 * Description: Ensures WooCommerce sessions initialize correctly in a same-domain headless setup.
 * Author: ChiroStretch Dev
 */

if (! defined('ABSPATH')) {
  exit;
}

/**
 * Always start the WooCommerce session on REST/store API requests.
 */
add_action('init', function () {
  if (! class_exists('WooCommerce')) {
    return;
  }

  if (! WC()->session) {
    WC()->initialize_session();
  }

  // Ensure the session cookie is written if headers aren't sent
  if (WC()->session && ! headers_sent()) {
    WC()->session->set_customer_session_cookie(true);
  }
}, 20);

/**
 * Ensure WC session cookie settings are compatible with same-domain usage.
 */
add_filter('woocommerce_cookie_secure', function () {
  // Use secure cookies only if the site is actually loaded over HTTPS
  return is_ssl();
});

add_filter('woocommerce_session_use_secure_cookie', function () {
  return is_ssl();
});

/**
 * Explicitly declare SameSite=None only when HTTPS is active.
 * Browsers block SameSite=None without SSL.
 */
add_filter('woocommerce_cookie_samesite', function () {
  return is_ssl() ? 'None' : 'Lax';
});
