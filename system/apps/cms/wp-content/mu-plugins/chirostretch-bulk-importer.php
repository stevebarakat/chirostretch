<?php

/**
 * Plugin Name: ChiroStretch Bulk Importer (MU)
 * Description: WP-CLI commands to bulk import generated demo data from JSON files.
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
        public static function error($message, $exit = true) {}
        public static function add_command($name, $callback) {}
    }
}

if (!defined('WP_CLI') || !WP_CLI) {
    return;
}

class ChiroStretch_Bulk_Import_Command
{
    /**
     * Import locations from a JSON file.
     *
     * ## OPTIONS
     *
     * [<file>]
     * : Path to the JSON file. Defaults to data/generated/locations.json
     *
     * [--dry-run]
     * : Preview what would be imported without creating posts.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch import locations
     *   wp chirostretch import locations /path/to/locations.json
     *   wp chirostretch import locations --dry-run
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function locations($args, $assoc_args)
    {
        $file = $args[0] ?? $this->get_default_path('locations.json');
        $dry_run = isset($assoc_args['dry-run']);

        if (!file_exists($file)) {
            WP_CLI::error("File not found: {$file}");
            return;
        }

        $locations = json_decode(file_get_contents($file), true);
        if (!is_array($locations)) {
            WP_CLI::error('Invalid JSON format');
            return;
        }

        $total = count($locations);
        WP_CLI::log(sprintf('Importing %d locations%s...', $total, $dry_run ? ' (dry run)' : ''));

        $created = 0;
        $skipped = 0;
        $processed = 0;

        foreach ($locations as $loc) {
            $processed++;
            $seed_id = $loc['_seed_id'] ?? null;

            if (!$seed_id) {
                WP_CLI::warning('Missing _seed_id, skipping');
                $skipped++;
                continue;
            }

            // Check if already exists
            if ($this->find_post_by_seed_id('location', $seed_id)) {
                $skipped++;
                continue;
            }

            if ($dry_run) {
                WP_CLI::log(sprintf('  [%d/%d] Would create: %s', $processed, $total, $loc['name']));
                $created++;
                continue;
            }

            $post_id = wp_insert_post([
                'post_type' => 'location',
                'post_title' => $loc['name'],
                'post_content' => $loc['short_description'] ?? '',
                'post_status' => 'publish',
            ]);

            if (!$post_id || is_wp_error($post_id)) {
                WP_CLI::warning('Failed to create: ' . $loc['name']);
                continue;
            }

            // Store seed_id for deduplication
            update_post_meta($post_id, '_seed_id', $seed_id);

            // Update ACF fields
            if (function_exists('update_field')) {
                update_field('street_address', $loc['street_address'] ?? '', $post_id);
                update_field('city', $loc['city'] ?? '', $post_id);
                update_field('state', $loc['state'] ?? '', $post_id);
                update_field('zip', $loc['zip'] ?? '', $post_id);
                update_field('phone', $loc['phone'] ?? '', $post_id);
                update_field('email', $loc['email'] ?? '', $post_id);
                update_field('short_description', $loc['short_description'] ?? '', $post_id);

                // Coordinates group (ACF subfields are 'lat' and 'lng')
                if (isset($loc['latitude']) && isset($loc['longitude'])) {
                    update_field('coordinates', [
                        'lat' => $loc['latitude'],
                        'lng' => $loc['longitude'],
                    ], $post_id);
                }

                // Hours repeater
                if (!empty($loc['hours'])) {
                    update_field('hours', $loc['hours'], $post_id);
                }
            }

            // Set featured image
            $featured_image_slug = $loc['featured_image_slug'] ?? null;
            if ($featured_image_slug) {
                $attachment_id = $this->get_attachment_by_slug($featured_image_slug);
                if ($attachment_id) {
                    set_post_thumbnail($post_id, $attachment_id);
                }
            }

            // Set hero CTA buttons (Book + Services)
            // ACF link fields require array with url, title, target
            if (function_exists('update_field')) {
                update_field('hero_link', [
                    'url' => '#book',
                    'title' => 'Book Now',
                    'target' => '',
                ], $post_id);

                update_field('hero_link_2', [
                    'url' => '#team',
                    'title' => 'Our Team',
                    'target' => '',
                ], $post_id);

                // Set icons (calendar-days for Book, users for Team)
                $calendar_icon = $this->get_attachment_by_slug('calendar-days');
                $users_icon = $this->get_attachment_by_slug('users');

                if ($calendar_icon) {
                    update_field('hero_link_icon', $calendar_icon, $post_id);
                }
                if ($users_icon) {
                    update_field('hero_link_icon_2', $users_icon, $post_id);
                }
            }

            $created++;

            // Log progress every 10 items
            if ($processed % 10 === 0) {
                WP_CLI::log(sprintf('  Progress: %d/%d', $processed, $total));
            }
        }

        WP_CLI::success(sprintf('Created %d locations, skipped %d (already exist)', $created, $skipped));
    }

    /**
     * Import staff from a JSON file.
     *
     * ## OPTIONS
     *
     * [<file>]
     * : Path to the JSON file. Defaults to data/generated/staff.json
     *
     * [--dry-run]
     * : Preview what would be imported without creating posts.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch import staff
     *   wp chirostretch import staff /path/to/staff.json
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function staff($args, $assoc_args)
    {
        $file = $args[0] ?? $this->get_default_path('staff.json');
        $dry_run = isset($assoc_args['dry-run']);

        if (!file_exists($file)) {
            WP_CLI::error("File not found: {$file}");
            return;
        }

        $staff_list = json_decode(file_get_contents($file), true);
        if (!is_array($staff_list)) {
            WP_CLI::error('Invalid JSON format');
            return;
        }

        // Build location seed_id -> post_id map
        $location_map = $this->build_location_map();

        // Build headshot slug -> attachment_id map
        $headshot_map = $this->build_headshot_map();

        $total = count($staff_list);
        WP_CLI::log(sprintf('Importing %d staff members%s...', $total, $dry_run ? ' (dry run)' : ''));

        $created = 0;
        $skipped = 0;
        $processed = 0;

        foreach ($staff_list as $staff) {
            $processed++;
            $seed_id = $staff['_seed_id'] ?? null;

            if (!$seed_id) {
                WP_CLI::warning('Missing _seed_id, skipping');
                $skipped++;
                continue;
            }

            // Check if already exists
            if ($this->find_post_by_seed_id('staff', $seed_id)) {
                $skipped++;
                continue;
            }

            // Get location post ID
            $location_seed_id = $staff['_location_seed_id'] ?? null;
            $location_post_id = $location_map[$location_seed_id] ?? null;

            if (!$location_post_id) {
                WP_CLI::warning("Location not found for staff: {$staff['name']} (location: {$location_seed_id})");
                $skipped++;
                continue;
            }

            if ($dry_run) {
                WP_CLI::log(sprintf('  [%d/%d] Would create: %s (%s)', $processed, $total, $staff['name'], $staff['staff_type']));
                $created++;
                continue;
            }

            // Create WordPress user for the staff member
            $user_id = $this->create_staff_user($staff);
            if (!$user_id) {
                WP_CLI::warning("Failed to create user for: {$staff['name']}");
                continue;
            }

            $post_id = wp_insert_post([
                'post_type' => 'staff',
                'post_title' => $staff['name'],
                'post_status' => 'publish',
                'post_author' => $user_id,
            ]);

            if (!$post_id || is_wp_error($post_id)) {
                WP_CLI::warning('Failed to create staff post: ' . $staff['name']);
                continue;
            }

            // Store seed_id for deduplication
            update_post_meta($post_id, '_seed_id', $seed_id);

            // Update ACF fields
            if (function_exists('update_field')) {
                update_field('staff_type', $staff['staff_type'] ?? '', $post_id);
                update_field('assigned_location', $location_post_id, $post_id);
                update_field('job_title', $staff['job_title'] ?? '', $post_id);
                update_field('credentials', $staff['credentials'] ?? '', $post_id);
                update_field('bio', $staff['bio'] ?? '', $post_id);
                update_field('specialties', $staff['specialties'] ?? [], $post_id);
                update_field('services_offered', $staff['services_offered'] ?? [], $post_id);
                update_field('is_public', $staff['is_public'] ?? true, $post_id);
                update_field('accepting_patients', $staff['accepting_patients'] ?? true, $post_id);

                // Headshot from media library
                $headshot_slug = $staff['headshot_slug'] ?? null;
                if ($headshot_slug && isset($headshot_map[$headshot_slug])) {
                    update_field('headshot', $headshot_map[$headshot_slug], $post_id);
                }
            }

            $created++;

            // Log progress every 10 items
            if ($processed % 10 === 0) {
                WP_CLI::log(sprintf('  Progress: %d/%d', $processed, $total));
            }
        }

        WP_CLI::success(sprintf('Created %d staff members, skipped %d', $created, $skipped));
    }

    /**
     * Import franchisees from a JSON file.
     *
     * ## OPTIONS
     *
     * [<file>]
     * : Path to the JSON file. Defaults to data/generated/franchisees.json
     *
     * [--dry-run]
     * : Preview what would be imported without creating users.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch import franchisees
     *   wp chirostretch import franchisees /path/to/franchisees.json
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function franchisees($args, $assoc_args)
    {
        $file = $args[0] ?? $this->get_default_path('franchisees.json');
        $dry_run = isset($assoc_args['dry-run']);

        if (!file_exists($file)) {
            WP_CLI::error("File not found: {$file}");
            return;
        }

        $franchisees = json_decode(file_get_contents($file), true);
        if (!is_array($franchisees)) {
            WP_CLI::error('Invalid JSON format');
            return;
        }

        // Build location seed_id -> post_id map
        $location_map = $this->build_location_map();

        $total = count($franchisees);
        WP_CLI::log(sprintf('Importing %d franchisees%s...', $total, $dry_run ? ' (dry run)' : ''));

        $created = 0;
        $skipped = 0;
        $processed = 0;

        foreach ($franchisees as $franchisee) {
            $processed++;
            $seed_id = $franchisee['_seed_id'] ?? null;

            if (!$seed_id) {
                WP_CLI::warning('Missing _seed_id, skipping');
                $skipped++;
                continue;
            }

            // Check if user already exists by email
            $existing = get_user_by('email', $franchisee['email']);
            if ($existing) {
                $skipped++;
                continue;
            }

            // Get location post ID
            $location_seed_id = $franchisee['_location_seed_id'] ?? null;
            $location_post_id = $location_map[$location_seed_id] ?? null;

            if (!$location_post_id) {
                WP_CLI::warning("Location not found for franchisee: {$franchisee['display_name']}");
                $skipped++;
                continue;
            }

            if ($dry_run) {
                WP_CLI::log(sprintf('  [%d/%d] Would create: %s', $processed, $total, $franchisee['display_name']));
                $created++;
                continue;
            }

            // Create WordPress user
            $user_id = wp_insert_user([
                'user_login' => $franchisee['email'],
                'user_email' => $franchisee['email'],
                'user_pass' => $franchisee['password'],
                'first_name' => $franchisee['first_name'],
                'last_name' => $franchisee['last_name'],
                'display_name' => $franchisee['display_name'],
                'role' => 'franchisee',
            ]);

            if (is_wp_error($user_id)) {
                WP_CLI::warning("Failed to create user: {$franchisee['display_name']} - " . $user_id->get_error_message());
                continue;
            }

            // Store seed_id on user meta
            update_user_meta($user_id, '_seed_id', $seed_id);
            update_user_meta($user_id, '_location_seed_id', $location_seed_id);

            // Link franchisee to location via ACF field
            if (function_exists('update_field')) {
                update_field('franchisee', $user_id, $location_post_id);
            }

            $created++;

            // Log progress every 10 items
            if ($processed % 10 === 0) {
                WP_CLI::log(sprintf('  Progress: %d/%d', $processed, $total));
            }
        }

        WP_CLI::success(sprintf('Created %d franchisees, skipped %d', $created, $skipped));
    }

    /**
     * Import testimonials from a JSON file.
     *
     * ## OPTIONS
     *
     * [<file>]
     * : Path to the JSON file. Defaults to data/generated/testimonials.json
     *
     * [--dry-run]
     * : Preview what would be imported without creating posts.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch import testimonials
     *   wp chirostretch import testimonials /path/to/testimonials.json
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function testimonials($args, $assoc_args)
    {
        $file = $args[0] ?? $this->get_default_path('testimonials.json');
        $dry_run = isset($assoc_args['dry-run']);

        if (!file_exists($file)) {
            WP_CLI::error("File not found: {$file}");
            return;
        }

        $testimonials = json_decode(file_get_contents($file), true);
        if (!is_array($testimonials)) {
            WP_CLI::error('Invalid JSON format');
            return;
        }

        // Build location seed_id -> post_id map
        $location_map = $this->build_location_map();

        $total = count($testimonials);
        WP_CLI::log(sprintf('Importing %d testimonials%s...', $total, $dry_run ? ' (dry run)' : ''));

        $created = 0;
        $skipped = 0;
        $processed = 0;

        foreach ($testimonials as $testimonial) {
            $processed++;
            $seed_id = $testimonial['_seed_id'] ?? null;

            if (!$seed_id) {
                WP_CLI::warning('Missing _seed_id, skipping');
                $skipped++;
                continue;
            }

            // Check if already exists
            if ($this->find_post_by_seed_id('testimonial', $seed_id)) {
                $skipped++;
                continue;
            }

            // Get location post ID
            $location_seed_id = $testimonial['_location_seed_id'] ?? null;
            $location_post_id = $location_map[$location_seed_id] ?? null;

            if (!$location_post_id) {
                WP_CLI::warning("Location not found for testimonial: {$testimonial['customer_name']} (location: {$location_seed_id})");
                $skipped++;
                continue;
            }

            if ($dry_run) {
                WP_CLI::log(sprintf('  [%d/%d] Would create: %s (rating: %d)', $processed, $total, $testimonial['customer_name'], $testimonial['rating']));
                $created++;
                continue;
            }

            $post_id = wp_insert_post([
                'post_type' => 'testimonial',
                'post_title' => $testimonial['customer_name'],
                'post_status' => 'publish',
            ]);

            if (!$post_id || is_wp_error($post_id)) {
                WP_CLI::warning('Failed to create testimonial: ' . $testimonial['customer_name']);
                continue;
            }

            // Store seed_id for deduplication
            update_post_meta($post_id, '_seed_id', $seed_id);

            // Update ACF fields
            if (function_exists('update_field')) {
                update_field('rating', $testimonial['rating'] ?? 5, $post_id);
                update_field('review_text', $testimonial['review_text'] ?? '', $post_id);
                update_field('location_id', $location_post_id, $post_id);
            }

            $created++;

            // Log progress every 20 items
            if ($processed % 20 === 0) {
                WP_CLI::log(sprintf('  Progress: %d/%d', $processed, $total));
            }
        }

        WP_CLI::success(sprintf('Created %d testimonials, skipped %d', $created, $skipped));
    }

    /**
     * Import events from a JSON file.
     *
     * ## OPTIONS
     *
     * [<file>]
     * : Path to the JSON file. Defaults to data/generated/events.json
     *
     * [--dry-run]
     * : Preview what would be imported without creating posts.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch import events
     *   wp chirostretch import events /path/to/events.json
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function events($args, $assoc_args)
    {
        $file = $args[0] ?? $this->get_default_path('events.json');
        $dry_run = isset($assoc_args['dry-run']);

        if (!file_exists($file)) {
            WP_CLI::error("File not found: {$file}");
            return;
        }

        $events = json_decode(file_get_contents($file), true);
        if (!is_array($events)) {
            WP_CLI::error('Invalid JSON format');
            return;
        }

        // Build location seed_id -> post_id map
        $location_map = $this->build_location_map();

        // Build location seed_id -> organizer_id map
        $organizer_map = $this->build_organizer_map($location_map);

        $total = count($events);
        WP_CLI::log(sprintf('Importing %d events%s...', $total, $dry_run ? ' (dry run)' : ''));

        $created = 0;
        $skipped = 0;
        $processed = 0;

        foreach ($events as $event) {
            $processed++;
            $seed_id = $event['_seed_id'] ?? null;

            if (!$seed_id) {
                WP_CLI::warning('Missing _seed_id, skipping');
                $skipped++;
                continue;
            }

            // Check if already exists
            if ($this->find_post_by_seed_id('tribe_events', $seed_id)) {
                $skipped++;
                continue;
            }

            // Get location and organizer
            $location_seed_id = $event['_location_seed_id'] ?? null;
            $location_post_id = $location_map[$location_seed_id] ?? null;
            $organizer_id = $organizer_map[$location_seed_id] ?? null;

            if (!$location_post_id) {
                WP_CLI::warning("Location not found for event: {$event['title']}");
                $skipped++;
                continue;
            }

            if ($dry_run) {
                WP_CLI::log(sprintf('  [%d/%d] Would create: %s', $processed, $total, $event['title']));
                $created++;
                continue;
            }

            // Create the event using TEC API if available, otherwise direct insert
            $post_id = wp_insert_post([
                'post_type' => 'tribe_events',
                'post_title' => $event['title'],
                'post_name' => $event['slug'],
                'post_content' => $event['content'] ?? '',
                'post_status' => 'publish',
            ]);

            if (!$post_id || is_wp_error($post_id)) {
                WP_CLI::warning('Failed to create event: ' . $event['title']);
                continue;
            }

            // Store seed_id for deduplication
            update_post_meta($post_id, '_seed_id', $seed_id);

            // Set TEC event meta
            update_post_meta($post_id, '_EventStartDate', $this->format_tec_date($event['start_date']));
            update_post_meta($post_id, '_EventEndDate', $this->format_tec_date($event['end_date']));
            update_post_meta($post_id, '_EventStartDateUTC', $event['start_date']);
            update_post_meta($post_id, '_EventEndDateUTC', $event['end_date']);

            // Calculate duration in seconds
            $start = strtotime($event['start_date']);
            $end = strtotime($event['end_date']);
            $duration = $end - $start;
            update_post_meta($post_id, '_EventDuration', $duration);

            // Cost
            if (!empty($event['cost'])) {
                update_post_meta($post_id, '_EventCost', $event['cost']);
            }

            // Link to organizer (location's synced organizer)
            if ($organizer_id) {
                update_post_meta($post_id, '_EventOrganizerID', [$organizer_id]);
            }

            // Create/link venue
            $venue_id = $this->get_or_create_venue($event);
            if ($venue_id) {
                update_post_meta($post_id, '_EventVenueID', $venue_id);
            }

            // Set featured image
            $featured_image_slug = $event['featured_image_slug'] ?? null;
            if ($featured_image_slug) {
                $attachment_id = $this->get_attachment_by_slug($featured_image_slug);
                if ($attachment_id) {
                    set_post_thumbnail($post_id, $attachment_id);
                }
            }

            // Set event category
            $category_slug = $event['category'] ?? null;
            if ($category_slug) {
                wp_set_object_terms($post_id, $category_slug, 'tribe_events_cat');
            }

            // Sync to TEC custom tables (required for GraphQL/frontend)
            $this->sync_tec_tables($post_id, $event['start_date'], $event['end_date'], $duration);

            $created++;

            // Log progress every 10 items
            if ($processed % 10 === 0) {
                WP_CLI::log(sprintf('  Progress: %d/%d', $processed, $total));
            }
        }

        WP_CLI::success(sprintf('Created %d events, skipped %d', $created, $skipped));
    }

    /**
     * Import all data (locations, staff, franchisees, testimonials, events) in order.
     *
     * ## OPTIONS
     *
     * [--dry-run]
     * : Preview what would be imported without creating anything.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch import all
     *   wp chirostretch import all --dry-run
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function all($args, $assoc_args)
    {
        WP_CLI::log('=== Importing all demo data ===');
        WP_CLI::log('');

        WP_CLI::log('Step 1/6: Importing locations...');
        $this->locations([], $assoc_args);
        WP_CLI::log('');

        WP_CLI::log('Step 2/6: Importing franchisees...');
        $this->franchisees([], $assoc_args);
        WP_CLI::log('');

        WP_CLI::log('Step 3/6: Importing staff...');
        $this->staff([], $assoc_args);
        WP_CLI::log('');

        WP_CLI::log('Step 4/6: Importing testimonials...');
        $this->testimonials([], $assoc_args);
        WP_CLI::log('');

        WP_CLI::log('Step 5/6: Importing events...');
        $this->events([], $assoc_args);
        WP_CLI::log('');

        if (!isset($assoc_args['dry-run'])) {
            WP_CLI::log('Step 6/6: Reindexing Algolia...');
            $this->reindex([], $assoc_args);
            WP_CLI::log('');
        }

        WP_CLI::success('All demo data imported!');
    }

    /**
     * Reset all imported demo data.
     *
     * ## OPTIONS
     *
     * [--yes]
     * : Skip confirmation prompt.
     *
     * ## EXAMPLES
     *
     *   wp chirostretch import reset --yes
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function reset($args, $assoc_args)
    {
        if (!isset($assoc_args['yes'])) {
            WP_CLI::error('This will delete all demo data. Use --yes to confirm.');
            return;
        }

        WP_CLI::log('Resetting demo data...');

        // Delete events first
        $events_deleted = $this->delete_posts_with_seed_id('tribe_events');
        WP_CLI::log(sprintf('Deleted %d events', $events_deleted));

        // Delete testimonials (they reference locations)
        $testimonials_deleted = $this->delete_posts_with_seed_id('testimonial');
        WP_CLI::log(sprintf('Deleted %d testimonials', $testimonials_deleted));

        // Delete staff posts with _seed_id
        $staff_deleted = $this->delete_posts_with_seed_id('staff');
        WP_CLI::log(sprintf('Deleted %d staff posts', $staff_deleted));

        // Delete location posts with _seed_id
        $locations_deleted = $this->delete_posts_with_seed_id('location');
        WP_CLI::log(sprintf('Deleted %d location posts', $locations_deleted));

        // Delete users with _seed_id
        $users_deleted = $this->delete_users_with_seed_id();
        WP_CLI::log(sprintf('Deleted %d users', $users_deleted));

        WP_CLI::success('Demo data reset complete!');
    }

    /**
     * Reindex all Algolia indices.
     *
     * ## OPTIONS
     *
     * [--url=<url>]
     * : Base URL for the Next.js app. Defaults to https://localhost:3000
     *
     * ## EXAMPLES
     *
     *   wp chirostretch import reindex
     *   wp chirostretch import reindex --url=https://chirostretch.local
     *
     * @param array $args
     * @param array $assoc_args
     */
    public function reindex($args, $assoc_args)
    {
        $base_url = $assoc_args['url'] ?? 'https://localhost:3000';

        $indices = [
            'locations' => '/api/algolia/index-locations',
            'events' => '/api/algolia/index-events',
            'products' => '/api/algolia/index-products',
            'articles' => '/api/algolia/index-articles',
        ];

        WP_CLI::log('Reindexing Algolia...');

        foreach ($indices as $name => $endpoint) {
            $url = $base_url . $endpoint;

            $response = wp_remote_post($url, [
                'timeout' => 60,
                'sslverify' => false,
            ]);

            if (is_wp_error($response)) {
                WP_CLI::warning(sprintf('Failed to reindex %s: %s', $name, $response->get_error_message()));
                continue;
            }

            $body = json_decode(wp_remote_retrieve_body($response), true);
            $count = $body['indexed'] ?? 0;
            WP_CLI::log(sprintf('  %s: %d indexed', ucfirst($name), $count));
        }

        WP_CLI::success('Algolia reindex complete!');
    }

    // === Helper methods ===

    private function get_default_path($filename)
    {
        // Try multiple possible locations
        $paths = [
            ABSPATH . '../../data/generated/' . $filename,
            ABSPATH . '../../../chirostretch/data/generated/' . $filename,
            '/Users/sb/Dev/chirostretch/data/generated/' . $filename,
        ];

        foreach ($paths as $path) {
            if (file_exists($path)) {
                return $path;
            }
        }

        return $paths[0];
    }

    private function find_post_by_seed_id($post_type, $seed_id)
    {
        $query = new WP_Query([
            'post_type' => $post_type,
            'post_status' => 'any',
            'posts_per_page' => 1,
            'meta_query' => [
                [
                    'key' => '_seed_id',
                    'value' => $seed_id,
                ],
            ],
            'fields' => 'ids',
        ]);

        return !empty($query->posts) ? $query->posts[0] : null;
    }

    private function build_location_map()
    {
        $map = [];
        $query = new WP_Query([
            'post_type' => 'location',
            'post_status' => 'publish',
            'posts_per_page' => -1,
            'meta_key' => '_seed_id',
        ]);

        foreach ($query->posts as $post) {
            $seed_id = get_post_meta($post->ID, '_seed_id', true);
            if ($seed_id) {
                $map[$seed_id] = $post->ID;
            }
        }

        return $map;
    }

    private function build_headshot_map()
    {
        $slugs = ['chiropractor', 'physical-therapist', 'massage-therapist', 'sports-medicine'];
        $map = [];

        foreach ($slugs as $slug) {
            $attachment_id = $this->get_attachment_by_slug($slug);
            if ($attachment_id) {
                $map[$slug] = $attachment_id;
            }
        }

        return $map;
    }

    private function build_organizer_map($location_map)
    {
        $map = [];

        foreach ($location_map as $seed_id => $location_id) {
            // Get the linked organizer ID from the location
            $organizer_id = get_post_meta($location_id, '_linked_organizer_id', true);
            if ($organizer_id) {
                $map[$seed_id] = $organizer_id;
            }
        }

        return $map;
    }

    private function format_tec_date($iso_date)
    {
        // Convert ISO 8601 to TEC format: Y-m-d H:i:s
        $timestamp = strtotime($iso_date);
        return date('Y-m-d H:i:s', $timestamp);
    }

    private function sync_tec_tables($post_id, $start_date_iso, $end_date_iso, $duration)
    {
        global $wpdb;

        $start_date = $this->format_tec_date($start_date_iso);
        $end_date = $this->format_tec_date($end_date_iso);
        $start_date_utc = gmdate('Y-m-d H:i:s', strtotime($start_date_iso));
        $end_date_utc = gmdate('Y-m-d H:i:s', strtotime($end_date_iso));

        // Insert into wp_tec_events
        $event_exists = $wpdb->get_var($wpdb->prepare(
            "SELECT post_id FROM {$wpdb->prefix}tec_events WHERE post_id = %d",
            $post_id
        ));

        if (!$event_exists) {
            $wpdb->insert("{$wpdb->prefix}tec_events", [
                'post_id' => $post_id,
                'start_date' => $start_date,
                'end_date' => $end_date,
                'timezone' => 'UTC',
                'duration' => $duration,
            ]);
        }

        // Insert into wp_tec_occurrences
        $occ_exists = $wpdb->get_var($wpdb->prepare(
            "SELECT occurrence_id FROM {$wpdb->prefix}tec_occurrences WHERE post_id = %d",
            $post_id
        ));

        if (!$occ_exists) {
            $wpdb->insert("{$wpdb->prefix}tec_occurrences", [
                'post_id' => $post_id,
                'start_date' => $start_date,
                'start_date_utc' => $start_date_utc,
                'end_date' => $end_date,
                'end_date_utc' => $end_date_utc,
                'duration' => $duration,
                'hash' => md5($post_id . $start_date),
            ]);
        }
    }

    private function get_or_create_venue($event)
    {
        $venue_name = $event['venue_name'] ?? null;
        if (!$venue_name) {
            return null;
        }

        // Check if venue already exists by name
        $existing = get_page_by_title($venue_name, OBJECT, 'tribe_venue');
        if ($existing) {
            return $existing->ID;
        }

        // Create new venue
        $venue_id = wp_insert_post([
            'post_type' => 'tribe_venue',
            'post_title' => $venue_name,
            'post_status' => 'publish',
        ]);

        if (!$venue_id || is_wp_error($venue_id)) {
            return null;
        }

        // Set venue meta
        update_post_meta($venue_id, '_VenueAddress', $event['venue_address'] ?? '');
        update_post_meta($venue_id, '_VenueCity', $event['venue_city'] ?? '');
        update_post_meta($venue_id, '_VenueState', $event['venue_state'] ?? '');
        update_post_meta($venue_id, '_VenueZip', $event['venue_zip'] ?? '');
        update_post_meta($venue_id, '_VenueCountry', 'United States');

        return $venue_id;
    }

    private function get_attachment_by_slug($slug)
    {
        global $wpdb;

        $attachment_id = $wpdb->get_var($wpdb->prepare(
            "SELECT ID FROM {$wpdb->posts} WHERE post_type = 'attachment' AND post_name = %s LIMIT 1",
            $slug
        ));

        return $attachment_id ? (int) $attachment_id : null;
    }

    private function create_staff_user($staff)
    {
        // Check if user already exists
        $existing = get_user_by('email', $staff['email']);
        if ($existing) {
            return $existing->ID;
        }

        $user_id = wp_insert_user([
            'user_login' => $staff['email'],
            'user_email' => $staff['email'],
            'user_pass' => $staff['password'],
            'display_name' => $staff['name'],
            'role' => 'practitioner',
        ]);

        if (is_wp_error($user_id)) {
            return null;
        }

        update_user_meta($user_id, '_seed_id', $staff['_seed_id']);

        return $user_id;
    }

    private function delete_posts_with_seed_id($post_type)
    {
        global $wpdb;

        $query = new WP_Query([
            'post_type' => $post_type,
            'post_status' => 'any',
            'posts_per_page' => -1,
            'meta_key' => '_seed_id',
            'fields' => 'ids',
        ]);

        $count = 0;
        foreach ($query->posts as $post_id) {
            // Clean up TEC tables for events
            if ($post_type === 'tribe_events') {
                $wpdb->delete("{$wpdb->prefix}tec_events", ['post_id' => $post_id]);
                $wpdb->delete("{$wpdb->prefix}tec_occurrences", ['post_id' => $post_id]);
            }

            wp_delete_post($post_id, true);
            $count++;
        }

        return $count;
    }

    private function delete_users_with_seed_id()
    {
        global $wpdb;

        $user_ids = $wpdb->get_col(
            "SELECT user_id FROM {$wpdb->usermeta} WHERE meta_key = '_seed_id'"
        );

        $count = 0;
        foreach ($user_ids as $user_id) {
            if (wp_delete_user($user_id)) {
                $count++;
            }
        }

        return $count;
    }
}

WP_CLI::add_command('chirostretch import', 'ChiroStretch_Bulk_Import_Command');
