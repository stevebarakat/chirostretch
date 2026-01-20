<?php
/**
 * Plugin Name: New Patient Coupon Generator
 * Description: Generates unique coupon codes for new patient leads
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Register REST API endpoint for generating unique coupons
 */
add_action('rest_api_init', function() {
    register_rest_route('chirostretch/v1', '/coupons/new-patient', [
        'methods' => 'POST',
        'callback' => 'chirostretch_generate_new_patient_coupon',
        'permission_callback' => 'chirostretch_verify_coupon_request',
        'args' => [
            'email' => [
                'required' => true,
                'type' => 'string',
                'format' => 'email',
            ],
            'first_name' => [
                'required' => false,
                'type' => 'string',
            ],
            'user_id' => [
                'required' => false,
                'type' => 'integer',
            ],
            'entry_id' => [
                'required' => false,
                'type' => 'string',
                'description' => 'Gravity Forms entry ID for storing coupon code',
            ],
        ],
    ]);
});

/**
 * Verify request authenticity
 */
function chirostretch_verify_coupon_request(WP_REST_Request $request) {
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
 * Generate a unique coupon code for new patient
 */
function chirostretch_generate_new_patient_coupon(WP_REST_Request $request) {
    $email = sanitize_email($request->get_param('email'));
    $first_name = sanitize_text_field($request->get_param('first_name') ?? '');
    $user_id = intval($request->get_param('user_id') ?? 0);
    $entry_id = sanitize_text_field($request->get_param('entry_id') ?? '');

    // Generate unique code: NP + first 4 chars of email hash + random 4 chars
    $hash = strtoupper(substr(md5($email . time()), 0, 4));
    $random = strtoupper(wp_generate_password(4, false, false));
    $coupon_code = 'NP' . $hash . $random;

    // Check for existing coupon for this email
    $existing_coupons = get_posts([
        'post_type' => 'shop_coupon',
        'meta_query' => [
            [
                'key' => '_new_patient_email',
                'value' => $email,
            ],
        ],
        'posts_per_page' => 1,
    ]);

    if (!empty($existing_coupons)) {
        $existing_coupon = new WC_Coupon($existing_coupons[0]->ID);
        $coupon_code = $existing_coupon->get_code();
        $expiry_date = $existing_coupon->get_date_expires();

        // Store in GF entry meta even for existing coupons
        if ($entry_id && function_exists('gform_update_meta')) {
            $meta_stored = gform_update_meta($entry_id, 'coupon_code', strtoupper($coupon_code));
            if (!$meta_stored) {
                error_log("[ChiroStretch Coupon] Failed to store coupon_code meta for entry {$entry_id}");
            }
            if ($expiry_date) {
                gform_update_meta($entry_id, 'coupon_expires', $expiry_date->date('F j, Y'));
            }
            gform_update_meta($entry_id, 'coupon_final_price', '29');
            // Trigger the "Coupon Generated" notification
            chirostretch_trigger_coupon_notification($entry_id);
        }

        return new WP_REST_Response([
            'success' => true,
            'coupon_code' => $coupon_code,
            'discount_amount' => $existing_coupon->get_amount(),
            'final_price' => 29,
            'existing' => true,
            'message' => 'Coupon already exists for this email',
        ], 200);
    }

    // Get the bookable product ID for new patient consultation
    $product_id = chirostretch_get_new_patient_product_id();

    // Create the coupon
    $coupon = new WC_Coupon();
    $coupon->set_code($coupon_code);
    $coupon->set_description("New Patient Special for {$first_name} ({$email})");
    $coupon->set_discount_type('fixed_product');
    $coupon->set_amount(70); // $99 - $70 = $29
    $coupon->set_individual_use(true);
    $coupon->set_usage_limit(1);
    $coupon->set_usage_limit_per_user(1);
    $coupon->set_product_ids([$product_id]);
    $coupon->set_free_shipping(false);

    // Set expiry to 30 days from now
    $expiry = new DateTime('+30 days');
    $coupon->set_date_expires($expiry->getTimestamp());

    $coupon_id = $coupon->save();

    if (!$coupon_id) {
        return new WP_Error(
            'coupon_creation_failed',
            'Failed to create coupon',
            ['status' => 500]
        );
    }

    // Store email reference for lookup
    update_post_meta($coupon_id, '_new_patient_email', $email);
    if ($user_id) {
        update_post_meta($coupon_id, '_new_patient_user_id', $user_id);
    }

    // Store coupon code in GF entry meta for notifications
    if ($entry_id && function_exists('gform_update_meta')) {
        $meta_stored = gform_update_meta($entry_id, 'coupon_code', strtoupper($coupon_code));
        if (!$meta_stored) {
            error_log("[ChiroStretch Coupon] Failed to store coupon_code meta for entry {$entry_id}");
        }
        gform_update_meta($entry_id, 'coupon_expires', $expiry->format('F j, Y'));
        gform_update_meta($entry_id, 'coupon_final_price', '29');
        // Trigger the "Coupon Generated" notification
        chirostretch_trigger_coupon_notification($entry_id);
    }

    return new WP_REST_Response([
        'success' => true,
        'coupon_code' => strtoupper($coupon_code),
        'coupon_id' => $coupon_id,
        'discount_amount' => 70,
        'final_price' => 29,
        'expires' => $expiry->format('Y-m-d'),
        'existing' => false,
    ], 201);
}

/**
 * Register merge tag filters after Gravity Forms is fully loaded.
 * This ensures filters work in all contexts: admin, frontend, REST, and cron.
 */
add_action('gform_loaded', function() {
    /**
     * Register custom merge tags for Gravity Forms notifications
     */
    add_filter('gform_custom_merge_tags', function($merge_tags, $form_id, $fields, $element_id) {
        $merge_tags[] = ['label' => 'Coupon Code', 'tag' => '{coupon_code}'];
        $merge_tags[] = ['label' => 'Coupon Expires', 'tag' => '{coupon_expires}'];
        $merge_tags[] = ['label' => 'Coupon Final Price', 'tag' => '{coupon_final_price}'];
        return $merge_tags;
    }, 10, 4);

    /**
     * Replace custom merge tags with entry meta values
     */
    add_filter('gform_replace_merge_tags', function($text, $form, $entry, $url_encode, $esc_html, $nl2br, $format) {
        if (!$entry || empty($entry['id'])) {
            return $text;
        }

        $entry_id = $entry['id'];

        $replacements = [
            '{coupon_code}' => (string) gform_get_meta($entry_id, 'coupon_code') ?: '',
            '{coupon_expires}' => (string) gform_get_meta($entry_id, 'coupon_expires') ?: '',
            '{coupon_final_price}' => (string) gform_get_meta($entry_id, 'coupon_final_price') ?: '29',
        ];

        return strtr($text, $replacements);
    }, 10, 7);
});

/**
 * Trigger coupon notification after storing meta
 *
 * Call this after storing coupon code in entry meta to send the
 * "Coupon Generated" notification with the coupon details.
 */
function chirostretch_trigger_coupon_notification($entry_id, $form_id = null) {
    if (!class_exists('GFAPI')) {
        error_log("[ChiroStretch Coupon] GFAPI class not available for entry {$entry_id}");
        return false;
    }

    $entry = GFAPI::get_entry($entry_id);
    if (is_wp_error($entry)) {
        error_log("[ChiroStretch Coupon] Failed to get entry {$entry_id}: " . $entry->get_error_message());
        return false;
    }

    // Debug: Log entry meta before sending notification
    $coupon_code = gform_get_meta($entry_id, 'coupon_code');
    $coupon_expires = gform_get_meta($entry_id, 'coupon_expires');
    $coupon_final_price = gform_get_meta($entry_id, 'coupon_final_price');
    error_log("[ChiroStretch Coupon] Entry {$entry_id} meta - coupon_code: " . ($coupon_code ?: '(empty)') . ", expires: " . ($coupon_expires ?: '(empty)') . ", final_price: " . ($coupon_final_price ?: '(empty)'));

    $form_id = $form_id ?: $entry['form_id'];
    $form = GFAPI::get_form($form_id);
    if (!$form) {
        error_log("[ChiroStretch Coupon] Failed to get form {$form_id}");
        return false;
    }

    // Find notification with name "Auto-Reply" (configured in GF admin)
    $notifications = $form['notifications'] ?? [];
    foreach ($notifications as $notification) {
        if ($notification['name'] === 'Auto-Reply' && $notification['isActive']) {
            error_log("[ChiroStretch Coupon] Sending 'Auto-Reply' notification for entry {$entry_id}");
            GFCommon::send_notification($notification, $form, $entry);
            return true;
        }
    }

    error_log("[ChiroStretch Coupon] No active 'Auto-Reply' notification found for form {$form_id}");
    return false;
}

/**
 * Get the new patient consultation product ID
 */
function chirostretch_get_new_patient_product_id() {
    // First try to find by name
    $products = wc_get_products([
        'name' => 'Initial Consultation (Consultation • Exam • Adjustment)',
        'limit' => 1,
    ]);

    if (!empty($products)) {
        return $products[0]->get_id();
    }

    // Fallback to the known ID
    return 7149;
}

