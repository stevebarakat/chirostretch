<?php
/**
 * WordPress Configuration Reference for ChiroStretch Headless Setup
 *
 * This file documents the required wp-config.php constants for the headless
 * WordPress + Next.js architecture. Copy these to your actual wp-config.php
 * and replace placeholder values with real secrets.
 *
 * IMPORTANT: Never commit real secrets to version control.
 */

// ──────────────────────────────────────────────────────────────────────────────
// DATABASE SETTINGS (Local by Flywheel provides these)
// ──────────────────────────────────────────────────────────────────────────────

define('DB_NAME', 'local');
define('DB_USER', 'root');
define('DB_PASSWORD', 'root');
define('DB_HOST', 'localhost'); // Local provides socket path
define('DB_CHARSET', 'utf8');
define('DB_COLLATE', '');

$table_prefix = 'wp_';

// ──────────────────────────────────────────────────────────────────────────────
// AUTH KEYS & SALTS
// Generate at: https://api.wordpress.org/secret-key/1.1/salt/
// ──────────────────────────────────────────────────────────────────────────────

define('AUTH_KEY',         'generate-unique-key');
define('SECURE_AUTH_KEY',  'generate-unique-key');
define('LOGGED_IN_KEY',    'generate-unique-key');
define('NONCE_KEY',        'generate-unique-key');
define('AUTH_SALT',        'generate-unique-key');
define('SECURE_AUTH_SALT', 'generate-unique-key');
define('LOGGED_IN_SALT',   'generate-unique-key');
define('NONCE_SALT',       'generate-unique-key');
define('WP_CACHE_KEY_SALT','generate-unique-key');

// ──────────────────────────────────────────────────────────────────────────────
// DEBUG SETTINGS
// ──────────────────────────────────────────────────────────────────────────────

define('WP_DEBUG', true);           // Enable in development
define('WP_DEBUG_LOG', true);       // Log to wp-content/debug.log
define('WP_DEBUG_DISPLAY', false);  // Don't show errors on frontend
define('WP_ENVIRONMENT_TYPE', 'local'); // 'local', 'development', 'staging', 'production'

// ──────────────────────────────────────────────────────────────────────────────
// HEADLESS / API SETTINGS
// ──────────────────────────────────────────────────────────────────────────────

/**
 * Webhook secret for Next.js Algolia sync
 * Generate with: openssl rand -base64 32
 * Must match WP_WEBHOOK_SECRET in Next.js .env.local
 */
define('WP_WEBHOOK_SECRET', 'generate-with-openssl-rand-base64-32');

// ──────────────────────────────────────────────────────────────────────────────
// BOOTSTRAP
// ──────────────────────────────────────────────────────────────────────────────

if (!defined('ABSPATH')) {
  define('ABSPATH', __DIR__ . '/');
}

require_once ABSPATH . 'wp-settings.php';
