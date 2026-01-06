<?php
/**
 * Plugin Name: Practitioner Taxonomies
 * Description: Registers discipline, service, and specialty taxonomies for staff CPT.
 *              Replaces ACF fields with proper taxonomies for filtering and GraphQL.
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Register practitioner taxonomies
 */
add_action('init', function () {
    // Discipline - What they are (single-select)
    register_taxonomy('discipline', ['staff'], [
        'labels' => [
            'name'          => 'Disciplines',
            'singular_name' => 'Discipline',
            'menu_name'     => 'Disciplines',
            'all_items'     => 'All Disciplines',
            'edit_item'     => 'Edit Discipline',
            'view_item'     => 'View Discipline',
            'add_new_item'  => 'Add New Discipline',
            'search_items'  => 'Search Disciplines',
        ],
        'public'            => false,
        'show_ui'           => true,
        'show_in_menu'      => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'hierarchical'      => false,
        'rewrite'           => false,
        'show_in_graphql'   => true,
        'graphql_single_name' => 'Discipline',
        'graphql_plural_name' => 'Disciplines',
    ]);

    // Service - What they can provide (multi-select)
    register_taxonomy('service', ['staff'], [
        'labels' => [
            'name'          => 'Services',
            'singular_name' => 'Service',
            'menu_name'     => 'Services',
            'all_items'     => 'All Services',
            'edit_item'     => 'Edit Service',
            'view_item'     => 'View Service',
            'add_new_item'  => 'Add New Service',
            'search_items'  => 'Search Services',
        ],
        'public'            => false,
        'show_ui'           => true,
        'show_in_menu'      => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'hierarchical'      => false,
        'rewrite'           => false,
        'show_in_graphql'   => true,
        'graphql_single_name' => 'Service',
        'graphql_plural_name' => 'Services',
    ]);

    // Specialty - What they focus on (multi-select)
    register_taxonomy('specialty', ['staff'], [
        'labels' => [
            'name'          => 'Specialties',
            'singular_name' => 'Specialty',
            'menu_name'     => 'Specialties',
            'all_items'     => 'All Specialties',
            'edit_item'     => 'Edit Specialty',
            'view_item'     => 'View Specialty',
            'add_new_item'  => 'Add New Specialty',
            'search_items'  => 'Search Specialties',
        ],
        'public'            => false,
        'show_ui'           => true,
        'show_in_menu'      => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'hierarchical'      => false,
        'rewrite'           => false,
        'show_in_graphql'   => true,
        'graphql_single_name' => 'Specialty',
        'graphql_plural_name' => 'Specialties',
    ]);
});

/**
 * Seed initial taxonomy terms on activation
 */
add_action('init', function () {
    // Only run once
    if (get_option('chs_practitioner_taxonomies_seeded')) {
        return;
    }

    // Disciplines
    $disciplines = [
        'chiropractor'       => 'Chiropractor',
        'physical_therapist' => 'Physical Therapist',
        'massage_therapist'  => 'Massage Therapist',
        'athletic_therapist' => 'Athletic Therapist',
    ];

    foreach ($disciplines as $slug => $name) {
        if (!term_exists($slug, 'discipline')) {
            wp_insert_term($name, 'discipline', ['slug' => $slug]);
        }
    }

    // Services
    $services = [
        'chiropractic'    => 'Chiropractic',
        'stretch_therapy' => 'Stretch Therapy',
        'massage'         => 'Massage',
        'sports_medicine' => 'Sports Medicine',
    ];

    foreach ($services as $slug => $name) {
        if (!term_exists($slug, 'service')) {
            wp_insert_term($name, 'service', ['slug' => $slug]);
        }
    }

    // Specialties
    $specialties = [
        'sports_injuries'    => 'Sports Injuries',
        'back_pain'          => 'Back Pain',
        'neck_pain'          => 'Neck Pain',
        'headaches'          => 'Headaches',
        'posture_correction' => 'Posture Correction',
        'wellness'           => 'Wellness',
        'flexibility'        => 'Flexibility',
        'rehab'              => 'Rehabilitation',
        'deep_tissue'        => 'Deep Tissue',
        'swedish'            => 'Swedish Massage',
        'trigger_point'      => 'Trigger Point',
        'myofascial'         => 'Myofascial Release',
        'prenatal_care'      => 'Prenatal Care',
    ];

    foreach ($specialties as $slug => $name) {
        if (!term_exists($slug, 'specialty')) {
            wp_insert_term($name, 'specialty', ['slug' => $slug]);
        }
    }

    update_option('chs_practitioner_taxonomies_seeded', true);
}, 20); // After taxonomy registration

/**
 * WP-CLI command for migrating ACF fields to taxonomies
 */
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('chirostretch staff migrate-taxonomies', function ($args, $assoc_args) {
        $dry_run = isset($assoc_args['dry-run']);

        if ($dry_run) {
            WP_CLI::log('DRY RUN - No changes will be made');
        }

        // Mapping from old staff_type values to discipline slugs
        $type_to_discipline = [
            'chiropractor'       => 'chiropractor',
            'physical_therapist' => 'physical_therapist',
            'massage_therapist'  => 'massage_therapist',
            'athletic_therapist' => 'athletic_therapist',
        ];

        // Mapping from old services_offered values to service slugs
        $service_mapping = [
            'Chiropractic'    => 'chiropractic',
            'Stretch Therapy' => 'stretch_therapy',
            'Massage'         => 'massage',
            'Sports Medicine' => 'sports_medicine',
        ];

        // Get all staff posts
        $staff = get_posts([
            'post_type'      => 'staff',
            'post_status'    => 'any',
            'posts_per_page' => -1,
        ]);

        WP_CLI::log(sprintf('Found %d staff posts to migrate', count($staff)));

        $migrated = 0;
        $errors = 0;

        foreach ($staff as $post) {
            WP_CLI::log(sprintf('Processing: %s (ID: %d)', $post->post_title, $post->ID));

            // Migrate staff_type -> discipline
            $staff_type = get_field('staff_type', $post->ID);
            if ($staff_type && isset($type_to_discipline[$staff_type])) {
                $discipline_slug = $type_to_discipline[$staff_type];
                if ($dry_run) {
                    WP_CLI::log(sprintf('  Would set discipline: %s', $discipline_slug));
                } else {
                    wp_set_object_terms($post->ID, $discipline_slug, 'discipline');
                    WP_CLI::log(sprintf('  Set discipline: %s', $discipline_slug));
                }
            }

            // Migrate services_offered -> service
            $services = get_field('services_offered', $post->ID);
            if ($services && is_array($services)) {
                $service_slugs = [];
                foreach ($services as $service) {
                    if (isset($service_mapping[$service])) {
                        $service_slugs[] = $service_mapping[$service];
                    }
                }
                if (!empty($service_slugs)) {
                    if ($dry_run) {
                        WP_CLI::log(sprintf('  Would set services: %s', implode(', ', $service_slugs)));
                    } else {
                        wp_set_object_terms($post->ID, $service_slugs, 'service');
                        WP_CLI::log(sprintf('  Set services: %s', implode(', ', $service_slugs)));
                    }
                }
            }

            // Migrate specialties -> specialty (already slugs)
            $specialties = get_field('specialties', $post->ID);
            if ($specialties && is_array($specialties)) {
                if ($dry_run) {
                    WP_CLI::log(sprintf('  Would set specialties: %s', implode(', ', $specialties)));
                } else {
                    wp_set_object_terms($post->ID, $specialties, 'specialty');
                    WP_CLI::log(sprintf('  Set specialties: %s', implode(', ', $specialties)));
                }
            }

            $migrated++;
        }

        if ($dry_run) {
            WP_CLI::success(sprintf('DRY RUN complete. Would migrate %d staff posts.', $migrated));
        } else {
            WP_CLI::success(sprintf('Migration complete. Migrated %d staff posts.', $migrated));
        }
    });
}
