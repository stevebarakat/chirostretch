<?php
/**
 * Plugin Name: ChiroStretch – QL Events resolve_post_object Compat
 * Description: Suppresses DataSource::resolve_post_object deprecation notices from ql-events
 *              until the plugin is updated to use $context->get_loader('post')->load_deferred().
 *
 * The deprecated method still works (it internally calls the new API), so this just
 * silences the _doing_it_wrong() notice to reduce log noise.
 *
 * Affected files in ql-events:
 *   - includes/types/object/common/trait-attendee.php (event field)
 *   - includes/types/object/class-event-type.php (venue field)
 *   - includes/types/object/class-paypalattendee-type.php (ticket, order fields)
 *   - includes/types/object/class-rsvpattendee-type.php (ticket field)
 */

defined('ABSPATH') || exit;

/**
 * Suppress _doing_it_wrong notices for deprecated WPGraphQL DataSource methods
 * that ql-events still uses.
 *
 * @param bool   $trigger       Whether to trigger the error.
 * @param string $function_name The function that was called incorrectly.
 * @param string $message       The error message.
 * @param string $version       The version since which the message was added.
 * @return bool
 */
function chirostretch_suppress_ql_events_deprecation_notices(
    bool $trigger,
    string $function_name,
    string $message,
    string $version
): bool {
    // List of deprecated DataSource methods that ql-events uses
    $suppressed_methods = [
        'WPGraphQL\Data\DataSource::resolve_post_object',
        'WPGraphQL\Data\DataSource::resolve_menu_item',
    ];

    if (in_array($function_name, $suppressed_methods, true)) {
        return false;
    }

    return $trigger;
}

add_filter('doing_it_wrong_trigger_error', 'chirostretch_suppress_ql_events_deprecation_notices', 10, 4);
