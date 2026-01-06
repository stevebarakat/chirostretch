<?php
/**
 * Application Status Template - Invalid Token
 *
 * Variables:
 * - $title: Page title
 * - $message: Error message
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
  <title><?php echo esc_html($title); ?> - <?php bloginfo('name'); ?></title>
  <?php wp_head(); ?>
  <style>
    :root {
      --chs-primary: #2563eb;
      --chs-gray-50: #f9fafb;
      --chs-gray-500: #6b7280;
      --chs-gray-600: #4b5563;
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
      text-align: center;
    }
    .title {
      font-size: 1.5rem;
      font-weight: 600;
      margin-bottom: 1rem;
    }
    .message {
      color: var(--chs-gray-600);
      margin-bottom: 1.5rem;
    }
    .help {
      color: var(--chs-gray-500);
      font-size: 0.875rem;
    }
    .contact-link {
      color: var(--chs-primary);
      text-decoration: none;
    }
    .contact-link:hover { text-decoration: underline; }
    .footer {
      text-align: center;
      padding: 1.5rem;
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
      <h1 class="title"><?php echo esc_html($title); ?></h1>
      <p class="message"><?php echo esc_html($message); ?></p>
      <p class="help">
        If you continue to have trouble, contact
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
