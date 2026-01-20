<?php
/**
 * Plugin Name: GraphQL Auth & Coupon Mutations
 * Description: GraphQL mutations for password reset and coupon operations (migrated from REST endpoints)
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Verify internal secret from HTTP headers for protected mutations
 */
function chirostretch_verify_graphql_internal_secret(): bool {
    $secret = $_SERVER['HTTP_X_INTERNAL_SECRET'] ?? '';
    $expected = defined('CHIROSTRETCH_INTERNAL_SECRET')
        ? CHIROSTRETCH_INTERNAL_SECRET
        : getenv('CHIROSTRETCH_INTERNAL_SECRET');

    // Allow in dev if no secret configured
    if (empty($expected)) {
        return true;
    }

    return $secret === $expected;
}

add_action('graphql_register_types', function () {

    // =========================================================================
    // Output Types
    // =========================================================================

    // PasswordResetUserData - returned from requestPasswordReset
    register_graphql_object_type('PasswordResetUserData', [
        'description' => 'User data for password reset email',
        'fields' => [
            'key'       => ['type' => 'String', 'description' => 'Password reset key'],
            'login'     => ['type' => 'String', 'description' => 'User login (username)'],
            'email'     => ['type' => 'String', 'description' => 'User email address'],
            'firstName' => ['type' => 'String', 'description' => 'User first name for personalized email'],
        ],
    ]);

    // CouponResult - returned from generateNewPatientCoupon
    register_graphql_object_type('CouponResult', [
        'description' => 'Result of coupon generation',
        'fields' => [
            'success'        => ['type' => 'Boolean', 'description' => 'Whether the operation succeeded'],
            'couponCode'     => ['type' => 'String', 'description' => 'The generated coupon code'],
            'couponId'       => ['type' => 'Int', 'description' => 'WooCommerce coupon post ID'],
            'discountAmount' => ['type' => 'Float', 'description' => 'Discount amount in dollars'],
            'finalPrice'     => ['type' => 'Float', 'description' => 'Final price after discount'],
            'expires'        => ['type' => 'String', 'description' => 'Expiration date (Y-m-d format)'],
            'existing'       => ['type' => 'Boolean', 'description' => 'True if coupon already existed'],
            'message'        => ['type' => 'String', 'description' => 'Additional message'],
        ],
    ]);

    // CouponValidation - returned from validateCoupon
    register_graphql_object_type('CouponValidation', [
        'description' => 'Result of coupon validation',
        'fields' => [
            'valid'          => ['type' => 'Boolean', 'description' => 'Whether the coupon is valid'],
            'discountAmount' => ['type' => 'Float', 'description' => 'Discount amount'],
            'discountType'   => ['type' => 'String', 'description' => 'Type of discount (fixed_product, percent, etc.)'],
            'couponCode'     => ['type' => 'String', 'description' => 'The validated coupon code'],
            'error'          => ['type' => 'String', 'description' => 'Error code if invalid'],
            'message'        => ['type' => 'String', 'description' => 'Human-readable message'],
        ],
    ]);

    // =========================================================================
    // Order Types
    // =========================================================================

    // CheckoutAddressInput - billing/shipping address for order creation
    register_graphql_input_type('CheckoutAddressInput', [
        'description' => 'Customer address input for checkout',
        'fields' => [
            'firstName' => ['type' => ['non_null' => 'String'], 'description' => 'First name'],
            'lastName'  => ['type' => ['non_null' => 'String'], 'description' => 'Last name'],
            'email'     => ['type' => ['non_null' => 'String'], 'description' => 'Email address'],
            'phone'     => ['type' => 'String', 'description' => 'Phone number'],
            'address1'  => ['type' => ['non_null' => 'String'], 'description' => 'Street address'],
            'address2'  => ['type' => 'String', 'description' => 'Apartment, suite, etc.'],
            'city'      => ['type' => ['non_null' => 'String'], 'description' => 'City'],
            'state'     => ['type' => ['non_null' => 'String'], 'description' => 'State/Province'],
            'postcode'  => ['type' => ['non_null' => 'String'], 'description' => 'ZIP/Postal code'],
            'country'   => ['type' => ['non_null' => 'String'], 'description' => 'Country code (US, CA, etc.)'],
        ],
    ]);

    // CheckoutLineItemInput - product line item for order
    register_graphql_input_type('CheckoutLineItemInput', [
        'description' => 'Line item input for checkout',
        'fields' => [
            'productId'   => ['type' => ['non_null' => 'Int'], 'description' => 'WooCommerce product ID'],
            'quantity'    => ['type' => ['non_null' => 'Int'], 'description' => 'Quantity'],
            'variationId' => ['type' => 'Int', 'description' => 'Variation ID for variable products'],
            'metaData'    => ['type' => ['list_of' => 'CheckoutMetaDataInput'], 'description' => 'Additional metadata (for bookings, etc.)'],
        ],
    ]);

    // CheckoutMetaDataInput - key/value metadata for line items
    register_graphql_input_type('CheckoutMetaDataInput', [
        'description' => 'Key-value metadata for line items',
        'fields' => [
            'key'   => ['type' => ['non_null' => 'String'], 'description' => 'Meta key'],
            'value' => ['type' => ['non_null' => 'String'], 'description' => 'Meta value'],
        ],
    ]);

    // CheckoutOrderResult - returned from createCheckoutOrder
    register_graphql_object_type('CheckoutOrderResult', [
        'description' => 'Result of checkout order creation',
        'fields' => [
            'success'    => ['type' => 'Boolean', 'description' => 'Whether order was created successfully'],
            'orderId'    => ['type' => 'Int', 'description' => 'WooCommerce order ID'],
            'orderKey'   => ['type' => 'String', 'description' => 'Order key for verification'],
            'paymentUrl' => ['type' => 'String', 'description' => 'URL to complete payment on WordPress'],
            'total'      => ['type' => 'String', 'description' => 'Order total'],
            'status'     => ['type' => 'String', 'description' => 'Order status'],
            'error'      => ['type' => 'String', 'description' => 'Error code if failed'],
            'message'    => ['type' => 'String', 'description' => 'Human-readable message'],
        ],
    ]);

    // =========================================================================
    // Auth Mutations (Public)
    // =========================================================================

    /**
     * requestPasswordReset - Generate reset key and return user data for email
     * Returns generic success even if user not found (prevents enumeration)
     */
    register_graphql_mutation('requestPasswordReset', [
        'inputFields' => [
            'email' => [
                'type' => ['non_null' => 'String'],
                'description' => 'User email address',
            ],
        ],
        'outputFields' => [
            'success' => ['type' => 'Boolean', 'description' => 'Always true to prevent enumeration'],
            'user' => ['type' => 'PasswordResetUserData', 'description' => 'User data if found, null otherwise'],
        ],
        'mutateAndGetPayload' => function ($input) {
            $email = sanitize_email($input['email']);

            if (!is_email($email)) {
                return ['success' => true, 'user' => null];
            }

            $user = get_user_by('email', $email);

            if (!$user) {
                return ['success' => true, 'user' => null];
            }

            $key = get_password_reset_key($user);

            if (is_wp_error($key)) {
                return ['success' => true, 'user' => null];
            }

            return [
                'success' => true,
                'user' => [
                    'key'       => $key,
                    'login'     => $user->user_login,
                    'email'     => $user->user_email,
                    'firstName' => $user->first_name ?: null,
                ],
            ];
        },
    ]);

    /**
     * validatePasswordResetKey - Check if a reset key is valid
     */
    register_graphql_mutation('validatePasswordResetKey', [
        'inputFields' => [
            'key' => [
                'type' => ['non_null' => 'String'],
                'description' => 'Password reset key from email link',
            ],
            'login' => [
                'type' => ['non_null' => 'String'],
                'description' => 'User login (username or email)',
            ],
        ],
        'outputFields' => [
            'valid' => ['type' => 'Boolean', 'description' => 'Whether the key is valid'],
            'userLogin' => ['type' => 'String', 'description' => 'The user login if valid'],
            'error' => ['type' => 'String', 'description' => 'Error code if invalid'],
            'message' => ['type' => 'String', 'description' => 'Human-readable message'],
        ],
        'mutateAndGetPayload' => function ($input) {
            $key = $input['key'];
            $login = $input['login'];

            // Get user by login (username or email)
            $user = get_user_by('login', $login);
            if (!$user) {
                $user = get_user_by('email', $login);
            }

            if (!$user) {
                return [
                    'valid' => false,
                    'userLogin' => null,
                    'error' => 'invalid_user',
                    'message' => 'Invalid username or email.',
                ];
            }

            $check = check_password_reset_key($key, $user->user_login);

            if (is_wp_error($check)) {
                return [
                    'valid' => false,
                    'userLogin' => null,
                    'error' => 'invalid_key',
                    'message' => 'This password reset link is invalid or has expired.',
                ];
            }

            return [
                'valid' => true,
                'userLogin' => $user->user_login,
                'error' => null,
                'message' => null,
            ];
        },
    ]);

    /**
     * resetPassword - Reset user password with valid key
     */
    register_graphql_mutation('resetPassword', [
        'inputFields' => [
            'key' => [
                'type' => ['non_null' => 'String'],
                'description' => 'Password reset key from email link',
            ],
            'login' => [
                'type' => ['non_null' => 'String'],
                'description' => 'User login (username or email)',
            ],
            'password' => [
                'type' => ['non_null' => 'String'],
                'description' => 'New password (minimum 8 characters)',
            ],
        ],
        'outputFields' => [
            'success' => ['type' => 'Boolean', 'description' => 'Whether password was reset'],
            'error' => ['type' => 'String', 'description' => 'Error code if failed'],
            'message' => ['type' => 'String', 'description' => 'Human-readable message'],
        ],
        'mutateAndGetPayload' => function ($input) {
            $key = $input['key'];
            $login = $input['login'];
            $password = $input['password'];

            // Validate password strength
            if (strlen($password) < 8) {
                return [
                    'success' => false,
                    'error' => 'weak_password',
                    'message' => 'Password must be at least 8 characters long.',
                ];
            }

            // Get user by login (username or email)
            $user = get_user_by('login', $login);
            if (!$user) {
                $user = get_user_by('email', $login);
            }

            if (!$user) {
                return [
                    'success' => false,
                    'error' => 'invalid_user',
                    'message' => 'Invalid username or email.',
                ];
            }

            $check = check_password_reset_key($key, $user->user_login);

            if (is_wp_error($check)) {
                return [
                    'success' => false,
                    'error' => 'invalid_key',
                    'message' => 'This password reset link is invalid or has expired.',
                ];
            }

            // Reset the password
            reset_password($user, $password);

            // Clear any password reset cookies
            if (isset($_COOKIE['wp-resetpass-' . COOKIEHASH])) {
                setcookie('wp-resetpass-' . COOKIEHASH, '', time() - 3600, '/');
            }

            return [
                'success' => true,
                'error' => null,
                'message' => 'Password has been reset successfully.',
            ];
        },
    ]);

    // =========================================================================
    // Coupon Mutations (Internal Secret Protected)
    // =========================================================================

    /**
     * generateNewPatientCoupon - Create unique coupon for new patient leads
     * Requires X-Internal-Secret header
     */
    register_graphql_mutation('generateNewPatientCoupon', [
        'inputFields' => [
            'email' => [
                'type' => ['non_null' => 'String'],
                'description' => 'Patient email address',
            ],
            'firstName' => [
                'type' => 'String',
                'description' => 'Patient first name',
            ],
            'userId' => [
                'type' => 'Int',
                'description' => 'WordPress user ID if exists',
            ],
            'entryId' => [
                'type' => 'String',
                'description' => 'Gravity Forms entry ID for storing coupon code',
            ],
        ],
        'outputFields' => [
            'success'        => ['type' => 'Boolean'],
            'couponCode'     => ['type' => 'String'],
            'couponId'       => ['type' => 'Int'],
            'discountAmount' => ['type' => 'Float'],
            'finalPrice'     => ['type' => 'Float'],
            'expires'        => ['type' => 'String'],
            'existing'       => ['type' => 'Boolean'],
            'message'        => ['type' => 'String'],
            'error'          => ['type' => 'String'],
        ],
        'mutateAndGetPayload' => function ($input) {
            // Verify internal secret
            if (!chirostretch_verify_graphql_internal_secret()) {
                throw new \GraphQL\Error\UserError('Unauthorized');
            }

            $email = sanitize_email($input['email']);
            $first_name = sanitize_text_field($input['firstName'] ?? '');
            $user_id = intval($input['userId'] ?? 0);
            $entry_id = sanitize_text_field($input['entryId'] ?? '');

            if (!is_email($email)) {
                return [
                    'success' => false,
                    'error' => 'invalid_email',
                    'message' => 'Invalid email address',
                ];
            }

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
                $existing_coupon = new \WC_Coupon($existing_coupons[0]->ID);
                $coupon_code = $existing_coupon->get_code();
                $expiry_date = $existing_coupon->get_date_expires();

                // Store in GF entry meta even for existing coupons
                if ($entry_id && function_exists('gform_update_meta')) {
                    gform_update_meta($entry_id, 'coupon_code', strtoupper($coupon_code));
                    if ($expiry_date) {
                        gform_update_meta($entry_id, 'coupon_expires', $expiry_date->date('F j, Y'));
                    }
                    gform_update_meta($entry_id, 'coupon_final_price', '29');
                    // Trigger the "Coupon Generated" notification
                    if (function_exists('chirostretch_trigger_coupon_notification')) {
                        chirostretch_trigger_coupon_notification($entry_id);
                    }
                }

                return [
                    'success' => true,
                    'couponCode' => strtoupper($coupon_code),
                    'couponId' => $existing_coupons[0]->ID,
                    'discountAmount' => floatval($existing_coupon->get_amount()),
                    'finalPrice' => 29.0,
                    'expires' => $expiry_date ? $expiry_date->date('Y-m-d') : null,
                    'existing' => true,
                    'message' => 'Coupon already exists for this email',
                ];
            }

            // Get the bookable product ID for new patient consultation
            $product_id = function_exists('chirostretch_get_new_patient_product_id')
                ? chirostretch_get_new_patient_product_id()
                : 7149;

            // Create the coupon
            $coupon = new \WC_Coupon();
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
            $expiry = new \DateTime('+30 days');
            $coupon->set_date_expires($expiry->getTimestamp());

            $coupon_id = $coupon->save();

            if (!$coupon_id) {
                return [
                    'success' => false,
                    'error' => 'coupon_creation_failed',
                    'message' => 'Failed to create coupon',
                ];
            }

            // Store email reference for lookup
            update_post_meta($coupon_id, '_new_patient_email', $email);
            if ($user_id) {
                update_post_meta($coupon_id, '_new_patient_user_id', $user_id);
            }

            // Store coupon code in GF entry meta for notifications
            if ($entry_id && function_exists('gform_update_meta')) {
                gform_update_meta($entry_id, 'coupon_code', strtoupper($coupon_code));
                gform_update_meta($entry_id, 'coupon_expires', $expiry->format('F j, Y'));
                gform_update_meta($entry_id, 'coupon_final_price', '29');
                // Trigger the "Coupon Generated" notification
                if (function_exists('chirostretch_trigger_coupon_notification')) {
                    chirostretch_trigger_coupon_notification($entry_id);
                }
            }

            return [
                'success' => true,
                'couponCode' => strtoupper($coupon_code),
                'couponId' => $coupon_id,
                'discountAmount' => 70.0,
                'finalPrice' => 29.0,
                'expires' => $expiry->format('Y-m-d'),
                'existing' => false,
                'message' => null,
            ];
        },
    ]);

    /**
     * validateCoupon - Validate coupon code with email verification
     * Requires X-Internal-Secret header
     */
    register_graphql_mutation('validateCoupon', [
        'inputFields' => [
            'couponCode' => [
                'type' => ['non_null' => 'String'],
                'description' => 'Coupon code to validate',
            ],
            'email' => [
                'type' => ['non_null' => 'String'],
                'description' => 'Customer email for new patient coupon verification',
            ],
        ],
        'outputFields' => [
            'valid'          => ['type' => 'Boolean'],
            'discountAmount' => ['type' => 'Float'],
            'discountType'   => ['type' => 'String'],
            'couponCode'     => ['type' => 'String'],
            'error'          => ['type' => 'String'],
            'message'        => ['type' => 'String'],
        ],
        'mutateAndGetPayload' => function ($input) {
            // Verify internal secret
            if (!chirostretch_verify_graphql_internal_secret()) {
                throw new \GraphQL\Error\UserError('Unauthorized');
            }

            $coupon_code = strtoupper(trim($input['couponCode']));
            $email = strtolower(trim($input['email']));

            // Check if coupon exists
            $coupon_id = wc_get_coupon_id_by_code($coupon_code);

            if (!$coupon_id) {
                return [
                    'valid' => false,
                    'error' => 'invalid_code',
                    'message' => 'This coupon code is not valid',
                ];
            }

            $coupon = new \WC_Coupon($coupon_id);

            // Check if coupon is expired
            $expiry_date = $coupon->get_date_expires();
            if ($expiry_date && $expiry_date->getTimestamp() < time()) {
                return [
                    'valid' => false,
                    'error' => 'expired',
                    'message' => 'This coupon has expired',
                ];
            }

            // Check usage limit
            $usage_count = $coupon->get_usage_count();
            $usage_limit = $coupon->get_usage_limit();
            if ($usage_limit > 0 && $usage_count >= $usage_limit) {
                return [
                    'valid' => false,
                    'error' => 'already_used',
                    'message' => 'This coupon has already been used',
                ];
            }

            // Check if this is a new patient coupon (has _new_patient_email meta)
            $coupon_email = get_post_meta($coupon_id, '_new_patient_email', true);

            if ($coupon_email) {
                // This is a new patient coupon - verify email matches
                if (strtolower(trim($coupon_email)) !== $email) {
                    return [
                        'valid' => false,
                        'error' => 'email_mismatch',
                        'message' => 'This coupon is not valid for your email address',
                    ];
                }
            }

            // Coupon is valid
            return [
                'valid' => true,
                'discountAmount' => floatval($coupon->get_amount()),
                'discountType' => $coupon->get_discount_type(),
                'couponCode' => $coupon->get_code(),
                'error' => null,
                'message' => null,
            ];
        },
    ]);

    // =========================================================================
    // Order Mutations (Internal Secret Protected)
    // =========================================================================

    /**
     * createCheckoutOrder - Create an unpaid WooCommerce order from cart data
     * Requires X-Internal-Secret header
     *
     * Creates an order in "pending" status with line items, billing/shipping,
     * and optional coupon. Returns payment_url for redirect to WordPress checkout.
     */
    register_graphql_mutation('createCheckoutOrder', [
        'inputFields' => [
            'billing' => [
                'type' => ['non_null' => 'CheckoutAddressInput'],
                'description' => 'Billing address',
            ],
            'shipping' => [
                'type' => 'CheckoutAddressInput',
                'description' => 'Shipping address (uses billing if not provided)',
            ],
            'lineItems' => [
                'type' => ['non_null' => ['list_of' => 'CheckoutLineItemInput']],
                'description' => 'Products to order',
            ],
            'couponCode' => [
                'type' => 'String',
                'description' => 'Coupon code to apply',
            ],
            'customerNote' => [
                'type' => 'String',
                'description' => 'Order notes from customer',
            ],
        ],
        'outputFields' => [
            'success'    => ['type' => 'Boolean'],
            'orderId'    => ['type' => 'Int'],
            'orderKey'   => ['type' => 'String'],
            'paymentUrl' => ['type' => 'String'],
            'total'      => ['type' => 'String'],
            'status'     => ['type' => 'String'],
            'error'      => ['type' => 'String'],
            'message'    => ['type' => 'String'],
        ],
        'mutateAndGetPayload' => function ($input) {
            // Verify internal secret
            if (!chirostretch_verify_graphql_internal_secret()) {
                throw new \GraphQL\Error\UserError('Unauthorized');
            }

            $billing = $input['billing'];
            $shipping = $input['shipping'] ?? $billing;
            $line_items = $input['lineItems'];
            $coupon_code = $input['couponCode'] ?? null;
            $customer_note = $input['customerNote'] ?? '';

            // Validate line items
            if (empty($line_items)) {
                return [
                    'success' => false,
                    'error' => 'empty_cart',
                    'message' => 'No items in order',
                ];
            }

            try {
                // Create WooCommerce order
                $order = wc_create_order(['status' => 'pending']);

                if (is_wp_error($order)) {
                    return [
                        'success' => false,
                        'error' => 'order_creation_failed',
                        'message' => $order->get_error_message(),
                    ];
                }

                // Set billing address
                $order->set_billing_first_name(sanitize_text_field($billing['firstName']));
                $order->set_billing_last_name(sanitize_text_field($billing['lastName']));
                $order->set_billing_email(sanitize_email($billing['email']));
                $order->set_billing_phone(sanitize_text_field($billing['phone'] ?? ''));
                $order->set_billing_address_1(sanitize_text_field($billing['address1']));
                $order->set_billing_address_2(sanitize_text_field($billing['address2'] ?? ''));
                $order->set_billing_city(sanitize_text_field($billing['city']));
                $order->set_billing_state(sanitize_text_field($billing['state']));
                $order->set_billing_postcode(sanitize_text_field($billing['postcode']));
                $order->set_billing_country(sanitize_text_field($billing['country']));

                // Set shipping address
                $order->set_shipping_first_name(sanitize_text_field($shipping['firstName']));
                $order->set_shipping_last_name(sanitize_text_field($shipping['lastName']));
                $order->set_shipping_address_1(sanitize_text_field($shipping['address1']));
                $order->set_shipping_address_2(sanitize_text_field($shipping['address2'] ?? ''));
                $order->set_shipping_city(sanitize_text_field($shipping['city']));
                $order->set_shipping_state(sanitize_text_field($shipping['state']));
                $order->set_shipping_postcode(sanitize_text_field($shipping['postcode']));
                $order->set_shipping_country(sanitize_text_field($shipping['country']));

                // Add line items
                foreach ($line_items as $item) {
                    $product_id = absint($item['productId']);
                    $quantity = absint($item['quantity']);
                    $variation_id = isset($item['variationId']) ? absint($item['variationId']) : 0;

                    $product = wc_get_product($variation_id ?: $product_id);

                    if (!$product) {
                        // Skip invalid products but log it
                        error_log("[createCheckoutOrder] Product not found: {$product_id}");
                        continue;
                    }

                    $item_id = $order->add_product($product, $quantity);

                    // Add meta data if provided (for bookings, etc.)
                    if (!empty($item['metaData']) && $item_id) {
                        foreach ($item['metaData'] as $meta) {
                            wc_add_order_item_meta(
                                $item_id,
                                sanitize_text_field($meta['key']),
                                sanitize_text_field($meta['value'])
                            );
                        }
                    }
                }

                // Apply coupon if provided
                if ($coupon_code) {
                    $coupon_result = $order->apply_coupon(sanitize_text_field($coupon_code));
                    if (is_wp_error($coupon_result)) {
                        error_log("[createCheckoutOrder] Coupon error: " . $coupon_result->get_error_message());
                        // Continue without coupon - don't fail the order
                    }
                }

                // Add customer note
                if ($customer_note) {
                    $order->set_customer_note(sanitize_textarea_field($customer_note));
                }

                // Calculate totals
                $order->calculate_totals();

                // Save order
                $order->save();

                // Get payment URL
                $payment_url = $order->get_checkout_payment_url();

                return [
                    'success' => true,
                    'orderId' => $order->get_id(),
                    'orderKey' => $order->get_order_key(),
                    'paymentUrl' => $payment_url,
                    'total' => $order->get_total(),
                    'status' => $order->get_status(),
                    'error' => null,
                    'message' => null,
                ];

            } catch (\Exception $e) {
                error_log("[createCheckoutOrder] Exception: " . $e->getMessage());
                return [
                    'success' => false,
                    'error' => 'exception',
                    'message' => $e->getMessage(),
                ];
            }
        },
    ]);
});
