<?php
/**
 * Franchise Application CPT
 *
 * Registers the franchise_application post type and ACF fields.
 * Applications are created via Gravity Forms Advanced Post Creation feed.
 *
 * IMPORTANT: Applicants do NOT get WordPress user accounts.
 * User accounts are created only upon approval.
 *
 * @see Access & Identity Charter
 */

defined('ABSPATH') || exit;

// ============================================================================
// ROLE REGISTRATION
// ============================================================================

add_action('init', function () {
  // Franchisee role - created upon approval
  if (!get_role('franchisee')) {
    add_role('franchisee', 'Franchisee', [
      'read' => true,
      'edit_posts' => false,
      'delete_posts' => false,
    ]);
  }

  // Remove legacy franchise_applicant role if it exists
  // Applicants no longer get user accounts
  if (get_role('franchise_applicant')) {
    remove_role('franchise_applicant');
  }
});

// ============================================================================
// CPT REGISTRATION
// ============================================================================

add_action('init', function () {
  register_post_type('franchise_app', [
    'labels' => [
      'name' => 'Franchise Applications',
      'singular_name' => 'Franchise Application',
      'add_new' => 'Add New',
      'add_new_item' => 'Add New Application',
      'edit_item' => 'Edit Application',
      'new_item' => 'New Application',
      'view_item' => 'View Application',
      'search_items' => 'Search Applications',
      'not_found' => 'No applications found',
      'not_found_in_trash' => 'No applications found in trash',
      'menu_name' => 'Franchise Apps',
    ],
    'public' => false,
    'publicly_queryable' => false,
    'show_ui' => true,
    'show_in_menu' => true,
    'show_in_rest' => true,
    'menu_position' => 25,
    'menu_icon' => 'dashicons-feedback',
    'supports' => ['title'],
    'has_archive' => false,
    'rewrite' => false,
    'capability_type' => 'post',
    'map_meta_cap' => true,
    'show_in_graphql' => true,
    'graphql_single_name' => 'franchiseApplication',
    'graphql_plural_name' => 'franchiseApplications',
  ]);
});

// ============================================================================
// ACF FIELDS
// ============================================================================

add_action('acf/init', function () {
  if (!function_exists('acf_add_local_field_group')) {
    return;
  }

  acf_add_local_field_group([
    'key' => 'group_franchise_application',
    'title' => 'Application Details',
    'fields' => [
      // Applicant Contact Info (stored here, not in a user account)
      [
        'key' => 'field_applicant_email',
        'label' => 'Email',
        'name' => 'applicant_email',
        'type' => 'email',
        'required' => 1,
      ],
      [
        'key' => 'field_applicant_first_name',
        'label' => 'First Name',
        'name' => 'applicant_first_name',
        'type' => 'text',
        'required' => 1,
      ],
      [
        'key' => 'field_applicant_last_name',
        'label' => 'Last Name',
        'name' => 'applicant_last_name',
        'type' => 'text',
      ],
      [
        'key' => 'field_applicant_phone',
        'label' => 'Phone Number',
        'name' => 'applicant_phone',
        'type' => 'text',
      ],
      // Application Status
      [
        'key' => 'field_application_status',
        'label' => 'Application Status',
        'name' => 'application_status',
        'type' => 'select',
        'choices' => [
          'pending' => 'Pending Review',
          'reviewing' => 'Under Review',
          'approved' => 'Approved',
          'rejected' => 'Rejected',
          'withdrawn' => 'Withdrawn',
        ],
        'default_value' => 'pending',
        'required' => 1,
      ],
      [
        'key' => 'field_submitted_date',
        'label' => 'Submitted Date',
        'name' => 'submitted_date',
        'type' => 'date_picker',
        'display_format' => 'F j, Y',
        'return_format' => 'Y-m-d',
      ],
      [
        'key' => 'field_gf_entry_id',
        'label' => 'Gravity Forms Entry ID',
        'name' => 'gf_entry_id',
        'type' => 'number',
        'instructions' => 'Automatically populated by Gravity Forms',
        'readonly' => 1,
      ],
      // Application Details
      [
        'key' => 'field_applicant_location',
        'label' => 'Desired Location/Territory',
        'name' => 'applicant_location',
        'type' => 'text',
      ],
      [
        'key' => 'field_investment_range',
        'label' => 'Investment Range',
        'name' => 'investment_range',
        'type' => 'select',
        'choices' => [
          '50k-100k' => '$50,000 - $100,000',
          '100k-250k' => '$100,000 - $250,000',
          '250k-500k' => '$250,000 - $500,000',
          '500k+' => '$500,000+',
        ],
        'allow_null' => 1,
      ],
      [
        'key' => 'field_experience',
        'label' => 'Relevant Experience',
        'name' => 'experience',
        'type' => 'textarea',
        'rows' => 3,
      ],
      // Admin Fields
      [
        'key' => 'field_internal_notes',
        'label' => 'Internal Notes',
        'name' => 'internal_notes',
        'type' => 'textarea',
        'rows' => 4,
        'instructions' => 'Notes visible only to administrators',
      ],
      [
        'key' => 'field_assigned_location',
        'label' => 'Assigned Location',
        'name' => 'assigned_location',
        'type' => 'post_object',
        'post_type' => ['location'],
        'return_format' => 'id',
        'instructions' => 'Select the location to assign to this franchisee when approved',
      ],
      [
        'key' => 'field_franchisee_user_id',
        'label' => 'Franchisee User ID',
        'name' => 'franchisee_user_id',
        'type' => 'number',
        'instructions' => 'WordPress user ID (populated upon approval)',
        'readonly' => 1,
      ],
      // Status Token Fields (for unauthenticated status checking)
      [
        'key' => 'field_status_token_hash',
        'label' => 'Status Token Hash',
        'name' => 'status_token_hash',
        'type' => 'text',
        'instructions' => 'SHA-256 hash of status link token (system-managed)',
        'readonly' => 1,
      ],
      [
        'key' => 'field_status_token_valid',
        'label' => 'Status Token Valid',
        'name' => 'status_token_valid',
        'type' => 'true_false',
        'default_value' => 0,
        'instructions' => 'Whether the status token is currently valid',
        'readonly' => 1,
      ],
    ],
    'location' => [
      [
        [
          'param' => 'post_type',
          'operator' => '==',
          'value' => 'franchise_app',
        ],
      ],
    ],
    'menu_order' => 0,
    'position' => 'normal',
    'style' => 'default',
    'label_placement' => 'top',
  ]);
});

// ============================================================================
// APPROVAL → CREATE USER
// ============================================================================

/**
 * Create user when application is approved
 *
 * User creation is event-driven, not speculative.
 * The user account is created only upon explicit approval.
 */
add_filter('acf/update_value/name=application_status', function ($value, $post_id, $field) {
  if (get_post_type($post_id) !== 'franchise_app') {
    return $value;
  }

  $old_value = get_field('application_status', $post_id);

  // Only act if status is changing TO approved
  if ($value !== 'approved' || $old_value === 'approved') {
    return $value;
  }

  // Check if user already exists for this application
  $existing_user_id = get_field('franchisee_user_id', $post_id);
  if ($existing_user_id && get_userdata($existing_user_id)) {
    error_log("[Franchise App] User already exists for post_id: $post_id");
    return $value;
  }

  // Get applicant info
  $email = get_field('applicant_email', $post_id);
  $first_name = get_field('applicant_first_name', $post_id);
  $last_name = get_field('applicant_last_name', $post_id);

  if (!$email) {
    error_log("[Franchise App] Cannot create user - no email for post_id: $post_id");
    return $value;
  }

  // Check if user with this email already exists
  $existing_user = get_user_by('email', $email);
  if ($existing_user) {
    // Link existing user to this application
    $user_id = $existing_user->ID;
    $existing_user->add_role('franchisee');
    error_log("[Franchise App] Linked existing user $user_id to application post_id: $post_id");
  } else {
    // Create new user
    $username = sanitize_user(strtolower($first_name . '.' . $last_name), true);
    $username = chirostretch_ensure_unique_username($username);

    $user_id = wp_insert_user([
      'user_login' => $username,
      'user_email' => $email,
      'first_name' => $first_name,
      'last_name' => $last_name,
      'display_name' => trim("$first_name $last_name"),
      'role' => 'franchisee',
      'user_pass' => wp_generate_password(24),
    ]);

    if (is_wp_error($user_id)) {
      error_log("[Franchise App] Failed to create user: " . $user_id->get_error_message());
      return $value;
    }

    // Send password reset email so user can set their password
    wp_send_new_user_notifications($user_id, 'user');

    error_log("[Franchise App] Created user $user_id for approved application post_id: $post_id");
  }

  // Store user ID in application
  update_field('franchisee_user_id', $user_id, $post_id);

  // Link franchisee to assigned location
  $location_id = get_field('assigned_location', $post_id);
  if ($location_id) {
    update_field('franchisee', $user_id, $location_id);
    error_log("[Franchise App] Linked user $user_id to location $location_id");
  }

  // Invalidate status token on approval
  update_field('status_token_valid', 0, $post_id);
  error_log("[Franchise App] Invalidated status token for post_id: $post_id (approved)");

  return $value;
}, 10, 3);

/**
 * Invalidate status token on terminal statuses (rejected, withdrawn)
 */
add_filter('acf/update_value/name=application_status', function ($value, $post_id, $field) {
  if (get_post_type($post_id) !== 'franchise_app') {
    return $value;
  }

  $terminal_statuses = ['rejected', 'withdrawn'];
  if (in_array($value, $terminal_statuses, true)) {
    update_field('status_token_valid', 0, $post_id);
    error_log("[Franchise App] Invalidated status token for post_id: $post_id (status: $value)");
  }

  return $value;
}, 20, 3); // Priority 20 to run after the approval hook

/**
 * Generate unique username
 */
function chirostretch_ensure_unique_username($username) {
  $base_username = $username ?: 'franchisee';
  $username = $base_username;
  $counter = 1;

  while (username_exists($username)) {
    $username = $base_username . $counter;
    $counter++;
  }

  return $username;
}

// ============================================================================
// ADMIN UI ENHANCEMENTS
// ============================================================================

/**
 * Add custom columns to franchise applications list
 */
add_filter('manage_franchise_app_posts_columns', function ($columns) {
  $new_columns = [];
  foreach ($columns as $key => $value) {
    if ($key === 'title') {
      $new_columns[$key] = $value;
      $new_columns['applicant_email'] = 'Email';
      $new_columns['application_status'] = 'Status';
      $new_columns['submitted_date'] = 'Submitted';
    } elseif ($key !== 'author' && $key !== 'date') {
      $new_columns[$key] = $value;
    }
  }
  return $new_columns;
});

add_action('manage_franchise_app_posts_custom_column', function ($column, $post_id) {
  switch ($column) {
    case 'applicant_email':
      echo esc_html(get_field('applicant_email', $post_id) ?: '—');
      break;
    case 'application_status':
      $status = get_field('application_status', $post_id) ?: 'pending';
      $labels = [
        'pending' => '<span style="color:#996800">Pending</span>',
        'reviewing' => '<span style="color:#0073aa">Reviewing</span>',
        'approved' => '<span style="color:#008a00">Approved</span>',
        'rejected' => '<span style="color:#a00">Rejected</span>',
        'withdrawn' => '<span style="color:#666">Withdrawn</span>',
      ];
      echo $labels[$status] ?? esc_html($status);
      break;
    case 'submitted_date':
      $date = get_field('submitted_date', $post_id);
      echo $date ? esc_html(date('M j, Y', strtotime($date))) : '—';
      break;
  }
}, 10, 2);

// ============================================================================
// GRAPHQL INTEGRATION
// ============================================================================

add_action('graphql_register_types', function () {
  // Expose ACF fields
  register_graphql_field('FranchiseApplication', 'applicationStatus', [
    'type' => 'String',
    'description' => 'Current status of the application',
    'resolve' => function ($post) {
      return get_field('application_status', $post->databaseId) ?: 'pending';
    },
  ]);

  register_graphql_field('FranchiseApplication', 'submittedDate', [
    'type' => 'String',
    'description' => 'Date the application was submitted',
    'resolve' => function ($post) {
      return get_field('submitted_date', $post->databaseId) ?: '';
    },
  ]);

  register_graphql_field('FranchiseApplication', 'applicantEmail', [
    'type' => 'String',
    'description' => 'Applicant email address',
    'resolve' => function ($post) {
      return get_field('applicant_email', $post->databaseId) ?: '';
    },
  ]);

  register_graphql_field('FranchiseApplication', 'applicantLocation', [
    'type' => 'String',
    'description' => 'Desired franchise location/territory',
    'resolve' => function ($post) {
      return get_field('applicant_location', $post->databaseId) ?: '';
    },
  ]);

  // Connection from User to their franchise applications (for approved franchisees)
  register_graphql_connection([
    'fromType' => 'User',
    'toType' => 'FranchiseApplication',
    'fromFieldName' => 'franchiseApplications',
    'connectionArgs' => \WPGraphQL\Connection\PostObjects::get_connection_args(),
    'resolve' => function ($user, $args, $context, $info) {
      $resolver = new \WPGraphQL\Data\Connection\PostObjectConnectionResolver($user, $args, $context, $info, 'franchise_app');
      // Find applications where this user is the approved franchisee
      $resolver->set_query_arg('meta_query', [
        [
          'key' => 'franchisee_user_id',
          'value' => $user->databaseId,
          'compare' => '=',
        ],
      ]);
      return $resolver->get_connection();
    },
  ]);
});

// ============================================================================
// STATUS TOKEN GENERATION
// ============================================================================

/**
 * Generate status token after franchise application post is created
 *
 * Hooks into Gravity Forms Advanced Post Creation.
 * Form ID 16 creates franchise_app posts via APC feed.
 *
 * @see Access & Identity Charter - Tokenized Applicant Status Flow
 */
add_action('gform_advancedpostcreation_post_after_creation', function ($post_id, $feed, $entry, $form) {
  // Only for form 16 (franchise application)
  if ($form['id'] != 16) {
    return;
  }

  // Verify this is a franchise_app post
  if (get_post_type($post_id) !== 'franchise_app') {
    return;
  }

  // Generate cryptographically secure token (32 bytes = 64 hex chars)
  $raw_token = bin2hex(random_bytes(32));
  $token_hash = hash('sha256', $raw_token);

  // Store hash and mark valid
  update_field('status_token_hash', $token_hash, $post_id);
  update_field('status_token_valid', 1, $post_id);

  // Store raw token URL in GF entry meta for merge tag
  if (function_exists('gform_update_meta')) {
    $status_url = home_url('/application-status/' . $raw_token);
    gform_update_meta($entry['id'], 'status_link', $status_url);
  }

  // Trigger the confirmation notification
  chirostretch_trigger_application_notification($entry['id'], $form['id']);

  error_log("[Franchise App] Generated status token for post_id: $post_id");
}, 10, 4);

/**
 * Trigger the "Application Received" notification
 */
function chirostretch_trigger_application_notification($entry_id, $form_id = null) {
  if (!class_exists('GFAPI')) {
    return false;
  }

  $entry = GFAPI::get_entry($entry_id);
  if (is_wp_error($entry)) {
    return false;
  }

  $form_id = $form_id ?: $entry['form_id'];
  $form = GFAPI::get_form($form_id);
  if (!$form) {
    return false;
  }

  // Find notification named "Application Received"
  $notifications = $form['notifications'] ?? [];
  foreach ($notifications as $notification) {
    if ($notification['name'] === 'Application Received' && $notification['isActive']) {
      GFCommon::send_notification($notification, $form, $entry);
      error_log("[Franchise App] Sent 'Application Received' notification for entry: $entry_id");
      return true;
    }
  }

  error_log("[Franchise App] No active 'Application Received' notification found for form: $form_id");
  return false;
}

// ============================================================================
// GRAVITY FORMS MERGE TAGS
// ============================================================================

/**
 * Register custom merge tags for franchise application notifications
 */
add_filter('gform_custom_merge_tags', function ($merge_tags, $form_id, $fields, $element_id) {
  // Only for form 16
  if ($form_id != 16) {
    return $merge_tags;
  }

  $merge_tags[] = ['label' => 'Application Status Link', 'tag' => '{status_link}'];
  return $merge_tags;
}, 10, 4);

/**
 * Replace status_link merge tag with entry meta value
 */
add_filter('gform_replace_merge_tags', function ($text, $form, $entry, $url_encode, $esc_html, $nl2br, $format) {
  if (!$entry || strpos($text, '{status_link}') === false) {
    return $text;
  }

  // Only for form 16
  if ($form['id'] != 16) {
    return $text;
  }

  $entry_id = rgar($entry, 'id');
  $status_link = gform_get_meta($entry_id, 'status_link') ?: '';

  return str_replace('{status_link}', $status_link, $text);
}, 10, 7);
