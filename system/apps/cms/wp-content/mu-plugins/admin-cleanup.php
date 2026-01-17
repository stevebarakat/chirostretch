<?php
/**
 * Plugin Name: Admin Cleanup
 * Description: Removes unnecessary admin UI elements for cleaner UX
 * Version: 1.0.0
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Completely disable Yoast SEO for customer users
 *
 * Customers don't create public content, so we hide:
 * - SEO meta fields (title, description)
 * - Social profiles
 * - Author archive settings
 *
 * This prevents customer data from being indexed by search engines.
 */
add_filter('wpseo_enable_author_settings', 'chirostretch_disable_yoast_for_customers', 10, 2);

function chirostretch_disable_yoast_for_customers($enable, $user) {
    // If user is a customer, disable all Yoast author settings
    if ($user && is_array($user->roles) && in_array('customer', $user->roles)) {
        return false;
    }

    return $enable;
}

/**
 * Hide Yoast SEO section via CSS and JS for customers
 *
 * Additional safeguard in case the filter doesn't catch everything
 */
add_action('admin_head-user-edit.php', 'chirostretch_hide_yoast_for_customers');
add_action('admin_head-profile.php', 'chirostretch_hide_yoast_for_customers');

function chirostretch_hide_yoast_for_customers() {
    // Check if editing a customer
    $user_id = isset($_GET['user_id']) ? intval($_GET['user_id']) : get_current_user_id();
    $user = get_userdata($user_id);

    if ($user && in_array('customer', $user->roles)) {
        ?>
        <style>
            .yoast-settings,
            #wpseo-author-metabox,
            .user-yoast-seo-wrap,
            h2.yoast {
                display: none !important;
            }
        </style>
        <script>
        (function() {
            // Wait for DOM ready
            document.addEventListener('DOMContentLoaded', function() {
                // Find and hide Yoast SEO sections by heading text
                const headings = document.querySelectorAll('h2, h3');
                headings.forEach(function(heading) {
                    if (heading.textContent.includes('Yoast SEO')) {
                        // Hide the heading
                        heading.style.display = 'none';
                        // Hide the next table/section (usually the settings)
                        let next = heading.nextElementSibling;
                        while (next && next.tagName !== 'H2' && next.tagName !== 'H3') {
                            next.style.display = 'none';
                            next = next.nextElementSibling;
                        }
                    }
                });
            });
        })();
        </script>
        <?php
    }
}
