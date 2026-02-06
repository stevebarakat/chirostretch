<!-- Scope: task runbook for building/updating Algolia indexes. -->
# Algolia Indexing

## Assumptions

- WPGraphQL is source of truth for content
- Algolia index is write-only from Next.js
- WordPress triggers webhooks on save/delete
- No client-side indexing

## Architecture

```
WordPress → Webhook → Next.js API → GraphQL fetch → Transform → Algolia
```

## Steps

1. Create API route at `src/app/api/algolia/index-{plural}/route.ts`
2. Handle `action: "delete"` by calling `adminClient.deleteObject()`
3. Handle `action: "update"` by fetching fresh data via GraphQL
4. Transform data to Algolia record format
5. Call `adminClient.saveObject()`
6. Add WordPress hooks in MU-plugin

## Files Involved

- `src/app/api/algolia/index-{plural}/route.ts`
- `mu-plugins/{cpt}-cpt.php` (webhook triggers)
- `src/lib/search/client.ts`

## ObjectID Rule (Critical)

**Always use `post_id` from webhook, never `databaseId` from GraphQL.**

```typescript
// CORRECT
const objectID = `location_${post_id}`;

// WRONG - causes duplicates
const objectID = `location_${data.location.databaseId}`;
```

## Record Shape

```typescript
{
  objectID: `{singular}_${postId}`,
  type: "{singular}",
  title: item.title,
  content: stripHtml(item.content || ""),
  // Filterable
  category: item.category?.name,
  // Geo (if applicable)
  _geoloc: { lat, lng },
}
```

## WordPress Hooks

```php
add_action('save_post_{cpt}', function($post_id) {
    if (wp_is_post_revision($post_id)) return;

    wp_remote_post(FRONTEND_URL . '/api/algolia/index-{plural}', [
        'body' => json_encode([
            'post_id' => $post_id,
            'action' => get_post_status($post_id) === 'publish' ? 'update' : 'delete',
        ]),
    ]);
});

add_action('before_delete_post', function($post_id) {
    if (get_post_type($post_id) !== '{cpt}') return;

    wp_remote_post(FRONTEND_URL . '/api/algolia/index-{plural}', [
        'body' => json_encode(['post_id' => $post_id, 'action' => 'delete']),
    ]);
});
```

## Gotchas

- Unpublished posts should trigger delete action
- GraphQL databaseId may differ from post_id (causes duplicate records)
- Always write tests for objectID stability
- Don't test Algolia internals — test your webhook handler logic
