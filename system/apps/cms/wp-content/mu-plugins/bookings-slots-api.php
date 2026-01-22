<?php
/**
 * Plugin Name: Bookings Slots API
 * Description: Exposes WooCommerce Bookings availability slots via REST API
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Skip WooCommerce Bookings checkout validation for bookings created via our API
 * Our bookings are already created and reserved, so validation is redundant
 */
add_filter('woocommerce_store_api_validate_cart_item', 'chirostretch_skip_booking_validation', 5, 2);

function chirostretch_skip_booking_validation($product, $cart_item) {
    // If this is a booking product with a booking ID, it's already validated
    if (isset($cart_item['booking']['_booking_id'])) {
        $booking_id = $cart_item['booking']['_booking_id'];
        $booking = get_wc_booking($booking_id);

        // If booking exists and is in-cart, skip further validation
        if ($booking && $booking->get_status() === 'in-cart') {
            // Add the booking to confirmed_order_bookings to exclude from availability check
            if ($product instanceof WC_Product_Booking) {
                $product->confirmed_order_bookings[] = $booking;
            }
        }
    }

    return $cart_item;
}

/**
 * Add booking to the "already confirmed" list during checkout validation
 */
add_action('woocommerce_store_api_validate_cart_item', 'chirostretch_mark_booking_confirmed', 1, 2);

function chirostretch_mark_booking_confirmed($product, $cart_item) {
    if (!$product || !is_wc_booking_product($product) || !isset($cart_item['booking']['_booking_id'])) {
        return;
    }

    $booking_id = $cart_item['booking']['_booking_id'];
    $booking = get_wc_booking($booking_id);

    if ($booking && in_array($booking->get_status(), ['in-cart', 'unpaid'])) {
        // Add to confirmed bookings to exclude from availability check
        $product->confirmed_order_bookings[] = $booking;
    }
}

/**
 * Bypass the WooCommerce Bookings is_bookable check for our in-cart bookings
 */
add_filter('woocommerce_bookings_is_block_bookable', 'chirostretch_allow_own_booking', 10, 5);

function chirostretch_allow_own_booking($bookable, $booking_data, $check_in_cart, $blocks_booked_for_date, $product_id) {
    // If we have a booking ID in the booking data, check if it's our in-cart booking
    if (isset($booking_data['_booking_id'])) {
        $booking = get_wc_booking($booking_data['_booking_id']);
        if ($booking && $booking->get_status() === 'in-cart') {
            return true; // Allow this booking to proceed
        }
    }

    return $bookable;
}

/**
 * Completely bypass the WooCommerce Bookings checkout validation for our headless bookings
 * We've already validated and created the booking, so re-validation is redundant and causes issues
 */
add_action('woocommerce_store_api_cart_errors', 'chirostretch_bypass_booking_validation', 1, 2);

function chirostretch_bypass_booking_validation($errors, $cart) {
    // Check if all booking items in cart have valid in-cart bookings
    $has_headless_bookings = false;

    foreach ($cart->get_cart() as $cart_item) {
        if (!isset($cart_item['booking']['_booking_id'])) {
            continue;
        }

        $booking_id = $cart_item['booking']['_booking_id'];
        $booking = get_wc_booking($booking_id);

        if ($booking && in_array($booking->get_status(), ['in-cart', 'unpaid'])) {
            $has_headless_bookings = true;
        }
    }

    // If we have headless bookings, temporarily remove the WooCommerce Bookings validation
    if ($has_headless_bookings) {
        global $wp_filter;

        // Find and remove the WC_Booking_Cart_Manager validation hook
        if (isset($wp_filter['woocommerce_store_api_cart_errors'])) {
            foreach ($wp_filter['woocommerce_store_api_cart_errors']->callbacks as $priority => $callbacks) {
                foreach ($callbacks as $key => $callback) {
                    if (is_array($callback['function']) &&
                        is_object($callback['function'][0]) &&
                        get_class($callback['function'][0]) === 'WC_Booking_Cart_Manager' &&
                        $callback['function'][1] === 'validate_booking_order_checkout_block_support') {
                        unset($wp_filter['woocommerce_store_api_cart_errors']->callbacks[$priority][$key]);
                        break 2;
                    }
                }
            }
        }
    }
}

/**
 * Also handle legacy checkout validation
 */
add_action('woocommerce_after_checkout_validation', 'chirostretch_bypass_legacy_booking_validation', 1, 2);

function chirostretch_bypass_legacy_booking_validation($data, $errors) {
    if (!WC()->cart) {
        return;
    }

    $has_headless_bookings = false;

    foreach (WC()->cart->get_cart() as $cart_item) {
        if (!isset($cart_item['booking']['_booking_id'])) {
            continue;
        }

        $booking = get_wc_booking($cart_item['booking']['_booking_id']);
        if ($booking && in_array($booking->get_status(), ['in-cart', 'unpaid'])) {
            $has_headless_bookings = true;
        }
    }

    if ($has_headless_bookings) {
        global $wp_filter;

        // Find and remove the WC_Booking_Cart_Manager validation hook
        if (isset($wp_filter['woocommerce_after_checkout_validation'])) {
            foreach ($wp_filter['woocommerce_after_checkout_validation']->callbacks as $priority => $callbacks) {
                foreach ($callbacks as $key => $callback) {
                    if (is_array($callback['function']) &&
                        is_object($callback['function'][0]) &&
                        get_class($callback['function'][0]) === 'WC_Booking_Cart_Manager' &&
                        $callback['function'][1] === 'validate_booking_order_legacy_checkout') {
                        unset($wp_filter['woocommerce_after_checkout_validation']->callbacks[$priority][$key]);
                        break 2;
                    }
                }
            }
        }

        // Also remove any booking errors that might have been added
        if ($errors instanceof WP_Error) {
            $error_codes = $errors->get_error_codes();
            foreach ($error_codes as $code) {
                if (strpos($code, 'booking') !== false) {
                    $errors->remove($code);
                }
            }
        }
    }
}

/**
 * Cancel in-cart booking when cart item is removed
 */
add_action('woocommerce_remove_cart_item', 'chirostretch_cancel_incart_booking', 10, 2);

function chirostretch_cancel_incart_booking($cart_item_key, $cart) {
    $cart_item = $cart->get_cart_item($cart_item_key);

    if (!empty($cart_item['booking']['_booking_id'])) {
        $booking = get_wc_booking($cart_item['booking']['_booking_id']);
        if ($booking && $booking->get_status() === 'in-cart') {
            $booking->set_status('cancelled');
            $booking->save();
        }
    }
}

/**
 * Cancel in-cart booking when cart is emptied
 */
add_action('woocommerce_cart_emptied', 'chirostretch_cancel_all_incart_bookings');

function chirostretch_cancel_all_incart_bookings() {
    // Bail early if WooCommerce Bookings post type isn't registered yet
    // (woocommerce_cart_emptied can fire during session init before post types are ready)
    if (!post_type_exists('wc_booking')) {
        return;
    }

    // Find all in-cart bookings and cancel them
    $bookings = get_posts([
        'post_type' => 'wc_booking',
        'post_status' => 'in-cart',
        'posts_per_page' => -1,
        'meta_query' => [
            [
                'key' => '_booking_cart_item_key',
                'compare' => 'EXISTS',
            ],
        ],
    ]);

    foreach ($bookings as $booking_post) {
        $booking = get_wc_booking($booking_post->ID);
        if ($booking) {
            $booking->set_status('cancelled');
            $booking->save();
        }
    }
}

add_action('rest_api_init', function() {
    register_rest_route('chirostretch/v1', '/bookings/slots', [
        'methods' => 'GET',
        'callback' => 'chirostretch_get_booking_slots',
        'permission_callback' => '__return_true',
        'args' => [
            'productId' => [
                'required' => true,
                'type' => 'integer',
                'sanitize_callback' => 'absint',
            ],
            'startDate' => [
                'required' => true,
                'type' => 'string',
            ],
            'endDate' => [
                'required' => true,
                'type' => 'string',
            ],
            'resourceId' => [
                'required' => false,
                'type' => 'integer',
                'sanitize_callback' => 'absint',
            ],
        ],
    ]);

    // Add booking to cart endpoint
    register_rest_route('chirostretch/v1', '/bookings/add-to-cart', [
        'methods' => 'POST',
        'callback' => 'chirostretch_add_booking_to_cart',
        'permission_callback' => '__return_true',
        'args' => [
            'productId' => [
                'required' => true,
                'type' => 'integer',
                'sanitize_callback' => 'absint',
            ],
            'date' => [
                'required' => true,
                'type' => 'string',
            ],
            'time' => [
                'required' => true,
                'type' => 'string',
            ],
            'resourceId' => [
                'required' => false,
                'type' => 'integer',
                'sanitize_callback' => 'absint',
            ],
        ],
    ]);
});

function chirostretch_get_booking_slots(WP_REST_Request $request) {
    $product_id = $request->get_param('productId');
    $start_date = $request->get_param('startDate');
    $end_date = $request->get_param('endDate');
    $resource_id = $request->get_param('resourceId');

    // Validate product exists and is a bookable product
    $product = wc_get_product($product_id);
    if (!$product || $product->get_type() !== 'booking') {
        return new WP_REST_Response([
            'success' => false,
            'error' => 'Product not found or is not a bookable product',
            'slots' => [],
        ], 404);
    }

    // Get the bookable product
    $bookable_product = new WC_Product_Booking($product_id);

    // Parse dates
    $start = strtotime($start_date);
    $end = strtotime($end_date);

    if (!$start || !$end) {
        return new WP_REST_Response([
            'success' => false,
            'error' => 'Invalid date format',
            'slots' => [],
        ], 400);
    }

    // Get availability for date range
    $slots = [];
    $current = $start;

    while ($current <= $end) {
        $date_str = date('Y-m-d', $current);

        // Check if date is available
        $available = chirostretch_check_date_availability($bookable_product, $current, $resource_id);

        if ($available) {
            // Get time slots for this date
            $time_slots = chirostretch_get_time_slots_for_date($bookable_product, $current, $resource_id);

            $slots[] = [
                'date' => $date_str,
                'available' => true,
                'slots' => $time_slots,
            ];
        } else {
            $slots[] = [
                'date' => $date_str,
                'available' => false,
                'slots' => [],
            ];
        }

        $current = strtotime('+1 day', $current);
    }

    return new WP_REST_Response([
        'success' => true,
        'productId' => $product_id,
        'productName' => $product->get_name(),
        'duration' => $bookable_product->get_duration(),
        'durationUnit' => $bookable_product->get_duration_unit(),
        'slots' => $slots,
    ], 200);
}

function chirostretch_check_date_availability($product, $timestamp, $resource_id = null) {
    // Check if product has availability rules
    $rules = $product->get_availability_rules();

    // Get day of week (0 = Sunday, 6 = Saturday)
    $day_of_week = (int) date('w', $timestamp);

    // Check restricted days
    if ($product->get_has_restricted_days()) {
        $restricted_days = $product->get_restricted_days();
        if (is_array($restricted_days) && in_array($day_of_week, $restricted_days)) {
            return false;
        }
    }

    // Check min/max date
    $min_date = $product->get_min_date();
    $max_date = $product->get_max_date();

    $now = current_time('timestamp');
    $min_timestamp = strtotime("+{$min_date['value']} {$min_date['unit']}", $now);
    $max_timestamp = strtotime("+{$max_date['value']} {$max_date['unit']}", $now);

    if ($timestamp < $min_timestamp || $timestamp > $max_timestamp) {
        return false;
    }

    // Default availability
    $default = $product->get_default_date_availability();

    return $default === 'available';
}

function chirostretch_get_time_slots_for_date($product, $timestamp, $resource_id = null) {
    $slots = [];

    $duration = $product->get_duration();
    $duration_unit = $product->get_duration_unit();
    $first_block_time = $product->get_first_block_time();

    // If duration is in days or months, return single slot
    if (in_array($duration_unit, ['day', 'month'])) {
        return [[
            'time' => '00:00',
            'available' => true,
        ]];
    }

    // For hourly/minute bookings, generate time slots
    $interval_minutes = $duration_unit === 'hour' ? $duration * 60 : $duration;

    // Default business hours (9 AM - 6 PM)
    $start_hour = $first_block_time ? (int) substr($first_block_time, 0, 2) : 9;
    $end_hour = 18;

    $current_minutes = $start_hour * 60;
    $end_minutes = $end_hour * 60;

    while ($current_minutes + $interval_minutes <= $end_minutes) {
        $hours = floor($current_minutes / 60);
        $mins = $current_minutes % 60;

        $slots[] = [
            'time' => sprintf('%02d:%02d', $hours, $mins),
            'available' => true,
        ];

        $current_minutes += $interval_minutes;
    }

    return $slots;
}

/**
 * Add a booking product to the cart
 */
function chirostretch_add_booking_to_cart(WP_REST_Request $request) {
    $product_id = $request->get_param('productId');
    $date = $request->get_param('date');
    $time = $request->get_param('time');
    $resource_id = $request->get_param('resourceId');

    // Validate product
    $product = wc_get_product($product_id);
    if (!$product || $product->get_type() !== 'booking') {
        return new WP_REST_Response([
            'success' => false,
            'error' => 'Product not found or is not a bookable product',
        ], 404);
    }

    // Parse date and time
    $date_parts = explode('-', $date);
    if (count($date_parts) !== 3) {
        return new WP_REST_Response([
            'success' => false,
            'error' => 'Invalid date format. Expected YYYY-MM-DD',
        ], 400);
    }

    $year = (int) $date_parts[0];
    $month = (int) $date_parts[1];
    $day = (int) $date_parts[2];

    // Parse time
    $time_parts = explode(':', $time);
    $hour = isset($time_parts[0]) ? (int) $time_parts[0] : 0;
    $minute = isset($time_parts[1]) ? (int) $time_parts[1] : 0;

    // Calculate start and end timestamps
    $start_timestamp = mktime($hour, $minute, 0, $month, $day, $year);

    // Get booking product for duration
    $bookable_product = new WC_Product_Booking($product_id);
    $duration = $bookable_product->get_duration();
    $duration_unit = $bookable_product->get_duration_unit();

    // Calculate end time based on duration
    switch ($duration_unit) {
        case 'minute':
            $end_timestamp = $start_timestamp + ($duration * 60);
            break;
        case 'hour':
            $end_timestamp = $start_timestamp + ($duration * 3600);
            break;
        case 'day':
            $end_timestamp = $start_timestamp + ($duration * 86400);
            break;
        default:
            $end_timestamp = $start_timestamp + 3600; // Default 1 hour
    }

    // Get price
    $cost = (float) $product->get_price();

    // Initialize WooCommerce for REST API context
    if (!WC()->session) {
        WC()->session = new WC_Session_Handler();
        WC()->session->init();
    }

    // Initialize customer (required for shipping calculations)
    if (!WC()->customer) {
        WC()->customer = new WC_Customer(get_current_user_id(), true);
    }

    if (!WC()->cart) {
        WC()->cart = new WC_Cart();
    }

    try {
        // Format month and day with leading zeros
        $month_padded = str_pad($month, 2, '0', STR_PAD_LEFT);
        $day_padded = str_pad($day, 2, '0', STR_PAD_LEFT);

        // Build ISO 8601 datetime for the time field
        $iso_datetime = "{$year}-{$month_padded}-{$day_padded}T{$time}:00";

        // Set up POST data in the format WooCommerce Bookings expects for validation
        $_POST['wc_bookings_field_start_date_year'] = $year;
        $_POST['wc_bookings_field_start_date_month'] = $month_padded;
        $_POST['wc_bookings_field_start_date_day'] = $day_padded;
        $_POST['wc_bookings_field_start_date_time'] = $iso_datetime;
        $_POST['add-to-cart'] = $product_id;

        // Also set in $_REQUEST for some validation paths
        $_REQUEST['wc_bookings_field_start_date_year'] = $year;
        $_REQUEST['wc_bookings_field_start_date_month'] = $month_padded;
        $_REQUEST['wc_bookings_field_start_date_day'] = $day_padded;
        $_REQUEST['wc_bookings_field_start_date_time'] = $iso_datetime;
        $_REQUEST['add-to-cart'] = $product_id;

        // Get formatted date for display
        $date_formatted = date_i18n(get_option('date_format'), $start_timestamp);
        $time_formatted = date_i18n(get_option('time_format'), $start_timestamp);

        // Create cart item data in the EXACT format WooCommerce Bookings expects
        // This must match what wc_bookings_get_posted_data() returns
        $cart_item_data = [
            'booking' => [
                '_year' => $year,
                '_month' => $month,
                '_day' => $day,
                '_date' => "{$year}-{$month}-{$day}",
                'date' => $date_formatted,
                '_time' => $time,
                'time' => $time_formatted,
                '_start_date' => $start_timestamp,
                '_end_date' => $end_timestamp,
                '_qty' => 1,
                '_duration' => $duration,
                '_duration_unit' => $duration_unit,
                '_cost' => $cost,
                '_all_day' => false,
                '_persons' => [],
            ],
        ];

        if (!empty($resource_id)) {
            $cart_item_data['booking']['_resource_id'] = $resource_id;
            $_POST['wc_bookings_field_resource'] = $resource_id;
            $_REQUEST['wc_bookings_field_resource'] = $resource_id;
        }

        // Temporarily remove all WooCommerce Bookings filters that could validate/modify our data
        global $wp_filter;

        $filters_to_remove = [
            'woocommerce_add_to_cart_validation',
            'woocommerce_add_cart_item_data',
        ];

        $original_filters = [];
        foreach ($filters_to_remove as $filter_name) {
            if (isset($wp_filter[$filter_name])) {
                $original_filters[$filter_name] = clone $wp_filter[$filter_name];
                remove_all_filters($filter_name);
            }
        }

        // Create an in-cart booking to reserve the slot
        $booking_data = [
            'product_id' => $product_id,
            'start_date' => $start_timestamp,
            'end_date' => $end_timestamp,
            'all_day' => false,
            'qty' => 1,
            'cost' => $cost,
        ];

        if (!empty($resource_id)) {
            $booking_data['resource_id'] = $resource_id;
        }

        // Create the booking with in-cart status
        $booking = create_wc_booking(
            $product_id,
            $booking_data,
            'in-cart',
            false // don't send customer notification
        );

        if (is_wp_error($booking)) {
            return new WP_REST_Response([
                'success' => false,
                'error' => $booking->get_error_message(),
            ], 500);
        }

        if (!$booking || !is_a($booking, 'WC_Booking')) {
            // Fall back to direct booking creation
            $booking = new WC_Booking();
            $booking->set_product_id($product_id);
            $booking->set_start($start_timestamp);
            $booking->set_end($end_timestamp);
            $booking->set_all_day(false);
            $booking->set_status('in-cart');
            $booking->set_cost($cost);
            if (!empty($resource_id)) {
                $booking->set_resource_id($resource_id);
            }
            $booking_id = $booking->save();

            if (!$booking_id) {
                return new WP_REST_Response([
                    'success' => false,
                    'error' => 'Failed to create booking reservation',
                ], 500);
            }
        }

        // Add booking ID to cart item data
        $cart_item_data['booking']['_booking_id'] = $booking->get_id();

        // Add to cart
        $cart_item_key = WC()->cart->add_to_cart($product_id, 1, 0, [], $cart_item_data);

        // Restore original filters
        foreach ($original_filters as $filter_name => $filter) {
            $wp_filter[$filter_name] = $filter;
        }

        if (!$cart_item_key) {
            // Delete the in-cart booking since add to cart failed
            $booking->set_status('cancelled');
            $booking->save();

            // Get any notices that might explain the failure
            $notices = wc_get_notices('error');
            $error_msg = !empty($notices) ? strip_tags($notices[0]['notice'] ?? 'Unknown error') : 'Failed to add booking to cart';
            wc_clear_notices();

            return new WP_REST_Response([
                'success' => false,
                'error' => $error_msg,
            ], 500);
        }

        // Update booking with cart item key for proper association
        update_post_meta($booking->get_id(), '_booking_cart_item_key', $cart_item_key);

        // Get cart totals
        WC()->cart->calculate_totals();

        return new WP_REST_Response([
            'success' => true,
            'cartItemKey' => $cart_item_key,
            'cartUrl' => wc_get_cart_url(),
            'checkoutUrl' => wc_get_checkout_url(),
            'cartCount' => WC()->cart->get_cart_contents_count(),
            'cartTotal' => WC()->cart->get_cart_total(),
        ], 200);

    } catch (Exception $e) {
        return new WP_REST_Response([
            'success' => false,
            'error' => $e->getMessage(),
        ], 500);
    }
}
