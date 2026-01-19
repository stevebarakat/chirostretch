<?php
/**
 * Plugin Name: Coupon Validation API
 * Description: REST API endpoint for validating coupon codes with email verification
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Register REST API endpoint for validating coupons
 */
add_action('rest_api_init', function() {
    register_rest_route('chirostretch/v1', '/coupons/validate', [
        'methods' => 'POST',
        'callback' => 'chirostretch_validate_coupon',
        'permission_callback' => 'chirostretch_verify_validation_request',
        'args' => [
            'coupon_code' => [
                'required' => true,
                'type' => 'string',
                'sanitize_callback' => 'sanitize_text_field',
            ],
            'email' => [
                'required' => true,
                'type' => 'string',
                'format' => 'email',
                'sanitize_callback' => 'sanitize_email',
            ],
        ],
    ]);
});

/**
 * Verify request authenticity
 */
function chirostretch_verify_validation_request(WP_REST_Request $request) {
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
 * Validate coupon code and check email match
 */
function chirostretch_validate_coupon(WP_REST_Request $request) {
    $coupon_code = strtoupper(trim($request->get_param('coupon_code')));
    $email = strtolower(trim($request->get_param('email')));

    // Check if coupon exists
    $coupon_id = wc_get_coupon_id_by_code($coupon_code);

    if (!$coupon_id) {
        return new WP_REST_Response([
            'valid' => false,
            'error' => 'invalid_code',
            'message' => 'This coupon code is not valid',
        ], 200);
    }

    $coupon = new WC_Coupon($coupon_id);

    // Check if coupon is expired
    $expiry_date = $coupon->get_date_expires();
    if ($expiry_date && $expiry_date->getTimestamp() < time()) {
        return new WP_REST_Response([
            'valid' => false,
            'error' => 'expired',
            'message' => 'This coupon has expired',
        ], 200);
    }

    // Check usage limit
    $usage_count = $coupon->get_usage_count();
    $usage_limit = $coupon->get_usage_limit();
    if ($usage_limit > 0 && $usage_count >= $usage_limit) {
        return new WP_REST_Response([
            'valid' => false,
            'error' => 'already_used',
            'message' => 'This coupon has already been used',
        ], 200);
    }

    // Check if this is a new patient coupon (has _new_patient_email meta)
    $coupon_email = get_post_meta($coupon_id, '_new_patient_email', true);

    if ($coupon_email) {
        // This is a new patient coupon - verify email matches
        if (strtolower(trim($coupon_email)) !== $email) {
            return new WP_REST_Response([
                'valid' => false,
                'error' => 'email_mismatch',
                'message' => 'This coupon is not valid for your email address',
            ], 200);
        }
    }

    // Coupon is valid
    return new WP_REST_Response([
        'valid' => true,
        'discount_amount' => floatval($coupon->get_amount()),
        'discount_type' => $coupon->get_discount_type(),
        'coupon_code' => $coupon->get_code(),
    ], 200);
}
