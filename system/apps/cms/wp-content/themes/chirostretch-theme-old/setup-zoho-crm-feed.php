<?php
/**
 * Setup Zoho CRM Feed for Form 17 (New Patient Special)
 *
 * Run via WP-CLI:
 *   wp eval-file wp-content/themes/chirostretch-theme/setup-zoho-crm-feed.php
 *
 * Or visit: /wp-admin/?setup-zoho-crm-feed=1 (while logged in as admin)
 *
 * Field mapping for Form 17 → Zoho CRM Leads:
 * | Form Field         | Field ID | Zoho Lead Field |
 * |--------------------|----------|-----------------|
 * | First Name         | 1        | First_Name      |
 * | Last Name          | 2        | Last_Name       |
 * | Email              | 3        | Email           |
 * | Phone              | 4        | Phone           |
 * | Preferred Location | 5        | City            |
 * | Lead Source        | 6        | Lead_Source     |
 */

// Allow running from admin URL
if (defined('ABSPATH') && isset($_GET['setup-zoho-crm-feed']) && current_user_can('manage_options')) {
    add_action('admin_init', 'chirostretch_setup_zoho_crm_feed');
}

// Allow running from WP-CLI
if (defined('WP_CLI') && WP_CLI) {
    chirostretch_setup_zoho_crm_feed();
}

function chirostretch_setup_zoho_crm_feed() {
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

    // Check if Zoho CRM addon is active
    if (!class_exists('GFZohoCRM')) {
        $message = 'Error: Gravity Forms Zoho CRM Add-On is not active.';
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
    $existing_feeds = GFAPI::get_feeds(null, $form_id, 'gravityformszohocrm');
    if (!is_wp_error($existing_feeds) && !empty($existing_feeds)) {
        $message = "Zoho CRM feed already exists for Form {$form_id}. Feed ID: " . $existing_feeds[0]['id'];
        if (defined('WP_CLI')) {
            WP_CLI::warning($message);
            WP_CLI::log('Existing feed: ' . print_r($existing_feeds[0], true));
        } else {
            echo "<p>{$message}</p>";
            echo '<pre>' . print_r($existing_feeds[0], true) . '</pre>';
        }
        return;
    }

    // Create the Zoho CRM feed
    // Field mapping for Form 17:
    // Field 1: First Name (TEXT)
    // Field 2: Last Name (TEXT)
    // Field 3: Email (EMAIL)
    // Field 4: Phone (PHONE)
    // Field 5: Preferred Location (SELECT)
    // Field 6: Lead Source (SELECT)

    $feed = array(
        'feedName'         => 'New Patient Lead to Zoho CRM',
        'action'           => 'create',
        'module'           => 'Leads',
        'fieldMap'         => array(
            array(
                'key'        => 'First_Name',
                'value'      => '1',  // Field 1: First Name
                'custom_key' => '',
            ),
            array(
                'key'        => 'Last_Name',
                'value'      => '2',  // Field 2: Last Name
                'custom_key' => '',
            ),
            array(
                'key'        => 'Email',
                'value'      => '3',  // Field 3: Email
                'custom_key' => '',
            ),
            array(
                'key'        => 'Phone',
                'value'      => '4',  // Field 4: Phone
                'custom_key' => '',
            ),
            array(
                'key'        => 'City',
                'value'      => '5',  // Field 5: Preferred Location
                'custom_key' => '',
            ),
            array(
                'key'        => 'Lead_Source',
                'value'      => '6',  // Field 6: Lead Source
                'custom_key' => '',
            ),
        ),
        'is_active'        => true,
        'conditionalLogic' => false,  // Always create lead
    );

    $result = GFAPI::add_feed($form_id, $feed, 'gravityformszohocrm');

    if (is_wp_error($result)) {
        $message = 'Error creating feed: ' . $result->get_error_message();
        if (defined('WP_CLI')) {
            WP_CLI::error($message);
        } else {
            wp_die($message);
        }
        return;
    }

    $message = "Success! Zoho CRM feed created for Form {$form_id}. Feed ID: {$result}";
    if (defined('WP_CLI')) {
        WP_CLI::success($message);
    } else {
        echo "<p style='color: green; font-weight: bold;'>{$message}</p>";
        echo '<p><a href="' . admin_url("admin.php?page=gf_edit_forms&view=settings&subview=gravityformszohocrm&id={$form_id}") . '">View Zoho CRM Settings</a></p>';
    }
}
