<?php
/**
 * Plugin Name: User Registration API
 * Description: REST API endpoint to process Gravity Forms User Registration feed for headless submissions
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Register REST API endpoint for processing User Registration feed
 */
add_action('rest_api_init', function() {
    register_rest_route('chirostretch/v1', '/user-registration/process', [
        'methods' => 'POST',
        'callback' => 'chirostretch_process_user_registration',
        'permission_callback' => 'chirostretch_verify_user_registration_request',
        'args' => [
            'entry_id' => [
                'required' => true,
                'type' => 'integer',
                'description' => 'Gravity Forms entry ID',
            ],
            'form_id' => [
                'required' => true,
                'type' => 'integer',
                'description' => 'Gravity Forms form ID',
            ],
        ],
    ]);
});

/**
 * Verify request authenticity
 */
function chirostretch_verify_user_registration_request(WP_REST_Request $request) {
    $secret = $request->get_header('X-Internal-Secret');
    $expected = defined('CHIROSTRETCH_INTERNAL_SECRET')
        ? CHIROSTRETCH_INTERNAL_SECRET
        : getenv('CHIROSTRETCH_INTERNAL_SECRET');

    // Allow in dev if no secret configured
    if (empty($expected)) {
        return true;
    }

    return $secret === $expected;
}

/**
 * Process User Registration feed for an entry
 */
function chirostretch_process_user_registration(WP_REST_Request $request) {
    $entry_id = intval($request->get_param('entry_id'));
    $form_id = intval($request->get_param('form_id'));

    // Verify Gravity Forms is active
    if (!class_exists('GFAPI')) {
        return new WP_Error(
            'gf_not_active',
            'Gravity Forms is not active',
            ['status' => 500]
        );
    }

    // Verify User Registration add-on is active
    if (!class_exists('GF_User_Registration')) {
        return new WP_Error(
            'gf_ur_not_active',
            'Gravity Forms User Registration Add-On is not active',
            ['status' => 500]
        );
    }

    // Get the entry
    $entry = GFAPI::get_entry($entry_id);
    if (is_wp_error($entry)) {
        return new WP_Error(
            'entry_not_found',
            'Entry not found: ' . $entry->get_error_message(),
            ['status' => 404]
        );
    }

    // Verify form_id matches
    if (intval($entry['form_id']) !== $form_id) {
        return new WP_Error(
            'form_mismatch',
            'Entry does not belong to the specified form',
            ['status' => 400]
        );
    }

    // Get the form
    $form = GFAPI::get_form($form_id);
    if (!$form) {
        return new WP_Error(
            'form_not_found',
            'Form not found',
            ['status' => 404]
        );
    }

    // Get User Registration feeds for this form
    $feeds = GFAPI::get_feeds(null, $form_id, 'gravityformsuserregistration');
    if (is_wp_error($feeds) || empty($feeds)) {
        return new WP_Error(
            'no_feeds',
            'No User Registration feeds found for this form',
            ['status' => 404]
        );
    }

    // Get the User Registration add-on instance
    $ur_addon = GF_User_Registration::get_instance();
    if (!$ur_addon) {
        return new WP_Error(
            'ur_instance_error',
            'Could not get User Registration add-on instance',
            ['status' => 500]
        );
    }

    $created_user = null;

    // Process each active feed
    foreach ($feeds as $feed) {
        if (!rgar($feed, 'is_active') && !rgar($feed['meta'], 'is_active')) {
            continue;
        }

        // Check if user already exists with this email
        $email_field_id = rgar($feed['meta'], 'userEmail');
        $email = rgar($entry, $email_field_id);

        if ($email && email_exists($email)) {
            $existing_user = get_user_by('email', $email);
            return new WP_REST_Response([
                'success' => true,
                'user_id' => $existing_user->ID,
                'username' => $existing_user->user_login,
                'email' => $existing_user->user_email,
                'existing' => true,
                'message' => 'User already exists with this email',
            ], 200);
        }

        // Check conditional logic if set
        if (rgar($feed['meta'], 'conditionalLogic')) {
            $is_match = GFCommon::evaluate_conditional_logic($feed['meta']['conditionalLogic'], $form, $entry);
            if (!$is_match) {
                continue;
            }
        }

        // Process the feed - create the user
        $user_id = chirostretch_create_user_from_feed($feed, $entry, $form);

        if (is_wp_error($user_id)) {
            return new WP_Error(
                'user_creation_failed',
                'Failed to create user: ' . $user_id->get_error_message(),
                ['status' => 500]
            );
        }

        if ($user_id) {
            $user = get_user_by('ID', $user_id);
            $created_user = [
                'user_id' => $user_id,
                'username' => $user->user_login,
                'email' => $user->user_email,
                'display_name' => $user->display_name,
            ];

            // Update entry with created_by
            GFAPI::update_entry_property($entry_id, 'created_by', $user_id);

            break; // Only process first matching feed
        }
    }

    if ($created_user) {
        return new WP_REST_Response([
            'success' => true,
            'user_id' => $created_user['user_id'],
            'username' => $created_user['username'],
            'email' => $created_user['email'],
            'display_name' => $created_user['display_name'],
            'existing' => false,
            'message' => 'User created successfully',
        ], 201);
    }

    return new WP_Error(
        'no_user_created',
        'No user was created - feed conditions may not have been met',
        ['status' => 400]
    );
}

/**
 * Create a user from a User Registration feed
 */
function chirostretch_create_user_from_feed($feed, $entry, $form) {
    $meta = $feed['meta'];

    // Get field values from entry
    $email = rgar($entry, rgar($meta, 'userEmail'));
    $username = rgar($entry, rgar($meta, 'username')) ?: $email;
    $first_name = rgar($entry, rgar($meta, 'firstName'));
    $last_name = rgar($entry, rgar($meta, 'lastName'));
    $role = rgar($meta, 'role', 'subscriber');

    // Validate required fields
    if (empty($email) || !is_email($email)) {
        return new WP_Error('invalid_email', 'Invalid email address');
    }

    if (email_exists($email)) {
        return new WP_Error('email_exists', 'User with this email already exists');
    }

    // Generate password if not provided
    $password_field = rgar($meta, 'password');
    $password = $password_field ? rgar($entry, $password_field) : wp_generate_password(12, true, true);

    // Sanitize username
    $username = sanitize_user($username, true);
    if (empty($username)) {
        $username = sanitize_user($email, true);
    }

    // Make username unique if needed
    if (username_exists($username)) {
        $username = $username . '_' . wp_rand(100, 999);
    }

    // Build display name
    $display_name = $first_name;
    $displayname_format = rgar($meta, 'displayname', 'firstlast');
    switch ($displayname_format) {
        case 'firstlast':
            $display_name = trim("$first_name $last_name");
            break;
        case 'lastfirst':
            $display_name = trim("$last_name $first_name");
            break;
        case 'firstname':
            $display_name = $first_name;
            break;
        case 'lastname':
            $display_name = $last_name;
            break;
        case 'username':
            $display_name = $username;
            break;
    }

    // Create the user
    $user_data = [
        'user_login' => $username,
        'user_email' => $email,
        'user_pass' => $password,
        'first_name' => $first_name,
        'last_name' => $last_name,
        'display_name' => $display_name ?: $username,
        'role' => $role,
    ];

    $user_id = wp_insert_user($user_data);

    if (is_wp_error($user_id)) {
        return $user_id;
    }

    // Add custom user meta from feed configuration
    $user_meta_config = rgar($meta, 'userMeta', []);
    foreach ($user_meta_config as $meta_item) {
        $meta_key = rgar($meta_item, 'custom_key') ?: rgar($meta_item, 'key');
        $field_id = rgar($meta_item, 'value');

        if ($meta_key && $field_id) {
            $meta_value = rgar($entry, $field_id);
            if ($meta_value !== '') {
                update_user_meta($user_id, $meta_key, $meta_value);
            }
        }
    }

    // Fire action for other plugins/integrations
    do_action('gform_user_registered', $user_id, $feed, $entry, $password);

    return $user_id;
}
