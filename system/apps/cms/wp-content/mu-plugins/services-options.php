<?php
/**
 * Plugin Name: Services Options Page
 * Description: ACF Options Page for managing services displayed on location pages
 * Author: ChiroStretch Dev
 */

if (!defined('ABSPATH')) {
    exit;
}

// Register ACF Options Page
add_action('acf/init', function () {
    if (!function_exists('acf_add_options_page')) {
        return;
    }

    acf_add_options_page([
        'page_title'  => 'Services Settings',
        'menu_title'  => 'Services',
        'menu_slug'   => 'services-settings',
        'capability'  => 'manage_options',
        'parent_slug' => 'edit.php?post_type=location',
        'position'    => '',
        'redirect'    => false,
    ]);
});

// Configure ACF to load/save JSON from wp-content/acf-json directory
add_filter('acf/settings/load_json', function ($paths) {
    $paths[] = WP_CONTENT_DIR . '/acf-json';
    return $paths;
});

add_filter('acf/settings/save_json', function ($path) {
    return WP_CONTENT_DIR . '/acf-json';
});


// Expose Services to WPGraphQL
add_action('graphql_register_types', function () {
    // Register ChiroService type
    register_graphql_object_type('ChiroService', [
        'description' => 'A service offered at ChiroStretch locations',
        'fields'      => [
            'tabLabel' => [
                'type'        => 'String',
                'description' => 'Tab label for the service',
            ],
            'tabIcon' => [
                'type'        => 'MediaItem',
                'description' => 'Icon image for the tab',
                'resolve'     => function ($source, $args, $context) {
                    if (empty($source->tabIconId)) {
                        return null;
                    }
                    return $context->get_loader('post')->load_deferred($source->tabIconId);
                },
            ],
            'title' => [
                'type'        => 'String',
                'description' => 'Service title',
            ],
            'description' => [
                'type'        => 'String',
                'description' => 'Service description',
            ],
            'bulletPoints' => [
                'type'        => ['list_of' => 'String'],
                'description' => 'List of benefit bullet points',
            ],
            'infoBox' => [
                'type'        => 'String',
                'description' => 'Info box content',
            ],
            'image' => [
                'type'        => 'MediaItem',
                'description' => 'Service image',
                'resolve'     => function ($source, $args, $context) {
                    if (empty($source->imageId)) {
                        return null;
                    }
                    return $context->get_loader('post')->load_deferred($source->imageId);
                },
            ],
        ],
    ]);

    // Register ChiroServicesSettings type
    register_graphql_object_type('ChiroServicesSettings', [
        'description' => 'Services section settings',
        'fields'      => [
            'title' => [
                'type'        => 'String',
                'description' => 'Section title',
            ],
            'description' => [
                'type'        => 'String',
                'description' => 'Section description',
            ],
            'services' => [
                'type'        => ['list_of' => 'ChiroService'],
                'description' => 'List of services',
            ],
        ],
    ]);

    // Register root query field
    register_graphql_field('RootQuery', 'chiroServicesSettings', [
        'type'        => 'ChiroServicesSettings',
        'description' => 'Services section settings and list',
        'resolve'     => function ($root, $args, $context) {
            // Get from ACF options - use get_field for proper ACF repeater support
            $title = get_field('services_title', 'option');
            if (!$title) {
                $title = get_option('options_services_title', 'Our Core Therapies');
            }

            $descr = get_field('services_description', 'option');
            if (!$descr) {
                $descr = get_option('options_services_description', '');
            }

            // Must use get_field for repeaters - get_option only returns count
            $services_raw = get_field('services', 'option');
            if (!is_array($services_raw)) {
                $services_raw = [];
            }

            $services = [];
            foreach ($services_raw as $service) {
                // Extract bullet points
                $bullets = [];
                if (!empty($service['bullet_points']) && is_array($service['bullet_points'])) {
                    foreach ($service['bullet_points'] as $bullet) {
                        if (!empty($bullet['bullet_text'])) {
                            $bullets[] = $bullet['bullet_text'];
                        }
                    }
                }

                // Get image IDs from ACF image fields (returns array with 'ID' key)
                $imageId = null;
                if (!empty($service['service_image']) && is_array($service['service_image']) && !empty($service['service_image']['ID'])) {
                    $imageId = $service['service_image']['ID'];
                }

                // Get tab icon image ID
                $tabIconId = null;
                if (!empty($service['tab_icon']) && is_array($service['tab_icon']) && !empty($service['tab_icon']['ID'])) {
                    $tabIconId = $service['tab_icon']['ID'];
                }

                // Use stdClass for WPGraphQL compatibility
                $s = new \stdClass();
                $s->tabLabel = isset($service['tab_label']) ? $service['tab_label'] : '';
                $s->tabIconId = $tabIconId;
                $s->title = isset($service['service_title']) ? $service['service_title'] : '';
                $s->description = isset($service['service_description']) ? $service['service_description'] : '';
                $s->bulletPoints = $bullets;
                $s->infoBox = isset($service['info_box']) ? $service['info_box'] : '';
                $s->imageId = $imageId; // Store ID for deferred loading
                $services[] = $s;
            }

            $result = new \stdClass();
            $result->title = $title;
            $result->description = $descr;
            $result->services = $services;
            return $result;
        },
    ]);
});
