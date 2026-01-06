<?php
/**
 * Plugin Name: Franchise Application Status Page
 * Description: Token-authenticated status page for franchise applicants
 * Version: 1.0.0
 *
 * Architecture:
 * - No user account required - token-based access only
 * - Token validated via timing-safe hash comparison
 * - Rendered by WordPress, not Next.js (per hybrid architecture)
 *
 * @see Access & Identity Charter - Tokenized Applicant Status Flow
 */

if (!defined('ABSPATH')) {
  exit;
}

class ChiroStretch_Application_Status {

  public function __construct() {
    add_action('init', [$this, 'register_rewrite_rules']);
    add_filter('query_vars', [$this, 'register_query_vars']);
    add_action('template_redirect', [$this, 'handle_status_page']);
    add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);
  }

  /**
   * Register rewrite rule for /application-status/{token}
   */
  public function register_rewrite_rules() {
    add_rewrite_rule(
      '^application-status/([a-f0-9]{64})/?$',
      'index.php?chs_app_status_token=$matches[1]',
      'top'
    );
  }

  /**
   * Register custom query var
   */
  public function register_query_vars($vars) {
    $vars[] = 'chs_app_status_token';
    return $vars;
  }

  /**
   * Handle status page requests
   */
  public function handle_status_page() {
    $token = get_query_var('chs_app_status_token');

    if (!$token) {
      return;
    }

    // Validate token format (64 hex chars)
    if (!preg_match('/^[a-f0-9]{64}$/', $token)) {
      $this->render_invalid_token();
      return;
    }

    // Find application by token hash
    $application = $this->find_application_by_token($token);

    if (!$application) {
      $this->render_invalid_token();
      return;
    }

    // Check if token is still valid
    $token_valid = get_field('status_token_valid', $application->ID);
    if (!$token_valid) {
      $this->render_expired_token($application);
      return;
    }

    // Render status page
    $this->render_status_page($application);
  }

  /**
   * Find application by token using timing-safe comparison
   */
  private function find_application_by_token($raw_token) {
    $token_hash = hash('sha256', $raw_token);

    // Query applications with a token hash
    $applications = get_posts([
      'post_type' => 'franchise_app',
      'post_status' => 'any',
      'posts_per_page' => -1, // Must check all for timing safety
      'meta_query' => [
        [
          'key' => 'status_token_hash',
          'compare' => 'EXISTS',
        ],
      ],
    ]);

    // Timing-safe comparison
    foreach ($applications as $app) {
      $stored_hash = get_field('status_token_hash', $app->ID);
      if ($stored_hash && hash_equals($stored_hash, $token_hash)) {
        return $app;
      }
    }

    return null;
  }

  /**
   * Render invalid token page
   */
  private function render_invalid_token() {
    status_header(404);
    $this->render_template('invalid', [
      'title' => 'Invalid Link',
      'message' => 'This application status link is invalid. Please check the link in your email.',
    ]);
  }

  /**
   * Render expired token page
   */
  private function render_expired_token($application) {
    $status = get_field('application_status', $application->ID);
    $status_labels = [
      'approved' => 'Your application has been approved! Check your email for next steps.',
      'rejected' => 'Your application was not approved at this time.',
      'withdrawn' => 'This application has been withdrawn.',
    ];

    $this->render_template('expired', [
      'title' => 'Application Decided',
      'message' => $status_labels[$status] ?? 'This status link is no longer active.',
      'status' => $status,
    ]);
  }

  /**
   * Render status page for valid token
   */
  private function render_status_page($application) {
    $status = get_field('application_status', $application->ID) ?: 'pending';
    $submitted_date = get_field('submitted_date', $application->ID);
    $first_name = get_field('applicant_first_name', $application->ID);
    $applicant_location = get_field('applicant_location', $application->ID);

    $status_info = $this->get_status_info($status);

    $this->render_template('status', [
      'first_name' => $first_name,
      'status' => $status,
      'status_label' => $status_info['label'],
      'status_class' => $status_info['class'],
      'status_description' => $status_info['description'],
      'submitted_date' => $submitted_date,
      'applicant_location' => $applicant_location,
    ]);
  }

  /**
   * Get status display info
   */
  private function get_status_info($status) {
    $statuses = [
      'pending' => [
        'label' => 'Pending Review',
        'class' => 'pending',
        'description' => 'Your application has been received and is waiting to be reviewed by our franchise team.',
      ],
      'reviewing' => [
        'label' => 'Under Review',
        'class' => 'warning',
        'description' => 'Great news! Your application is actively being reviewed by our franchise team. We may reach out with questions.',
      ],
    ];

    return $statuses[$status] ?? [
      'label' => ucfirst($status),
      'class' => 'pending',
      'description' => '',
    ];
  }

  /**
   * Render template with data
   */
  private function render_template($template, $data = []) {
    extract($data);

    // Prevent search indexing
    add_action('wp_head', function () {
      echo '<meta name="robots" content="noindex, nofollow">' . "\n";
    });

    // Set document title
    add_filter('document_title_parts', function ($title_parts) use ($template) {
      $titles = [
        'status' => 'Application Status',
        'invalid' => 'Invalid Link',
        'expired' => 'Application Decided',
      ];
      $title_parts['title'] = $titles[$template] ?? 'Application Status';
      return $title_parts;
    });

    // Output page
    $template_file = plugin_dir_path(__FILE__) . "templates/application-status-{$template}.php";

    if (!file_exists($template_file)) {
      wp_die('Template not found: ' . esc_html($template));
    }

    // Simple standalone template (no theme header/footer)
    include $template_file;
    exit;
  }

  /**
   * Enqueue styles for status pages
   */
  public function enqueue_styles() {
    if (!get_query_var('chs_app_status_token')) {
      return;
    }

    wp_enqueue_style(
      'chs-application-status',
      plugins_url('assets/application-status.css', __FILE__),
      [],
      '1.0.0'
    );
  }
}

new ChiroStretch_Application_Status();
