<?php
/**
 * Plugin Name: WooCommerce Account Settings
 * Description: Locks account creation settings for headless checkout
 */

defined('ABSPATH') || exit;

/**
 * Disable "create account during checkout" option
 * The checkbox will appear unchecked and saving won't change it
 */
add_filter('pre_option_woocommerce_enable_signup_and_login_from_checkout', fn() => 'no');
