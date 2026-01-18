/**
 * Header navigation functionality
 * Handles mobile menu toggle and dropdown menus
 */

(function() {
  'use strict';

  // Mobile menu toggle
  function initMobileMenu() {
    const hamburger = document.querySelector('.topBarHamburger');
    const nav = document.querySelector('.topNav');

    if (!hamburger || !nav) return;

    hamburger.addEventListener('click', function() {
      const isExpanded = hamburger.getAttribute('aria-expanded') === 'true';

      // Toggle aria-expanded
      hamburger.setAttribute('aria-expanded', !isExpanded);

      // Toggle classes
      hamburger.classList.toggle('is-active');
      nav.classList.toggle('is-open');
    });

    // Close mobile menu when clicking outside
    document.addEventListener('click', function(event) {
      if (!nav.contains(event.target) && !hamburger.contains(event.target)) {
        if (nav.classList.contains('is-open')) {
          hamburger.setAttribute('aria-expanded', 'false');
          hamburger.classList.remove('is-active');
          nav.classList.remove('is-open');
        }
      }
    });

    // Close mobile menu when clicking on a link
    const navLinks = nav.querySelectorAll('.topMenuLink');
    navLinks.forEach(function(link) {
      link.addEventListener('click', function() {
        hamburger.setAttribute('aria-expanded', 'false');
        hamburger.classList.remove('is-active');
        nav.classList.remove('is-open');
      });
    });
  }

  // Dropdown menu functionality
  function initDropdowns() {
    const menuItems = document.querySelectorAll('.topMenuItem[data-has-dropdown="true"]');

    menuItems.forEach(function(item) {
      const button = item.querySelector('.topMenuBtnLink');
      const dropdown = item.querySelector('.topMenuDropdown');

      if (!button || !dropdown) return;

      // Desktop: Show dropdown on hover
      item.addEventListener('mouseenter', function() {
        if (window.innerWidth > 700) {
          dropdown.classList.add('topMenuDropdownOpen');
          button.setAttribute('aria-expanded', 'true');
        }
      });

      item.addEventListener('mouseleave', function() {
        if (window.innerWidth > 700) {
          dropdown.classList.remove('topMenuDropdownOpen');
          button.setAttribute('aria-expanded', 'false');
        }
      });

      // Mobile/Desktop: Toggle on button click
      button.addEventListener('click', function(e) {
        e.preventDefault();
        const isExpanded = button.getAttribute('aria-expanded') === 'true';

        // Close all other dropdowns
        document.querySelectorAll('.topMenuDropdown').forEach(function(otherDropdown) {
          if (otherDropdown !== dropdown) {
            otherDropdown.classList.remove('topMenuDropdownOpen');
            otherDropdown.previousElementSibling.setAttribute('aria-expanded', 'false');
          }
        });

        // Toggle this dropdown
        dropdown.classList.toggle('topMenuDropdownOpen');
        button.setAttribute('aria-expanded', !isExpanded);
      });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function(event) {
      if (!event.target.closest('.topMenuItem')) {
        document.querySelectorAll('.topMenuDropdown').forEach(function(dropdown) {
          dropdown.classList.remove('topMenuDropdownOpen');
          const button = dropdown.previousElementSibling;
          if (button) {
            button.setAttribute('aria-expanded', 'false');
          }
        });
      }
    });
  }

  // Initialize on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function() {
      initMobileMenu();
      initDropdowns();
    });
  } else {
    initMobileMenu();
    initDropdowns();
  }
})();
