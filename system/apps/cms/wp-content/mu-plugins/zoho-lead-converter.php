<?php
/**
 * Plugin Name: Zoho Lead Converter
 * Description: Converts Zoho CRM leads to Contacts when Initial Consultation is purchased
 * Version: 2.0.0
 */

defined('ABSPATH') || exit;

/**
 * Hook into WooCommerce payment completion
 *
 * Priority 25 to run after other payment handlers
 */
add_action('woocommerce_payment_complete', 'chirostretch_convert_zoho_lead_on_payment', 25);

/**
 * Convert Zoho lead to Contact when payment is completed
 *
 * @param int $order_id The WooCommerce order ID
 */
function chirostretch_convert_zoho_lead_on_payment($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) {
        return;
    }

    // Initial Consultation product ID
    $initial_consultation_id = 7149;

    // Check if order contains Initial Consultation product
    $has_initial_consultation = false;
    foreach ($order->get_items() as $item) {
        if ($item->get_product_id() === $initial_consultation_id) {
            $has_initial_consultation = true;
            break;
        }
    }

    if (!$has_initial_consultation) {
        return;
    }

    $email = $order->get_billing_email();
    if (empty($email)) {
        chirostretch_zoho_log('No billing email found for order ' . $order_id);
        return;
    }

    chirostretch_zoho_log("Order {$order_id}: Initial Consultation purchased, converting lead for {$email}");

    // Convert the lead to a Contact in Zoho CRM
    $result = chirostretch_convert_zoho_lead($email);

    if ($result) {
        chirostretch_zoho_log("Order {$order_id}: Successfully converted Zoho lead to Contact (ID: {$result}) for {$email}");
    } elseif ($result === null) {
        chirostretch_zoho_log("Order {$order_id}: No lead found in Zoho for {$email}");
    } else {
        chirostretch_zoho_log("Order {$order_id}: Failed to convert Zoho lead for {$email}");
    }
}

/**
 * Get Zoho OAuth access token
 *
 * Uses WordPress transients to cache the token (50 min TTL)
 *
 * @return string|false Access token or false on failure
 */
function chirostretch_get_zoho_access_token() {
    // Check for cached token
    $cached_token = get_transient('zoho_crm_access_token');
    if ($cached_token !== false) {
        return $cached_token;
    }

    $client_id = defined('ZOHO_CLIENT_ID') ? ZOHO_CLIENT_ID : getenv('ZOHO_CLIENT_ID');
    $client_secret = defined('ZOHO_CLIENT_SECRET') ? ZOHO_CLIENT_SECRET : getenv('ZOHO_CLIENT_SECRET');
    $refresh_token = defined('ZOHO_REFRESH_TOKEN') ? ZOHO_REFRESH_TOKEN : getenv('ZOHO_REFRESH_TOKEN');

    if (empty($client_id) || empty($client_secret) || empty($refresh_token)) {
        chirostretch_zoho_log('Zoho CRM credentials not configured');
        return false;
    }

    $accounts_domain = defined('ZOHO_ACCOUNTS_DOMAIN') ? ZOHO_ACCOUNTS_DOMAIN : 'https://accounts.zoho.com';

    $response = wp_remote_post($accounts_domain . '/oauth/v2/token', [
        'body' => [
            'refresh_token' => $refresh_token,
            'client_id' => $client_id,
            'client_secret' => $client_secret,
            'grant_type' => 'refresh_token',
        ],
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        chirostretch_zoho_log('Failed to refresh Zoho token: ' . $response->get_error_message());
        return false;
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (isset($body['error'])) {
        chirostretch_zoho_log('Zoho token refresh error: ' . $body['error']);
        return false;
    }

    if (empty($body['access_token'])) {
        chirostretch_zoho_log('No access token in Zoho response');
        return false;
    }

    // Cache token for 50 minutes (tokens expire in 60 min)
    set_transient('zoho_crm_access_token', $body['access_token'], 50 * MINUTE_IN_SECONDS);

    return $body['access_token'];
}

/**
 * Search for a lead by email in Zoho CRM
 *
 * @param string $email Email to search for
 * @return array|null Lead data or null if not found
 */
function chirostretch_search_zoho_lead_by_email($email) {
    $access_token = chirostretch_get_zoho_access_token();
    if (!$access_token) {
        return null;
    }

    $api_domain = defined('ZOHO_API_DOMAIN') ? ZOHO_API_DOMAIN : 'https://www.zohoapis.com';
    $criteria = "(Email:equals:{$email})";
    $url = $api_domain . '/crm/v2/Leads/search?criteria=' . urlencode($criteria);

    $response = wp_remote_get($url, [
        'headers' => [
            'Authorization' => 'Zoho-oauthtoken ' . $access_token,
        ],
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        chirostretch_zoho_log('Zoho search error: ' . $response->get_error_message());
        return null;
    }

    $status_code = wp_remote_retrieve_response_code($response);

    // 204 means no records found
    if ($status_code === 204) {
        return null;
    }

    if ($status_code !== 200) {
        chirostretch_zoho_log('Zoho search failed with status ' . $status_code);
        return null;
    }

    $body = json_decode(wp_remote_retrieve_body($response), true);

    if (empty($body['data']) || !is_array($body['data'])) {
        return null;
    }

    return $body['data'][0];
}

/**
 * Convert a lead to a Contact by lead ID
 *
 * @param string $lead_id Zoho lead ID
 * @return string|false Contact ID on success, false on failure
 */
function chirostretch_convert_zoho_lead_by_id($lead_id) {
    $access_token = chirostretch_get_zoho_access_token();
    if (!$access_token) {
        return false;
    }

    $api_domain = defined('ZOHO_API_DOMAIN') ? ZOHO_API_DOMAIN : 'https://www.zohoapis.com';
    $url = $api_domain . '/crm/v2/Leads/' . $lead_id . '/actions/convert';

    $response = wp_remote_post($url, [
        'headers' => [
            'Authorization' => 'Zoho-oauthtoken ' . $access_token,
            'Content-Type' => 'application/json',
        ],
        'body' => json_encode([
            'data' => [
                [
                    'overwrite' => true,
                ],
            ],
        ]),
        'timeout' => 30,
    ]);

    if (is_wp_error($response)) {
        chirostretch_zoho_log('Zoho convert error: ' . $response->get_error_message());
        return false;
    }

    $status_code = wp_remote_retrieve_response_code($response);
    $body = json_decode(wp_remote_retrieve_body($response), true);

    if ($status_code !== 200) {
        $error_message = 'Unknown error';
        if (isset($body['data'][0]['message'])) {
            $error_message = $body['data'][0]['message'];
        } elseif (isset($body['message'])) {
            $error_message = $body['message'];
        }
        chirostretch_zoho_log("Zoho convert failed (status {$status_code}): {$error_message}");
        return false;
    }

    if (empty($body['data']) || !is_array($body['data'])) {
        chirostretch_zoho_log('Zoho convert response missing data');
        return false;
    }

    // The convert API returns the IDs of created records
    $result = $body['data'][0];

    // Return the Contact ID if created
    if (isset($result['Contacts'])) {
        return $result['Contacts'];
    }

    chirostretch_zoho_log('Zoho convert succeeded but no Contact ID returned');
    return false;
}

/**
 * Convert a lead to a Contact by email
 *
 * @param string $email Customer email
 * @return string|null|false Contact ID on success, null if no lead found, false on failure
 */
function chirostretch_convert_zoho_lead($email) {
    $lead = chirostretch_search_zoho_lead_by_email($email);

    if (!$lead) {
        return null;
    }

    return chirostretch_convert_zoho_lead_by_id($lead['id']);
}

/**
 * Log Zoho-related messages
 *
 * @param string $message Message to log
 */
function chirostretch_zoho_log($message) {
    if (defined('WP_DEBUG') && WP_DEBUG) {
        error_log('[Zoho Lead] ' . $message);
    }
}

/**
 * Register WP-CLI commands for testing Zoho integration
 */
if (defined('WP_CLI') && WP_CLI) {
    WP_CLI::add_command('zoho', 'Chirostretch_Zoho_CLI');
}

/**
 * WP-CLI commands for Zoho CRM integration
 */
class Chirostretch_Zoho_CLI {

    /**
     * Test Zoho CRM connection
     *
     * ## EXAMPLES
     *
     *     wp zoho test
     *
     * @when after_wp_load
     */
    public function test($args, $assoc_args) {
        WP_CLI::log('Testing Zoho CRM connection...');

        // Check credentials
        $client_id = defined('ZOHO_CLIENT_ID') ? ZOHO_CLIENT_ID : getenv('ZOHO_CLIENT_ID');
        $client_secret = defined('ZOHO_CLIENT_SECRET') ? ZOHO_CLIENT_SECRET : getenv('ZOHO_CLIENT_SECRET');
        $refresh_token = defined('ZOHO_REFRESH_TOKEN') ? ZOHO_REFRESH_TOKEN : getenv('ZOHO_REFRESH_TOKEN');

        if (empty($client_id) || empty($client_secret) || empty($refresh_token)) {
            WP_CLI::error('Zoho credentials not configured. Set ZOHO_CLIENT_ID, ZOHO_CLIENT_SECRET, and ZOHO_REFRESH_TOKEN.');
        }

        WP_CLI::log('✓ Credentials found');
        WP_CLI::log('  Client ID: ' . substr($client_id, 0, 10) . '...');

        // Clear cached token to force a fresh request
        delete_transient('zoho_crm_access_token');

        // Make direct request to show detailed error
        $accounts_domain = defined('ZOHO_ACCOUNTS_DOMAIN') ? ZOHO_ACCOUNTS_DOMAIN : 'https://accounts.zoho.com';
        WP_CLI::log("  Accounts domain: {$accounts_domain}");

        $response = wp_remote_post($accounts_domain . '/oauth/v2/token', [
            'body' => [
                'refresh_token' => $refresh_token,
                'client_id' => $client_id,
                'client_secret' => $client_secret,
                'grant_type' => 'refresh_token',
            ],
            'timeout' => 30,
        ]);

        if (is_wp_error($response)) {
            WP_CLI::error('HTTP request failed: ' . $response->get_error_message());
        }

        $status_code = wp_remote_retrieve_response_code($response);
        $body = wp_remote_retrieve_body($response);
        $data = json_decode($body, true);

        WP_CLI::log("  Response status: {$status_code}");

        if (isset($data['error'])) {
            WP_CLI::log('  Error: ' . $data['error']);
            if (isset($data['error_description'])) {
                WP_CLI::log('  Description: ' . $data['error_description']);
            }
            WP_CLI::log('');
            WP_CLI::log('Common fixes:');
            WP_CLI::log('  - If "invalid_code": Refresh token has expired, generate a new one');
            WP_CLI::log('  - If "invalid_client": Check ZOHO_CLIENT_ID and ZOHO_CLIENT_SECRET');
            WP_CLI::log('  - For EU/IN/AU accounts: Set ZOHO_ACCOUNTS_DOMAIN (e.g., https://accounts.zoho.eu)');
            WP_CLI::error('Authentication failed.');
        }

        if (empty($data['access_token'])) {
            WP_CLI::log('  Response body: ' . $body);
            WP_CLI::error('No access token in response.');
        }

        // Cache the token
        set_transient('zoho_crm_access_token', $data['access_token'], 50 * MINUTE_IN_SECONDS);

        WP_CLI::success('Connected to Zoho CRM successfully!');
    }

    /**
     * Search for a lead by email
     *
     * ## OPTIONS
     *
     * <email>
     * : The email address to search for
     *
     * ## EXAMPLES
     *
     *     wp zoho search test@example.com
     *
     * @when after_wp_load
     */
    public function search($args, $assoc_args) {
        $email = $args[0];

        WP_CLI::log("Searching for lead with email: {$email}");

        $lead = chirostretch_search_zoho_lead_by_email($email);

        if (!$lead) {
            WP_CLI::warning('No lead found with that email.');
            return;
        }

        WP_CLI::success('Lead found!');
        WP_CLI::log('');

        $fields = [
            'ID' => $lead['id'] ?? 'N/A',
            'Email' => $lead['Email'] ?? 'N/A',
            'First Name' => $lead['First_Name'] ?? 'N/A',
            'Last Name' => $lead['Last_Name'] ?? 'N/A',
            'Lead Status' => $lead['Lead_Status'] ?? 'N/A',
        ];

        foreach ($fields as $label => $value) {
            WP_CLI::log(sprintf('  %s: %s', $label, $value));
        }
    }

    /**
     * Convert a lead to a Contact by email
     *
     * ## OPTIONS
     *
     * <email>
     * : The email address of the lead to convert
     *
     * [--dry-run]
     * : Preview the conversion without making changes
     *
     * ## EXAMPLES
     *
     *     wp zoho convert test@example.com
     *     wp zoho convert test@example.com --dry-run
     *
     * @when after_wp_load
     */
    public function convert($args, $assoc_args) {
        $email = $args[0];
        $dry_run = isset($assoc_args['dry-run']);

        WP_CLI::log("Searching for lead with email: {$email}");

        $lead = chirostretch_search_zoho_lead_by_email($email);

        if (!$lead) {
            WP_CLI::error('No lead found with that email.');
        }

        WP_CLI::log("Found lead: {$lead['First_Name']} {$lead['Last_Name']} (ID: {$lead['id']})");
        WP_CLI::log("Lead Status: " . ($lead['Lead_Status'] ?? 'N/A'));

        if ($dry_run) {
            WP_CLI::success('Dry run complete. Lead would be converted to a Contact.');
            return;
        }

        WP_CLI::log('Converting lead to Contact...');

        $contact_id = chirostretch_convert_zoho_lead_by_id($lead['id']);

        if ($contact_id) {
            WP_CLI::success("Lead converted to Contact successfully!");
            WP_CLI::log("  Contact ID: {$contact_id}");
        } else {
            WP_CLI::error('Failed to convert lead to Contact.');
        }
    }

    /**
     * Clear the cached Zoho access token
     *
     * ## EXAMPLES
     *
     *     wp zoho clear-cache
     *
     * @when after_wp_load
     */
    public function clear_cache($args, $assoc_args) {
        delete_transient('zoho_crm_access_token');
        WP_CLI::success('Zoho access token cache cleared.');
    }
}
