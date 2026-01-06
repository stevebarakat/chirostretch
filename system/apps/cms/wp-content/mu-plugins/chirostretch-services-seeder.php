<?php

/**
 * Plugin Name: ChiroStretch Services Seeder (MU)
 * Description: WP-CLI commands to seed services options for ChiroStretch.
 */

/**
 * Stub for WP_CLI constant and class to satisfy linter
 * @phpstan-ignore-next-line
 */
if (false) {
    if (!defined('WP_CLI')) {
        define('WP_CLI', true);
    }
    class WP_CLI
    {
        public static function log($message) {}
        public static function warning($message) {}
        public static function success($message) {}
        public static function add_command($name, $callback) {}
    }
}

if (!defined('WP_CLI') || !WP_CLI) {
    return;
}

class ChiroStretch_Services_Command
{

    /**
     * Seed services options.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch services seed
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function seed($args, $assoc_args)
    {
        WP_CLI::log('Seeding ChiroStretch services...');

        // Section header fields
        $title = 'Our Core Therapies';
        $description = 'We combine modern chiropractic adjustments with assisted stretching to treat the root cause of your discomfort.';

        // Services data (4 total)
        // tab_icon is an image field - upload icons via WP Media Library
        $services = [
            [
                'tab_label'           => 'Chiropractic',
                'tab_icon'            => '',
                'service_title'       => 'Precision Spinal Adjustments',
                'service_description' => 'Our licensed chiropractors use controlled, gentle force to realign joints, improving mobility and relieving pain. We focus on the spine to optimize nervous system function and body mechanics.',
                'bullet_points'       => [
                    ['bullet_text' => 'Relief from back, neck, and joint pain'],
                    ['bullet_text' => 'Improved nervous system function'],
                    ['bullet_text' => 'Non-invasive & drug-free'],
                ],
                'info_box'            => 'Adjustments help improve nerve function, which boosts the body\'s immune response and overall wellness.',
                'service_image'       => '',
            ],
            [
                'tab_label'           => 'Stretch Therapy',
                'tab_icon'            => '',
                'service_title'       => 'Assisted Stretch Therapy',
                'service_description' => 'Don\'t just stretch—get stretched. Our therapists use PNF (Proprioceptive Neuromuscular Facilitation) techniques to safely push your muscles further than you can on your own.',
                'bullet_points'       => [
                    ['bullet_text' => 'Increase flexibility & range of motion'],
                    ['bullet_text' => 'Reduce muscle stiffness & tension'],
                    ['bullet_text' => 'Enhance athletic performance'],
                ],
                'info_box'            => 'Regular stretching combined with chiropractic care extends the positive effects of your treatment.',
                'service_image'       => '',
            ],
            [
                'tab_label'           => 'Massage',
                'tab_icon'            => '',
                'service_title'       => 'Therapeutic Massage',
                'service_description' => 'Our massage therapists work to reduce muscle tension, improve circulation, and complement your chiropractic treatment plan with targeted soft tissue work.',
                'bullet_points'       => [
                    ['bullet_text' => 'Reduce muscle tension & pain'],
                    ['bullet_text' => 'Improve blood circulation'],
                    ['bullet_text' => 'Accelerate recovery from injuries'],
                ],
                'info_box'            => 'Massage therapy before adjustments can help relax tight muscles, making chiropractic care more effective.',
                'service_image'       => '',
            ],
            [
                'tab_label'           => 'Sports Medicine',
                'tab_icon'            => '',
                'service_title'       => 'Sports Medicine & Athletic Care',
                'service_description' => 'From weekend warriors to professional athletes, our certified athletic therapists provide specialized care to optimize performance and get you back in the game. We address acute injuries, chronic overuse conditions, and focus on injury prevention.',
                'bullet_points'       => [
                    ['bullet_text' => 'Injury assessment & treatment'],
                    ['bullet_text' => 'Performance enhancement'],
                    ['bullet_text' => 'Return-to-sport protocols'],
                ],
                'info_box'            => 'Our athletic therapists are experienced in treating athletes at all levels, from recreational to professional.',
                'service_image'       => '',
            ],
        ];

        // Update ACF options
        if (function_exists('update_field')) {
            update_field('services_title', $title, 'option');
            WP_CLI::log('Set services_title: ' . $title);

            update_field('services_description', $description, 'option');
            WP_CLI::log('Set services_description');

            update_field('services', $services, 'option');
            WP_CLI::log('Set services repeater with ' . count($services) . ' services');
        } else {
            // Fallback to update_option if ACF not available
            update_option('options_services_title', $title);
            update_option('options_services_description', $description);
            update_option('options_services', $services);
            WP_CLI::warning('ACF not available, used update_option instead');
        }

        WP_CLI::success('Services seeded successfully!');
    }

    /**
     * Clear all services data.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch services clear
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function clear($args, $assoc_args)
    {
        WP_CLI::log('Clearing ChiroStretch services...');

        if (function_exists('delete_field')) {
            delete_field('services_title', 'option');
            delete_field('services_description', 'option');
            delete_field('services', 'option');
        } else {
            delete_option('options_services_title');
            delete_option('options_services_description');
            delete_option('options_services');
        }

        WP_CLI::success('Services cleared successfully!');
    }
}

WP_CLI::add_command('chirostretch services', 'ChiroStretch_Services_Command');
