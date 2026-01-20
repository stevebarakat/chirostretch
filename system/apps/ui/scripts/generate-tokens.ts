import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables from .env.local
dotenv.config({ path: '.env.local' });

// Parse HSL from env var format "200,70,52" -> {h: 200, s: 70, l: 52}
function parseHSL(envValue: string): { h: number; s: number; l: number } {
  const [h, s, l] = envValue.split(',').map(Number);
  return { h, s, l };
}

// Generate color scale (50-950) from base HSL
function generateColorScale(base: { h: number; s: number; l: number }, name: string) {
  const scale = {
    50: { ...base, s: Math.min(100, base.s + 30), l: 98 },
    100: { ...base, s: Math.min(100, base.s + 25), l: 95 },
    200: { ...base, s: Math.min(100, base.s + 20), l: 88 },
    300: { ...base, s: Math.min(100, base.s + 15), l: 78 },
    400: { ...base, s: Math.min(100, base.s + 5), l: 65 },
    500: { ...base }, // Base color
    600: { ...base, s: Math.max(0, base.s - 5), l: base.l - 7 },
    700: { ...base, s: Math.max(0, base.s - 10), l: base.l - 14 },
    800: { ...base, s: Math.max(0, base.s - 15), l: base.l - 22 },
    900: { ...base, s: Math.max(0, base.s - 20), l: base.l - 30 },
    950: { ...base, s: Math.max(0, base.s - 25), l: base.l - 37 },
  };

  return Object.entries(scale)
    .map(([weight, color]) =>
      `  --color-${name}-${weight}: hsl(${color.h}deg ${color.s}% ${color.l}%);`
    )
    .join('\n');
}

// Generate a curated set of transparent variations (light, medium, dark opacities)
function generateTransparentVariants(base: { h: number; s: number; l: number }, name: string) {
  // Keep a practical set: 50 (5%), 100 (10%), 200 (20%), 500 (50%), 800 (80%), 900 (90%)
  // This covers common use cases without generating all 11 variants
  const variants = [
    { weight: 50, alpha: 0.05 },
    { weight: 100, alpha: 0.1 },
    { weight: 200, alpha: 0.2 },
    { weight: 500, alpha: 0.5 },
    { weight: 800, alpha: 0.8 },
    { weight: 900, alpha: 0.9 },
  ];

  return variants
    .map(
      (v) =>
        `  --color-${name}-transparent-${v.weight}: hsl(${base.h}deg ${base.s}% ${base.l}% / ${v.alpha * 100}%);`
    )
    .join('\n');
}

// Generate gradient for primary and secondary colors
function generateGradient(base: { h: number; s: number; l: number }, name: string) {
  return `  --color-${name}-gradient: linear-gradient(to bottom,
    hsl(${base.h}deg ${base.s}% ${base.l}%) 0%,
    hsl(${base.h}deg ${Math.max(0, base.s - 5)}% ${base.l - 7}%) 50%,
    hsl(${base.h}deg ${base.s}% ${base.l}%) 100%);`;
}

// Main generation function
function generateTokens() {
  const primary = parseHSL(process.env.DESIGN_TOKEN_PRIMARY || '200,70,52');
  const secondary = parseHSL(process.env.DESIGN_TOKEN_SECONDARY || '324,80,44');
  const neutral = parseHSL(process.env.DESIGN_TOKEN_NEUTRAL || '0,0,45');
  const success = parseHSL(process.env.DESIGN_TOKEN_SUCCESS || '142,71,45');
  const warning = parseHSL(process.env.DESIGN_TOKEN_WARNING || '38,92,50');
  const error = parseHSL(process.env.DESIGN_TOKEN_ERROR || '0,86,53');
  const info = parseHSL(process.env.DESIGN_TOKEN_INFO || '210,80,50');

  const css = `:root {
  --font-primary: var(--font-poppins);
  --font-secondary: var(--font-montserrat);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /* Primary Color Scale (Generated from env: ${process.env.DESIGN_TOKEN_PRIMARY}) */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
${generateColorScale(primary, 'primary')}

${generateGradient(primary, 'primary')}

${generateTransparentVariants(primary, 'primary')}

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /* Secondary Color Scale (Generated from env: ${process.env.DESIGN_TOKEN_SECONDARY}) */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
${generateColorScale(secondary, 'secondary')}

${generateGradient(secondary, 'secondary')}

${generateTransparentVariants(secondary, 'secondary')}

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /* Neutral Scale (Grayscale) */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
${generateColorScale(neutral, 'neutral')}

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /* Transparent Overlays */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-transparent-white-50: hsl(0deg 0% 100% / 5%);
  --color-transparent-white-100: hsl(0deg 0% 100% / 10%);
  --color-transparent-white-150: hsl(0deg 0% 100% / 15%);
  --color-transparent-white-200: hsl(0deg 0% 100% / 20%);
  --color-transparent-white-250: hsl(0deg 0% 100% / 25%);
  --color-transparent-white-300: hsl(0deg 0% 100% / 30%);
  --color-transparent-white-400: hsl(0deg 0% 100% / 40%);
  --color-transparent-white-500: hsl(0deg 0% 100% / 50%);
  --color-transparent-white-600: hsl(0deg 0% 100% / 60%);
  --color-transparent-white-700: hsl(0deg 0% 100% / 70%);
  --color-transparent-white-800: hsl(0deg 0% 100% / 80%);
  --color-transparent-white-900: hsl(0deg 0% 100% / 90%);
  --color-transparent-white-950: hsl(0deg 0% 100% / 95%);

  --color-transparent-black-50: hsl(0deg 0% 0% / 5%);
  --color-transparent-black-100: hsl(0deg 0% 0% / 10%);
  --color-transparent-black-150: hsl(0deg 0% 0% / 15%);
  --color-transparent-black-200: hsl(0deg 0% 0% / 20%);
  --color-transparent-black-250: hsl(0deg 0% 0% / 25%);
  --color-transparent-black-300: hsl(0deg 0% 0% / 30%);
  --color-transparent-black-400: hsl(0deg 0% 0% / 40%);
  --color-transparent-black-500: hsl(0deg 0% 0% / 50%);
  --color-transparent-black-600: hsl(0deg 0% 0% / 60%);
  --color-transparent-black-700: hsl(0deg 0% 0% / 70%);
  --color-transparent-black-800: hsl(0deg 0% 0% / 80%);
  --color-transparent-black-900: hsl(0deg 0% 0% / 90%);
  --color-transparent-black-950: hsl(0deg 0% 0% / 95%);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /* Semantic Colors */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-success-500: hsl(${success.h}deg ${success.s}% ${success.l}%);
  --color-success-600: hsl(${success.h}deg ${success.s + 1}% ${success.l - 7}%);
  --color-success-700: hsl(${success.h}deg ${success.s + 2}% ${success.l - 13}%);
  --color-success-800: hsl(${success.h}deg ${success.s + 2}% ${success.l - 18}%);
  --color-success-50: hsl(${success.h}deg ${success.s + 5}% 96%);
  --color-success-100: hsl(${success.h}deg ${success.s - 1}% 90%);
  --color-success-200: hsl(${success.h}deg ${success.s - 1}% 80%);
  --color-success-300: hsl(${success.h}deg ${success.s - 1}% 70%);
  --color-success-400: hsl(${success.h}deg ${success.s - 1}% 60%);

  --color-warning-500: hsl(${warning.h}deg ${warning.s}% ${warning.l}%);
  --color-warning-600: hsl(${warning.h}deg ${warning.s + 2}% ${warning.l - 7}%);
  --color-warning-700: hsl(${warning.h}deg ${warning.s + 4}% ${warning.l - 14}%);
  --color-warning-50: hsl(${warning.h}deg ${warning.s}% 96%);
  --color-warning-100: hsl(${warning.h}deg ${warning.s - 4}% 90%);

  --color-error-500: hsl(${error.h}deg ${error.s - 2}% 60%);
  --color-error-600: hsl(${error.h}deg ${error.s}% ${error.l}%);
  --color-error-700: hsl(${error.h}deg ${error.s + 2}% ${error.l - 7}%);
  --color-error-50: hsl(${error.h}deg ${error.s + 7}% 96%);
  --color-error-100: hsl(${error.h}deg ${error.s + 4}% 90%);

  --color-info-50: hsl(${info.h}deg ${info.s}% 96%);
  --color-info-100: hsl(${info.h}deg ${info.s}% 90%);
  --color-info-500: hsl(${info.h}deg ${info.s}% ${info.l}%);
  --color-info-600: hsl(${info.h}deg ${info.s}% ${info.l - 5}%);
  --color-info-700: hsl(${info.h}deg ${info.s}% ${info.l - 15}%);

  /* Status colors (for order states) */
  --color-status-pending: var(--color-warning-600);
  --color-status-pending-bg: var(--color-warning-50);
  --color-status-processing: var(--color-info-600);
  --color-status-processing-bg: var(--color-info-100);
  --color-status-completed: var(--color-success-700);
  --color-status-completed-bg: var(--color-success-50);
  --color-status-failed: var(--color-error-600);
  --color-status-failed-bg: var(--color-error-50);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /* Semantic Token Aliases */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --color-text-primary: var(--color-neutral-900);
  --color-text-secondary: var(--color-neutral-700);
  --color-text-tertiary: var(--color-neutral-500);
  --color-text-inverse: var(--color-neutral-50);
  --color-text-link: var(--color-primary-600);
  --color-text-link-hover: var(--color-primary-700);

  --color-bg-primary: var(--color-neutral-50);
  --color-bg-secondary: var(--color-neutral-100);
  --color-bg-tertiary: var(--color-neutral-200);
  --color-bg-inverse: var(--color-neutral-900);
  --color-bg-overlay: hsl(0deg 0% 0% / 40%);

  --color-border-primary: var(--color-neutral-300);
  --color-border-secondary: var(--color-neutral-200);
  --color-border-focus: var(--color-primary-500);

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */

  /* Spacing, Typography, Effects (Static - not env-driven) */

  /* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
  --spacing-2xl: 48px;
  --spacing-3xl: 64px;
  --spacing-4xl: 96px;
  --spacing-5xl: 128px;

  --font-size-xs: 0.75rem;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;
  --font-size-xl: 1.25rem;
  --font-size-2xl: 1.5rem;
  --font-size-3xl: 1.875rem;
  --font-size-4xl: 2.25rem;
  --font-size-5xl: 3rem;
  --font-size-6xl: 3.75rem;

  --font-weight-light: 300;
  --font-weight-normal: 400;
  --font-weight-medium: 500;
  --font-weight-semibold: 600;
  --font-weight-bold: 700;

  --line-height-tight: 1.2;
  --line-height-normal: 1.5;
  --line-height-relaxed: 1.75;

  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 8px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-full: 9999px;

  --shadow-color: var(--color-transparent-black-100);
  --shadow-sm: 0.3px 0.5px 0.7px var(--shadow-color),
    0.4px 0.8px 1px -1.2px var(--shadow-color),
    1px 2px 2.5px -2.5px var(--shadow-color);
  --shadow-md: 0.3px 0.5px 0.7px var(--shadow-color),
    0.8px 1.6px 2px -0.8px var(--shadow-color),
    2.1px 4.1px 5.2px -1.7px var(--shadow-color),
    5px 10px 12.6px -2.5px var(--shadow-color);
  --shadow-lg: 0.3px 0.5px 0.7px var(--shadow-color),
    1.5px 2.9px 3.7px -0.4px var(--shadow-color),
    2.7px 5.4px 6.8px -0.7px var(--shadow-color),
    4.5px 8.9px 11.2px -1.1px var(--shadow-color),
    7.1px 14.3px 18px -1.4px var(--shadow-color),
    11.2px 22.3px 28.1px -1.8px var(--shadow-color),
    17px 33.9px 42.7px -2.1px var(--shadow-color),
    25px 50px 62.9px -2.5px var(--shadow-color);

  --transition-fast: 150ms ease;
  --transition-base: 200ms ease;
  --transition-slow: 300ms ease;

  --breakpoint-sm: 640px;
  --breakpoint-md: 768px;
  --breakpoint-lg: 1024px;
  --breakpoint-xl: 1280px;
  --breakpoint-2xl: 1536px;

  --container-sm: 640px;
  --container-md: 768px;
  --container-lg: 1024px;
  --container-xl: 1280px;
  --container-2xl: 1536px;

  --header-height: 60px;
  --header-width: 1400px;
}
`;

  // Write to Next.js location
  const nextjsPath = path.join(__dirname, '../src/styles/tokens.css');
  fs.mkdirSync(path.dirname(nextjsPath), { recursive: true });
  fs.writeFileSync(nextjsPath, css);
  console.log('✅ Generated tokens.css for Next.js');

  // Copy to WordPress theme
  const wpPath = path.join(
    __dirname,
    '../../cms/wp-content/themes/chirostretch-theme/css/tokens.css'
  );
  fs.mkdirSync(path.dirname(wpPath), { recursive: true });
  fs.writeFileSync(wpPath, css);
  console.log('✅ Copied tokens.css to WordPress theme');
}

generateTokens();
