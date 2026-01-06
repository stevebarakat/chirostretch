<?php
/**
 * Franchise Applicant Dashboard Template
 *
 * Variables available:
 * - $user: WP_User object
 */

if (!defined('ABSPATH')) {
    exit;
}

// Check if application has been approved (user now has franchisee role)
$is_approved = in_array('franchisee', (array) $user->roles, true);

if ($is_approved) {
    wp_redirect(home_url('/dashboard/franchisee/'));
    exit;
}

// Get application entry if available
$entry_id = get_user_meta($user->ID, 'franchise_application_entry_id', true);
$application_date = get_user_meta($user->ID, 'franchise_application_date', true);
?>

<div class="chs-dashboard">
    <div class="chs-dashboard__container">
        <h1 class="chs-dashboard__title">Application Status</h1>

        <div class="chs-dashboard__content">
            <div style="text-align: center; padding: 2rem 0;">
                <div style="margin-bottom: 1.5rem;">
                    <span class="chs-dashboard__badge chs-dashboard__badge--pending" style="font-size: 1rem; padding: 0.5rem 1rem;">
                        Under Review
                    </span>
                </div>

                <h2 style="margin-bottom: 0.5rem;">Thank you for applying!</h2>
                <p style="color: var(--chs-gray-600); max-width: 500px; margin: 0 auto;">
                    Your franchise application is currently being reviewed by our team.
                    We'll contact you at <strong><?php echo esc_html($user->user_email); ?></strong> with updates.
                </p>

                <?php if ($application_date): ?>
                    <p style="color: var(--chs-gray-600); margin-top: 1rem; font-size: 0.875rem;">
                        Application submitted: <?php echo esc_html(date('F j, Y', strtotime($application_date))); ?>
                    </p>
                <?php endif; ?>
            </div>
        </div>

        <div class="chs-dashboard__content" style="margin-top: 1.5rem;">
            <h3 class="chs-dashboard__card-title">What happens next?</h3>
            <ol style="color: var(--chs-gray-700); padding-left: 1.25rem; line-height: 1.8;">
                <li>Our team reviews your application (typically 3-5 business days)</li>
                <li>We may reach out with follow-up questions</li>
                <li>If approved, you'll receive franchise agreement documents</li>
                <li>Once signed, your franchisee dashboard will be activated</li>
            </ol>
        </div>

        <div class="chs-dashboard__content" style="margin-top: 1.5rem;">
            <h3 class="chs-dashboard__card-title">Questions?</h3>
            <p style="color: var(--chs-gray-700);">
                Contact our franchise team at
                <a href="mailto:franchise@chirostretch.com" style="color: var(--chs-primary);">
                    franchise@chirostretch.com
                </a>
            </p>
        </div>

        <div class="chs-dashboard__actions" style="margin-top: 1.5rem;">
            <a href="<?php echo esc_url(home_url()); ?>" class="chs-dashboard__link">
                Return to Site
            </a>
            <a href="<?php echo esc_url(wp_logout_url(home_url())); ?>" class="chs-dashboard__link">
                Log Out
            </a>
        </div>
    </div>
</div>
