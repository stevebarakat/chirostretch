# Modern CSS Patterns

## Container Queries

Responsive component sizing based on container, not viewport:

```css
.card-container {
  container-type: inline-size;
}

.card {
  display: grid;
  gap: 1rem;
}

@container (min-width: 400px) {
  .card {
    grid-template-columns: 200px 1fr;
  }
}
```

## :has() Selector

Style parent based on children/state:

```css
/* Form group with invalid input */
.form-group:has(input:invalid) {
  border-color: var(--error);
}

/* Nav with open dropdown */
.nav:has(.dropdown[open]) {
  background: var(--nav-active);
}

/* Card with image vs without */
.card:has(img) {
  grid-template-rows: 200px 1fr;
}
```

## Anchor Positioning + Popover

Position tooltips/menus relative to trigger:

```css
.trigger {
  anchor-name: --trigger;
}

.tooltip {
  position: fixed;
  position-anchor: --trigger;
  top: anchor(bottom);
  left: anchor(center);
  translate: -50% 0.5rem;
}
```

```html
<button class="trigger" popovertarget="tip">Hover me</button>
<div id="tip" popover class="tooltip">Tooltip content</div>
```

## View Transitions

Smooth page/state transitions:

```css
::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 200ms;
}

.card {
  view-transition-name: card;
}
```

```tsx
function navigate(href: string) {
  document.startViewTransition(() => {
    router.push(href);
  });
}
```

## Scroll-Driven Animations

Animate based on scroll position:

```css
.progress-bar {
  animation: grow linear;
  animation-timeline: scroll();
}

@keyframes grow {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}

/* Animate element as it enters viewport */
.fade-in {
  animation: fadeIn linear;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes fadeIn {
  from { opacity: 0; translate: 0 2rem; }
  to { opacity: 1; translate: 0 0; }
}
```

## Animating display: none

Use `@starting-style` and `allow-discrete` for enter/exit animations:

```css
.modal {
  opacity: 0;
  scale: 0.95;
  transition: opacity 200ms, scale 200ms, display 200ms allow-discrete;
}

.modal[open] {
  opacity: 1;
  scale: 1;
}

@starting-style {
  .modal[open] {
    opacity: 0;
    scale: 0.95;
  }
}
```

## Dark Mode

System preference with custom property toggle:

```css
:root {
  --bg: #fff;
  --text: #111;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg: #111;
    --text: #eee;
  }
}

/* Optional: data attribute override */
[data-theme="dark"] {
  --bg: #111;
  --text: #eee;
}
```

## Native HTML Solutions

Use semantic HTML before custom components:

```html
<!-- Accordion -->
<details>
  <summary>Section title</summary>
  <p>Expandable content</p>
</details>

<!-- Dialog/Modal -->
<dialog id="modal">
  <form method="dialog">
    <p>Modal content</p>
    <button>Close</button>
  </form>
</dialog>

<!-- Popover -->
<button popovertarget="menu">Open</button>
<div id="menu" popover>Menu content</div>
```

## Responsive Nav Pattern (CSS-only)

```css
.nav {
  container-type: inline-size;
}

.nav-list {
  display: flex;
  gap: 1rem;
}

@container (max-width: 600px) {
  .nav-list {
    position: fixed;
    inset: 0;
    flex-direction: column;
    translate: -100% 0;
    transition: translate 300ms;
  }

  .nav:has(.menu-toggle:checked) .nav-list {
    translate: 0 0;
  }
}
```
