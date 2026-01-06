<?php
/**
 * Plugin Name: Location → Organizer Sync
 * Description: Syncs ChiroStretch Locations to Events Calendar Organizers.
 * Author: ChiroStretch Dev
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Sync a location to its linked organizer
 */
function chirostretch_sync_location_to_organizer($post_id, $post) {
    static $syncing = [];

    // Prevent infinite loops per post
    if (isset($syncing[$post_id])) {
        return;
    }

    // Skip autosaves and revisions
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (wp_is_post_revision($post_id)) {
        return;
    }

    $syncing[$post_id] = true;

    // Get or create linked organizer
    $organizer_id = get_post_meta($post_id, '_linked_organizer_id', true);

    // Map location fields → organizer fields
    $organizer_data = [
        'post_title'  => $post->post_title,
        'post_status' => $post->post_status,
        'post_type'   => 'tribe_organizer',
        'meta_input'  => [
            '_OrganizerPhone'     => get_post_meta($post_id, 'phone', true),
            '_OrganizerEmail'     => get_post_meta($post_id, 'email', true),
            '_OrganizerWebsite'   => get_permalink($post_id),
            '_linked_location_id' => $post_id,
        ],
    ];

    if ($organizer_id && get_post($organizer_id)) {
        $organizer_data['ID'] = $organizer_id;
        wp_update_post($organizer_data);
    } else {
        $organizer_id = wp_insert_post($organizer_data);
        if (!is_wp_error($organizer_id)) {
            update_post_meta($post_id, '_linked_organizer_id', $organizer_id);
        }
    }
}
add_action('save_post_location', 'chirostretch_sync_location_to_organizer', 20, 2);

/**
 * Trash the linked organizer when location is trashed
 */
function chirostretch_trash_synced_organizer($post_id) {
    if (get_post_type($post_id) !== 'location') {
        return;
    }

    $organizer_id = get_post_meta($post_id, '_linked_organizer_id', true);
    if ($organizer_id && get_post($organizer_id)) {
        wp_trash_post($organizer_id);
    }
}
add_action('wp_trash_post', 'chirostretch_trash_synced_organizer');

/**
 * Restore the linked organizer when location is restored
 */
function chirostretch_restore_synced_organizer($post_id) {
    if (get_post_type($post_id) !== 'location') {
        return;
    }

    $organizer_id = get_post_meta($post_id, '_linked_organizer_id', true);
    if ($organizer_id) {
        wp_untrash_post($organizer_id);
    }
}
add_action('untrash_post', 'chirostretch_restore_synced_organizer');

/**
 * Delete the linked organizer when location is permanently deleted
 */
function chirostretch_delete_synced_organizer($post_id) {
    if (get_post_type($post_id) !== 'location') {
        return;
    }

    $organizer_id = get_post_meta($post_id, '_linked_organizer_id', true);
    if ($organizer_id && get_post($organizer_id)) {
        wp_delete_post($organizer_id, true);
    }
}
add_action('before_delete_post', 'chirostretch_delete_synced_organizer');

// Business Info options page moved to business-info-options.php

/**
 * Sync business info when ACF options are saved
 * - Updates global Events Calendar organizer
 * - Syncs with Yoast SEO organization settings (if installed)
 */
add_action('acf/save_post', function ($post_id) {
    if ($post_id !== 'options') {
        return;
    }

    // Only sync if business info fields were saved
    $name = get_field('business_name', 'option');
    if (!$name) {
        return;
    }

    $phone = get_field('primary_phone', 'option');
    $email = get_field('primary_email', 'option');

    // Sync to Events Calendar global organizer (if TEC is active)
    if (post_type_exists('tribe_organizer')) {
        $global_org_id = get_option('chirostretch_global_business_id');

        $data = [
            'post_title'  => $name,
            'post_status' => 'publish',
            'post_type'   => 'tribe_organizer',
            'meta_input'  => [
                '_OrganizerPhone'      => $phone,
                '_OrganizerEmail'      => $email,
                '_is_global_business'  => '1',
            ],
        ];

        if ($global_org_id && get_post($global_org_id)) {
            $data['ID'] = $global_org_id;
            wp_update_post($data);
        } else {
            $global_org_id = wp_insert_post($data);
            if (!is_wp_error($global_org_id)) {
                update_option('chirostretch_global_business_id', $global_org_id);
            }
        }
    }

    // Sync to Yoast SEO organization settings (if Yoast is active)
    if (defined('WPSEO_VERSION')) {
        $yoast_titles = get_option('wpseo_titles', []);
        $yoast_titles['company_name'] = $name;
        $yoast_titles['org-email'] = $email;
        $yoast_titles['org-phone'] = $phone;
        update_option('wpseo_titles', $yoast_titles);
    }
}, 20);

/**
 * Pre-populate business info from Yoast on first load (if empty)
 */
add_action('acf/init', function () {
    // Only run once
    if (get_option('chirostretch_business_info_initialized')) {
        return;
    }

    // Check if Yoast has org data
    if (!defined('WPSEO_VERSION')) {
        return;
    }

    $yoast_titles = get_option('wpseo_titles', []);

    // Only populate if our fields are empty
    if (!get_field('business_name', 'option') && !empty($yoast_titles['company_name'])) {
        update_field('business_name', $yoast_titles['company_name'], 'option');
    }
    if (!get_field('primary_email', 'option') && !empty($yoast_titles['org-email'])) {
        update_field('primary_email', $yoast_titles['org-email'], 'option');
    }
    if (!get_field('primary_phone', 'option') && !empty($yoast_titles['org-phone'])) {
        update_field('primary_phone', $yoast_titles['org-phone'], 'option');
    }

    update_option('chirostretch_business_info_initialized', true);
}, 20);

/**
 * Hide Organizers from menu (they're managed via Locations)
 */
add_action('admin_menu', function () {
    remove_submenu_page('edit.php?post_type=tribe_events', 'edit.php?post_type=tribe_organizer');
}, 999);

/**
 * Hide unused TEC admin fields:
 * - Event Website section (entire table)
 * - Show Map / Show Map Link row
 */
add_action('admin_head', function () {
    global $post_type;
    if ($post_type !== 'tribe_events' && $post_type !== 'tribe_venue') {
        return;
    }
    ?>
    <style>
        /* Hide entire Event Website section */
        #event_url {
            display: none !important;
        }

        /* Hide Map row (includes "Map:" label and both checkboxes) */
        #google_map_toggle,
        .tec-linked-post__map-options {
            display: none !important;
        }

        /* Hide Additional Functionality upsell */
        .eventBritePluginPlug {
            display: none !important;
        }
    </style>
    <?php
});

/**
 * Redirect organizer edit page to linked location (if exists)
 */
add_action('load-post.php', function () {
    if (!isset($_GET['post'])) {
        return;
    }

    $post_id = intval($_GET['post']);
    if (get_post_type($post_id) !== 'tribe_organizer') {
        return;
    }

    // Check if this is a linked organizer
    $location_id = get_post_meta($post_id, '_linked_location_id', true);
    if ($location_id && get_post($location_id)) {
        wp_redirect(admin_url('post.php?post=' . $location_id . '&action=edit'));
        exit;
    }

    // Check if this is the global business organizer
    $is_global = get_post_meta($post_id, '_is_global_business', true);
    if ($is_global) {
        wp_redirect(admin_url('admin.php?page=business_info'));
        exit;
    }
});

/**
 * WP-CLI command to sync all locations to organizers
 */
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('chirostretch organizers sync', function ($args, $assoc_args) {
        $locations = get_posts([
            'post_type'      => 'location',
            'posts_per_page' => -1,
            'post_status'    => 'any',
        ]);

        $synced = 0;
        foreach ($locations as $location) {
            chirostretch_sync_location_to_organizer($location->ID, $location);
            WP_CLI::log("Synced: {$location->post_title}");
            $synced++;
        }

        // Also sync global business info by triggering the ACF save
        $business_name = get_field('business_name', 'option');
        if ($business_name) {
            do_action('acf/save_post', 'options');
            WP_CLI::log("Synced global business: {$business_name}");
        }

        WP_CLI::success("Synced {$synced} locations to organizers");
    });

    WP_CLI::add_command('chirostretch organizers cleanup', function ($args, $assoc_args) {
        // Find orphan organizers (not linked to a location and not global)
        $organizers = get_posts([
            'post_type'      => 'tribe_organizer',
            'posts_per_page' => -1,
            'post_status'    => 'any',
        ]);

        $orphans = [];
        foreach ($organizers as $organizer) {
            $linked_location = get_post_meta($organizer->ID, '_linked_location_id', true);
            $is_global = get_post_meta($organizer->ID, '_is_global_business', true);

            if (!$linked_location && !$is_global) {
                $orphans[] = $organizer;
            }
        }

        if (empty($orphans)) {
            WP_CLI::success("No orphan organizers found");
            return;
        }

        WP_CLI::log("Found " . count($orphans) . " orphan organizers:");
        foreach ($orphans as $orphan) {
            WP_CLI::log("  - {$orphan->post_title} (ID: {$orphan->ID})");
        }

        if (!isset($assoc_args['delete'])) {
            WP_CLI::log("\nRun with --delete to remove these organizers");
            return;
        }

        foreach ($orphans as $orphan) {
            wp_delete_post($orphan->ID, true);
            WP_CLI::log("Deleted: {$orphan->post_title}");
        }

        WP_CLI::success("Deleted " . count($orphans) . " orphan organizers");
    });
}

/**
 * =============================================================================
 * AJAX-Powered Organizer Search (for 1000+ locations)
 * =============================================================================
 */

/**
 * AJAX handler for organizer search via TEC's tribe_dropdown system
 */
add_filter('tribe_dropdown_organizer', function ($data, $search, $page, $args, $source) {
    $per_page = 20;
    $page = max(1, intval($page));
    $offset = ($page - 1) * $per_page;

    // Handle search term - can be string or array
    $search_term = '';
    if (!empty($search)) {
        if (is_array($search) && isset($search['term'])) {
            $search_term = sanitize_text_field($search['term']);
        } elseif (is_string($search)) {
            $search_term = sanitize_text_field($search);
        }
    }

    $query_args = [
        'post_type'      => 'tribe_organizer',
        'post_status'    => 'publish',
        'posts_per_page' => $per_page,
        'offset'         => $offset,
        'orderby'        => 'title',
        'order'          => 'ASC',
    ];

    if (!empty($search_term)) {
        $query_args['s'] = $search_term;
    }

    $organizers = get_posts($query_args);

    $results = [];
    foreach ($organizers as $org) {
        $results[] = [
            'id'   => $org->ID,
            'text' => $org->post_title,
        ];
    }

    // Check if more results exist
    $count_args = [
        'post_type'      => 'tribe_organizer',
        'post_status'    => 'publish',
        'posts_per_page' => 1,
        'fields'         => 'ids',
    ];
    if (!empty($search_term)) {
        $count_args['s'] = $search_term;
    }
    $count_query = new WP_Query($count_args);
    $total = $count_query->found_posts;
    $has_more = ($offset + count($organizers)) < $total;

    return [
        'results'    => $results,
        'more'       => $has_more,
        'pagination' => ['more' => $has_more],
    ];
}, 10, 5);

/**
 * Inject JS to convert organizer dropdown to AJAX mode
 * Must run after TEC's dropdown initialization
 */
add_action('admin_footer-post.php', function () {
    global $post_type;
    if ($post_type !== 'tribe_events') {
        return;
    }
    $nonce = wp_create_nonce('tribe_dropdown');
    ?>
    <script>
    (function($) {
        var nonce = <?php echo wp_json_encode($nonce); ?>;

        function convertToAjaxDropdown() {
            var $select = $('#saved_tribe_organizer');
            if (!$select.length) {
                return;
            }

            // Store current value
            var currentValue = $select.val();

            // Check if Select2 is initialized
            if ($select.hasClass('select2-hidden-accessible')) {
                try {
                    $select.select2('destroy');
                } catch(e) {}
            }

            // Add AJAX data attributes
            $select.attr({
                'data-source': 'organizer',
                'data-source-nonce': nonce
            });

            // Reinitialize using TEC's dropdown function
            if (typeof window.tribe_dropdowns !== 'undefined' && $.fn.tribe_dropdowns) {
                $select.tribe_dropdowns();
            }

            // Restore value if needed
            if (currentValue && currentValue !== '-1') {
                $select.val(currentValue).trigger('change');
            }
        }

        // Run after a short delay to ensure TEC has initialized
        $(document).ready(function() {
            setTimeout(convertToAjaxDropdown, 500);
        });

    })(jQuery);
    </script>
    <?php
});

/**
 * Limit initial organizer load for performance
 * Selected organizers are always included, plus a few recent ones
 * AJAX search handles the rest
 */
add_filter('tribe_events_linked_posts_query_args', function ($args, $post_type) {
    if ($post_type !== 'tribe_organizer') {
        return $args;
    }

    // Get current event ID
    $event_id = isset($_GET['post']) ? intval($_GET['post']) : 0;

    if ($event_id) {
        // Only load the currently selected organizers
        $selected_ids = tribe_get_organizer_ids($event_id);
        if (!empty($selected_ids)) {
            $args['post__in'] = $selected_ids;
            $args['posts_per_page'] = count($selected_ids);
        } else {
            // No selection - load just a few for the dropdown to render
            $args['posts_per_page'] = 10;
        }
    } else {
        // New event - load just a few for the dropdown to render
        $args['posts_per_page'] = 10;
    }

    return $args;
}, 10, 2);
