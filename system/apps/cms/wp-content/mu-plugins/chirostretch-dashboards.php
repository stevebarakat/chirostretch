<?php
/**
 * Plugin Name: ChiroStretch Dashboards
 * Description: Operational dashboards for staff and franchisees. Capability-gated frontend pages.
 * Version: 1.0.0
 * Author: ChiroStretch
 *
 * Architecture:
 * - WooCommerce /my-account handles customer commerce (orders, billing, addresses)
 * - This plugin handles operational dashboards (staff, franchisee management)
 * - Next.js handles public presentation only
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Dashboard Routes and Capabilities
 *
 * /dashboard              - Main dashboard (redirects based on role)
 * /dashboard/staff        - Practitioner dashboard (requires practitioner role)
 * /dashboard/franchisee   - Franchisee dashboard (requires franchisee role)
 */
class ChiroStretch_Dashboards {

    const SLUG_MAIN = 'dashboard';
    const SLUG_STAFF = 'dashboard/staff';
    const SLUG_FRANCHISEE = 'dashboard/franchisee';

    /**
     * Roles that can access the practitioner dashboard
     */
    const STAFF_ROLES = [
        'practitioner',
    ];

    public function __construct() {
        add_action('init', [$this, 'register_rewrite_rules']);
        add_filter('query_vars', [$this, 'register_query_vars']);
        add_action('template_redirect', [$this, 'handle_dashboard_routes']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_dashboard_styles']);

        // Redirect users to appropriate dashboard after login
        add_filter('woocommerce_login_redirect', [$this, 'login_redirect'], 10, 2);
        add_filter('login_redirect', [$this, 'login_redirect'], 10, 3);

        // Flush rewrite rules on activation
        register_activation_hook(__FILE__, [$this, 'flush_rewrite_rules']);
    }

    /**
     * Register rewrite rules for dashboard routes
     */
    public function register_rewrite_rules() {
        add_rewrite_rule(
            '^dashboard/staff/?$',
            'index.php?chs_dashboard=staff',
            'top'
        );

        add_rewrite_rule(
            '^dashboard/franchisee/?$',
            'index.php?chs_dashboard=franchisee',
            'top'
        );

        add_rewrite_rule(
            '^dashboard/?$',
            'index.php?chs_dashboard=main',
            'top'
        );
    }

    /**
     * Register custom query vars
     */
    public function register_query_vars($vars) {
        $vars[] = 'chs_dashboard';
        return $vars;
    }

    /**
     * Handle dashboard route requests
     */
    public function handle_dashboard_routes() {
        $dashboard = get_query_var('chs_dashboard');

        if (!$dashboard) {
            return;
        }

        // Require login for all dashboard pages
        if (!is_user_logged_in()) {
            wp_redirect(wp_login_url(home_url('/dashboard/')));
            exit;
        }

        $user = wp_get_current_user();

        switch ($dashboard) {
            case 'main':
                $this->handle_main_dashboard($user);
                break;

            case 'staff':
                $this->handle_staff_dashboard($user);
                break;

            case 'franchisee':
                $this->handle_franchisee_dashboard($user);
                break;

            default:
                // Unknown dashboard, redirect to main
                wp_redirect(home_url('/dashboard/'));
                exit;
        }
    }

    /**
     * Main dashboard - redirects based on role
     */
    private function handle_main_dashboard($user) {
        // Check role priority and redirect accordingly
        if ($this->user_has_role($user, 'franchisee')) {
            wp_redirect(home_url('/dashboard/franchisee/'));
            exit;
        }

        if ($this->user_has_any_role($user, self::STAFF_ROLES)) {
            wp_redirect(home_url('/dashboard/staff/'));
            exit;
        }

        if ($this->user_has_role($user, 'franchise_applicant')) {
            // Applicants see a status page
            $this->render_template('applicant');
            return;
        }

        // Default: customers go to WooCommerce My Account
        wp_redirect(wc_get_page_permalink('myaccount'));
        exit;
    }

    /**
     * Staff dashboard
     */
    private function handle_staff_dashboard($user) {
        if (!$this->user_has_any_role($user, self::STAFF_ROLES)) {
            wp_redirect(home_url('/dashboard/'));
            exit;
        }

        $this->render_template('staff', [
            'user' => $user,
            'staff_profile' => $this->get_staff_profile($user->ID),
        ]);
    }

    /**
     * Franchisee dashboard
     */
    private function handle_franchisee_dashboard($user) {
        if (!$this->user_has_role($user, 'franchisee')) {
            wp_redirect(home_url('/dashboard/'));
            exit;
        }

        $this->render_template('franchisee', [
            'user' => $user,
            'location' => $this->get_franchisee_location($user->ID),
            'staff' => $this->get_location_staff($user->ID),
        ]);
    }

    /**
     * Render a dashboard template
     */
    private function render_template($template, $data = []) {
        // Extract data for use in template
        extract($data);

        // Set page title
        add_filter('document_title_parts', function($title) use ($template) {
            $titles = [
                'staff' => 'Staff Dashboard',
                'franchisee' => 'Franchisee Dashboard',
                'applicant' => 'Application Status',
            ];
            $title['title'] = $titles[$template] ?? 'Dashboard';
            return $title;
        });

        // Load header
        get_header('dashboard');

        // Load template
        $template_file = plugin_dir_path(__FILE__) . "templates/dashboard-{$template}.php";

        if (file_exists($template_file)) {
            include $template_file;
        } else {
            // Fallback inline template
            $this->render_fallback_template($template, $data);
        }

        // Load footer
        get_footer('dashboard');

        exit;
    }

    /**
     * Fallback template if file doesn't exist
     */
    private function render_fallback_template($template, $data) {
        ?>
        <div class="chs-dashboard">
            <div class="chs-dashboard__container">
                <h1 class="chs-dashboard__title">
                    <?php
                    switch ($template) {
                        case 'staff':
                            echo 'Staff Dashboard';
                            break;
                        case 'franchisee':
                            echo 'Franchisee Dashboard';
                            break;
                        case 'applicant':
                            echo 'Application Status';
                            break;
                        default:
                            echo 'Dashboard';
                    }
                    ?>
                </h1>

                <div class="chs-dashboard__content">
                    <?php if ($template === 'staff'): ?>
                        <p>Welcome, <?php echo esc_html($data['user']->display_name); ?>!</p>
                        <p>Your staff dashboard is being set up. Check back soon.</p>

                    <?php elseif ($template === 'franchisee'): ?>
                        <p>Welcome, <?php echo esc_html($data['user']->display_name); ?>!</p>
                        <p>Your franchisee dashboard is being set up. Check back soon.</p>

                    <?php elseif ($template === 'applicant'): ?>
                        <p>Your franchise application is being reviewed.</p>
                        <p>We'll contact you at <strong><?php echo esc_html($data['user']->user_email); ?></strong> with updates.</p>

                    <?php else: ?>
                        <p>Dashboard content coming soon.</p>
                    <?php endif; ?>
                </div>

                <div class="chs-dashboard__actions">
                    <a href="<?php echo esc_url(wp_logout_url(home_url())); ?>" class="chs-dashboard__link">
                        Log Out
                    </a>
                </div>
            </div>
        </div>
        <?php
    }

    /**
     * Enqueue dashboard styles
     */
    public function enqueue_dashboard_styles() {
        if (!get_query_var('chs_dashboard')) {
            return;
        }

        wp_enqueue_style(
            'chs-dashboard',
            plugin_dir_url(__FILE__) . 'assets/dashboard.css',
            [],
            '1.0.0'
        );
    }

    /**
     * Check if user has a specific role
     */
    private function user_has_role($user, $role) {
        return in_array($role, (array) $user->roles, true);
    }

    /**
     * Check if user has any of the given roles
     */
    private function user_has_any_role($user, $roles) {
        return !empty(array_intersect($roles, (array) $user->roles));
    }

    /**
     * Get staff profile for a user
     */
    private function get_staff_profile($user_id) {
        // Find staff post linked to this user
        $staff_posts = get_posts([
            'post_type' => 'staff',
            'meta_key' => 'user_account',
            'meta_value' => $user_id,
            'posts_per_page' => 1,
        ]);

        if (empty($staff_posts)) {
            return null;
        }

        $staff = $staff_posts[0];

        return [
            'id' => $staff->ID,
            'title' => $staff->post_title,
            'location' => get_field('location', $staff->ID),
            'staff_type' => get_field('staff_type', $staff->ID),
            'services' => get_field('services_offered', $staff->ID),
            'bio' => get_field('bio', $staff->ID),
            'photo' => get_field('photo', $staff->ID),
        ];
    }

    /**
     * Get franchisee's location
     */
    private function get_franchisee_location($user_id) {
        // Find location post linked to this franchisee
        $locations = get_posts([
            'post_type' => 'location',
            'meta_key' => 'franchisee',
            'meta_value' => $user_id,
            'posts_per_page' => 1,
        ]);

        if (empty($locations)) {
            return null;
        }

        $location = $locations[0];

        return [
            'id' => $location->ID,
            'title' => $location->post_title,
            'address' => get_field('address', $location->ID),
            'city' => get_field('city', $location->ID),
            'state' => get_field('state', $location->ID),
            'phone' => get_field('phone', $location->ID),
            'hours' => get_field('hours', $location->ID),
        ];
    }

    /**
     * Get staff for a franchisee's location
     */
    private function get_location_staff($user_id) {
        $location = $this->get_franchisee_location($user_id);

        if (!$location) {
            return [];
        }

        $staff = get_posts([
            'post_type' => 'staff',
            'meta_key' => 'location',
            'meta_value' => $location['id'],
            'posts_per_page' => -1,
        ]);

        return array_map(function($s) {
            return [
                'id' => $s->ID,
                'title' => $s->post_title,
                'staff_type' => get_field('staff_type', $s->ID),
                'photo' => get_field('photo', $s->ID),
            ];
        }, $staff);
    }

    /**
     * Flush rewrite rules
     */
    public function flush_rewrite_rules() {
        $this->register_rewrite_rules();
        flush_rewrite_rules();
    }

    /**
     * Redirect users to appropriate dashboard after login
     *
     * @param string $redirect_to Default redirect URL
     * @param mixed  $user_or_requested For woocommerce_login_redirect: WP_User, for login_redirect: requested URL
     * @param mixed  $user For login_redirect only: WP_User or WP_Error
     * @return string
     */
    public function login_redirect($redirect_to, $user_or_requested, $user = null) {
        // Handle both filter signatures
        if ($user instanceof WP_User) {
            $current_user = $user;
        } elseif ($user_or_requested instanceof WP_User) {
            $current_user = $user_or_requested;
        } else {
            return $redirect_to;
        }

        // Don't redirect if there was an error
        if (is_wp_error($current_user)) {
            return $redirect_to;
        }

        // Franchisees go to franchisee dashboard
        if ($this->user_has_role($current_user, 'franchisee')) {
            return home_url('/dashboard/franchisee/');
        }

        // Staff go to staff dashboard
        if ($this->user_has_any_role($current_user, self::STAFF_ROLES)) {
            return home_url('/dashboard/staff/');
        }

        // Franchise applicants go to main dashboard (shows status)
        if ($this->user_has_role($current_user, 'franchise_applicant')) {
            return home_url('/dashboard/');
        }

        // Everyone else (customers, admins) keeps default redirect
        return $redirect_to;
    }
}

// Initialize
new ChiroStretch_Dashboards();

/**
 * Flush rewrite rules on plugin activation
 * Run: wp eval "do_action('activate_mu-plugins/chirostretch-dashboards.php');"
 * Or simply visit Settings > Permalinks in WordPress admin
 */
