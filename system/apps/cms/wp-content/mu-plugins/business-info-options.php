<?php
/**
 * Plugin Name: Business Information Options Page
 * Description: Registers the corporate Business Information ACF options page.
 *              Stores canonical, presentation-agnostic facts about ChiroStretch HQ.
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Register the Business Information options page
 *
 * This page stores corporate identity facts only:
 * - Legal/public business name
 * - Primary contact info
 * - Canonical HQ address
 *
 * This page does NOT store:
 * - Hours, availability, schedules
 * - SEO metadata
 * - Social links
 * - UI/layout configuration
 * - Location-specific data
 */
add_action('acf/init', function () {
    if (!function_exists('acf_add_options_page')) {
        return;
    }

    acf_add_options_page([
        'page_title'      => 'Business Information',
        'menu_title'      => 'Business Information',
        'menu_slug'       => 'business_info',
        'capability'      => 'manage_options',
        'position'        => 80,
        'icon_url'        => 'dashicons-building',
        'redirect'        => false,
        'update_button'   => 'Save Business Information',
        'updated_message' => 'Business information updated.',
        'show_in_graphql' => false, // We expose via custom chsBusinessInfo query instead
    ]);
});

/**
 * Expose Business Information to WPGraphQL
 *
 * Query: { businessInfo { businessName primaryPhone ... } }
 */
add_action('graphql_register_types', function () {
    register_graphql_object_type('ChsBusinessInfo', [
        'description' => 'Canonical corporate identity for ChiroStretch headquarters.',
        'fields' => [
            'businessName' => [
                'type' => 'String',
                'description' => 'Public-facing corporate name',
            ],
            'legalBusinessName' => [
                'type' => 'String',
                'description' => 'Legal entity name (LLC, Inc, etc.)',
            ],
            'primaryPhone' => [
                'type' => 'String',
                'description' => 'Main corporate phone (digits only)',
            ],
            'primaryEmail' => [
                'type' => 'String',
                'description' => 'Main corporate email',
            ],
            'streetAddress' => [
                'type' => 'String',
                'description' => 'HQ street address',
            ],
            'city' => [
                'type' => 'String',
                'description' => 'HQ city',
            ],
            'state' => [
                'type' => 'String',
                'description' => 'HQ state/region',
            ],
            'postalCode' => [
                'type' => 'String',
                'description' => 'HQ postal/ZIP code',
            ],
            'country' => [
                'type' => 'String',
                'description' => 'HQ country',
            ],
        ],
    ]);

    register_graphql_field('RootQuery', 'chsBusinessInfo', [
        'type' => 'ChsBusinessInfo',
        'description' => 'Corporate business information for ChiroStretch HQ',
        'resolve' => function () {
            return [
                'businessName'      => get_field('business_name', 'option') ?: '',
                'legalBusinessName' => get_field('legal_business_name', 'option') ?: '',
                'primaryPhone'      => get_field('primary_phone', 'option') ?: '',
                'primaryEmail'      => get_field('primary_email', 'option') ?: '',
                'streetAddress'     => get_field('street_address', 'option') ?: '',
                'city'              => get_field('city', 'option') ?: '',
                'state'             => get_field('state', 'option') ?: '',
                'postalCode'        => get_field('postal_code', 'option') ?: '',
                'country'           => get_field('country', 'option') ?: '',
            ];
        },
    ]);
});
