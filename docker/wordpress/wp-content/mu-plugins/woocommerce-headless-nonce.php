<?php

/**
 * Plugin Name: WooCommerce Headless Nonce Disable
 * Description: Disables nonce checks for the WooCommerce Store API in a same-domain headless setup.
 * Author: ChiroStretch Dev
 */

if (! defined('ABSPATH')) {
  exit;
}

/**
 * Disable WC Store API nonce requirement for same-domain headless frontends.
 */
add_filter('woocommerce_store_api_disable_nonce_check', '__return_true');
