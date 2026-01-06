<?php
/**
 * Plugin Name: WPGraphQL WooCommerce Bookings
 * Description: Adds WooCommerce Bookings support to WPGraphQL
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

add_action('graphql_register_types', 'chirostretch_register_booking_graphql_types');

// Note: We don't register booking in graphql_woocommerce_product_types because
// WooGraphQL auto-generates queries that conflict with our custom implementation.
// Use chsBookingProduct and bookingProducts queries instead of the generic product query.

function chirostretch_register_booking_graphql_types() {
    // Register BookingProduct type
    register_graphql_object_type('BookingProduct', [
        'description' => 'A bookable product',
        'interfaces' => ['Node', 'Product', 'NodeWithFeaturedImage', 'ContentNode', 'UniformResourceIdentifiable'],
        'fields' => [
            'databaseId' => [
                'type' => ['non_null' => 'Int'],
                'description' => 'Product database ID',
            ],
            'name' => [
                'type' => 'String',
                'description' => 'Product name',
            ],
            'slug' => [
                'type' => 'String',
                'description' => 'Product slug',
            ],
            'price' => [
                'type' => 'String',
                'description' => 'Product price',
            ],
            'regularPrice' => [
                'type' => 'String',
                'description' => 'Regular price',
            ],
            'description' => [
                'type' => 'String',
                'description' => 'Product description',
            ],
            'shortDescription' => [
                'type' => 'String',
                'description' => 'Short description',
            ],
            'bookingDuration' => [
                'type' => 'Int',
                'description' => 'Booking duration',
            ],
            'bookingDurationUnit' => [
                'type' => 'String',
                'description' => 'Duration unit (minute, hour, day, month)',
            ],
            'bookingDurationType' => [
                'type' => 'String',
                'description' => 'Duration type (fixed or customer)',
            ],
            'bookingMinDuration' => [
                'type' => 'Int',
                'description' => 'Minimum duration',
            ],
            'bookingMaxDuration' => [
                'type' => 'Int',
                'description' => 'Maximum duration',
            ],
            'bookingCost' => [
                'type' => 'Float',
                'description' => 'Base booking cost',
            ],
            'bookingBlockCost' => [
                'type' => 'Float',
                'description' => 'Cost per block',
            ],
            'bookingHasPersons' => [
                'type' => 'Boolean',
                'description' => 'Whether product has persons',
            ],
            'bookingMinPersons' => [
                'type' => 'Int',
                'description' => 'Minimum persons',
            ],
            'bookingMaxPersons' => [
                'type' => 'Int',
                'description' => 'Maximum persons',
            ],
            'bookingHasResources' => [
                'type' => 'Boolean',
                'description' => 'Whether product has resources',
            ],
            'bookingRequiresConfirmation' => [
                'type' => 'Boolean',
                'description' => 'Whether booking requires confirmation',
            ],
            'bookingCanBeCancelled' => [
                'type' => 'Boolean',
                'description' => 'Whether booking can be cancelled',
            ],
            'bookingDefaultAvailability' => [
                'type' => 'String',
                'description' => 'Default date availability',
            ],
            'bookingCalendarDisplayMode' => [
                'type' => 'String',
                'description' => 'Calendar display mode',
            ],
            'bookingFirstBlockTime' => [
                'type' => 'String',
                'description' => 'First block start time',
            ],
            'bookingBufferPeriod' => [
                'type' => 'Int',
                'description' => 'Buffer period between bookings',
            ],
            'resources' => [
                'type' => ['list_of' => 'BookingResource'],
                'description' => 'Available resources for this product',
            ],
        ],
    ]);

    // Register BookingResource type
    register_graphql_object_type('BookingResource', [
        'description' => 'A bookable resource (e.g., staff member, room)',
        'fields' => [
            'databaseId' => [
                'type' => 'Int',
                'description' => 'Resource database ID',
            ],
            'name' => [
                'type' => 'String',
                'description' => 'Resource name',
            ],
            'availability' => [
                'type' => ['list_of' => 'BookingAvailabilityRule'],
                'description' => 'Availability rules',
            ],
        ],
    ]);

    // Register BookingAvailabilityRule type
    register_graphql_object_type('BookingAvailabilityRule', [
        'description' => 'An availability rule',
        'fields' => [
            'type' => ['type' => 'String'],
            'from' => ['type' => 'String'],
            'to' => ['type' => 'String'],
            'fromDate' => ['type' => 'String'],
            'toDate' => ['type' => 'String'],
            'bookable' => ['type' => 'Boolean'],
            'priority' => ['type' => 'Int'],
        ],
    ]);

    // Register BookingSlot type
    register_graphql_object_type('BookingSlot', [
        'description' => 'An available booking time slot',
        'fields' => [
            'date' => [
                'type' => 'String',
                'description' => 'Date (YYYY-MM-DD)',
            ],
            'time' => [
                'type' => 'String',
                'description' => 'Time (HH:MM)',
            ],
            'available' => [
                'type' => 'Boolean',
                'description' => 'Whether slot is available',
            ],
            'booked' => [
                'type' => 'Int',
                'description' => 'Number of bookings in this slot',
            ],
        ],
    ]);

    // Register BookingAvailability type
    register_graphql_object_type('BookingAvailability', [
        'description' => 'Booking availability for a date range',
        'fields' => [
            'productId' => ['type' => 'Int'],
            'productName' => ['type' => 'String'],
            'duration' => ['type' => 'Int'],
            'durationUnit' => ['type' => 'String'],
            'dates' => [
                'type' => ['list_of' => 'BookingDateAvailability'],
            ],
        ],
    ]);

    register_graphql_object_type('BookingDateAvailability', [
        'description' => 'Availability for a single date',
        'fields' => [
            'date' => ['type' => 'String'],
            'available' => ['type' => 'Boolean'],
            'slots' => ['type' => ['list_of' => 'BookingSlot']],
        ],
    ]);

    // Register query for booking products
    register_graphql_field('RootQuery', 'bookingProducts', [
        'type' => ['list_of' => 'BookingProduct'],
        'description' => 'Get all bookable products',
        'args' => [
            'first' => ['type' => 'Int', 'defaultValue' => 10],
        ],
        'resolve' => function($root, $args) {
            $products = wc_get_products([
                'type' => 'booking',
                'limit' => $args['first'],
                'status' => 'publish',
            ]);

            return array_map('chirostretch_resolve_booking_product', $products);
        },
    ]);

    // Register query for single booking product (prefixed to avoid WooGraphQL conflict)
    register_graphql_field('RootQuery', 'chsBookingProduct', [
        'type' => 'BookingProduct',
        'description' => 'Get a single bookable product',
        'args' => [
            'id' => ['type' => 'Int', 'description' => 'Product database ID'],
            'slug' => ['type' => 'String', 'description' => 'Product slug'],
        ],
        'resolve' => function($root, $args) {
            $product = null;

            if (!empty($args['id'])) {
                $product = wc_get_product($args['id']);
            } elseif (!empty($args['slug'])) {
                $product = get_page_by_path($args['slug'], OBJECT, 'product');
                if ($product) {
                    $product = wc_get_product($product->ID);
                }
            }

            if (!$product || $product->get_type() !== 'booking') {
                return null;
            }

            return chirostretch_resolve_booking_product($product);
        },
    ]);

    // Register query for booking availability
    register_graphql_field('RootQuery', 'bookingAvailability', [
        'type' => 'BookingAvailability',
        'description' => 'Get availability for a bookable product',
        'args' => [
            'productId' => ['type' => ['non_null' => 'Int']],
            'startDate' => ['type' => ['non_null' => 'String']],
            'endDate' => ['type' => ['non_null' => 'String']],
            'resourceId' => ['type' => 'Int'],
        ],
        'resolve' => function($root, $args) {
            $product = wc_get_product($args['productId']);

            if (!$product || $product->get_type() !== 'booking') {
                return null;
            }

            $bookable = new WC_Product_Booking($args['productId']);
            $start = strtotime($args['startDate']);
            $end = strtotime($args['endDate']);

            $dates = [];
            $current = $start;

            while ($current <= $end) {
                $date_str = date('Y-m-d', $current);
                $available = chirostretch_check_booking_date_availability($bookable, $current, $args['resourceId'] ?? null);

                $slots = [];
                if ($available) {
                    $slots = chirostretch_get_booking_time_slots($bookable, $current, $args['resourceId'] ?? null);
                }

                $dates[] = [
                    'date' => $date_str,
                    'available' => $available,
                    'slots' => $slots,
                ];

                $current = strtotime('+1 day', $current);
            }

            return [
                'productId' => $args['productId'],
                'productName' => $product->get_name(),
                'duration' => $bookable->get_duration(),
                'durationUnit' => $bookable->get_duration_unit(),
                'dates' => $dates,
            ];
        },
    ]);

    // Register query for booking resources
    register_graphql_field('RootQuery', 'bookingResources', [
        'type' => ['list_of' => 'BookingResource'],
        'description' => 'Get all booking resources',
        'resolve' => function() {
            $resources = get_posts([
                'post_type' => 'bookable_resource',
                'posts_per_page' => -1,
                'post_status' => 'publish',
            ]);

            return array_map(function($resource) {
                return [
                    'databaseId' => $resource->ID,
                    'name' => $resource->post_title,
                    'availability' => [],
                ];
            }, $resources);
        },
    ]);
}

function chirostretch_resolve_booking_product($product) {
    if (!$product) return null;

    $bookable = new WC_Product_Booking($product->get_id());

    // Get resources
    $resource_ids = $bookable->get_resource_ids();
    $resources = [];
    foreach ($resource_ids as $resource_id) {
        $resource = get_post($resource_id);
        if ($resource) {
            $resources[] = [
                'databaseId' => $resource_id,
                'name' => $resource->post_title,
                'availability' => [],
            ];
        }
    }

    return [
        'databaseId' => $product->get_id(),
        'name' => $product->get_name(),
        'slug' => $product->get_slug(),
        'price' => $product->get_price(),
        'regularPrice' => $product->get_regular_price(),
        'description' => $product->get_description(),
        'shortDescription' => $product->get_short_description(),
        'bookingDuration' => $bookable->get_duration(),
        'bookingDurationUnit' => $bookable->get_duration_unit(),
        'bookingDurationType' => $bookable->get_duration_type(),
        'bookingMinDuration' => $bookable->get_min_duration(),
        'bookingMaxDuration' => $bookable->get_max_duration(),
        'bookingCost' => (float) $bookable->get_cost(),
        'bookingBlockCost' => (float) $bookable->get_block_cost(),
        'bookingHasPersons' => $bookable->has_persons(),
        'bookingMinPersons' => $bookable->get_min_persons(),
        'bookingMaxPersons' => $bookable->get_max_persons(),
        'bookingHasResources' => $bookable->has_resources(),
        'bookingRequiresConfirmation' => $bookable->requires_confirmation(),
        'bookingCanBeCancelled' => $bookable->can_be_cancelled(),
        'bookingDefaultAvailability' => $bookable->get_default_date_availability(),
        'bookingCalendarDisplayMode' => $bookable->get_calendar_display_mode(),
        'bookingFirstBlockTime' => $bookable->get_first_block_time(),
        'bookingBufferPeriod' => $bookable->get_buffer_period(),
        'resources' => $resources,
    ];
}

function chirostretch_check_booking_date_availability($product, $timestamp, $resource_id = null) {
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

    return $product->get_default_date_availability() === 'available';
}

function chirostretch_get_booking_time_slots($product, $timestamp, $resource_id = null) {
    $slots = [];
    $duration = $product->get_duration();
    $duration_unit = $product->get_duration_unit();
    $first_block_time = $product->get_first_block_time();

    if (in_array($duration_unit, ['day', 'month'])) {
        return [[
            'date' => date('Y-m-d', $timestamp),
            'time' => '00:00',
            'available' => true,
            'booked' => 0,
        ]];
    }

    $interval_minutes = $duration_unit === 'hour' ? $duration * 60 : $duration;
    $start_hour = $first_block_time ? (int) substr($first_block_time, 0, 2) : 9;
    $end_hour = 18;

    $current_minutes = $start_hour * 60;
    $end_minutes = $end_hour * 60;

    while ($current_minutes + $interval_minutes <= $end_minutes) {
        $hours = floor($current_minutes / 60);
        $mins = $current_minutes % 60;

        $slots[] = [
            'date' => date('Y-m-d', $timestamp),
            'time' => sprintf('%02d:%02d', $hours, $mins),
            'available' => true,
            'booked' => 0,
        ];

        $current_minutes += $interval_minutes;
    }

    return $slots;
}
