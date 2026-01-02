---
name: wp-block
description: Use when creating or modifying WordPress blocks for headless rendering. Covers ACF block registration, Next.js component mapping, and the block whitelist pattern.
---

## Block Architecture (Headless)

```
Editor → ACF fields → GraphQL → Next.js → React component
```

Never:

```
Editor → serialized HTML → parse → pray
```

## Block Usage Boundaries (Critical)

Blocks are not a universal content mechanism.

This project uses a **hybrid content strategy**:

- Some pages are schema-first (no block composition)
- Some pages are block-first (governed composition)

### Where Blocks Are Allowed

Blocks may be used on:

- Marketing pages
- Campaign pages
- Contact and form pages
- Investor and promotional pages

Blocks must NOT be used on:

- Franchise location pages
- Repeated operational layouts
- Pages where structure consistency is required

### What Blocks Control

Blocks may control:

- Section-level composition
- Content grouping
- Narrative order

Blocks must NOT control:

- Global layout
- Spacing systems
- Motion or animation
- Accessibility behavior
- Core page structure

Blocks select _what exists_, not _how it behaves_.

## Separation of Concerns

| Layer     | Responsibility                             |
| --------- | ------------------------------------------ |
| MU-plugin | Block registration + `render_callback`     |
| ACF       | Block fields (editor-facing configuration) |
| Next.js   | React component mapped to block name       |

## Required Files

### 1. WordPress MU-plugin

```php
<?php
// mu-plugins/block-{name}.php

add_action('acf/init', function() {
    if (!function_exists('acf_register_block_type')) return;

    acf_register_block_type([
        'name' => 'block-name',
        'title' => 'Block Name',
        'category' => 'common',
        'mode' => 'edit',
        'supports' => ['align' => false],
        'render_callback' => function($block) {
            // Dynamic block - outputs nothing, data via GraphQL
            echo '<!-- block-name -->';
        },
    ]);
});
```

### 2. Next.js Component

```
src/components/Blocks/BlockName/
├── BlockName.tsx
├── BlockName.module.css
└── index.ts
```

### 3. BlockRenderer Case

```typescript
case "acf/block-name":
  return <BlockName key={key} attributes={block.attributes} />;
```

### 4. Block Whitelist

Add to `mu-plugins/block-whitelist.php`:

```php
'acf/block-name',
```

## Block Categories

### JSON Blocks (structured attributes)

- `core/image`, `core/columns`, `b-chart/chart`
- Query ACF fields via GraphQL
- Render from typed props

### HTML Blocks (parseHtml)

- `core/paragraph`, `core/heading`, `core/list`
- Content stored as HTML
- Use `parseHtml` for React transformation

## Normalization Pattern

Always normalize WordPress data at the boundary:

```typescript
// parseBlockData.ts
export function normalizeBlockName(attrs: any): BlockNameData {
  return {
    // Map WordPress schema to application schema
    title: attrs.title || "",
    items: (attrs.items || []).map(normalizeItem),
  };
}
```

## Anti-Patterns

- Never query `innerHTML` for structured data
- Never store layout/design in HTML attributes
- Never skip the whitelist
- Never use static blocks (serialize to HTML)
