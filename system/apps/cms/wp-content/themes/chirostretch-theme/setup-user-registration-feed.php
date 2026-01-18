<?php
/**
 * Setup User Registration Feed for Form 17 (New Patient Special)
 *
 * Run via WP-CLI:
 *   wp eval-file wp-content/themes/chirostretch-theme/setup-user-registration-feed.php
 *
 * Or visit: /wp-admin/?setup-user-registration-feed=1 (while logged in as admin)
 */

// Allow running from admin URL
if (defined('ABSPATH') && isset($_GET['setup-user-registration-feed']) && current_user_can('manage_options')) {
    add_action('admin_init', 'chirostretch_setup_user_registration_feed');
}

// Allow running from WP-CLI
if (defined('WP_CLI') && WP_CLI) {
    chirostretch_setup_user_registration_feed();
}

function chirostretch_setup_user_registration_feed() {
    // Check if GFAPI exists
    if (!class_exists('GFAPI')) {
        $message = 'Error: Gravity Forms is not active.';
        if (defined('WP_CLI')) {
            WP_CLI::error($message);
        } else {
            wp_die($message);
        }
        return;
    }

    // Check if User Registration addon is active
    if (!class_exists('GF_User_Registration')) {
        $message = 'Error: Gravity Forms User Registration Add-On is not active.';
        if (defined('WP_CLI')) {
            WP_CLI::error($message);
        } else {
            wp_die($message);
        }
        return;
    }

    $form_id = 17; // New Patient Special form

    // Check if form exists
    $form = GFAPI::get_form($form_id);
    if (!$form) {
        $message = "Error: Form {$form_id} not found.";
        if (defined('WP_CLI')) {
            WP_CLI::error($message);
        } else {
            wp_die($message);
        }
        return;
    }

    // Check if feed already exists
    $existing_feeds = GFAPI::get_feeds(null, $form_id, 'gravityformsuserregistration');
    if (!is_wp_error($existing_feeds) && !empty($existing_feeds)) {
        $message = "User Registration feed already exists for Form {$form_id}. Feed ID: " . $existing_feeds[0]['id'];
        if (defined('WP_CLI')) {
            WP_CLI::warning($message);
            WP_CLI::log('Existing feed: ' . print_r($existing_feeds[0], true));
        } else {
            echo "<p>{$message}</p>";
            echo '<pre>' . print_r($existing_feeds[0], true) . '</pre>';
        }
        return;
    }

    // Create the User Registration feed
    // Field mapping for Form 17:
    // Field 1: First Name (TEXT)
    // Field 2: Last Name (TEXT)
    // Field 3: Email (EMAIL)
    // Field 4: Phone (PHONE)
    // Field 5: Preferred Location (SELECT)
    // Field 6: Lead Source (SELECT)

    $feed = array(
        'feedName'           => 'New Patient Lead',
        'feedType'           => 'create', // 'create' or 'update'
        'userActivation'     => false,    // No email activation required
        'sendEmail'          => false,    // Don't send WP new user email (GF notification handles this)
        'setAsAuthor'        => false,
        'userEmail'          => '3',      // Field 3: Email
        'username'           => '3',      // Use email as username
        'password'           => '',       // Auto-generate password
        'firstName'          => '1',      // Field 1: First Name
        'lastName'           => '2',      // Field 2: Last Name
        'displayname'        => 'firstlast', // Display as "First Last"
        'role'               => 'subscriber', // Or create a custom 'lead' role
        'createSite'         => false,
        'userMeta'           => array(
            array(
                'key'        => 'phone',
                'value'      => '4',      // Field 4: Phone
                'custom_key' => '',
            ),
            array(
                'key'        => 'preferred_location',
                'value'      => '5',      // Field 5: Preferred Location
                'custom_key' => '',
            ),
            array(
                'key'        => 'lead_source',
                'value'      => '6',      // Field 6: Lead Source
                'custom_key' => '',
            ),
        ),
        'is_active'          => true,
        'conditionalLogic'   => false,    // Always create user
    );

    $result = GFAPI::add_feed($form_id, $feed, 'gravityformsuserregistration');

    if (is_wp_error($result)) {
        $message = 'Error creating feed: ' . $result->get_error_message();
        if (defined('WP_CLI')) {
            WP_CLI::error($message);
        } else {
            wp_die($message);
        }
        return;
    }

    $message = "Success! User Registration feed created for Form {$form_id}. Feed ID: {$result}";
    if (defined('WP_CLI')) {
        WP_CLI::success($message);
    } else {
        echo "<p style='color: green; font-weight: bold;'>{$message}</p>";
        echo '<p><a href="' . admin_url("admin.php?page=gf_edit_forms&view=settings&subview=gravityformsuserregistration&id={$form_id}") . '">View User Registration Settings</a></p>';
    }
}
