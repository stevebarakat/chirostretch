<?php
/**
 * Testimonials CPT
 *
 * Fields defined in ACF UI, not here.
 */

add_action('init', function () {
    register_post_type('testimonial', [
        'labels' => [
            'name' => 'Testimonials',
            'singular_name' => 'Testimonial',
            'add_new' => 'Add New',
            'add_new_item' => 'Add New Testimonial',
            'edit_item' => 'Edit Testimonial',
            'new_item' => 'New Testimonial',
            'view_item' => 'View Testimonial',
            'search_items' => 'Search Testimonials',
            'not_found' => 'No testimonials found',
            'not_found_in_trash' => 'No testimonials found in trash',
        ],
        'public' => false,
        'show_ui' => true,
        'show_in_menu' => true,
        'menu_icon' => 'dashicons-format-quote',
        'supports' => ['title', 'thumbnail'],
        'show_in_graphql' => true,
        'graphql_single_name' => 'Testimonial',
        'graphql_plural_name' => 'Testimonials',
    ]);
});

add_action('graphql_register_types', function () {
    register_graphql_field('Testimonial', 'rating', [
        'type' => 'Int',
        'description' => 'Rating from 1-5',
        'resolve' => fn($post) => (int) get_field('rating', $post->databaseId) ?: 5,
    ]);

    register_graphql_field('Testimonial', 'reviewText', [
        'type' => 'String',
        'description' => 'The testimonial review text',
        'resolve' => fn($post) => get_field('review_text', $post->databaseId),
    ]);

    register_graphql_field('Testimonial', 'locationId', [
        'type' => 'Int',
        'description' => 'Associated location ID (null for global testimonials)',
        'resolve' => function ($post) {
            $location = get_field('location', $post->databaseId);
            return $location ? (int) $location : null;
        },
    ]);
});
