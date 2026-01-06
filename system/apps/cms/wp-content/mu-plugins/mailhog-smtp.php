<?php
/**
 * Plugin Name: Mailhog SMTP Configuration
 * Description: Forces WordPress to use Mailhog for email sending (localhost:1025)
 * Version: 1.0.0
 */

// Only load in local/development environments
if (!defined('ABSPATH')) {
    exit;
}

$env = function_exists('wp_get_environment_type') ? wp_get_environment_type() : 'production';
if (!in_array($env, ['local', 'development'], true)) {
    return;
}

// Configure PHPMailer to use Mailhog SMTP
add_action('phpmailer_init', function($phpmailer) {
    $phpmailer->isSMTP();
    $phpmailer->Host = '127.0.0.1';
    $phpmailer->SMTPAuth = false;
    $phpmailer->Port = 10041;
    $phpmailer->SMTPSecure = '';
    $phpmailer->SMTPAutoTLS = false;
    $phpmailer->From = 'noreply@chirostretch.local';
    $phpmailer->FromName = 'ChiroStretch';
});

// Override from email and name
add_filter('wp_mail_from', function($email) {
    return 'noreply@chirostretch.local';
});

add_filter('wp_mail_from_name', function($name) {
    return 'ChiroStretch';
});
