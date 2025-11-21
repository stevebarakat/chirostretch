<?php

/**
 * Plugin Name: WooCommerce Store API Nonce Relax (Local Dev)
 * Description: Disable WooCommerce Store API nonce checks for same-domain local development.
 */

if (! defined('ABSPATH')) {
  exit;
}

// Disable nonce requirement for Store API (local dev only!)
add_filter('woocommerce_store_api_disable_nonce_check', '__return_true');
add_filter('woocommerce_store_api_require_nonce', '__return_false');
