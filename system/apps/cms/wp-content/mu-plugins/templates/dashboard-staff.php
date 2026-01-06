<?php
/**
 * Staff Dashboard Template
 *
 * Variables available:
 * - $user: WP_User object
 * - $staff_profile: array|null - Staff profile data from ACF
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="chs-dashboard">
    <div class="chs-dashboard__container">
        <h1 class="chs-dashboard__title">Staff Dashboard</h1>

        <?php if ($staff_profile): ?>
            <div class="chs-dashboard__grid">
                <!-- Profile Card -->
                <div class="chs-dashboard__card">
                    <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem;">
                        <?php if (!empty($staff_profile['photo'])): ?>
                            <img
                                src="<?php echo esc_url($staff_profile['photo']['url']); ?>"
                                alt=""
                                class="chs-dashboard__staff-photo"
                                style="width: 64px; height: 64px;"
                            >
                        <?php else: ?>
                            <div class="chs-dashboard__staff-photo" style="width: 64px; height: 64px;"></div>
                        <?php endif; ?>
                        <div>
                            <h2 style="margin: 0; font-size: 1.25rem;"><?php echo esc_html($staff_profile['title']); ?></h2>
                            <p style="margin: 0; color: var(--chs-gray-600);">
                                <?php echo esc_html(ucwords(str_replace('_', ' ', $staff_profile['staff_type'] ?? 'Staff'))); ?>
                            </p>
                        </div>
                    </div>

                    <?php if (!empty($staff_profile['location'])): ?>
                        <p style="margin: 0; color: var(--chs-gray-600);">
                            <strong>Location:</strong>
                            <?php echo esc_html(get_the_title($staff_profile['location'])); ?>
                        </p>
                    <?php endif; ?>
                </div>

                <!-- Services Card -->
                <?php if (!empty($staff_profile['services'])): ?>
                <div class="chs-dashboard__card">
                    <h3 class="chs-dashboard__card-title">Services Offered</h3>
                    <ul style="margin: 0; padding-left: 1.25rem; color: var(--chs-gray-700);">
                        <?php foreach ($staff_profile['services'] as $service): ?>
                            <li><?php echo esc_html(get_the_title($service)); ?></li>
                        <?php endforeach; ?>
                    </ul>
                </div>
                <?php endif; ?>
            </div>

            <!-- Bio -->
            <?php if (!empty($staff_profile['bio'])): ?>
            <div class="chs-dashboard__content" style="margin-top: 1.5rem;">
                <h3 class="chs-dashboard__card-title">Bio</h3>
                <p><?php echo esc_html($staff_profile['bio']); ?></p>
            </div>
            <?php endif; ?>

            <div class="chs-dashboard__content" style="margin-top: 1.5rem;">
                <p style="color: var(--chs-gray-600);">
                    To update your profile information, please contact your location manager or admin.
                </p>
            </div>

        <?php else: ?>
            <div class="chs-dashboard__content">
                <p>Welcome, <?php echo esc_html($user->display_name); ?>!</p>
                <p>Your staff profile is being set up. Please contact your manager if you need immediate access.</p>
            </div>
        <?php endif; ?>

        <div class="chs-dashboard__actions" style="margin-top: 1.5rem;">
            <a href="<?php echo esc_url(wc_get_page_permalink('myaccount')); ?>" class="chs-dashboard__link">
                My Account
            </a>
            <a href="<?php echo esc_url(wp_logout_url(home_url())); ?>" class="chs-dashboard__link">
                Log Out
            </a>
        </div>
    </div>
</div>
