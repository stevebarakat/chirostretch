---
name: algolia-index
description: Use when creating or modifying Algolia search indexing for headless WordPress. Covers webhook handlers, record transformation, objectID stability, and WordPress hooks.
---

## Webhook Architecture

```
WordPress → Webhook → Next.js API → GraphQL fetch → Transform → Algolia
```

## API Route Structure

```
src/app/api/algolia/index-{plural}/
└── route.ts
```

## Standard Webhook Handler

```typescript
import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/algolia/client";
import { fetchGraphQL } from "@/lib/graphql/client";

const INDEX_NAME = "{plural}";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { post_id, action } = body;

  // Delete action
  if (action === "delete") {
    await adminClient.deleteObject({
      indexName: INDEX_NAME,
      objectID: `{singular}_${post_id}`,
    });
    return NextResponse.json({ success: true, action: "deleted" });
  }

  // Fetch fresh data
  const data = await fetchGraphQL(QUERY, { id: post_id });
  if (!data.{singular}) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  // Transform and index
  const record = transformToAlgoliaRecord(data.{singular}, post_id);
  await adminClient.saveObject({
    indexName: INDEX_NAME,
    body: record,
  });

  return NextResponse.json({ success: true, objectID: record.objectID });
}
```

## ObjectID Stability (Critical)

**Always use `post_id` from webhook, never `databaseId` from GraphQL.**

```typescript
// CORRECT
const objectID = `location_${post_id}`;

// WRONG - causes duplicates
const objectID = `location_${data.location.databaseId}`;
```

## Record Transformation

```typescript
function transformToAlgoliaRecord(item: GraphQLItem, postId: number) {
  return {
    objectID: `{singular}_${postId}`,
    type: "{singular}",
    title: item.title,
    // Searchable fields
    content: stripHtml(item.content || ""),
    // Filterable fields
    category: item.category?.name,
    // Geo fields (if applicable)
    _geoloc: item.latitude && item.longitude ? {
      lat: parseFloat(item.latitude),
      lng: parseFloat(item.longitude),
    } : undefined,
  };
}
```

## WordPress Webhook Setup

```php
// In MU-plugin
add_action('save_post_{cpt}', function($post_id) {
    if (wp_is_post_revision($post_id)) return;

    wp_remote_post(FRONTEND_URL . '/api/algolia/index-{plural}', [
        'body' => json_encode([
            'post_id' => $post_id,
            'action' => get_post_status($post_id) === 'publish' ? 'update' : 'delete',
        ]),
        'headers' => ['Content-Type' => 'application/json'],
    ]);
});

add_action('before_delete_post', function($post_id) {
    if (get_post_type($post_id) !== '{cpt}') return;

    wp_remote_post(FRONTEND_URL . '/api/algolia/index-{plural}', [
        'body' => json_encode([
            'post_id' => $post_id,
            'action' => 'delete',
        ]),
        'headers' => ['Content-Type' => 'application/json'],
    ]);
});
```

## Testing Pattern

```typescript
it("deletes when action=delete", async () => {
  const req = createWebhookRequest({ post_id: 123, action: "delete" });
  await POST(req);
  expect(mockDeleteObject).toHaveBeenCalledWith({
    indexName: "{plural}",
    objectID: "{singular}_123",
  });
});

it("uses post_id from webhook, not GraphQL databaseId", async () => {
  mockFetchGraphQL.mockResolvedValueOnce({
    {singular}: { databaseId: 99999, title: "Test" }
  });
  const req = createWebhookRequest({ post_id: 555, action: "update" });
  await POST(req);
  expect(mockSaveObject).toHaveBeenCalledWith(
    expect.objectContaining({
      body: expect.objectContaining({ objectID: "{singular}_555" }),
    })
  );
});
```

## Checklist

- [ ] API route created at `api/algolia/index-{plural}/route.ts`
- [ ] ObjectID uses `post_id` from webhook (not databaseId)
- [ ] WordPress hooks fire on save/delete
- [ ] Unpublished posts trigger delete action
- [ ] Tests cover delete, update, and objectID stability
