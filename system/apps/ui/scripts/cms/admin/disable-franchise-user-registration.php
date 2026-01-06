<?php
/**
 * Disable User Registration feed on Franchise Application form
 *
 * Run with: wp eval-file scripts/disable-franchise-user-registration.php
 *
 * Per the Access & Identity Charter, applicants must NOT get WordPress user accounts.
 * This script disables any User Registration feeds on the franchise form.
 */

if (!defined('ABSPATH')) {
    echo "Run this script with: wp eval-file scripts/disable-franchise-user-registration.php\n";
    exit(1);
}

// Configuration
$form_id = 16; // ChiroStretch Franchise Application form

if (!class_exists('GFAPI')) {
    WP_CLI::error('Gravity Forms must be active.');
    exit(1);
}

// Get User Registration feeds for this form
$feeds = GFAPI::get_feeds(null, $form_id, 'gravityformsuserregistration');

if (empty($feeds)) {
    WP_CLI::log("No User Registration feeds found for form $form_id.");
    exit(0);
}

$disabled_count = 0;
$deleted_count = 0;

foreach ($feeds as $feed) {
    $feed_id = $feed['id'];
    $feed_name = $feed['meta']['feedName'] ?? 'Unnamed';

    // Option 1: Disable the feed (safer, reversible)
    $feed['is_active'] = false;
    $result = GFAPI::update_feed($feed_id, $feed['meta'], $form_id);

    if (!is_wp_error($result)) {
        // Also need to update the is_active flag separately
        global $wpdb;
        $wpdb->update(
            $wpdb->prefix . 'gf_addon_feed',
            ['is_active' => 0],
            ['id' => $feed_id]
        );
        WP_CLI::log("Disabled User Registration feed: $feed_name (ID: $feed_id)");
        $disabled_count++;
    } else {
        WP_CLI::warning("Failed to disable feed $feed_id: " . $result->get_error_message());
    }

    // Option 2: Delete the feed (uncomment if you want to remove entirely)
    // $result = GFAPI::delete_feed($feed_id);
    // if ($result) {
    //     WP_CLI::log("Deleted User Registration feed: $feed_name (ID: $feed_id)");
    //     $deleted_count++;
    // }
}

WP_CLI::success("Disabled $disabled_count User Registration feed(s) on form $form_id.");
WP_CLI::log("\nPer the Access & Identity Charter:");
WP_CLI::log("  - Applicants must NOT have WordPress user accounts");
WP_CLI::log("  - User accounts are created only upon approval");
WP_CLI::log("  - Use Advanced Post Creation to create franchise_app posts instead");
