<?php
/**
 * Plugin Name: ChiroStretch Dashboards
 * Description: Operational dashboards for practitioners and franchisees. Capability-gated frontend pages.
 * Version: 1.0.0
 * Author: ChiroStretch
 *
 * Architecture:
 * - WooCommerce /my-account handles customer commerce (orders, billing, addresses)
 * - This plugin handles operational dashboards (practitioner, franchisee management)
 * - Next.js handles public presentation only
 */

if (!defined('ABSPATH')) {
    exit;
}

/**
 * Dashboard Routes and Capabilities
 *
 * /dashboard                - Main dashboard (redirects based on role)
 * /dashboard/practitioner   - Practitioner dashboard (requires practitioner role)
 * /dashboard/franchisee     - Franchisee dashboard (requires franchisee role)
 */
class ChiroStretch_Dashboards {

    const SLUG_MAIN = 'dashboard';
    const SLUG_PRACTITIONER = 'dashboard/practitioner';
    const SLUG_FRANCHISEE = 'dashboard/franchisee';

    /**
     * Roles that can access the practitioner dashboard
     */
    const PRACTITIONER_ROLES = [
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
            '^dashboard/practitioner/?$',
            'index.php?chs_dashboard=practitioner',
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

            case 'practitioner':
                $this->handle_practitioner_dashboard($user);
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

        if ($this->user_has_any_role($user, self::PRACTITIONER_ROLES)) {
            wp_redirect(home_url('/dashboard/practitioner/'));
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
     * Practitioner dashboard
     */
    private function handle_practitioner_dashboard($user) {
        if (!$this->user_has_any_role($user, self::PRACTITIONER_ROLES)) {
            wp_redirect(home_url('/dashboard/'));
            exit;
        }

        $this->render_template('practitioner', [
            'user' => $user,
            'practitioner_profile' => $this->get_practitioner_profile($user->ID),
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
            'practitioners' => $this->get_location_practitioners($user->ID),
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
                'practitioner' => 'Practitioner Dashboard',
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
                        case 'practitioner':
                            echo 'Practitioner Dashboard';
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
                    <?php if ($template === 'practitioner'): ?>
                        <p>Welcome, <?php echo esc_html($data['user']->display_name); ?>!</p>
                        <p>Your practitioner dashboard is being set up. Check back soon.</p>

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
     * Get practitioner profile for a user
     */
    private function get_practitioner_profile($user_id) {
        // Find practitioner post linked to this user
        $practitioner_posts = get_posts([
            'post_type' => 'practitioner',
            'meta_key' => 'user_account',
            'meta_value' => $user_id,
            'posts_per_page' => 1,
        ]);

        if (empty($practitioner_posts)) {
            return null;
        }

        $practitioner = $practitioner_posts[0];

        return [
            'id' => $practitioner->ID,
            'title' => $practitioner->post_title,
            'location' => get_field('location', $practitioner->ID),
            'discipline' => wp_get_object_terms($practitioner->ID, 'discipline', ['fields' => 'slugs'])[0] ?? '',
            'services' => wp_get_object_terms($practitioner->ID, 'service', ['fields' => 'slugs']) ?: [],
            'bio' => get_field('bio', $practitioner->ID),
            'photo' => get_field('photo', $practitioner->ID),
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
     * Get practitioners for a franchisee's location
     */
    private function get_location_practitioners($user_id) {
        $location = $this->get_franchisee_location($user_id);

        if (!$location) {
            return [];
        }

        $practitioners = get_posts([
            'post_type' => 'practitioner',
            'meta_key' => 'location',
            'meta_value' => $location['id'],
            'posts_per_page' => -1,
        ]);

        return array_map(function($p) {
            $discipline = wp_get_object_terms($p->ID, 'discipline', ['fields' => 'names'])[0] ?? '';
            return [
                'id' => $p->ID,
                'title' => $p->post_title,
                'discipline' => $discipline,
                'photo' => get_field('photo', $p->ID),
            ];
        }, $practitioners);
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

        // Practitioners go to practitioner dashboard
        if ($this->user_has_any_role($current_user, self::PRACTITIONER_ROLES)) {
            return home_url('/dashboard/practitioner/');
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
