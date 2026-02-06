<!-- Scope: task runbook for registering WordPress custom post types. -->
# WordPress Custom Post Type

## Assumptions

- Headless WordPress with WPGraphQL
- ACF for editorial fields
- MU-plugins for registration

## Separation of Concerns

| Layer | Responsibility |
|-------|----------------|
| MU-plugin | CPT registration, slugs, rewrite rules, GraphQL exposure |
| ACF | Editorial fields only |

**Rule:** If deleting ACF fields breaks production logic, fields belong in PHP.

## Steps

1. Create MU-plugin at `mu-plugins/{slug}-cpt.php`
2. Register CPT with GraphQL exposure
3. Create ACF field group (if editorial)
4. Write GraphQL query
5. Create Next.js routes
6. Add Algolia webhook (if searchable)

## Files Involved

- `mu-plugins/{slug}-cpt.php`
- ACF field group (UI or JSON)
- `src/lib/graphql/queries/{slug}.ts`
- `src/app/(site)/{url-slug}/page.tsx`
- `src/app/(site)/{url-slug}/[slug]/page.tsx`

## MU-plugin Template

```php
<?php
/**
 * Plugin Name: {Name} CPT
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

## GraphQL Query

```graphql
query Get{Name}($id: ID!) {
  {graphqlSingular}(id: $id, idType: DATABASE_ID) {
    databaseId
    title
    {fieldGroupName} {
      fieldName
    }
  }
}
```

## CPT Categories

**Editorial (MU-plugin + ACF):** locations, events, staff
- Content evolves, fields iterate
- ACF handles field configuration

**System (full MU-plugin):** registrations, sync artifacts
- Programmatic, tied to form logic
- Fields defined in `register_post_meta()`

## Gotchas

- Always set `show_in_graphql: true`
- GraphQL names must be camelCase singular/plural
- Don't forget ACF field group location rules
- Test GraphQL queries in GraphiQL before writing frontend
