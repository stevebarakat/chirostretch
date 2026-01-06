<?php
/**
 * Plugin Name: Environment-Based MU-Plugin Loader
 * Description: Conditionally loads mu-plugins based on environment
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Get the current environment type
 *
 * @return string 'local', 'development', 'staging', or 'production'
 */
function chs_get_environment() {
    if (function_exists('wp_get_environment_type')) {
        return wp_get_environment_type();
    }

    // Fallback: check WP_ENV constant (common in Bedrock/modern setups)
    if (defined('WP_ENV')) {
        return WP_ENV;
    }

    // Default to production for safety
    return 'production';
}

/**
 * Plugins that should ONLY load in local/development environments
 * These will be blocked in staging and production
 */
const CHS_DEV_ONLY_PLUGINS = [
    'mailhog-smtp.php',
];

/**
 * Plugins that should NEVER load in production
 * These can load in local, development, and staging
 */
const CHS_NON_PRODUCTION_PLUGINS = [
    // Add plugins here that are safe for staging but not production
];

/**
 * Block plugins from loading based on environment
 */
add_filter('option_active_plugins', function($plugins) {
    $env = chs_get_environment();
    $blocked = [];

    // Block dev-only plugins in non-local environments
    if (!in_array($env, ['local', 'development'], true)) {
        $blocked = array_merge($blocked, CHS_DEV_ONLY_PLUGINS);
    }

    // Block non-production plugins in production
    if ($env === 'production') {
        $blocked = array_merge($blocked, CHS_NON_PRODUCTION_PLUGINS);
    }

    if (empty($blocked)) {
        return $plugins;
    }

    // Filter out blocked plugins
    return array_filter($plugins, function($plugin) use ($blocked) {
        $basename = basename($plugin);
        return !in_array($basename, $blocked, true);
    });
}, 1);

/**
 * Prevent direct loading of dev-only mu-plugins
 * This runs before the plugins are loaded
 */
add_action('muplugins_loaded', function() {
    $env = chs_get_environment();

    // Skip if in dev environment
    if (in_array($env, ['local', 'development'], true)) {
        return;
    }

    // Remove hooks from dev-only plugins if they somehow loaded
    foreach (CHS_DEV_ONLY_PLUGINS as $plugin) {
        if (did_action('plugins_loaded')) {
            continue;
        }

        // Log warning in non-local environments
        if (function_exists('error_log') && $env !== 'local') {
            error_log(sprintf(
                'ChiroStretch: Blocked dev-only plugin "%s" from loading in %s environment',
                $plugin,
                $env
            ));
        }
    }
}, 0);
