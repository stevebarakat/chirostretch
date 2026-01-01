---
name: wp-cpt
description: Use when creating or modifying WordPress custom post types. Covers MU-plugin registration, GraphQL exposure, ACF field integration, and Next.js routing.
---

## CPT Architecture

**Separation of concerns:**
- **MU-plugin** = CPT registration (schema: slug, rewrite rules, GraphQL exposure)
- **ACF** = fields (editorial structure: content, images, toggles)

**The rule:** If deleting an ACF field group would break production logic, fields belong in PHP.

## CPT Categories

### Editorial CPTs (MU-plugin + ACF)
- `locations`, `events`, `staff`
- Content evolves, fields iterate
- ACF handles field configuration

### System CPTs (full MU-plugin, fields in PHP)
- `registrations` — programmatic, tied to form logic
- Sync artifacts, logs, computed records
- Fields defined in `register_post_meta()`

## Required MU-plugin Structure

```php
<?php
/**
 * Plugin Name: {Name} CPT
 * Description: Registers the {name} custom post type
 */

defined('ABSPATH') || exit;

add_action('init', function() {
    register_post_type('{slug}', [
        'labels' => [
            'name' => '{Plural Name}',
            'singular_name' => '{Singular Name}',
        ],
        'public' => true,
        'show_in_rest' => true,
        'show_in_graphql' => true,
        'graphql_single_name' => '{graphqlSingular}',
        'graphql_plural_name' => '{graphqlPlural}',
        'supports' => ['title', 'editor', 'thumbnail'],
        'menu_icon' => 'dashicons-{icon}',
        'has_archive' => true,
        'rewrite' => ['slug' => '{url-slug}'],
    ]);
});
```

## GraphQL Exposure

Required for headless:
```php
'show_in_graphql' => true,
'graphql_single_name' => 'location',
'graphql_plural_name' => 'locations',
```

## ACF Field Registration

For editorial CPTs, use ACF UI or JSON:
```php
// Location rules in ACF field group
'location' => [
    [
        ['param' => 'post_type', 'operator' => '==', 'value' => '{slug}'],
    ],
],
```

## Next.js Integration

### GraphQL Query
```graphql
query Get{Name}($id: ID!) {
  {graphqlSingular}(id: $id, idType: DATABASE_ID) {
    databaseId
    title
    # ACF fields via WPGraphQL for ACF
    {fieldGroupName} {
      fieldName
    }
  }
}
```

### Route Structure
```
src/app/(site)/{url-slug}/
├── page.tsx           # List page
└── [slug]/
    └── page.tsx       # Single page
```

## Checklist

- [ ] MU-plugin created with GraphQL exposure
- [ ] ACF field group created (if editorial)
- [ ] GraphQL query written
- [ ] Next.js routes created
- [ ] Algolia indexing webhook (if searchable)
