# WordPress Block (Headless)

## Assumptions

- Headless rendering via Next.js
- All blocks are dynamic (no static HTML output)
- ACF is used for block fields (schema), not templates
- Block whitelist is enforced

## Architecture

```
Editor → ACF fields → GraphQL → Next.js → React component
```

Never:

```
Editor → HTML → parse → hope
```

Blocks are **data schemas**, not templates.

## Steps

1. Create MU-plugin at `mu-plugins/block-{name}.php`
2. Register block (dynamic) and connect ACF field group
3. Create React component at `src/components/Blocks/{Name}/`
4. Add case to `BlockRenderer`
5. Add to the block whitelist

## Files Involved

- `mu-plugins/block-{name}.php`
- ACF field group (and `acf-json/` output)
- `src/components/Blocks/{Name}/{Name}.tsx`
- `src/components/Blocks/{Name}/{Name}.module.css`
- `src/components/Blocks/{Name}/index.ts`
- `src/components/Blocks/BlockRenderer/BlockRenderer.tsx`
- `mu-plugins/block-whitelist.php`

## MU-plugin Template

```php
<?php
// mu-plugins/block-{name}.php

defined('ABSPATH') || exit;

add_action('acf/init', function() {
    if (!function_exists('acf_register_block_type')) return;

    acf_register_block_type([
        'name' => 'block-name',
        'title' => 'Block Name',
        'category' => 'common',
        'mode' => 'edit',
        'supports' => ['align' => false],
        'render_callback' => function($block) {
            // Dynamic block: render in Next.js. This is only a marker.
            echo '<!-- block-name -->';
        },
    ]);
});
```

## React Component

```tsx
type BlockNameProps = {
  attributes: {
    fieldName: string;
  };
};

export function BlockName({ attributes }: BlockNameProps) {
  return <div>{attributes.fieldName}</div>;
}
```

## BlockRenderer Case

```ts
case "acf/block-name":
  return <BlockName key={key} attributes={block.attributes} />;
```

## Block Categories

| Type                                | Data Source        | Renderer                                           |
| ----------------------------------- | ------------------ | -------------------------------------------------- |
| Structured (image, columns, charts) | `block.attributes` | React component                                    |
| Prose (paragraph, heading, list)    | `block.innerHTML`  | `parseHtml()`                                      |
| Unknown                             | `block.innerHTML`  | **Disallowed by default** (explicit approval only) |

## Where Blocks Are Allowed

**Allowed:** Marketing pages, campaigns, contact/forms

**Not allowed:** Location pages, repeated operational layouts

Blocks may control section-level composition. Blocks must NOT control global layout, spacing, motion, or accessibility.

## HTML Fallback Policy

- `dangerouslySetInnerHTML` is permitted only for:
  - Legacy content migrations
  - Explicitly approved block types
- All other unknown blocks should fail loudly with a placeholder and logged warning
- Inline styles, scripts, and layout markup are not permitted

## Gotchas

- Never query `innerHTML` for structured data
- Never store layout/design in HTML attributes
- Never skip the whitelist
- Never use static blocks (serialize to HTML)
- Always normalize WordPress data at the boundary
