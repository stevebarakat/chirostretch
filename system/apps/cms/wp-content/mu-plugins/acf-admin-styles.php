<?php
/**
 * Plugin Name: ACF Admin Styles
 * Description: Improves ACF field layout responsiveness in wp-admin
 */

add_action('admin_head', function() {
    $screen = get_current_screen();
    
    if ($screen->base !== 'post') return;
    
    // Restrict to specific post types (empty array = all post types)
    $post_types = apply_filters('acf_admin_styles_post_types', []);
    
    if (!empty($post_types) && !in_array($screen->post_type, $post_types)) return;
    
    ?>
    <style>
        /* Make ACF columns stack on narrower screens */
        @media (max-width: 1200px) {
            .acf-fields > .acf-field[data-width] {
                width: 100% !important;
            }
        }
        
        /* Reduce field padding */
        .acf-field {
            padding: 15px 12px;
        }
        
        /* Field group spacing */
        .acf-postbox {
            margin-bottom: 20px;
        }
        
        /* Repeater row styling */
        .acf-repeater .acf-row {
            background: #fafafa;
            margin-bottom: 8px;
            border-radius: 4px;
        }
    </style>
    <?php
});
