<?php
/**
 * Plugin Name: Staff Custom Post Type
 * Description: Registers the 'staff' custom post type for location staff (chiropractors, office managers, etc.)
 * Author: ChiroStretch Dev
 */

if (!defined('ABSPATH')) {
    exit;
}

// Allow staff to view their own profile via GraphQL
add_filter('graphql_data_is_private', function ($is_private, $model_name, $data, $visibility, $owner, $current_user) {
    // Only apply to Post model
    if ('PostObject' !== $model_name) {
        return $is_private;
    }

    // Only apply to staff post type
    if (!isset($data->post_type) || 'staff' !== $data->post_type) {
        return $is_private;
    }

    // Allow if current user is linked to this staff profile
    if ($current_user instanceof \WP_User) {
        $linked_user = get_field('user_account', $data->ID);
        if ($linked_user && (int) $linked_user === $current_user->ID) {
            return false;
        }
    }

    return $is_private;
}, 10, 6);

// Register practitioner role (single role for all staff members)
add_action('init', function () {
    if (!get_role('practitioner')) {
        add_role('practitioner', 'Practitioner', [
            'read'         => true,
            'edit_posts'   => false,
            'delete_posts' => false,
        ]);
    }
});

// Register Staff CPT
add_action('init', function () {
    $labels = [
        'name'               => 'Staff',
        'singular_name'      => 'Staff Member',
        'menu_name'          => 'Staff',
        'add_new'            => 'Add New',
        'add_new_item'       => 'Add New Staff Member',
        'edit_item'          => 'Edit Staff Member',
        'new_item'           => 'New Staff Member',
        'view_item'          => 'View Staff Member',
        'search_items'       => 'Search Staff',
        'not_found'          => 'No staff found',
        'not_found_in_trash' => 'No staff found in trash',
    ];

    register_post_type('staff', [
        'labels'              => $labels,
        'public'              => true,
        'publicly_queryable'  => false, // No frontend single pages
        'exclude_from_search' => true,
        'show_ui'             => true,
        'show_in_menu'        => true,
        'show_in_rest'        => true,
        'menu_position'       => 26,
        'menu_icon'           => 'dashicons-groups',
        'supports'            => ['title', 'thumbnail'],
        'has_archive'         => false,
        'rewrite'             => false,
        'capability_type'     => 'post',
        'map_meta_cap'        => true,
        // WPGraphQL settings
        'show_in_graphql'     => true,
        'graphql_single_name' => 'Practitioner',
        'graphql_plural_name' => 'Practitioners',
    ]);
});

// ACF fields loaded from acf-json/group_staff_details.json

// Expose Practitioner fields to WPGraphQL
// Note: staffType, servicesOffered, specialties removed - now use taxonomies:
// - discipline (single) - via Practitioner.disciplines
// - service (multi) - via Practitioner.services
// - specialty (multi) - via Practitioner.specialties
add_action('graphql_register_types', function () {
    // Assigned Location
    register_graphql_field('Practitioner', 'assignedLocation', [
        'type'        => 'Location',
        'description' => 'The location this staff member works at',
        'resolve'     => function ($post, $args, $context) {
            $location_id = get_field('assigned_location', $post->databaseId);
            if (!$location_id) {
                return null;
            }
            return $context->get_loader('post')->load_deferred($location_id);
        },
    ]);

    // Job Title
    register_graphql_field('Practitioner', 'jobTitle', [
        'type'        => 'String',
        'description' => 'Job title',
        'resolve'     => function ($post) {
            return get_field('job_title', $post->databaseId) ?: '';
        },
    ]);

    // Credentials
    register_graphql_field('Practitioner', 'credentials', [
        'type'        => 'String',
        'description' => 'Professional credentials (DC, CCSP, etc.)',
        'resolve'     => function ($post) {
            return get_field('credentials', $post->databaseId) ?: '';
        },
    ]);

    // Bio
    register_graphql_field('Practitioner', 'bio', [
        'type'        => 'String',
        'description' => 'Biography',
        'resolve'     => function ($post) {
            return get_field('bio', $post->databaseId) ?: '';
        },
    ]);

    // Headshot
    register_graphql_field('Practitioner', 'headshot', [
        'type'        => 'MediaItem',
        'description' => 'Headshot image',
        'resolve'     => function ($post, $args, $context) {
            $image = get_field('headshot', $post->databaseId);
            if (!$image || !isset($image['ID'])) {
                return null;
            }
            return $context->get_loader('post')->load_deferred($image['ID']);
        },
    ]);

    // Accepting Patients
    register_graphql_field('Practitioner', 'acceptingPatients', [
        'type'        => 'Boolean',
        'description' => 'Whether accepting new patients',
        'resolve'     => function ($post) {
            return (bool) get_field('accepting_patients', $post->databaseId);
        },
    ]);

    // Is Public
    register_graphql_field('Practitioner', 'isPublic', [
        'type'        => 'Boolean',
        'description' => 'Whether displayed publicly on website',
        'resolve'     => function ($post) {
            return (bool) get_field('is_public', $post->databaseId);
        },
    ]);
});

// Add connection from Location to Practitioners
add_action('graphql_register_types', function () {
    // All practitioners at a location (public and non-public)
    register_graphql_connection([
        'fromType'      => 'Location',
        'toType'        => 'Practitioner',
        'fromFieldName' => 'allPractitioners',
        'resolve'       => function ($location, $args, $context, $info) {
            $resolver = new \WPGraphQL\Data\Connection\PostObjectConnectionResolver($location, $args, $context, $info, 'staff');
            $resolver->set_query_arg('post_status', 'publish');
            $resolver->set_query_arg('meta_query', [
                [
                    'key'     => 'assigned_location',
                    'value'   => (string) $location->databaseId,
                    'compare' => '=',
                ],
            ]);
            return $resolver->get_connection();
        },
    ]);

    // Public practitioners at a location (for website display)
    register_graphql_connection([
        'fromType'      => 'Location',
        'toType'        => 'Practitioner',
        'fromFieldName' => 'practitioners',
        'resolve'       => function ($location, $args, $context, $info) {
            $resolver = new \WPGraphQL\Data\Connection\PostObjectConnectionResolver($location, $args, $context, $info, 'staff');
            $resolver->set_query_arg('post_status', 'publish');
            $resolver->set_query_arg('meta_query', [
                'relation' => 'AND',
                [
                    'key'     => 'assigned_location',
                    'value'   => (string) $location->databaseId,
                    'compare' => '=',
                ],
                [
                    'key'     => 'is_public',
                    'value'   => '1',
                    'compare' => '=',
                ],
            ]);
            return $resolver->get_connection();
        },
    ]);
});

// Add practitionerProfile field to User type (for viewer.practitionerProfile query)
add_action('graphql_register_types', function () {
    register_graphql_field('User', 'practitionerProfile', [
        'type'        => 'Practitioner',
        'description' => 'Staff profile linked to this user account',
        'resolve'     => function ($user, $args, $context) {
            $staff_posts = get_posts([
                'post_type'      => 'staff',
                'posts_per_page' => 1,
                'post_status'    => 'publish',
                'meta_query'     => [
                    [
                        'key'     => 'user_account',
                        'value'   => $user->databaseId,
                        'compare' => '=',
                    ],
                ],
            ]);
            if (empty($staff_posts)) {
                return null;
            }
            return new \WPGraphQL\Model\Post($staff_posts[0]);
        },
    ]);
});

// Display staff info on user profile page
add_action('show_user_profile', 'display_staff_info_on_profile');
add_action('edit_user_profile', 'display_staff_info_on_profile');

function display_staff_info_on_profile($user) {
    // Find the user's staff profile
    $staff_posts = get_posts([
        'post_type'      => 'staff',
        'posts_per_page' => 1,
        'post_status'    => 'publish',
        'meta_query'     => [
            [
                'key'     => 'user_account',
                'value'   => $user->ID,
                'compare' => '=',
            ],
        ],
    ]);

    if (empty($staff_posts)) {
        return;
    }

    $staff = $staff_posts[0];
    $staff_type = get_field('staff_type', $staff->ID);
    $location_id = get_field('assigned_location', $staff->ID);
    $location = $location_id ? get_post($location_id) : null;
    $job_title = get_field('job_title', $staff->ID);

    $type_labels = [
        'chiropractor'       => 'Chiropractor',
        'physical_therapist' => 'Physical Therapist',
        'massage_therapist'  => 'Massage Therapist',
        'athletic_therapist' => 'Athletic Therapist',
    ];
    ?>
    <h2>Staff Profile</h2>
    <table class="form-table">
        <tr>
            <th><label>Role</label></th>
            <td><?php echo esc_html($type_labels[$staff_type] ?? $staff_type); ?></td>
        </tr>
        <?php if ($job_title): ?>
        <tr>
            <th><label>Job Title</label></th>
            <td><?php echo esc_html($job_title); ?></td>
        </tr>
        <?php endif; ?>
        <?php if ($location): ?>
        <tr>
            <th><label>Location</label></th>
            <td>
                <a href="<?php echo esc_url(get_edit_post_link($location->ID)); ?>">
                    <?php echo esc_html($location->post_title); ?>
                </a>
            </td>
        </tr>
        <?php endif; ?>
        <tr>
            <th><label>Staff Profile</label></th>
            <td>
                <a href="<?php echo esc_url(get_edit_post_link($staff->ID)); ?>">Edit Staff Profile</a>
            </td>
        </tr>
    </table>
    <?php
}

// Auto-create WordPress user when Staff is published
add_action('acf/save_post', 'chirostretch_auto_create_staff_user', 20);

function chirostretch_auto_create_staff_user($post_id) {
    // Only for staff post type
    if (get_post_type($post_id) !== 'staff') {
        return;
    }

    // Only on publish (not draft/auto-draft)
    if (get_post_status($post_id) !== 'publish') {
        return;
    }

    // Skip if user already linked
    $existing_user = get_field('user_account', $post_id);
    if ($existing_user) {
        return;
    }

    // Get email from Staff CPT
    $email = get_field('staff_email', $post_id);
    if (!$email || !is_email($email)) {
        return;
    }

    // Check if user with this email already exists
    $existing = get_user_by('email', $email);
    if ($existing) {
        // Link existing user to this Staff profile
        update_field('user_account', $existing->ID, $post_id);
        return;
    }

    // All staff get the practitioner role
    $role = 'practitioner';

    // Get name from post title
    $post = get_post($post_id);
    $name_parts = explode(' ', $post->post_title, 2);
    $first_name = $name_parts[0] ?? '';
    $last_name = $name_parts[1] ?? '';

    // Create WP user
    $password = wp_generate_password(16, true, true);
    $user_id = wp_insert_user([
        'user_login'   => $email,
        'user_email'   => $email,
        'user_pass'    => $password,
        'first_name'   => $first_name,
        'last_name'    => $last_name,
        'display_name' => $post->post_title,
        'role'         => $role,
    ]);

    if (is_wp_error($user_id)) {
        error_log('Staff user creation failed: ' . $user_id->get_error_message());
        return;
    }

    // Link user to Staff CPT
    update_field('user_account', $user_id, $post_id);

    // Send password reset email
    wp_new_user_notification($user_id, null, 'user');
}

// Expose practitioner email via GraphQL
add_action('graphql_register_types', function () {
    register_graphql_field('Practitioner', 'email', [
        'type'        => 'String',
        'description' => 'Staff email address',
        'resolve'     => function ($post) {
            return get_field('staff_email', $post->databaseId) ?: '';
        },
    ]);
});
