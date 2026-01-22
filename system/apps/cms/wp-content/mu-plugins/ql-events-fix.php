


<?php
/**
 * Plugin Name: ChiroStretch – QL Events Fix
 * Description: Hotfix for ql-events: graphql_data_is_private filter should tolerate array/object payloads.
 */

/**
 * Remove the buggy ql-events callback regardless of when/where it was registered.
 */
function chirostretch_remove_ql_events_is_cpt_private_filter(): void
{
  // Only run if ql-events is active/loaded
  if (!class_exists('WPGraphQL\\QL_Events\\Core_Schema_Filters')) {
    return;
  }

  // Best-effort removal using the exact callback signature ql-events registers.
  remove_filter(
    'graphql_data_is_private',
    ['WPGraphQL\\QL_Events\\Core_Schema_Filters', 'is_cpt_private'],
    10
  );

  // If it was registered at a different priority, scan and remove matching callbacks.
  global $wp_filter;
  if (!isset($wp_filter['graphql_data_is_private'])) {
    return;
  }

  $hook = $wp_filter['graphql_data_is_private'];

  // WP 4.7+ uses WP_Hook objects.
  $callbacks = (is_object($hook) && isset($hook->callbacks)) ? $hook->callbacks : (is_array($hook) ? $hook : null);
  if (!is_array($callbacks)) {
    return;
  }

  foreach ($callbacks as $priority => $group) {
    if (!is_array($group)) {
      continue;
    }

    foreach ($group as $cb) {
      $fn = $cb['function'] ?? null;

      // We only care about static method callbacks: [ClassName, 'method']
      if (!is_array($fn) || count($fn) !== 2) {
        continue;
      }

      if (($fn[0] ?? null) === 'WPGraphQL\\QL_Events\\Core_Schema_Filters' && ($fn[1] ?? null) === 'is_cpt_private') {
        remove_filter('graphql_data_is_private', $fn, (int) $priority);
      }
    }
  }
}

// Run late on normal requests.
add_action('wp_loaded', 'chirostretch_remove_ql_events_is_cpt_private_filter', 1);

// Also run when WPGraphQL initializes (covers cases where filters are added late).
add_action('graphql_init', 'chirostretch_remove_ql_events_is_cpt_private_filter', 1);

// Add our safe replacement. Hook after removals so we don't get removed by mistake.
add_filter('graphql_data_is_private', function (
  $is_private,
  $model_name,
  $data,
  $visibility,
  $owner,
  $current_user
) {
  // Extract ID safely whether $data is an object or array
  $id = null;

  if (is_object($data) && isset($data->ID)) {
    $id = (int) $data->ID;
  } elseif (is_array($data) && isset($data['ID'])) {
    $id = (int) $data['ID'];
  }

  // If we can't determine an ID, don't change the privacy decision
  if (!$id) {
    return $is_private;
  }

  $post_type = get_post_type($id);

  // Match ql-events behavior: TEC post types are never private
  $tec_post_types = [
    \Tribe__Events__Main::POSTTYPE,
    \Tribe__Events__Main::ORGANIZER_POST_TYPE,
    \Tribe__Events__Main::VENUE_POST_TYPE,
  ];

  if (in_array($post_type, $tec_post_types, true)) {
    return false;
  }

  return $is_private;
}, 11, 6);
