<?php

/**
 * Plugin Name: ChiroStretch Locations Seeder (MU)
 * Description: WP-CLI commands to seed/reset dummy data for ChiroStretch clinic locations.
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

class ChiroStretch_Locations_Command
{

  /**
   * Seed dummy locations.
   *
   * ## EXAMPLES
   *
   *   wp chirostretch locations seed
   *
   * @param array $args
   * @param array $assoc_args
   */
  public function seed($args, $assoc_args)
  {
    WP_CLI::log('Seeding ChiroStretch locations...');

    $locations = $this->get_locations_data();

    foreach ($locations as $loc) {
      $post_id = wp_insert_post([
        'post_type' => 'location',
        'post_title' => $loc['name'],
        'post_status' => 'publish',
        'post_content' => $loc['description'],
      ]);

      if (!$post_id || is_wp_error($post_id)) {
        WP_CLI::warning('Failed to create location: ' . $loc['name']);
        continue;
      }

      // Basic scalar fields.
      $this->update_field_or_meta('street_address', $loc['street_address'], $post_id);
      $this->update_field_or_meta('city', $loc['city'], $post_id);
      $this->update_field_or_meta('state', $loc['state'], $post_id);
      $this->update_field_or_meta('zip_code', $loc['zip_code'], $post_id);
      $this->update_field_or_meta('phone_number', $loc['phone_number'], $post_id);
      $this->update_field_or_meta('email', $loc['email'], $post_id);
      $this->update_field_or_meta('latitude', $loc['latitude'], $post_id);
      $this->update_field_or_meta('longitude', $loc['longitude'], $post_id);
      $this->update_field_or_meta('short_description', $loc['short_description'], $post_id);

      // Hours of operation (repeater).
      if (function_exists('update_field')) {
        update_field('hours_of_operation', $loc['hours_of_operation'], $post_id);
      }

      // Services offered (checkbox).
      if (function_exists('update_field')) {
        update_field('services_offered', $loc['services_offered'], $post_id);
      }

      // Featured image (WordPress thumbnail).
      if (!empty($loc['hero_image'])) {
        $this->set_featured_image_from_url($loc['hero_image'], $post_id);
      }

      WP_CLI::log("Created location #{$post_id}: {$loc['name']}");
    }

    WP_CLI::success('ChiroStretch locations seeded.');
  }

  /**
   * Reset all location posts.
   *
   * ## EXAMPLES
   *
   *   wp chirostretch locations reset
   *
   * @param array $args
   * @param array $assoc_args
   */
  public function reset($args, $assoc_args)
  {
    $query = new WP_Query([
      'post_type' => 'location',
      'post_status' => 'any',
      'posts_per_page' => -1,
      'fields' => 'ids',
    ]);

    foreach ($query->posts as $post_id) {
      wp_delete_post($post_id, true);
    }

    WP_CLI::success(sprintf('Deleted %d location posts.', $query->post_count));
  }

  /**
   * Helper: update via ACF if available, else plain meta.
   */
  protected function update_field_or_meta($field_name, $value, $post_id)
  {
    if (null === $value || '' === $value) {
      return;
    }

    if (function_exists('update_field')) {
      update_field($field_name, $value, $post_id);
    } else {
      update_post_meta($post_id, $field_name, $value);
    }
  }

  /**
   * Static data for 10 locations.
   */
  protected function get_locations_data()
  {
    $hero_images = [
      'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg',
      'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg',
      'https://images.pexels.com/photos/3822189/pexels-photo-3822189.jpeg',
      'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg',
      'https://images.pexels.com/photos/7163984/pexels-photo-7163984.jpeg',
      'https://images.pexels.com/photos/6454087/pexels-photo-6454087.jpeg',
      'https://images.pexels.com/photos/3823060/pexels-photo-3823060.jpeg',
      'https://images.pexels.com/photos/3823207/pexels-photo-3823207.jpeg',
      'https://images.pexels.com/photos/3822083/pexels-photo-3822083.jpeg',
      'https://images.pexels.com/photos/6454082/pexels-photo-6454082.jpeg',
      // repeat a few, that’s fine for demo
      'https://images.pexels.com/photos/3823039/pexels-photo-3823039.jpeg',
      'https://images.pexels.com/photos/3823063/pexels-photo-3823063.jpeg',
      'https://images.pexels.com/photos/3822189/pexels-photo-3822189.jpeg',
      'https://images.pexels.com/photos/3822621/pexels-photo-3822621.jpeg',
      'https://images.pexels.com/photos/7163984/pexels-photo-7163984.jpeg',
      'https://images.pexels.com/photos/6454087/pexels-photo-6454087.jpeg',
      'https://images.pexels.com/photos/3823060/pexels-photo-3823060.jpeg',
    ];

    $common_hours = [
      ['day' => 'Monday', 'open' => '9:00 AM', 'close' => '6:00 PM'],
      ['day' => 'Tuesday', 'open' => '9:00 AM', 'close' => '6:00 PM'],
      ['day' => 'Wednesday', 'open' => '9:00 AM', 'close' => '6:00 PM'],
      ['day' => 'Thursday', 'open' => '9:00 AM', 'close' => '6:00 PM'],
      ['day' => 'Friday', 'open' => '9:00 AM', 'close' => '6:00 PM'],
      ['day' => 'Saturday', 'open' => '9:00 AM', 'close' => '2:00 PM'],
      ['day' => 'Sunday', 'open' => 'Closed', 'close' => 'Closed'],
    ];

    // ACF "Services" choices: Stretching, Chiropractic, Mobility Training, Pain Relief, Workshops
    $locations = [
      // 1. Cape Town
      [
        'name' => 'ChiroStretch Cape Town – Sea Point',
        'street_address' => '12 Ocean View Road',
        'city' => 'Cape Town',
        'state' => 'Western Cape',
        'zip' => '8005',
        'phone' => '+27 21 555 0123',
        'email' => 'capetown@chirostretch.com',
        'lat' => '-33.9150',
        'lng' => '18.3890',
        'short_description' => 'Sea Point’s coastal movement studio blending chiropractic, mobility work, and slow-breath floor sessions.',
        'description' => 'ChiroStretch Cape Town – Sea Point sits between the mountain and the ocean, serving runners, surfers, and office workers who live in a city that is constantly in motion. The clinic feels more like a light-filled studio than a medical space, with mats, low stools, and simple tools for teaching joint-friendly movement. Sessions blend chiropractic adjustments with breath-led mobility work aimed at helping people feel stable on trails, comfortable at desks, and relaxed on long flights.

Many patients arrive with a familiar mix of low-back tightness, hip stiffness, and upper-back tension from both training and stress. Each visit includes a short movement screen and one or two take-home drills that can be done in small apartments or along the Sea Point Promenade. The tone is warm and conversational: less “you’re broken,” more “let’s help your body remember how to move well again.”',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training', 'Pain Relief'],
        'hero_image' => $hero_images[0],
      ],

      // 2. Singapore
      [
        'name' => 'ChiroStretch Singapore – Tiong Bahru',
        'street_address' => '22 Yong Siak Street',
        'city' => 'Singapore',
        'state' => 'Singapore',
        'zip' => '168650',
        'phone' => '+65 6555 2030',
        'email' => 'singapore@chirostretch.com',
        'lat' => '1.2840',
        'lng' => '103.8320',
        'short_description' => 'A calm, plant-filled studio in Tiong Bahru focused on posture, breath, and gentle spinal loading.',
        'description' => 'ChiroStretch Singapore – Tiong Bahru lives in a neighborhood that already understands the language of slow coffee and mindful movement. Inside, the clinic is quiet, bright, and simple: no harsh lighting, no blaring TVs, just soft floors, low benches, and enough space to actually move. Many patients arrive straight from co-working spaces and tech offices, bringing neck tension, wrist discomfort, and the forward-rolled shoulders that come with screen-heavy days.

Sessions combine specific adjustments with small, repeatable drills that can be done beside a standing desk or in a condo hallway. There is a strong emphasis on breath and pacing so movement feels sustainable rather than like another high-intensity task. The goal is not to turn patients into athletes but to help them feel grounded and relaxed in a city that rarely slows down.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training', 'Workshops'],
        'hero_image' => $hero_images[1],
      ],

      // 3. Dublin
      [
        'name' => 'ChiroStretch Dublin – City Centre',
        'street_address' => '8 Abbey Street Lower',
        'city' => 'Dublin',
        'state' => 'Dublin',
        'zip' => 'D01',
        'phone' => '+353 1 555 3245',
        'email' => 'dublin@chirostretch.com',
        'lat' => '53.3498',
        'lng' => '-6.2603',
        'short_description' => 'A friendly city-centre space helping musicians, teachers, and office workers move with less grind.',
        'description' => 'ChiroStretch Dublin – City Centre serves a mix of musicians, teachers, hospitality workers, and office teams who split their time between cobblestone streets, classrooms, and small stages. The clinic feels casual and conversational, with plenty of space for people to talk about how they actually use their bodies day-to-day. Staff focus on practical spine and hip care rather than perfection, showing patients how to warm up before gigs, ease into long walks, or unwind after late shifts.

Each visit blends targeted adjustments with simple drills patients can repeat at home: hip openers in the living room, upper-back rotations against a wall, or floor work that needs little more than a mat. The clinic is built around the idea that if care fits into real life, people will actually stick with it.',
        'hours' => $common_hours,
        'services' => ['Chiropractic', 'Stretching', 'Pain Relief'],
        'hero_image' => $hero_images[2],
      ],

      // 4. Toronto
      [
        'name' => 'ChiroStretch Toronto – Queen West',
        'street_address' => '1040 Queen Street West',
        'city' => 'Toronto',
        'state' => 'ON',
        'zip' => 'M6J 1H7',
        'phone' => '+1 (416) 555-0198',
        'email' => 'toronto@chirostretch.com',
        'lat' => '43.6430',
        'lng' => '-79.4240',
        'short_description' => 'A creative-neighbourhood studio for artists, designers, and cyclists trying not to wreck their backs.',
        'description' => 'ChiroStretch Toronto – Queen West lives in a corridor of galleries, studios, and cafés where people constantly flip between laptops, cameras, and bikes. The space is intentionally minimal: clean lines, natural light, and just enough gear to explore how joints behave under light load. Many patients are freelancers and creatives juggling deadlines, side projects, and late nights, so care plans emphasize short, potent routines rather than long, complicated workouts.

The team pays special attention to neck and upper-back tension from screen time, hip tightness from cycling, and wrist issues from cameras and instruments. Each session includes one or two “anchor drills” patients can pair with their existing habits—like a hip reset after coffee or a thoracic rotation series before editing. The vibe is collaborative, not clinical: care is something you and the practitioner build together, not something handed down from a clipboard.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training', 'Workshops'],
        'hero_image' => $hero_images[3],
      ],

      // 5. London
      [
        'name' => 'ChiroStretch London – Shoreditch',
        'street_address' => '27 Redchurch Street',
        'city' => 'London',
        'state' => 'London',
        'zip' => 'E2 7DP',
        'phone' => '+44 20 5550 8123',
        'email' => 'london@chirostretch.com',
        'lat' => '51.5245',
        'lng' => '-0.0738',
        'short_description' => 'An urban mobility loft hidden above the noise of Shoreditch’s cafés and studios.',
        'description' => 'ChiroStretch London – Shoreditch sits above street level, just far enough from the noise to feel like a reset but still close to the energy of the East End. Patients are designers, coders, baristas, DJs, and founders who don’t necessarily want a “clinic” so much as a place to keep their body from burning out. The space leans into that, with open floors, low platforms, and a mix of mobility tools that make it easy to explore how the spine and hips move under gentle load.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training'],
        'hero_image' => $hero_images[4],
      ],

      // 6. San Francisco
      [
        'name' => 'ChiroStretch San Francisco – Mission',
        'street_address' => '910 Valencia Street',
        'city' => 'San Francisco',
        'state' => 'CA',
        'zip' => '94110',
        'phone' => '+1 (415) 555-0177',
        'email' => 'sanfrancisco@chirostretch.com',
        'lat' => '37.7579',
        'lng' => '-122.4219',
        'short_description' => 'Mission District studio helping remote workers and weekend hikers undo screen time and steep hills.',
        'description' => 'ChiroStretch San Francisco – Mission welcomes people who split their time between code, coffee, and climbs up seemingly vertical streets. The clinic leans heavily on hip, ankle, and mid-back mobility so walking the city, carrying groceries, and weekend hiking all feel less punishing. Patients get short, focused routines that pair well with standing desks and long work blocks, making it easier to keep joints awake without turning mobility into a part-time job.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training', 'Pain Relief'],
        'hero_image' => $hero_images[5],
      ],

      // 7. Seattle
      [
        'name' => 'ChiroStretch Seattle – Capitol Hill',
        'street_address' => '615 E Pine Street',
        'city' => 'Seattle',
        'state' => 'WA',
        'zip' => '98122',
        'phone' => '+1 (206) 555-0144',
        'email' => 'seattle@chirostretch.com',
        'lat' => '47.6150',
        'lng' => '-122.3200',
        'short_description' => 'A cozy, plant-heavy studio serving cyclists, lifters, and laptop people on the hill.',
        'description' => 'ChiroStretch Seattle – Capitol Hill is built for people who ride bikes in the rain, lift in small neighborhood gyms, and do deep focus work in crowded cafés. The space is warm and informal, with plenty of hooks for jackets and gear and enough open floor to test how joints move under light load. Most plans address a blend of neck, low-back, and hip issues tied to sitting, lifting, and commuting.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training'],
        'hero_image' => $hero_images[6],
      ],

      // 8. Los Angeles
      [
        'name' => 'ChiroStretch Los Angeles – Silver Lake',
        'street_address' => '3400 Sunset Boulevard',
        'city' => 'Los Angeles',
        'state' => 'CA',
        'zip' => '90026',
        'phone' => '+1 (323) 555-0190',
        'email' => 'losangeles@chirostretch.com',
        'lat' => '34.0860',
        'lng' => '-118.2700',
        'short_description' => 'A light-filled studio for creatives, trainers, and remote workers who live half their life on hills.',
        'description' => 'ChiroStretch Los Angeles – Silver Lake serves a community that bounces between sets, sessions, rehearsals, and long drives across town. The clinic combines precise spinal work with hip and shoulder mobility that keeps people ready for cameras, classes, and last-minute projects. Sessions are built to fit into unpredictable schedules, using short routines that can be done in trailers, studios, and small apartments.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training', 'Workshops'],
        'hero_image' => $hero_images[7],
      ],

      // 9. Denver
      [
        'name' => 'ChiroStretch Denver – RiNo',
        'street_address' => '2901 Blake Street',
        'city' => 'Denver',
        'state' => 'CO',
        'zip' => '80205',
        'phone' => '+1 (303) 555-0162',
        'email' => 'denver@chirostretch.com',
        'lat' => '39.7680',
        'lng' => '-104.9770',
        'short_description' => 'Industrial-loft clinic helping lifters, climbers, and desk workers feel less compressed.',
        'description' => 'ChiroStretch Denver – RiNo sits in an old industrial pocket now filled with murals, breweries, and gyms. Many patients climb, lift, or ski on weekends and sit for long blocks during the week. Care focuses on hips, ankles, and mid-back so people can actually use their strength without grinding their joints. The space leans into that vibe with open floors, rings, and simple tools for teaching joint-friendly loading.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training', 'Pain Relief'],
        'hero_image' => $hero_images[8],
      ],

      // 10. Austin
      [
        'name' => 'ChiroStretch Austin – South Lamar',
        'street_address' => '2211 S Lamar Blvd',
        'city' => 'Austin',
        'state' => 'TX',
        'zip' => '78704',
        'phone' => '+1 (512) 555-9910',
        'email' => 'austin@chirostretch.com',
        'lat' => '30.2470',
        'lng' => '-97.7830',
        'short_description' => 'South Austin studio for people who swap between laptops, live music, and trail days.',
        'description' => 'ChiroStretch Austin – South Lamar fits into a neighborhood full of remote workers, musicians, and people who do not love sitting still. Patients often arrive with a mix of neck tension, low-back crankiness, and hip stiffness from driving, playing, and training. The clinic focuses on simple, repeatable sequences that can be done in backyards, rehearsal spaces, or between meetings.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training', 'Pain Relief'],
        'hero_image' => $hero_images[9],
      ],

      // 11. Pittsburgh
      [
        'name' => 'ChiroStretch Pittsburgh – Lawrenceville',
        'street_address' => '3601 Butler Street',
        'city' => 'Pittsburgh',
        'state' => 'PA',
        'zip' => '15201',
        'phone' => '+1 (412) 555-0188',
        'email' => 'pittsburgh@chirostretch.com',
        'lat' => '40.4685',
        'lng' => '-79.9600',
        'short_description' => 'Neighborhood clinic supporting makers, med workers, and office crews across the river.',
        'description' => 'ChiroStretch Pittsburgh – Lawrenceville works with a mix of hospital staff, makers, and office teams who live and work on different sides of the city’s hills and bridges. Plans are built around easing the strain of long shifts, awkward lifting, and hours at screens. The clinic emphasizes practical drills that fit into tight spaces—hallways, garages, and break rooms—so people actually do the work between visits.',
        'hours' => $common_hours,
        'services' => ['Chiropractic', 'Pain Relief', 'Stretching'],
        'hero_image' => $hero_images[10],
      ],

      // 12. Chicago
      [
        'name' => 'ChiroStretch Chicago – Wicker Park',
        'street_address' => '1503 N Milwaukee Avenue',
        'city' => 'Chicago',
        'state' => 'IL',
        'zip' => '60622',
        'phone' => '+1 (312) 555-0133',
        'email' => 'chicago@chirostretch.com',
        'lat' => '41.9080',
        'lng' => '-87.6770',
        'short_description' => 'Urban studio for commuters, lifters, and remote workers who walk, bike, and train year-round.',
        'description' => 'ChiroStretch Chicago – Wicker Park supports people who move through wind, snow, and heat to get where they need to go. The clinic focuses on keeping joints happy through all of it—especially knees, hips, and low backs that take the brunt of commuting and training. Sessions are structured, clear, and practical, giving patients a couple of key drills to anchor to their day.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Pain Relief', 'Mobility Training'],
        'hero_image' => $hero_images[11],
      ],

      // 13. Philadelphia
      [
        'name' => 'ChiroStretch Philadelphia – Fishtown',
        'street_address' => '1245 Frankford Avenue',
        'city' => 'Philadelphia',
        'state' => 'PA',
        'zip' => '19125',
        'phone' => '+1 (215) 555-0171',
        'email' => 'philadelphia@chirostretch.com',
        'lat' => '39.9690',
        'lng' => '-75.1340',
        'short_description' => 'A low-key mobility studio serving baristas, artists, and office crews along the river.',
        'description' => 'ChiroStretch Philadelphia – Fishtown blends neighborhood casual with focused, evidence-based care. Patients often juggle creative work, hospitality shifts, and time at screens, so plans prioritize neck, shoulder, and low-back relief. The team uses simple tools and floor work to teach people how to share load between hips and spine instead of letting the low back take every hit.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training'],
        'hero_image' => $hero_images[12],
      ],

      // 14. Washington DC
      [
        'name' => 'ChiroStretch Washington DC – Capitol Hill',
        'street_address' => '415 Pennsylvania Ave SE',
        'city' => 'Washington',
        'state' => 'DC',
        'zip' => '20003',
        'phone' => '+1 (202) 555-0196',
        'email' => 'dc@chirostretch.com',
        'lat' => '38.8850',
        'lng' => '-76.9950',
        'short_description' => 'Hill-adjacent clinic focused on posture, stress, and walking-heavy commutes.',
        'description' => 'ChiroStretch Washington DC – Capitol Hill supports policy staffers, civil servants, and locals who spend long days sitting, standing, and walking between meetings. The clinic emphasizes posture, breathing, and simple hip and spine drills that make it easier to tolerate full days in dress shoes and on marble floors.',
        'hours' => $common_hours,
        'services' => ['Chiropractic', 'Stretching', 'Pain Relief'],
        'hero_image' => $hero_images[13],
      ],

      // 15. New York
      [
        'name' => 'ChiroStretch New York – Chelsea',
        'street_address' => '230 W 19th Street',
        'city' => 'New York',
        'state' => 'NY',
        'zip' => '10011',
        'phone' => '+1 (212) 555-0142',
        'email' => 'newyork@chirostretch.com',
        'lat' => '40.7420',
        'lng' => '-74.0018',
        'short_description' => 'Movement studio tucked between galleries, gyms, and office towers in Chelsea.',
        'description' => 'ChiroStretch New York – Chelsea is built for people who live in a vertical city and move fast through all of it. The clinic works with creatives, trainers, and office workers who spend long days on concrete, in elevators, and at screens. Care plans are efficient and focused, designed to slot into busy calendars while still delivering meaningful change in how people move and feel.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training', 'Workshops'],
        'hero_image' => $hero_images[14],
      ],

      // 16. Atlanta
      [
        'name' => 'ChiroStretch Atlanta – Old Fourth Ward',
        'street_address' => '650 North Avenue NE',
        'city' => 'Atlanta',
        'state' => 'GA',
        'zip' => '30308',
        'phone' => '+1 (678) 555-0110',
        'email' => 'atlanta@chirostretch.com',
        'lat' => '33.7710',
        'lng' => '-84.3660',
        'short_description' => 'BeltLine-adjacent clinic for runners, riders, and remote workers who live on the trail.',
        'description' => 'ChiroStretch Atlanta – Old Fourth Ward backs onto the BeltLine and serves people who treat it as their daily loop. Runners, cyclists, and stroller-pushers all show up with the familiar cocktail of hip tightness, knee irritation, and low-back fatigue. The clinic emphasizes gentle loading and practical strength so people can keep enjoying the trail without feeling wrecked afterward.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Mobility Training', 'Pain Relief'],
        'hero_image' => $hero_images[15],
      ],

      // 17. Miami
      [
        'name' => 'ChiroStretch Miami – Wynwood',
        'street_address' => '2560 NW 2nd Avenue',
        'city' => 'Miami',
        'state' => 'FL',
        'zip' => '33127',
        'phone' => '+1 (305) 555-2330',
        'email' => 'miami@chirostretch.com',
        'lat' => '25.8010',
        'lng' => '-80.2000',
        'short_description' => 'Art-district studio blending mobility, breath, and spine work for a late-night city.',
        'description' => 'ChiroStretch Miami – Wynwood lives in a neighborhood full of murals, music, and late hours. Patients are artists, hospitality workers, remote teams, and travelers who want their bodies to keep up with the pace of the city. The clinic leans into breath, mobility, and practical strength so people can enjoy the nightlife, the beach, and their work without feeling like their joints are constantly shouting at them.',
        'hours' => $common_hours,
        'services' => ['Stretching', 'Chiropractic', 'Pain Relief', 'Workshops'],
        'hero_image' => $hero_images[16],
      ],
    ];

    return $locations;
  }
  /**
   * Download an image and set as featured image. Returns attachment ID or 0.
   */
  protected function set_featured_image_from_url($url, $post_id)
  {
    if (!function_exists('media_sideload_image')) {
      require_once ABSPATH . 'wp-admin/includes/media.php';
      require_once ABSPATH . 'wp-admin/includes/file.php';
      require_once ABSPATH . 'wp-admin/includes/image.php';
    }

    $tmp = download_url($url);

    if (is_wp_error($tmp)) {
      return 0;
    }

    $file_array = [
      'name' => basename(parse_url($url, PHP_URL_PATH)),
      'tmp_name' => $tmp,
    ];

    $attachment_id = media_handle_sideload($file_array, $post_id);

    if (is_wp_error($attachment_id)) {
      @unlink($tmp);
      return 0;
    }

    set_post_thumbnail($post_id, $attachment_id);

    return $attachment_id;
  }
}

WP_CLI::add_command('chirostretch locations', 'ChiroStretch_Locations_Command');
