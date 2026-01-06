<?php
/**
 * Plugin Name: Block Whitelist
 * Description: Restricts editor to blocks supported by the headless frontend
 * Version: 1.0.0
 */

defined('ABSPATH') || exit;

/**
 * Remove Row/Stack/Grid variations from Group block
 */
add_action('admin_print_footer_scripts', function () {
  if (!get_current_screen() || get_current_screen()->base !== 'post')
    return;
  ?>
  <script>
    (function checkAndRemove() {
      if (typeof wp === 'undefined' || !wp.blocks || !wp.blocks.getBlockVariations) {
        setTimeout(checkAndRemove, 100);
        return;
      }
      var check = setInterval(function () {
        var variations = wp.blocks.getBlockVariations('core/group');
        if (variations && variations.length > 1) {
          wp.blocks.unregisterBlockVariation('core/group', 'group-row');
          wp.blocks.unregisterBlockVariation('core/group', 'group-stack');
          wp.blocks.unregisterBlockVariation('core/group', 'group-grid');
          clearInterval(check);
        }
      }, 100);
      setTimeout(function () { clearInterval(check); }, 5000);
    })();
  </script>
  <?php
}, 999);

/**
 * Only allow blocks that have renderer support in Next.js
 */
// add_filter('allowed_block_types_all', function($allowed_blocks, $context) {
//     return [
//         // Rich text (rendered via parseHtml)
//         'core/paragraph',
//         'core/heading',
//         'core/quote',

//         // Structured (rendered from JSON attributes)
//         'core/image',
//         'core/list',
//         'core/list-item',

//         // Layout (editor affordances)
//         'core/group',
//         'core/columns',
//         'core/column',

//         // Third-party with renderer support
//         'b-chart/chart',
//         'gravityforms/form',
//     ];
// }, 10, 2);

