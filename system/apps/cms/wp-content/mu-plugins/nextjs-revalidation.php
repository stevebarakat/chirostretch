<?php
/**
 * Plugin Name: Next.js Cache Revalidation
 * Description: Automatically revalidates Next.js cache when WordPress content is updated
 * Version: 2.0.0
 * Author: ChiroStretch
 *
 * Sends granular cache tags to Next.js for targeted invalidation:
 * - Post types: locations, events, staff, products, posts, pages
 * - Global: menus, options, media
 */

if (!defined('ABSPATH')) {
    exit;
}

class NextJS_Revalidation {

    private $nextjs_url;
    private $secret;

    /**
     * Map post types to cache tags
     */
    const POST_TYPE_TAGS = [
        'location'      => 'locations',
        'tribe_events'  => 'events',
        'staff'         => 'staff',
        'product'       => 'products',
        'post'          => 'posts',
        'page'          => 'pages',
        'testimonial'   => 'testimonials',
        'service'       => 'services',
    ];

    public function __construct() {
        $this->nextjs_url = getenv('NEXTJS_REVALIDATE_URL') ?: 'https://localhost:3000/api/revalidate';
        $this->secret = getenv('NEXTJS_REVALIDATE_SECRET') ?: 'chirostretch-revalidate-secret-2024';

        $this->init_hooks();
    }

    private function init_hooks() {
        // Post/Page updates
        add_action('save_post', [$this, 'handle_post_update'], 10, 3);
        add_action('delete_post', [$this, 'handle_post_delete']);
        add_action('trash_post', [$this, 'handle_post_trash']);

        // ACF updates
        add_action('acf/save_post', [$this, 'handle_acf_update'], 20);

        // Menu updates
        add_action('wp_update_nav_menu', [$this, 'handle_menu_update']);

        // Term updates (categories, tags)
        add_action('created_term', [$this, 'handle_term_update'], 10, 3);
        add_action('edited_term', [$this, 'handle_term_update'], 10, 3);
        add_action('delete_term', [$this, 'handle_term_update'], 10, 3);

        // Media updates
        add_action('add_attachment', [$this, 'handle_media_update']);
        add_action('edit_attachment', [$this, 'handle_media_update']);
        add_action('delete_attachment', [$this, 'handle_media_update']);

        // WooCommerce product updates
        add_action('woocommerce_update_product', [$this, 'handle_product_update']);
        add_action('woocommerce_new_product', [$this, 'handle_product_update']);
    }

    /**
     * Get cache tag for a post type
     */
    private function get_tag_for_post_type($post_type) {
        return self::POST_TYPE_TAGS[$post_type] ?? $post_type;
    }

    /**
     * Handle post/page updates
     */
    public function handle_post_update($post_id, $post, $update) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        if (wp_is_post_revision($post_id)) {
            return;
        }

        // Trigger for publish and trash (to remove from listings)
        if (!in_array($post->post_status, ['publish', 'trash'], true)) {
            return;
        }

        $tag = $this->get_tag_for_post_type($post->post_type);

        $this->trigger_revalidation([
            'tags' => [$tag],
            'reason' => 'post_update',
            'post_id' => $post_id,
            'post_type' => $post->post_type,
        ]);
    }

    /**
     * Handle post deletions
     */
    public function handle_post_delete($post_id) {
        $post = get_post($post_id);
        if (!$post) {
            return;
        }

        $tag = $this->get_tag_for_post_type($post->post_type);

        $this->trigger_revalidation([
            'tags' => [$tag],
            'reason' => 'post_delete',
            'post_id' => $post_id,
            'post_type' => $post->post_type,
        ]);
    }

    /**
     * Handle post trash
     */
    public function handle_post_trash($post_id) {
        $post = get_post($post_id);
        if (!$post) {
            return;
        }

        $tag = $this->get_tag_for_post_type($post->post_type);

        $this->trigger_revalidation([
            'tags' => [$tag],
            'reason' => 'post_trash',
            'post_id' => $post_id,
            'post_type' => $post->post_type,
        ]);
    }

    /**
     * Handle ACF field updates
     */
    public function handle_acf_update($post_id) {
        if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
            return;
        }

        // Handle options pages
        if ($post_id === 'options' || strpos($post_id, 'option') === 0) {
            $this->trigger_revalidation([
                'tags' => ['options', 'layout'],
                'reason' => 'acf_options',
                'options_page' => $post_id,
            ]);
            return;
        }

        // Regular posts handled by save_post hook
    }

    /**
     * Handle menu updates
     */
    public function handle_menu_update($menu_id) {
        $this->trigger_revalidation([
            'tags' => ['menus', 'layout'],
            'reason' => 'menu_update',
            'menu_id' => $menu_id,
        ]);
    }

    /**
     * Handle term updates
     */
    public function handle_term_update($term_id, $tt_id, $taxonomy) {
        // Map taxonomies to relevant content tags
        $taxonomy_tags = [
            'category'          => ['posts'],
            'post_tag'          => ['posts'],
            'product_cat'       => ['products'],
            'product_tag'       => ['products'],
            'tribe_events_cat'  => ['events'],
            'location_category' => ['locations'],
        ];

        $tags = $taxonomy_tags[$taxonomy] ?? [];

        if (!empty($tags)) {
            $this->trigger_revalidation([
                'tags' => $tags,
                'reason' => 'term_update',
                'term_id' => $term_id,
                'taxonomy' => $taxonomy,
            ]);
        }
    }

    /**
     * Handle media updates
     */
    public function handle_media_update($attachment_id) {
        $this->trigger_revalidation([
            'tags' => ['media'],
            'reason' => 'media_update',
            'attachment_id' => $attachment_id,
        ]);
    }

    /**
     * Handle WooCommerce product updates
     */
    public function handle_product_update($product_id) {
        $this->trigger_revalidation([
            'tags' => ['products'],
            'reason' => 'product_update',
            'product_id' => $product_id,
        ]);
    }

    /**
     * Trigger Next.js revalidation
     */
    private function trigger_revalidation($data = []) {
        // Skip if no tags specified
        if (empty($data['tags'])) {
            return;
        }

        // Skip localhost check in production
        if (strpos($this->nextjs_url, 'localhost') !== false) {
            $context = stream_context_create([
                'ssl' => ['verify_peer' => false, 'verify_peer_name' => false],
                'http' => ['timeout' => 1],
            ]);
            $check = @file_get_contents($this->nextjs_url, false, $context);
            if ($check === false) {
                if (defined('WP_DEBUG') && WP_DEBUG) {
                    error_log('Next.js revalidation skipped - Next.js not running locally');
                }
                return;
            }
        }

        $url = add_query_arg('secret', $this->secret, $this->nextjs_url);

        // Send each tag as a separate revalidation request
        // This ensures Next.js invalidates each tag independently
        foreach ($data['tags'] as $tag) {
            wp_remote_post($url, [
                'timeout' => 5,
                'blocking' => false,
                'sslverify' => false,
                'headers' => [
                    'Content-Type' => 'application/json',
                ],
                'body' => json_encode([
                    'tag' => $tag,
                    'reason' => $data['reason'] ?? 'unknown',
                    'timestamp' => time(),
                ]),
            ]);
        }

        if (defined('WP_DEBUG') && WP_DEBUG) {
            error_log(sprintf(
                'Next.js revalidation triggered: tags=[%s] reason=%s',
                implode(', ', $data['tags']),
                $data['reason'] ?? 'unknown'
            ));
        }
    }
}

new NextJS_Revalidation();
