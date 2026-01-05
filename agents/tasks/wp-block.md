# WordPress Block (Headless)

## Assumptions

- Headless rendering via Next.js
- All blocks are dynamic (no static HTML output)
- ACF for block fields
- Block whitelist enforced

## Architecture

```
Editor → ACF fields → GraphQL → Next.js → React component
```

Never:

```
Editor → HTML → parse → hope
```

## Steps

1. Create MU-plugin at `mu-plugins/block-{name}.php`
2. Register ACF field group for block
3. Create React component at `src/components/Blocks/{Name}/`
4. Add case to BlockRenderer
5. Add to block whitelist

## Files Involved

- `mu-plugins/block-{name}.php`
- ACF field group
- `src/components/Blocks/{Name}/{Name}.tsx`
- `src/components/Blocks/{Name}/{Name}.module.css`
- `src/components/Blocks/{Name}/index.ts`
- `src/components/Blocks/BlockRenderer.tsx`
- `mu-plugins/block-whitelist.php`

## MU-plugin Template

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

```typescript
case "acf/block-name":
  return <BlockName key={key} attributes={block.attributes} />;
```

## Block Categories

| Type | Data Source | Renderer |
|------|-------------|----------|
| Structured (image, columns, charts) | `block.attributes` | React component |
| Prose (paragraph, heading, list) | `block.innerHTML` | `parseHtml()` |
| Unknown | `block.innerHTML` | `dangerouslySetInnerHTML` |

## Where Blocks Are Allowed

**Allowed:** Marketing pages, campaigns, contact/forms

**Not allowed:** Location pages, repeated operational layouts

Blocks may control section-level composition. Blocks must NOT control global layout, spacing, motion, or accessibility.

## Gotchas

- Never query `innerHTML` for structured data
- Never store layout/design in HTML attributes
- Never skip the whitelist
- Never use static blocks (serialize to HTML)
- Always normalize WordPress data at the boundary
