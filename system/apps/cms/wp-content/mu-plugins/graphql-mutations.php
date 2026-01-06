<?php
/**
 * Plugin Name: ChiroStretch GraphQL Mutations
 * Description: Custom GraphQL mutations for CPT management with role-based authorization
 */

if (!defined('ABSPATH')) {
  exit;
}

add_action('graphql_register_types', function () {

  // Register input types for complex fields
  register_graphql_input_type('LocationAddressInput', [
    'description' => 'Input for location address',
    'fields'      => [
      'street'  => ['type' => 'String'],
      'city'    => ['type' => 'String'],
      'state'   => ['type' => 'String'],
      'zipCode' => ['type' => 'String'],
    ],
  ]);

  register_graphql_input_type('LocationHoursInput', [
    'description' => 'Input for location business hours',
    'fields'      => [
      'day'   => ['type' => 'String'],
      'open'  => ['type' => 'String'],
      'close' => ['type' => 'String'],
    ],
  ]);

  // updateFranchiseLocation mutation (named to avoid conflict with auto-generated updateLocation)
  register_graphql_mutation('updateFranchiseLocation', [
    'inputFields'  => [
      'id'          => ['type' => ['non_null' => 'ID']],
      'title'       => ['type' => 'String'],
      'phone'       => ['type' => 'String'],
      'email'       => ['type' => 'String'],
      'description' => ['type' => 'String'],
      'streetAddress' => ['type' => 'String'],
      'city'        => ['type' => 'String'],
      'state'       => ['type' => 'String'],
      'zip'         => ['type' => 'String'],
      'hours'       => ['type' => ['list_of' => 'LocationHoursInput']],
    ],
    'outputFields' => [
      'location' => [
        'type'    => 'Location',
        'resolve' => function ($payload) {
          return new \WPGraphQL\Model\Post(get_post($payload['id']));
        },
      ],
      'success' => ['type' => 'Boolean'],
    ],
    'mutateAndGetPayload' => function ($input, $context) {
      $user = wp_get_current_user();
      if (!$user || !$user->ID) {
        throw new \GraphQL\Error\UserError('Not authenticated');
      }

      $location_id = absint($input['id']);

      // Authorization: must own location or be admin
      if (!chirostretch_user_owns_location($user->ID, $location_id) &&
          !current_user_can('manage_options')) {
        throw new \GraphQL\Error\UserError('Not authorized to edit this location');
      }

      // Update title
      if (isset($input['title'])) {
        wp_update_post(['ID' => $location_id, 'post_title' => sanitize_text_field($input['title'])]);
      }

      // Update post meta fields
      if (isset($input['phone'])) {
        update_post_meta($location_id, 'phone', sanitize_text_field($input['phone']));
      }
      if (isset($input['email'])) {
        update_post_meta($location_id, 'email', sanitize_email($input['email']));
      }
      if (isset($input['description'])) {
        update_post_meta($location_id, 'short_description', sanitize_textarea_field($input['description']));
      }
      if (isset($input['streetAddress'])) {
        update_post_meta($location_id, 'street_address', sanitize_text_field($input['streetAddress']));
      }
      if (isset($input['city'])) {
        update_post_meta($location_id, 'city', sanitize_text_field($input['city']));
      }
      if (isset($input['state'])) {
        update_post_meta($location_id, 'state', sanitize_text_field($input['state']));
      }
      if (isset($input['zip'])) {
        update_post_meta($location_id, 'zip', sanitize_text_field($input['zip']));
      }

      // Update hours (repeater field stored as individual meta entries)
      if (isset($input['hours']) && is_array($input['hours'])) {
        // Clear existing hours
        $i = 0;
        while (get_post_meta($location_id, "hours_{$i}_day", true)) {
          delete_post_meta($location_id, "hours_{$i}_day");
          delete_post_meta($location_id, "hours_{$i}_open");
          delete_post_meta($location_id, "hours_{$i}_close");
          $i++;
        }

        // Set new hours
        foreach ($input['hours'] as $i => $hour) {
          if (isset($hour['day'])) {
            update_post_meta($location_id, "hours_{$i}_day", sanitize_text_field($hour['day']));
          }
          if (isset($hour['open'])) {
            update_post_meta($location_id, "hours_{$i}_open", sanitize_text_field($hour['open']));
          }
          if (isset($hour['close'])) {
            update_post_meta($location_id, "hours_{$i}_close", sanitize_text_field($hour['close']));
          }
        }
      }

      return ['id' => $location_id, 'success' => true];
    },
  ]);

  // updateStaff mutation
  register_graphql_mutation('updateStaff', [
    'inputFields'  => [
      'id'                => ['type' => ['non_null' => 'ID']],
      'bio'               => ['type' => 'String'],
      'headshot'          => ['type' => 'Int'], // media ID
      'acceptingPatients' => ['type' => 'Boolean'],
      'isPublic'          => ['type' => 'Boolean'],
      'credentials'       => ['type' => 'String'],
      'specialties'       => ['type' => ['list_of' => 'String']],
      'servicesOffered'   => ['type' => ['list_of' => 'String']],
      'jobTitle'          => ['type' => 'String'],
    ],
    'outputFields' => [
      'practitioner' => [
        'type'    => 'Practitioner',
        'resolve' => function ($payload) {
          return new \WPGraphQL\Model\Post(get_post($payload['id']));
        },
      ],
      'success' => ['type' => 'Boolean'],
    ],
    'mutateAndGetPayload' => function ($input, $context) {
      $user = wp_get_current_user();
      if (!$user || !$user->ID) {
        throw new \GraphQL\Error\UserError('Not authenticated');
      }

      $staff_id = absint($input['id']);

      $is_admin = current_user_can('manage_options');
      $is_owner = chirostretch_user_owns_staff_location($user->ID, $staff_id);
      $is_self = chirostretch_is_own_staff_profile($user->ID, $staff_id);

      if (!$is_admin && !$is_owner && !$is_self) {
        throw new \GraphQL\Error\UserError('Not authorized to edit this staff profile');
      }

      // Fields anyone with access can edit
      if (isset($input['bio'])) {
        update_field('bio', wp_kses_post($input['bio']), $staff_id);
      }
      if (isset($input['headshot'])) {
        update_field('headshot', absint($input['headshot']), $staff_id);
      }
      if (isset($input['acceptingPatients'])) {
        update_field('accepting_patients', (bool) $input['acceptingPatients'], $staff_id);
      }

      // Fields only franchisee/admin can edit
      if ($is_owner || $is_admin) {
        if (isset($input['isPublic'])) {
          update_field('is_public', (bool) $input['isPublic'], $staff_id);
        }
        if (isset($input['credentials'])) {
          update_field('credentials', sanitize_text_field($input['credentials']), $staff_id);
        }
        if (isset($input['specialties'])) {
          update_field('specialties', array_map('sanitize_text_field', $input['specialties']), $staff_id);
        }
        if (isset($input['servicesOffered'])) {
          update_field('services_offered', array_map('sanitize_text_field', $input['servicesOffered']), $staff_id);
        }
        if (isset($input['jobTitle'])) {
          update_field('job_title', sanitize_text_field($input['jobTitle']), $staff_id);
        }
      }

      return ['id' => $staff_id, 'success' => true];
    },
  ]);

  // createStaff mutation
  register_graphql_mutation('createStaff', [
    'inputFields'  => [
      'title'           => ['type' => ['non_null' => 'String']],
      'email'           => ['type' => ['non_null' => 'String']],
      'staffType'       => ['type' => ['non_null' => 'String']],
      'locationId'      => ['type' => ['non_null' => 'Int']],
      'jobTitle'        => ['type' => 'String'],
      'bio'             => ['type' => 'String'],
      'credentials'     => ['type' => 'String'],
      'servicesOffered' => ['type' => ['list_of' => 'String']],
      'isPublic'        => ['type' => 'Boolean'],
      'acceptingPatients' => ['type' => 'Boolean'],
    ],
    'outputFields' => [
      'practitioner' => [
        'type'    => 'Practitioner',
        'resolve' => function ($payload) {
          return new \WPGraphQL\Model\Post(get_post($payload['id']));
        },
      ],
      'success' => ['type' => 'Boolean'],
    ],
    'mutateAndGetPayload' => function ($input, $context) {
      $user = wp_get_current_user();
      if (!$user || !$user->ID) {
        throw new \GraphQL\Error\UserError('Not authenticated');
      }

      $location_id = absint($input['locationId']);

      // Must own the location or be admin
      if (!chirostretch_user_owns_location($user->ID, $location_id) &&
          !current_user_can('manage_options')) {
        throw new \GraphQL\Error\UserError('Not authorized to create staff for this location');
      }

      // Validate email
      $email = sanitize_email($input['email']);
      if (!is_email($email)) {
        throw new \GraphQL\Error\UserError('Invalid email address');
      }

      // Create post
      $staff_id = wp_insert_post([
        'post_type'   => 'staff',
        'post_title'  => sanitize_text_field($input['title']),
        'post_status' => 'publish',
      ]);

      if (is_wp_error($staff_id)) {
        throw new \GraphQL\Error\UserError($staff_id->get_error_message());
      }

      // Set required fields
      update_field('staff_email', $email, $staff_id);
      update_field('staff_type', sanitize_text_field($input['staffType']), $staff_id);
      update_field('assigned_location', $location_id, $staff_id);

      // Set optional fields
      if (isset($input['jobTitle'])) {
        update_field('job_title', sanitize_text_field($input['jobTitle']), $staff_id);
      }
      if (isset($input['bio'])) {
        update_field('bio', wp_kses_post($input['bio']), $staff_id);
      }
      if (isset($input['credentials'])) {
        update_field('credentials', sanitize_text_field($input['credentials']), $staff_id);
      }
      if (isset($input['servicesOffered'])) {
        update_field('services_offered', array_map('sanitize_text_field', $input['servicesOffered']), $staff_id);
      }
      if (isset($input['isPublic'])) {
        update_field('is_public', (bool) $input['isPublic'], $staff_id);
      }
      if (isset($input['acceptingPatients'])) {
        update_field('accepting_patients', (bool) $input['acceptingPatients'], $staff_id);
      }

      // User auto-creation happens via acf/save_post hook in staff-cpt.php

      return ['id' => $staff_id, 'success' => true];
    },
  ]);

  // deleteStaff mutation
  register_graphql_mutation('deleteStaff', [
    'inputFields'  => [
      'id' => ['type' => ['non_null' => 'ID']],
    ],
    'outputFields' => [
      'deletedId' => ['type' => 'ID'],
      'success'   => ['type' => 'Boolean'],
    ],
    'mutateAndGetPayload' => function ($input, $context) {
      $user = wp_get_current_user();
      if (!$user || !$user->ID) {
        throw new \GraphQL\Error\UserError('Not authenticated');
      }

      $staff_id = absint($input['id']);

      if (!chirostretch_user_owns_staff_location($user->ID, $staff_id) &&
          !current_user_can('manage_options')) {
        throw new \GraphQL\Error\UserError('Not authorized to delete this staff member');
      }

      $result = wp_delete_post($staff_id, true);

      if (!$result) {
        throw new \GraphQL\Error\UserError('Failed to delete staff member');
      }

      return ['deletedId' => $staff_id, 'success' => true];
    },
  ]);
});

/**
 * Helper: Check if user owns location
 */
function chirostretch_user_owns_location($user_id, $location_id) {
  $franchisee = get_field('franchisee', $location_id);
  return $franchisee == $user_id;
}

/**
 * Helper: Check if user owns staff's location
 */
function chirostretch_user_owns_staff_location($user_id, $staff_id) {
  $location_id = get_field('assigned_location', $staff_id);
  if (!$location_id) {
    return false;
  }
  return chirostretch_user_owns_location($user_id, $location_id);
}

/**
 * Helper: Check if staff belongs to user
 */
function chirostretch_is_own_staff_profile($user_id, $staff_id) {
  $linked_user = get_field('user_account', $staff_id);
  return $linked_user == $user_id;
}
