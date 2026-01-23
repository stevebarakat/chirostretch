<?php
/**
 * Plugin Name: Redirect Options Page
 * Description: Registers the Redirects ACF options page and exposes redirect rules via WPGraphQL.
 *              Enables headless Next.js middleware to enforce server-side redirects.
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Register the Redirects options page
 *
 * This page stores URL redirect rules:
 * - Source path (supports trailing wildcard: /blog/*)
 * - Destination path or URL
 * - HTTP status code (301, 302, 307, 308)
 * - Enabled/disabled toggle
 * - Internal notes
 */
add_action('acf/init', function () {
    if (!function_exists('acf_add_options_page')) {
        return;
    }

    acf_add_options_page([
        'page_title'      => 'Redirects',
        'menu_title'      => 'Redirects',
        'menu_slug'       => 'redirects',
        'capability'      => 'manage_options',
        'position'        => 81,
        'icon_url'        => 'dashicons-randomize',
        'redirect'        => false,
        'update_button'   => 'Save Redirects',
        'updated_message' => 'Redirects updated.',
        'show_in_graphql' => false, // We expose via custom chsRedirects query instead
    ]);
});

/**
 * Expose Redirects to WPGraphQL
 *
 * Query: { chsRedirects { fromPath toPath statusCode enabled } }
 */
add_action('graphql_register_types', function () {
    register_graphql_object_type('ChsRedirectRule', [
        'description' => 'A URL redirect rule for the headless frontend.',
        'fields' => [
            'fromPath' => [
                'type' => 'String',
                'description' => 'Source path (e.g., /old-page or /blog/*)',
            ],
            'toPath' => [
                'type' => 'String',
                'description' => 'Destination path or URL (e.g., /new-page or https://external.com)',
            ],
            'statusCode' => [
                'type' => 'Int',
                'description' => 'HTTP redirect status code (301, 302, 307, 308)',
            ],
            'enabled' => [
                'type' => 'Boolean',
                'description' => 'Whether this redirect rule is active',
            ],
        ],
    ]);

    register_graphql_field('RootQuery', 'chsRedirects', [
        'type' => ['list_of' => 'ChsRedirectRule'],
        'description' => 'URL redirect rules for the headless frontend',
        'resolve' => function () {
            $redirects = get_field('redirects', 'option');

            if (!$redirects || !is_array($redirects)) {
                return [];
            }

            $rules = [];
            foreach ($redirects as $redirect) {
                // Skip if missing required fields
                if (empty($redirect['from_path']) || empty($redirect['to_path'])) {
                    continue;
                }

                $rules[] = [
                    'fromPath'   => $redirect['from_path'] ?? '',
                    'toPath'     => $redirect['to_path'] ?? '',
                    'statusCode' => (int) ($redirect['redirect_type'] ?? 301),
                    'enabled'    => (bool) ($redirect['enabled'] ?? true),
                ];
            }

            return $rules;
        },
    ]);
});
