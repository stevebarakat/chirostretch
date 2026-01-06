<?php
/**
 * Plugin Name: Feature Options Page
 * Description: ACF Options Page for managing feature key points displayed on location pages
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
        'page_title'  => 'Feature Settings',
        'menu_title'  => 'Feature',
        'menu_slug'   => 'feature-settings',
        'capability'  => 'manage_options',
        'parent_slug' => 'edit.php?post_type=location',
        'position'    => '',
        'redirect'    => false,
    ]);
});

// ACF Field Group is loaded from acf-json/group_feature.json

// Expose Feature Key Points to WPGraphQL (priority 99 to run after wpgraphql-acf)
add_action('graphql_register_types', function () {
    register_graphql_object_type('ChiroKeyPoint', [
        'description' => 'A key point displayed on location pages',
        'fields'      => [
            'icon' => [
                'type'        => 'MediaItem',
                'description' => 'Icon image',
                'resolve'     => function ($source, $args, $context) {
                    if (empty($source->iconId)) {
                        return null;
                    }
                    return $context->get_loader('post')->load_deferred($source->iconId);
                },
            ],
            'iconBackgroundColor' => [
                'type'        => 'String',
                'description' => 'Background color for the icon',
            ],
            'title' => [
                'type'        => 'String',
                'description' => 'Key point title',
            ],
            'description' => [
                'type'        => 'String',
                'description' => 'Key point description',
            ],
        ],
    ]);

    register_graphql_object_type('ChiroFeatureSettings', [
        'description' => 'Feature section settings',
        'fields'      => [
            'title' => [
                'type'        => 'String',
                'description' => 'Section title',
            ],
            'description' => [
                'type'        => 'String',
                'description' => 'Section description',
            ],
            'keyPoints' => [
                'type'        => ['list_of' => 'ChiroKeyPoint'],
                'description' => 'List of key points',
            ],
        ],
    ]);

    register_graphql_field('RootQuery', 'chiroFeatureSettings', [
        'type'        => 'ChiroFeatureSettings',
        'description' => 'Feature section settings and key points',
        'resolve'     => function ($root, $args, $context) {
            $title = get_field('value_propositions_title', 'option') ?: 'The ChiroStretch Advantage';
            $descr = get_field('value_propositions_description', 'option') ?: '';
            $items_raw = get_field('key_points', 'option') ?: [];

            $items = [];
            foreach ($items_raw as $item) {
                $iconId = null;
                if (!empty($item['icon']) && is_array($item['icon']) && !empty($item['icon']['ID'])) {
                    $iconId = $item['icon']['ID'];
                }

                $kp = new \stdClass();
                $kp->iconId = $iconId;
                $kp->iconBackgroundColor = $item['icon_background_color'] ?? '#E8F4FD';
                $kp->title = $item['title'] ?? '';
                $kp->description = $item['description'] ?? '';
                $items[] = $kp;
            }

            return [
                'title' => $title,
                'description' => $descr,
                'keyPoints' => $items,
            ];
        },
    ]);
}, 99);
