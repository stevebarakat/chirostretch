<?php
/**
 * Plugin Name: Locations Custom Post Type
 * Description: Registers the 'location' custom post type for ChiroStretch global clinics.
 * Author: ChiroStretch Dev
 */

if (!defined('ABSPATH'))
  exit;

/**
 * Register Location CPT
 */
function chiro_register_location_cpt()
{

  $labels = array(
    'name' => 'Locations',
    'singular_name' => 'Location',
    'menu_name' => 'Locations',
    'add_new' => 'Add New Location',
    'add_new_item' => 'Add New Location',
    'edit_item' => 'Edit Location',
    'new_item' => 'New Location',
    'view_item' => 'View Location',
    'search_items' => 'Search Locations',
    'not_found' => 'No locations found',
    'not_found_in_trash' => 'No locations found in Trash'
  );

  $args = array(
    'labels' => $labels,
    'public' => true,
    'has_archive' => true,
    'menu_icon' => 'dashicons-location-alt',
    'rewrite' => array('slug' => 'locations'),
    'supports' => array('title', 'editor', 'thumbnail'),
    'show_in_graphql' => true,
    'graphql_single_name' => 'Location',
    'graphql_plural_name' => 'Locations',
  );

  register_post_type('location', $args);
}
add_action('init', 'chiro_register_location_cpt');

// Register Franchisee field for Locations
add_action('acf/init', function () {
  if (!function_exists('acf_add_local_field_group')) {
    return;
  }

  acf_add_local_field_group([
    'key'      => 'group_location_franchise',
    'title'    => 'Franchise Management',
    'fields'   => [
      [
        'key'           => 'field_location_franchisee',
        'label'         => 'Franchisee',
        'name'          => 'franchisee',
        'type'          => 'user',
        'role'          => ['franchisee'],
        'return_format' => 'id',
        'instructions'  => 'The franchisee who owns this location',
      ],
    ],
    'location' => [
      [
        [
          'param'    => 'post_type',
          'operator' => '==',
          'value'    => 'location',
        ],
      ],
    ],
    'menu_order'      => 100,
    'position'        => 'side',
    'style'           => 'default',
    'label_placement' => 'top',
  ]);
});

// Expose Location fields to WPGraphQL
add_action('graphql_register_types', function () {
  // Franchisee
  register_graphql_field('Location', 'franchisee', [
    'type'        => 'User',
    'description' => 'The franchisee who owns this location',
    'resolve'     => function ($post, $args, $context) {
      $user_id = get_field('franchisee', $post->databaseId);
      if (!$user_id) {
        return null;
      }
      return $context->get_loader('user')->load_deferred($user_id);
    },
  ]);

  // Street Address
  register_graphql_field('Location', 'streetAddress', [
    'type'        => 'String',
    'description' => 'Street address',
    'resolve'     => function ($post) {
      return get_post_meta($post->databaseId, 'street_address', true) ?: '';
    },
  ]);

  // City
  register_graphql_field('Location', 'city', [
    'type'        => 'String',
    'description' => 'City',
    'resolve'     => function ($post) {
      return get_post_meta($post->databaseId, 'city', true) ?: '';
    },
  ]);

  // State
  register_graphql_field('Location', 'state', [
    'type'        => 'String',
    'description' => 'State',
    'resolve'     => function ($post) {
      return get_post_meta($post->databaseId, 'state', true) ?: '';
    },
  ]);

  // Zip
  register_graphql_field('Location', 'zip', [
    'type'        => 'String',
    'description' => 'Zip code',
    'resolve'     => function ($post) {
      return get_post_meta($post->databaseId, 'zip', true) ?: '';
    },
  ]);

  // Phone
  register_graphql_field('Location', 'phone', [
    'type'        => 'String',
    'description' => 'Phone number',
    'resolve'     => function ($post) {
      return get_post_meta($post->databaseId, 'phone', true) ?: '';
    },
  ]);

  // Email
  register_graphql_field('Location', 'email', [
    'type'        => 'String',
    'description' => 'Email address',
    'resolve'     => function ($post) {
      return get_post_meta($post->databaseId, 'email', true) ?: '';
    },
  ]);

  // Short Description
  register_graphql_field('Location', 'shortDescription', [
    'type'        => 'String',
    'description' => 'Short description for the location',
    'resolve'     => function ($post) {
      return get_post_meta($post->databaseId, 'short_description', true) ?: '';
    },
  ]);

  // Coordinates type
  register_graphql_object_type('LocationCoordinates', [
    'description' => 'Geographic coordinates',
    'fields'      => [
      'lat' => ['type' => 'Float', 'description' => 'Latitude'],
      'lng' => ['type' => 'Float', 'description' => 'Longitude'],
    ],
  ]);

  // Coordinates
  register_graphql_field('Location', 'coordinates', [
    'type'        => 'LocationCoordinates',
    'description' => 'Geographic coordinates',
    'resolve'     => function ($post) {
      $lat = get_post_meta($post->databaseId, 'coordinates_lat', true);
      $lng = get_post_meta($post->databaseId, 'coordinates_lng', true);
      if (!$lat && !$lng) {
        return null;
      }
      return [
        'lat' => $lat ? (float) $lat : null,
        'lng' => $lng ? (float) $lng : null,
      ];
    },
  ]);

  // Hours type
  register_graphql_object_type('LocationHours', [
    'description' => 'Business hours for a day',
    'fields'      => [
      'day'   => ['type' => 'String', 'description' => 'Day of the week'],
      'open'  => ['type' => 'String', 'description' => 'Opening time'],
      'close' => ['type' => 'String', 'description' => 'Closing time'],
    ],
  ]);

  // Hours
  register_graphql_field('Location', 'hours', [
    'type'        => ['list_of' => 'LocationHours'],
    'description' => 'Business hours',
    'resolve'     => function ($post) {
      $hours = [];
      $i = 0;
      while (true) {
        $day = get_post_meta($post->databaseId, "hours_{$i}_day", true);
        if (!$day) {
          break;
        }
        $hours[] = [
          'day'   => $day,
          'open'  => get_post_meta($post->databaseId, "hours_{$i}_open", true) ?: '',
          'close' => get_post_meta($post->databaseId, "hours_{$i}_close", true) ?: '',
        ];
        $i++;
      }
      return $hours;
    },
  ]);

  // Franchise Location - get location owned by franchisee
  register_graphql_field('User', 'franchiseLocation', [
    'type'        => 'Location',
    'description' => 'Location owned by this franchisee',
    'resolve'     => function ($user, $args, $context) {
      $locations = get_posts([
        'post_type'      => 'location',
        'posts_per_page' => 1,
        'post_status'    => 'publish',
        'meta_query'     => [[
          'key'   => 'franchisee',
          'value' => $user->databaseId,
        ]],
      ]);
      if (empty($locations)) {
        return null;
      }
      return new \WPGraphQL\Model\Post($locations[0]);
    },
  ]);

  // Services Offered (computed from staff at this location)
  register_graphql_field('Location', 'servicesOffered', [
    'type'        => ['list_of' => 'String'],
    'description' => 'Services offered at this location (computed from staff)',
    'resolve'     => function ($post) {
      // Priority order for services (core services first, then others)
      $priority_order = [
        'Chiropractic'    => 1,
        'Stretch Therapy' => 2,
        'Massage'         => 3,
        'Sports Medicine' => 4,
      ];

      $staff = get_posts([
        'post_type'      => 'practitioner',
        'posts_per_page' => -1,
        'post_status'    => 'publish',
        'meta_query'     => [[
          'key'   => 'assigned_location',
          'value' => $post->databaseId,
        ]],
      ]);

      $services = [];
      foreach ($staff as $member) {
        $service_terms = wp_get_object_terms($member->ID, 'service', ['fields' => 'names']);
        if (!empty($service_terms) && !is_wp_error($service_terms)) {
          $services = array_merge($services, $service_terms);
        }
      }

      // Dedupe
      $services = array_values(array_unique($services));

      // Sort: prioritized services first, then others alphabetically
      usort($services, function ($a, $b) use ($priority_order) {
        $pa = $priority_order[$a] ?? 100;
        $pb = $priority_order[$b] ?? 100;
        if ($pa !== $pb) {
          return $pa - $pb;
        }
        return strcmp($a, $b);
      });

      return $services;
    },
  ]);
});
