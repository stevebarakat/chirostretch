<?php
/**
 * The template for displaying the footer
 *
 * This matches the Next.js frontend footer design.
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

$frontend_url = getenv('NEXT_PUBLIC_FRONTEND_URL') ?: 'https://localhost:3000';
$tagline = get_bloginfo('description') ?: 'Chiropractic mobility and assisted stretching for modern movement and recovery.';
?>

	<footer class="footer">
		<div class="container">
			<div class="footerMain">
				<!-- Brand Column -->
				<div class="footerBrandColumn">
					<div class="footerLogoWrapper">
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
					<p class="footerTagline"><?php echo esc_html($tagline); ?></p>
					<div class="footerSocial">
						<a href="https://instagram.com" target="_blank" rel="noopener noreferrer" class="footerSocialLink" aria-label="Instagram">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
								<path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
								<line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
							</svg>
						</a>
						<a href="https://facebook.com" target="_blank" rel="noopener noreferrer" class="footerSocialLink" aria-label="Facebook">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
							</svg>
						</a>
						<a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" class="footerSocialLink" aria-label="LinkedIn">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
								<rect width="4" height="12" x="2" y="9"/>
								<circle cx="4" cy="4" r="2"/>
							</svg>
						</a>
					</div>
				</div>

				<!-- Navigation Column -->
				<div class="footerNavColumn">
					<h3 class="footerColumnTitle">EXPLORE</h3>
					<nav class="footerNavList">
						<a href="<?php echo esc_url($frontend_url . '/about'); ?>" class="footerNavLink">About</a>
						<a href="<?php echo esc_url($frontend_url . '/locations'); ?>" class="footerNavLink">Locations</a>
						<a href="<?php echo esc_url($frontend_url . '/services'); ?>" class="footerNavLink">Services</a>
						<a href="<?php echo esc_url($frontend_url . '/franchise'); ?>" class="footerNavLink">Franchise</a>
						<a href="<?php echo esc_url($frontend_url . '/contact'); ?>" class="footerNavLink">Contact</a>
					</nav>
				</div>

				<!-- Corporate Column -->
				<div class="footerCorporateColumn">
					<h3 class="footerColumnTitle">CORPORATE</h3>
					<div class="footerCorporateItem">
						<div class="footerCorporateLabel">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footerCorporateIcon">
								<rect width="20" height="16" x="2" y="4" rx="2"/>
								<path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
							</svg>
							<span>INQUIRIES:</span>
						</div>
						<a href="mailto:info@chirostretch.site" class="footerCorporateLink">
							info@chirostretch.site
						</a>
					</div>
					<div class="footerCorporateItem">
						<div class="footerCorporateLabel">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footerCorporateIcon">
								<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/>
								<line x1="3" x2="21" y1="6" y2="6"/>
								<path d="M16 10a4 4 0 0 1-8 0"/>
							</svg>
							<span>PARTNERSHIP:</span>
						</div>
						<a href="<?php echo esc_url($frontend_url . '/franchise'); ?>" class="footerCorporateLink">
							Franchise Opportunities
						</a>
					</div>
				</div>

				<!-- CTA Column -->
				<div class="footerCtaColumn">
					<div class="footerCtaBox">
						<h3 class="footerCtaTitle">Find a Clinic</h3>
						<p class="footerCtaDescription">
							Locate a ChiroStretch studio near you and start your recovery journey.
						</p>
						<a href="<?php echo esc_url($frontend_url . '/locations'); ?>" class="footerCtaButton">
							<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
								<path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
								<circle cx="12" cy="10" r="3"/>
							</svg>
							<span>Find a Location</span>
						</a>
					</div>
				</div>
			</div>

			<!-- Bottom section -->
			<div class="footerBottom">
				<p class="footerCopyright">
					© <?php echo date('Y'); ?> ChiroStretch. All rights reserved.
				</p>
				<div class="footerLegal">
					<a href="<?php echo esc_url($frontend_url . '/privacy-policy'); ?>" class="footerLegalLink">
						Privacy Policy
					</a>
					<a href="<?php echo esc_url($frontend_url . '/terms-of-use'); ?>" class="footerLegalLink">
						Terms of Use
					</a>
					<a href="<?php echo esc_url($frontend_url . '/accessibility'); ?>" class="footerLegalLink">
						<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="footerAccessibilityIcon">
							<circle cx="16" cy="4" r="1"/>
							<path d="m18 19 1-7-6 1"/>
							<path d="m5 8 3-3 5.5 3-2.36 3.5"/>
							<path d="M4.24 14.5a5 5 0 0 0 6.88 6"/>
							<path d="M13.76 17.5a5 5 0 0 0-6.88-6"/>
						</svg>
						Accessibility
					</a>
				</div>
			</div>
		</div>
	</footer>

</div><!-- #page -->

<?php wp_footer(); ?>

</body>
</html>
