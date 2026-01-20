/**
 * Lighthouse CI Configuration
 *
 * Tracks performance metrics across key pages:
 * - Homepage
 * - Location detail page
 * - Product page
 * - Checkout page
 *
 * Run locally: npx lhci autorun
 * Or via npm script: pnpm lighthouse
 */

module.exports = {
  ci: {
    collect: {
      // Use a static URL or configure based on environment
      url: [
        process.env.LHCI_BASE_URL || "https://chirostretch-copy.local:3000",
        `${process.env.LHCI_BASE_URL || "https://chirostretch-copy.local:3000"}/locations`,
        `${process.env.LHCI_BASE_URL || "https://chirostretch-copy.local:3000"}/shop`,
        `${process.env.LHCI_BASE_URL || "https://chirostretch-copy.local:3000"}/cart`,
      ],
      numberOfRuns: 3,
      settings: {
        // Skip HTTPS errors for local development
        chromeFlags: "--ignore-certificate-errors",
        // Mobile-first testing
        preset: "desktop",
        // Throttle to simulate real-world conditions
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
        },
      },
    },
    assert: {
      assertions: {
        // Performance thresholds
        "categories:performance": ["warn", { minScore: 0.7 }],
        "categories:accessibility": ["error", { minScore: 0.9 }],
        "categories:best-practices": ["warn", { minScore: 0.8 }],
        "categories:seo": ["warn", { minScore: 0.8 }],

        // Core Web Vitals
        "largest-contentful-paint": ["warn", { maxNumericValue: 2500 }],
        "first-contentful-paint": ["warn", { maxNumericValue: 1800 }],
        "cumulative-layout-shift": ["warn", { maxNumericValue: 0.1 }],
        "total-blocking-time": ["warn", { maxNumericValue: 300 }],

        // Interactive metrics
        interactive: ["warn", { maxNumericValue: 3800 }],
        "speed-index": ["warn", { maxNumericValue: 3400 }],
      },
    },
    upload: {
      // Store results locally in filesystem for now
      // Change to 'lhci' for Lighthouse CI server, or 'temporary-public-storage'
      target: "filesystem",
      outputDir: ".lighthouseci",
      reportFilenamePattern:
        "%%PATHNAME%%-%%DATETIME%%-report.%%EXTENSION%%",
    },
  },
};
