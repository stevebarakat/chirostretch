<?php

/**
 * Plugin Name: ChiroStretch Staff Seeder (MU)
 * Description: WP-CLI commands to seed staff members for ChiroStretch locations.
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
        public static function error($message) {}
        public static function add_command($name, $callback) {}
    }
}

if (!defined('WP_CLI') || !WP_CLI) {
    return;
}

class ChiroStretch_Staff_Command
{
    // Headshot placeholder images - professional headshots, NO MASKS
    // Using pre-2020 or business professional photos from Pexels
    private $headshot_images = [
        'male' => [
            'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?w=400&h=400&fit=crop',   // Professional male 1
            'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=400&h=400&fit=crop', // Professional male 2
            'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?w=400&h=400&fit=crop', // Professional male 3
            'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?w=400&h=400&fit=crop', // Professional male 4
        ],
        'female' => [
            'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?w=400&h=400&fit=crop',   // Professional female 1
            'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=400&h=400&fit=crop', // Professional female 2
            'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?w=400&h=400&fit=crop', // Professional female 3
            'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?w=400&h=400&fit=crop',   // Professional female 4
        ],
    ];

    // Photo slugs for seeded images
    private $photo_slugs = [
        'male'   => ['staff-headshot-male-1', 'staff-headshot-male-2', 'staff-headshot-male-3', 'staff-headshot-male-4'],
        'female' => ['staff-headshot-female-1', 'staff-headshot-female-2', 'staff-headshot-female-3', 'staff-headshot-female-4'],
    ];

    // First names for generating staff
    private $first_names = [
        'male'   => ['James', 'Michael', 'David', 'Daniel', 'Christopher', 'Matthew', 'Andrew', 'Ryan', 'Kevin', 'Jason', 'Marcus', 'William', 'Brian', 'Steven', 'Eric'],
        'female' => ['Sarah', 'Emily', 'Jennifer', 'Michelle', 'Amanda', 'Jessica', 'Ashley', 'Nicole', 'Stephanie', 'Lauren', 'Rachel', 'Megan', 'Elizabeth', 'Christina', 'Victoria'],
    ];

    // Last names
    private $last_names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Anderson', 'Taylor', 'Thomas', 'Moore', 'Jackson', 'Lee', 'Kim', 'Chen', 'Patel', 'Thompson'];

    // Staff type configurations - each type has ONE service
    // Discipline slug matches the array key
    private $staff_configs = [
        'chiropractor' => [
            'credentials'  => ['DC', 'DC, CCSP', 'DC, DACBSP'],
            'job_titles'   => ['Chiropractor', 'Lead Chiropractor'],
            'service_slug' => 'chiropractic',
            'specialties'  => ['sports_injuries', 'back_pain', 'neck_pain', 'headaches', 'posture_correction', 'wellness'],
        ],
        'physical_therapist' => [
            'credentials'  => ['PT, DPT', 'DPT', 'PT, SCS'],
            'job_titles'   => ['Physical Therapist', 'Stretch Specialist'],
            'service_slug' => 'stretch_therapy',
            'specialties'  => ['flexibility', 'sports_injuries', 'rehab', 'back_pain'],
        ],
        'massage_therapist' => [
            'credentials'  => ['LMT', 'LMT, CMT', 'LMT, NCTMB'],
            'job_titles'   => ['Massage Therapist', 'Licensed Massage Therapist'],
            'service_slug' => 'massage',
            'specialties'  => ['deep_tissue', 'swedish', 'trigger_point', 'myofascial'],
        ],
        'athletic_therapist' => [
            'credentials'  => ['ATC', 'ATC, LAT', 'CSCS, ATC'],
            'job_titles'   => ['Athletic Therapist', 'Sports Medicine Specialist'],
            'service_slug' => 'sports_medicine',
            'specialties'  => ['sports_injuries', 'rehab', 'flexibility', 'wellness'],
        ],
    ];

    // Bio templates
    private $bio_templates = [
        'chiropractor' => [
            '%s brings %d years of experience in chiropractic care, specializing in spinal health and musculoskeletal conditions. With a passion for helping patients achieve optimal wellness, %s combines traditional adjustments with modern techniques to deliver personalized treatment plans.',
            'With %d years of dedicated practice, Dr. %s has helped thousands of patients find relief from pain and improve their quality of life. %s approach focuses on understanding each patient\'s unique needs and developing comprehensive care strategies.',
            'Dr. %s graduated with honors and has since devoted %d years to perfecting the art of chiropractic care. Known for a gentle yet effective approach, %s is committed to helping patients achieve lasting results through evidence-based treatment.',
        ],
        'physical_therapist' => [
            '%s brings %d years of physical therapy experience to our team. Specializing in stretch therapy and rehabilitation, %s creates customized treatment programs that help patients regain strength, mobility, and confidence.',
            'Dr. %s has %d years of experience helping patients improve flexibility and recover from injuries. %s evidence-based approach combines manual therapy with therapeutic stretching for optimal outcomes.',
        ],
        'massage_therapist' => [
            '%s is a skilled massage therapist with %d years of experience in therapeutic bodywork. Specializing in deep tissue and sports massage, %s helps clients recover from injuries, reduce stress, and improve overall well-being.',
            'With %d years of hands-on experience, %s has developed expertise in multiple massage modalities. %s takes a holistic approach to healing, addressing both physical tension and the underlying causes of discomfort.',
        ],
        'athletic_therapist' => [
            '%s is a certified athletic therapist with %d years of experience in sports medicine. Specializing in injury prevention and athletic performance, %s helps athletes of all levels achieve their goals safely.',
            'With %d years dedicated to sports medicine, %s has worked with athletes from weekend warriors to professionals. %s approach focuses on getting you back in the game stronger than before.',
        ],
    ];

    /**
     * Seed headshot photos to the media library.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch staff seed-photos
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function seed_photos($args, $assoc_args)
    {
        WP_CLI::log('Seeding staff headshot photos...');

        if (!function_exists('media_sideload_image')) {
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';
        }

        $photos_created = 0;

        foreach (['male', 'female'] as $gender) {
            foreach ($this->headshot_images[$gender] as $index => $url) {
                $slug = $this->photo_slugs[$gender][$index];

                // Check if photo already exists
                $existing = get_page_by_path($slug, OBJECT, 'attachment');
                if ($existing) {
                    WP_CLI::log(sprintf('  Skipped (exists): %s', $slug));
                    continue;
                }

                // Download the image
                $tmp = download_url($url);
                if (is_wp_error($tmp)) {
                    WP_CLI::warning(sprintf('Failed to download %s: %s', $slug, $tmp->get_error_message()));
                    continue;
                }

                $file_array = [
                    'name'     => $slug . '.jpg',
                    'tmp_name' => $tmp,
                ];

                // Upload to media library
                $attachment_id = media_handle_sideload($file_array, 0, ucfirst($gender) . ' Staff Headshot');

                if (is_wp_error($attachment_id)) {
                    @unlink($tmp);
                    WP_CLI::warning(sprintf('Failed to upload %s: %s', $slug, $attachment_id->get_error_message()));
                    continue;
                }

                // Update the post slug
                wp_update_post([
                    'ID'        => $attachment_id,
                    'post_name' => $slug,
                ]);

                WP_CLI::log(sprintf('  Created: %s (ID: %d)', $slug, $attachment_id));
                $photos_created++;
            }
        }

        WP_CLI::success(sprintf('Created %d headshot photos', $photos_created));
    }

    /**
     * Seed staff members for all locations.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch staff seed
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function seed($args, $assoc_args)
    {
        WP_CLI::log('Seeding ChiroStretch staff members...');

        // Get all locations
        $locations = get_posts([
            'post_type'      => 'location',
            'posts_per_page' => -1,
            'post_status'    => 'publish',
        ]);

        if (empty($locations)) {
            WP_CLI::error('No locations found. Run wp chirostretch locations seed first.');
            return;
        }

        WP_CLI::log(sprintf('Found %d locations', count($locations)));

        $staff_created = 0;
        $male_index = 0;
        $female_index = 0;

        foreach ($locations as $location) {
            WP_CLI::log(sprintf('Creating staff for: %s', $location->post_title));

            // Each location gets exactly 3 staff: Chiropractor + Physical Therapist + (Massage OR Athletic)
            $staff_types = $this->get_staff_composition();

            foreach ($staff_types as $staff_type) {
                $gender = rand(0, 1) ? 'male' : 'female';
                $photo_index = $gender === 'male' ? ($male_index++ % 4) : ($female_index++ % 4);

                $staff_data = $this->generate_staff_data($staff_type, $gender, $photo_index);

                $post_id = wp_insert_post([
                    'post_type'   => 'practitioner',
                    'post_title'  => $staff_data['name'],
                    'post_status' => 'publish',
                ]);

                if (!$post_id || is_wp_error($post_id)) {
                    WP_CLI::warning('Failed to create staff: ' . $staff_data['name']);
                    continue;
                }

                // Set taxonomies (discipline, service, specialty)
                wp_set_object_terms($post_id, $staff_type, 'discipline');
                wp_set_object_terms($post_id, $staff_data['service_slug'], 'service');
                wp_set_object_terms($post_id, $staff_data['specialties'], 'specialty');

                // Update ACF fields (remaining fields only)
                if (function_exists('update_field')) {
                    update_field('assigned_location', $location->ID, $post_id);
                    update_field('job_title', $staff_data['job_title'], $post_id);
                    update_field('credentials', $staff_data['credentials'], $post_id);
                    update_field('bio', $staff_data['bio'], $post_id);
                    update_field('accepting_patients', true, $post_id);
                    update_field('is_public', true, $post_id);

                    // Get headshot from seeded photos or download fresh
                    $attachment_id = $this->get_seeded_photo($gender, $photo_index);
                    if (!$attachment_id) {
                        // Fallback: download fresh
                        $attachment_id = $this->download_and_attach_image(
                            $this->headshot_images[$gender][$photo_index],
                            $post_id,
                            $staff_data['name']
                        );
                    }
                    if ($attachment_id) {
                        update_field('headshot', $attachment_id, $post_id);
                    }
                }

                WP_CLI::log(sprintf('  Created: %s (%s) - %s', $staff_data['name'], $staff_data['job_title'], $staff_type));
                $staff_created++;
            }
        }

        WP_CLI::success(sprintf('Created %d staff members across %d locations', $staff_created, count($locations)));
    }

    /**
     * Reset all staff posts.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch staff reset
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function reset($args, $assoc_args)
    {
        WP_CLI::log('Deleting all staff members...');

        $query = new WP_Query([
            'post_type'      => 'practitioner',
            'post_status'    => 'any',
            'posts_per_page' => -1,
            'fields'         => 'ids',
        ]);

        foreach ($query->posts as $post_id) {
            wp_delete_post($post_id, true);
        }

        WP_CLI::success(sprintf('Deleted %d staff posts.', $query->post_count));
    }

    /**
     * Get staff composition for a location.
     * Always: Chiropractor + Physical Therapist + (Massage OR Athletic)
     */
    private function get_staff_composition()
    {
        // Required: Chiropractor + Physical Therapist
        $composition = ['chiropractor', 'physical_therapist'];

        // Third: randomly Massage Therapist or Athletic Therapist
        $third = rand(0, 1) ? 'massage_therapist' : 'athletic_therapist';
        $composition[] = $third;

        return $composition;
    }

    /**
     * Generate staff data for a given type.
     */
    private function generate_staff_data($staff_type, $gender, $photo_index)
    {
        $config = $this->staff_configs[$staff_type];

        $first_name = $this->first_names[$gender][array_rand($this->first_names[$gender])];
        $last_name = $this->last_names[array_rand($this->last_names)];

        // Chiropractors and Physical Therapists get "Dr." prefix
        $name = in_array($staff_type, ['chiropractor', 'physical_therapist'])
            ? "Dr. {$first_name} {$last_name}"
            : "{$first_name} {$last_name}";

        $years = rand(3, 20);
        $bio_template = $this->bio_templates[$staff_type][array_rand($this->bio_templates[$staff_type])];
        $pronoun = $gender === 'male' ? 'His' : 'Her';

        // Generate bio
        if (in_array($staff_type, ['chiropractor', 'physical_therapist'])) {
            $bio = sprintf($bio_template, $last_name, $years, $pronoun);
        } else {
            $bio = sprintf($bio_template, $first_name, $years, $pronoun);
        }

        // Select 2-3 specialties
        $available_specialties = $config['specialties'];
        $num_specialties = rand(2, min(3, count($available_specialties)));
        shuffle($available_specialties);
        $specialties = array_slice($available_specialties, 0, $num_specialties);

        return [
            'name'         => $name,
            'job_title'    => $config['job_titles'][array_rand($config['job_titles'])],
            'credentials'  => $config['credentials'][array_rand($config['credentials'])],
            'service_slug' => $config['service_slug'], // Taxonomy slug
            'specialties'  => $specialties,
            'bio'          => $bio,
            'gender'       => $gender,
        ];
    }

    /**
     * Get a seeded photo by gender and index.
     */
    private function get_seeded_photo($gender, $index)
    {
        $slug = $this->photo_slugs[$gender][$index];
        $attachment = get_page_by_path($slug, OBJECT, 'attachment');
        return $attachment ? $attachment->ID : 0;
    }

    /**
     * Download image from URL and attach to post.
     */
    private function download_and_attach_image($url, $post_id, $title)
    {
        if (!function_exists('media_sideload_image')) {
            require_once ABSPATH . 'wp-admin/includes/media.php';
            require_once ABSPATH . 'wp-admin/includes/file.php';
            require_once ABSPATH . 'wp-admin/includes/image.php';
        }

        $tmp = download_url($url);

        if (is_wp_error($tmp)) {
            WP_CLI::warning('Failed to download image: ' . $tmp->get_error_message());
            return 0;
        }

        $file_array = [
            'name'     => sanitize_file_name($title) . '.jpg',
            'tmp_name' => $tmp,
        ];

        $attachment_id = media_handle_sideload($file_array, $post_id, $title . ' Headshot');

        if (is_wp_error($attachment_id)) {
            @unlink($tmp);
            WP_CLI::warning('Failed to attach image: ' . $attachment_id->get_error_message());
            return 0;
        }

        return $attachment_id;
    }
}

WP_CLI::add_command('chirostretch staff', 'ChiroStretch_Staff_Command');
