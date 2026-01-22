<?php
/**
 * Plugin Name: ChiroStretch – GraphQL Data Loaders Compat Shim
 * Description: Suppresses graphql_data_loaders deprecation warnings from plugins that haven't
 *              updated to use graphql_data_loader_classes yet.
 *
 * Note: We can't migrate these plugins to the new API because their loaders have non-standard
 * constructors (e.g., WC_Db_Loader expects 2 args, but the new API only passes 1).
 * So we keep the deprecated hooks working and just suppress the deprecation notice.
 *
 * Affected plugins:
 *   - wp-graphql-woocommerce (WooGraphQL)
 *   - wp-graphql-gravity-forms
 *   - wpgraphql-acf
 *
 * @see https://github.com/wp-graphql/wp-graphql/blob/develop/src/AppContext.php
 */

defined('ABSPATH') || exit;

/**
 * Custom error handler to suppress specific deprecation notices.
 *
 * WordPress's deprecated_hook_trigger_error filter doesn't pass the hook name,
 * so we use a custom error handler to check the message content instead.
 *
 * @param int    $errno   Error level.
 * @param string $errstr  Error message.
 * @param string $errfile File where error occurred.
 * @param int    $errline Line number.
 * @return bool True to suppress the error, false to let PHP handle it.
 */
function chirostretch_suppress_graphql_deprecations(
    int $errno,
    string $errstr,
    string $errfile = '',
    int $errline = 0
): bool {
    // Only handle E_USER_DEPRECATED (deprecation notices)
    if ($errno !== E_USER_DEPRECATED) {
        return false;
    }

    // Suppress graphql_data_loaders deprecation
    if (strpos($errstr, 'graphql_data_loaders') !== false) {
        return true;
    }

    // Let PHP's default handler deal with other deprecations
    return false;
}

set_error_handler('chirostretch_suppress_graphql_deprecations', E_USER_DEPRECATED);
