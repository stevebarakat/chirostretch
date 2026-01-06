<?php
/**
 * Application Status Template - Valid Token
 *
 * Variables:
 * - $first_name: Applicant first name
 * - $status: Raw status value
 * - $status_label: Human-readable status
 * - $status_class: CSS class (pending|warning|success)
 * - $status_description: Description text
 * - $submitted_date: Submission date
 * - $applicant_location: Desired territory
 */

if (!defined('ABSPATH')) {
  exit;
}
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
  <meta charset="<?php bloginfo('charset'); ?>">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Application Status - <?php bloginfo('name'); ?></title>
  <?php wp_head(); ?>
  <style>
    :root {
      --chs-primary: #2563eb;
      --chs-success: #16a34a;
      --chs-warning: #ca8a04;
      --chs-pending: #6b7280;
      --chs-gray-50: #f9fafb;
      --chs-gray-100: #f3f4f6;
      --chs-gray-500: #6b7280;
      --chs-gray-600: #4b5563;
      --chs-gray-700: #374151;
      --chs-gray-900: #111827;
    }
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      background: var(--chs-gray-50);
      color: var(--chs-gray-900);
      line-height: 1.6;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1rem;
    }
    .container {
      max-width: 32rem;
      width: 100%;
    }
    .card {
      background: white;
      border-radius: 0.75rem;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
      padding: 2rem;
      margin-bottom: 1rem;
    }
    .card-header {
      text-align: center;
      margin-bottom: 1.5rem;
    }
    .greeting {
      font-size: 1.125rem;
      color: var(--chs-gray-700);
      margin-bottom: 1rem;
    }
    .badge {
      display: inline-block;
      padding: 0.5rem 1rem;
      border-radius: 9999px;
      font-weight: 600;
      font-size: 0.875rem;
    }
    .badge--pending { background: var(--chs-gray-100); color: var(--chs-pending); }
    .badge--warning { background: #fef3c7; color: var(--chs-warning); }
    .badge--success { background: #dcfce7; color: var(--chs-success); }
    .description {
      color: var(--chs-gray-600);
      text-align: center;
      max-width: 24rem;
      margin: 1rem auto 0;
    }
    .meta {
      color: var(--chs-gray-500);
      font-size: 0.875rem;
      text-align: center;
      margin-top: 1rem;
    }
    .card-title {
      font-size: 1rem;
      font-weight: 600;
      color: var(--chs-gray-900);
      margin-bottom: 0.75rem;
    }
    .steps {
      color: var(--chs-gray-700);
      padding-left: 1.25rem;
      line-height: 1.8;
    }
    .contact-link {
      color: var(--chs-primary);
      text-decoration: none;
    }
    .contact-link:hover { text-decoration: underline; }
    .footer {
      text-align: center;
      padding: 1rem;
    }
    .footer-link {
      color: var(--chs-gray-500);
      text-decoration: none;
      font-size: 0.875rem;
    }
    .footer-link:hover { color: var(--chs-primary); }
  </style>
</head>
<body>
  <div class="container">
    <div class="card">
      <div class="card-header">
        <?php if ($first_name): ?>
          <p class="greeting">Hi <?php echo esc_html($first_name); ?>,</p>
        <?php endif; ?>

        <span class="badge badge--<?php echo esc_attr($status_class); ?>">
          <?php echo esc_html($status_label); ?>
        </span>

        <?php if ($status_description): ?>
          <p class="description"><?php echo esc_html($status_description); ?></p>
        <?php endif; ?>

        <?php if ($submitted_date): ?>
          <p class="meta">Submitted: <?php echo esc_html(date('F j, Y', strtotime($submitted_date))); ?></p>
        <?php endif; ?>

        <?php if ($applicant_location): ?>
          <p class="meta">Territory: <?php echo esc_html($applicant_location); ?></p>
        <?php endif; ?>
      </div>
    </div>

    <div class="card">
      <h3 class="card-title">What happens next?</h3>
      <ol class="steps">
        <li>Our team reviews your application (typically 3-5 business days)</li>
        <li>We may reach out with follow-up questions</li>
        <li>If approved, you'll receive franchise agreement documents by email</li>
        <li>Once signed, your franchisee account will be created</li>
      </ol>
    </div>

    <div class="card">
      <h3 class="card-title">Questions?</h3>
      <p style="color: var(--chs-gray-700);">
        Contact our franchise team at
        <a href="mailto:franchise@chirostretch.com" class="contact-link">franchise@chirostretch.com</a>
      </p>
    </div>

    <div class="footer">
      <a href="<?php echo esc_url(home_url()); ?>" class="footer-link">Return to Site</a>
    </div>
  </div>
  <?php wp_footer(); ?>
</body>
</html>
