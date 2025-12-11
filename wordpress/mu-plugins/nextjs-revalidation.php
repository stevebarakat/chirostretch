<?php
/**
 * Plugin Name: Next.js Cache Revalidation
 * Description: Automatically revalidates Next.js cache when WordPress content is updated
 * Version: 1.0.0
 * Author: ChiroStretch
 */

if (!defined('ABSPATH')) {
    exit; // Exit if accessed directly
}

class NextJS_Revalidation {

    /**
     * Next.js revalidation endpoint URL
     */
    private $nextjs_url;

    /**
     * Secret key for authentication
     */
    private $secret;

    /**
     * Constructor
     */
    public function __construct() {
        // Configure your Next.js URL and secret
        // You can also use WordPress options or environment variables
        $this->nextjs_url = getenv('NEXTJS_REVALIDATE_URL') ?: 'http://localhost:3000/api/revalidate';
        $this->secret = getenv('NEXTJS_REVALIDATE_SECRET') ?: 'your-secret-key-here';

        $this->init_hooks();
    }

    /**
     * Initialize WordPress hooks
     */
    private function init_hooks() {
        // Post/Page updates
        add_action('save_post', [$this, 'handle_post_update'], 10, 3);
        add_action('delete_post', [$this, 'handle_post_delete']);

        // ACF updates
        add_action('acf/save_post', [$this, 'handle_acf_update'], 20);

        // Menu updates
        add_action('wp_update_nav_menu', [$this, 'handle_menu_update']);

        // Media updates (for logo changes, etc.)
        add_action('add_attachment', [$this, 'handle_media_update']);
        add_action('edit_attachment', [$this, 'handle_media_update']);
        add_action('delete_attachment', [$this, 'handle_media_update']);
    }

    /**
     * Handle post/page updates
     */
    public function handle_post_update($post_id, $post, $update) {
        // Don't trigger for autosaves or revisions
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (wp_is_post_revision($post_id)) {
            return;
        }

        // Only trigger for published posts/pages
        if ($post->post_status !== 'publish') {
            return;
        }

        $this->trigger_revalidation([
            'type' => 'post_update',
            'post_id' => $post_id,
            'post_type' => $post->post_type,
        ]);
    }

    /**
     * Handle post/page deletions
     */
    public function handle_post_delete($post_id) {
        $this->trigger_revalidation([
            'type' => 'post_delete',
            'post_id' => $post_id,
        ]);
    }

    /**
     * Handle ACF field updates
     */
    public function handle_acf_update($post_id) {
        // Skip for autosaves
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Handle options pages (ACF Options)
        if ($post_id === 'options' || strpos($post_id, 'option') === 0) {
            $this->trigger_revalidation([
                'type' => 'acf_options',
                'post_id' => $post_id,
            ]);
            return;
        }

        // Handle regular posts/pages
        $post = get_post($post_id);
        if ($post && $post->post_status === 'publish') {
            $this->trigger_revalidation([
                'type' => 'acf_update',
                'post_id' => $post_id,
                'post_type' => $post->post_type,
            ]);
        }
    }

    /**
     * Handle menu updates
     */
    public function handle_menu_update($menu_id) {
        $this->trigger_revalidation([
            'type' => 'menu_update',
            'menu_id' => $menu_id,
        ]);
    }

    /**
     * Handle media updates
     */
    public function handle_media_update($attachment_id) {
        $this->trigger_revalidation([
            'type' => 'media_update',
            'attachment_id' => $attachment_id,
        ]);
    }

    /**
     * Trigger Next.js revalidation
     */
    private function trigger_revalidation($data = []) {
        // Don't trigger in local development if Next.js isn't running
        if (strpos($this->nextjs_url, 'localhost') !== false) {
            // Check if Next.js is running locally
            $check = @file_get_contents($this->nextjs_url, false, stream_context_create([
                'http' => ['timeout' => 1]
            ]));
            if ($check === false) {
                error_log('Next.js revalidation skipped - Next.js not running locally');
                return;
            }
        }

        $url = add_query_arg('secret', $this->secret, $this->nextjs_url);

        wp_remote_post($url, [
            'timeout' => 5,
            'blocking' => false, // Don't wait for response to avoid slowing down WordPress
            'headers' => [
                'Content-Type' => 'application/json',
            ],
            'body' => json_encode(array_merge([
                'tag' => 'wordpress-content',
                'timestamp' => time(),
            ], $data)),
        ]);

        // Log for debugging
        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log(sprintf(
                'Next.js revalidation triggered: %s',
                json_encode($data)
            ));
        }
    }
}

// Initialize the plugin
new NextJS_Revalidation();
