<?php
/**
 * Setup Advanced Post Creation feed for Franchise Application form
 *
 * Run with: wp eval-file scripts/setup-franchise-apc-feed.php
 *
 * This creates the APC feed that generates franchise_app posts from form submissions.
 * Per the Access & Identity Charter, NO user accounts are created at submission time.
 */

if (!defined('ABSPATH')) {
    echo "Run this script with: wp eval-file scripts/setup-franchise-apc-feed.php\n";
    exit(1);
}

// Configuration
$form_id = 16; // ChiroStretch Franchise Application form

// Field mappings based on form 16 structure
$field_map = [
    'first_name' => '1',        // First Name (text)
    'last_name' => '2',         // Last Name (text)
    'email' => '3',             // Email
    'phone' => '4',             // Phone
    'location' => '25',         // Desired Market / City
    'investment' => '20',       // Estimated Liquid Capital (select)
    'experience' => '17',       // Describe your previous business experience
];

// Check if GF and APC are available
if (!class_exists('GFAPI') || !class_exists('GF_Advanced_Post_Creation')) {
    WP_CLI::error('Gravity Forms and Advanced Post Creation add-on must be active.');
    exit(1);
}

// Check if form exists
$form = GFAPI::get_form($form_id);
if (!$form) {
    WP_CLI::error("Form ID $form_id not found.");
    exit(1);
}

// Check for existing APC feed
$existing_feeds = GFAPI::get_feeds(null, $form_id, 'gravityformsadvancedpostcreation');
if (is_wp_error($existing_feeds)) {
    // No feeds found or add-on not configured - this is fine, we'll create one
    $existing_feeds = [];
}
if (!empty($existing_feeds)) {
    WP_CLI::warning("APC feed already exists for form $form_id. Skipping creation.");
    WP_CLI::log("Existing feed ID: " . $existing_feeds[0]['id']);
    exit(0);
}

// Build the feed configuration
$feed = [
    'feedName' => 'Create Franchise Application',
    'postType' => 'franchise_app',
    'postStatus' => 'publish',
    'postAuthor' => 'current_user', // Will be 0 for anonymous submissions
    'postTitle' => '{' . $field_map['first_name'] . '} {' . $field_map['last_name'] . '} - Franchise Application',
    'postContent' => '',
    'postExcerpt' => '',
    'useCustomFields' => '1',
    'postFields' => [
        [
            'customFieldName' => 'applicant_email',
            'customFieldValue' => '{' . $field_map['email'] . '}',
        ],
        [
            'customFieldName' => 'applicant_first_name',
            'customFieldValue' => '{' . $field_map['first_name'] . '}',
        ],
        [
            'customFieldName' => 'applicant_last_name',
            'customFieldValue' => '{' . $field_map['last_name'] . '}',
        ],
        [
            'customFieldName' => 'applicant_phone',
            'customFieldValue' => '{' . $field_map['phone'] . '}',
        ],
        [
            'customFieldName' => 'applicant_location',
            'customFieldValue' => '{' . $field_map['location'] . '}',
        ],
        [
            'customFieldName' => 'investment_range',
            'customFieldValue' => '{' . $field_map['investment'] . '}',
        ],
        [
            'customFieldName' => 'experience',
            'customFieldValue' => '{' . $field_map['experience'] . '}',
        ],
        [
            'customFieldName' => 'application_status',
            'customFieldValue' => 'pending',
        ],
        [
            'customFieldName' => 'submitted_date',
            'customFieldValue' => '{date_created:Y-m-d}',
        ],
        [
            'customFieldName' => 'gf_entry_id',
            'customFieldValue' => '{entry_id}',
        ],
    ],
    'conditionalLogic' => null,
    'feed_condition_conditional_logic' => '0',
    'feed_condition_conditional_logic_object' => null,
];

// Create the feed
$feed_id = GFAPI::add_feed($form_id, $feed, 'gravityformsadvancedpostcreation');

if (is_wp_error($feed_id)) {
    WP_CLI::error('Failed to create feed: ' . $feed_id->get_error_message());
    exit(1);
}

WP_CLI::success("Created Advanced Post Creation feed (ID: $feed_id) for form $form_id");
WP_CLI::log("\nField mappings:");
WP_CLI::log("  First Name:   field {$field_map['first_name']} → applicant_first_name");
WP_CLI::log("  Last Name:    field {$field_map['last_name']} → applicant_last_name");
WP_CLI::log("  Email:        field {$field_map['email']} → applicant_email");
WP_CLI::log("  Phone:        field {$field_map['phone']} → applicant_phone");
WP_CLI::log("  Location:     field {$field_map['location']} → applicant_location");
WP_CLI::log("  Investment:   field {$field_map['investment']} → investment_range");
WP_CLI::log("  Experience:   field {$field_map['experience']} → experience");
WP_CLI::log("\nDefaults:");
WP_CLI::log("  application_status: pending");
WP_CLI::log("  submitted_date: {date_created}");
WP_CLI::log("  gf_entry_id: {entry_id}");
