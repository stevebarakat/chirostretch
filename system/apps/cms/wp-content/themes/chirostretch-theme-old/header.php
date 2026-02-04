<?php
/**
 * The header for our theme
 *
 * This is the template that displays the header section matching the Next.js frontend design.
 *
 * @package chirostretch
 */

// Get the logo
$logo_id = attachment_url_to_postid(wp_get_attachment_url(get_theme_mod('custom_logo')));
$logo = null;
if ($logo_id) {
	$logo = array(
		'sourceUrl' => wp_get_attachment_image_url($logo_id, 'full'),
		'altText' => get_post_meta($logo_id, '_wp_attachment_image_alt', true) ?: get_bloginfo('name'),
		'width' => wp_get_attachment_metadata($logo_id)['width'] ?? null,
		'height' => wp_get_attachment_metadata($logo_id)['height'] ?? null,
	);
}

// Determine which menu to display based on page context
$is_account_page = function_exists('is_account_page') && is_account_page();
$menu_slug = $is_account_page ? 'customer-menu' : 'main-menu';

// Get the appropriate menu
$menu_items = wp_get_nav_menu_items($menu_slug);
$menu_tree = array();

if ($menu_items) {
	// Build menu tree with parent-child relationships
	foreach ($menu_items as $item) {
		if ($item->menu_item_parent == 0) {
			$menu_tree[$item->ID] = array(
				'id' => $item->ID,
				'label' => $item->title,
				'uri' => $item->url,
				'children' => array()
			);
		}
	}

	// Add children to parents
	foreach ($menu_items as $item) {
		if ($item->menu_item_parent != 0 && isset($menu_tree[$item->menu_item_parent])) {
			$menu_tree[$item->menu_item_parent]['children'][] = array(
				'id' => $item->ID,
				'label' => $item->title,
				'uri' => $item->url,
			);
		}
	}
}

$frontend_url = getenv('NEXT_PUBLIC_FRONTEND_URL') ?: 'https://localhost:3000';
?>
<!doctype html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo('charset'); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="profile" href="https://gmpg.org/xfn/11">
	<?php wp_head(); ?>
</head>

<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<div id="page" class="site">

	<header class="siteHeader <?php echo $is_account_page ? 'siteHeader--accountPage' : ''; ?>">
		<!-- Top Bar (fixed navigation) -->
		<div class="topBar">
			<div class="topBarContainer">
				<!-- Mobile logo (visible on mobile only) -->
				<div class="topBarMobileOnly">
					<?php if ($logo): ?>
						<a href="<?php echo esc_url($frontend_url); ?>">
							<img
								src="<?php echo esc_url($logo['sourceUrl']); ?>"
								alt="<?php echo esc_attr($logo['altText']); ?>"
								<?php if ($logo['width']): ?>width="<?php echo esc_attr($logo['width']); ?>"<?php endif; ?>
								<?php if ($logo['height']): ?>height="<?php echo esc_attr($logo['height']); ?>"<?php endif; ?>
							/>
						</a>
					<?php else: ?>
						<a href="<?php echo esc_url($frontend_url); ?>">
							<?php bloginfo('name'); ?>
						</a>
					<?php endif; ?>
				</div>

				<!-- Hamburger button (mobile only) -->
				<button
					type="button"
					class="topBarHamburger"
					aria-expanded="false"
					aria-controls="top-navigation"
					aria-label="Toggle navigation menu"
				>
					<span class="hamburger-box">
						<span class="hamburger-inner"></span>
					</span>
				</button>

				<!-- Navigation -->
				<nav id="top-navigation" class="topNav" aria-label="Top navigation">
					<div class="topNavContainer">
						<!-- Mobile logo inside nav (visible on mobile when menu is open) -->
						<div class="topBarMobileOnly">
							<?php if ($logo): ?>
								<a href="<?php echo esc_url($frontend_url); ?>">
									<img
										src="<?php echo esc_url($logo['sourceUrl']); ?>"
										alt="<?php echo esc_attr($logo['altText']); ?>"
										<?php if ($logo['width']): ?>width="<?php echo esc_attr($logo['width']); ?>"<?php endif; ?>
										<?php if ($logo['height']): ?>height="<?php echo esc_attr($logo['height']); ?>"<?php endif; ?>
									/>
								</a>
							<?php else: ?>
								<a href="<?php echo esc_url($frontend_url); ?>">
									<?php bloginfo('name'); ?>
								</a>
							<?php endif; ?>
						</div>

						<!-- Menu items -->
						<ul class="topMenu">
							<?php if (!empty($menu_tree)): ?>
								<?php foreach ($menu_tree as $item): ?>
									<li class="topMenuItem"
										<?php if (!empty($item['children'])): ?>
											data-has-dropdown="true"
										<?php endif; ?>
									>
										<?php if (empty($item['children'])): ?>
											<a href="<?php echo esc_url($item['uri']); ?>" class="topMenuLink">
												<?php echo esc_html($item['label']); ?>
											</a>
										<?php else: ?>
											<button
												type="button"
												class="topMenuBtnLink"
												aria-expanded="false"
												aria-haspopup="true"
											>
												<?php echo esc_html($item['label']); ?>
												<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-left: 0.25rem;" aria-hidden="true">
													<path d="m6 9 6 6 6-6"/>
												</svg>
											</button>
											<ul class="topMenuDropdown">
												<?php foreach ($item['children'] as $child): ?>
													<li>
														<a href="<?php echo esc_url($child['uri']); ?>" class="topMenuLink">
															<?php echo esc_html($child['label']); ?>
														</a>
													</li>
												<?php endforeach; ?>
											</ul>
										<?php endif; ?>
									</li>
								<?php endforeach; ?>
							<?php endif; ?>
						</ul>

						<!-- Location search trigger (mobile only) -->
						<div class="topBarMobileOnly">
							<a href="<?php echo esc_url($frontend_url . '/locations'); ?>" class="locationSearchLink">
								Find a Location
							</a>
						</div>
					</div>

					<!-- Auth/Account link -->
					<a href="<?php echo esc_url(home_url('/my-account/')); ?>" class="topBarAuthLink">
						<span class="visuallyHidden">My Account</span>
						<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
							<circle cx="12" cy="12" r="10"/>
							<circle cx="12" cy="10" r="3"/>
							<path d="M7 20.662V19a2 2 0 0 1 2-2h6a2 2 0 0 1 2 2v1.662"/>
						</svg>
					</a>
				</nav>
			</div>
		</div>

		<?php if (!$is_account_page): ?>
			<!-- Header Bar (logo and location search - desktop only) -->
			<div class="headerBar">
				<div class="headerContainer">
					<!-- Main logo -->
					<?php if ($logo): ?>
						<a href="<?php echo esc_url($frontend_url); ?>" class="logo">
							<img
								src="<?php echo esc_url($logo['sourceUrl']); ?>"
								alt="<?php echo esc_attr($logo['altText']); ?>"
								<?php if ($logo['width']): ?>width="<?php echo esc_attr($logo['width']); ?>"<?php endif; ?>
								<?php if ($logo['height']): ?>height="<?php echo esc_attr($logo['height']); ?>"<?php endif; ?>
							/>
						</a>
					<?php else: ?>
						<a href="<?php echo esc_url($frontend_url); ?>" class="logoText">
							<?php bloginfo('name'); ?>
						</a>
					<?php endif; ?>

					<!-- Location search trigger -->
					<a href="<?php echo esc_url($frontend_url . '/locations'); ?>" class="locationSearchTrigger">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
							<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
							<circle cx="12" cy="10" r="3"/>
						</svg>
						<span>Find a Location</span>
					</a>
				</div>
			</div>
		<?php endif; ?>
	</header>
