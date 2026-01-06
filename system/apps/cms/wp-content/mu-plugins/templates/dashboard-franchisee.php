<?php
/**
 * Franchisee Dashboard Template
 *
 * Variables available:
 * - $user: WP_User object
 * - $location: array|null - Franchisee's location data
 * - $staff: array - Staff members at this location
 */

if (!defined('ABSPATH')) {
    exit;
}
?>

<div class="chs-dashboard">
    <div class="chs-dashboard__container">
        <h1 class="chs-dashboard__title">Franchisee Dashboard</h1>

        <?php if ($location): ?>
            <!-- Location Overview -->
            <div class="chs-dashboard__grid">
                <div class="chs-dashboard__card">
                    <h2 class="chs-dashboard__card-title">Location</h2>
                    <p style="font-size: 1.25rem; font-weight: 600; margin-bottom: 0.5rem;">
                        <?php echo esc_html($location['title']); ?>
                    </p>
                    <?php if (!empty($location['address'])): ?>
                        <p style="margin: 0; color: var(--chs-gray-600);">
                            <?php echo esc_html($location['address']); ?><br>
                            <?php echo esc_html($location['city']); ?>, <?php echo esc_html($location['state']); ?>
                        </p>
                    <?php endif; ?>
                    <?php if (!empty($location['phone'])): ?>
                        <p style="margin-top: 0.5rem; color: var(--chs-gray-600);">
                            <?php echo esc_html($location['phone']); ?>
                        </p>
                    <?php endif; ?>
                </div>

                <div class="chs-dashboard__card">
                    <h3 class="chs-dashboard__card-title">Staff Count</h3>
                    <p class="chs-dashboard__card-value"><?php echo count($staff); ?></p>
                </div>
            </div>

            <!-- Staff List -->
            <?php if (!empty($staff)): ?>
            <div class="chs-dashboard__content" style="margin-top: 1.5rem;">
                <h3 class="chs-dashboard__card-title">Staff Members</h3>
                <div class="chs-dashboard__staff-list">
                    <?php foreach ($staff as $member): ?>
                        <div class="chs-dashboard__staff-item">
                            <?php if (!empty($member['photo'])): ?>
                                <img
                                    src="<?php echo esc_url($member['photo']['sizes']['thumbnail'] ?? $member['photo']['url']); ?>"
                                    alt=""
                                    class="chs-dashboard__staff-photo"
                                >
                            <?php else: ?>
                                <div class="chs-dashboard__staff-photo"></div>
                            <?php endif; ?>
                            <div>
                                <div class="chs-dashboard__staff-name">
                                    <?php echo esc_html($member['title']); ?>
                                </div>
                                <div class="chs-dashboard__staff-role">
                                    <?php echo esc_html(ucwords(str_replace('_', ' ', $member['staff_type'] ?? 'Staff'))); ?>
                                </div>
                            </div>
                        </div>
                    <?php endforeach; ?>
                </div>
            </div>
            <?php else: ?>
            <div class="chs-dashboard__content" style="margin-top: 1.5rem;">
                <p>No staff members assigned to this location yet.</p>
            </div>
            <?php endif; ?>

            <!-- Hours -->
            <?php if (!empty($location['hours'])): ?>
            <div class="chs-dashboard__content" style="margin-top: 1.5rem;">
                <h3 class="chs-dashboard__card-title">Business Hours</h3>
                <table class="chs-dashboard__table">
                    <tbody>
                        <?php
                        $days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
                        foreach ($days as $day):
                            $hours = $location['hours'];
                            $open = $hours[$day . '_open'] ?? '';
                            $close = $hours[$day . '_close'] ?? '';
                            $closed = !empty($hours[$day . '_closed']);
                        ?>
                            <tr>
                                <td style="text-transform: capitalize; font-weight: 500;">
                                    <?php echo esc_html($day); ?>
                                </td>
                                <td>
                                    <?php if ($closed): ?>
                                        <span style="color: var(--chs-gray-600);">Closed</span>
                                    <?php elseif ($open && $close): ?>
                                        <?php echo esc_html($open); ?> - <?php echo esc_html($close); ?>
                                    <?php else: ?>
                                        <span style="color: var(--chs-gray-600);">—</span>
                                    <?php endif; ?>
                                </td>
                            </tr>
                        <?php endforeach; ?>
                    </tbody>
                </table>
            </div>
            <?php endif; ?>

            <div class="chs-dashboard__content" style="margin-top: 1.5rem;">
                <p style="color: var(--chs-gray-600);">
                    To update location details or manage staff, please contact the admin team.
                </p>
            </div>

        <?php else: ?>
            <div class="chs-dashboard__content">
                <p>Welcome, <?php echo esc_html($user->display_name); ?>!</p>
                <p>No location is currently assigned to your account. Please contact support if you believe this is an error.</p>
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
