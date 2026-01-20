# Algolia Search Setup

This project uses Algolia for search functionality across products, events, articles, and locations.

## Environment Variables

### Next.js (`.env.local`)

```env
NEXT_PUBLIC_ALGOLIA_APP_ID=your_app_id
NEXT_PUBLIC_ALGOLIA_SEARCH_KEY=your_search_only_api_key
ALGOLIA_ADMIN_API_KEY=your_admin_api_key

# Optional: Custom index names (defaults shown)
NEXT_PUBLIC_ALGOLIA_INDEX_PRODUCTS=products
NEXT_PUBLIC_ALGOLIA_INDEX_EVENTS=events
NEXT_PUBLIC_ALGOLIA_INDEX_ARTICLES=articles
NEXT_PUBLIC_ALGOLIA_INDEX_LOCATIONS=locations
```

### WordPress (`wp-config.php`)

```php
define('ALGOLIA_APP_ID', 'your_app_id');
define('ALGOLIA_ADMIN_API_KEY', 'your_admin_api_key');
define('ALGOLIA_INDEX_PREFIX', ''); // Optional prefix for index names
```

## Initial Setup

1. Create an Algolia account at https://www.algolia.com/
2. Create four indices in your Algolia dashboard:

   - `products` (or your custom name)
   - `events` (or your custom name)
   - `articles` (or your custom name)
   - `locations` (or your custom name)

3. Configure the searchable attributes for each index:

   - **Products**: `name`, `slug`, `categories`, `excerpt`
   - **Events**: `title`, `slug`, `content`
   - **Articles**: `title`, `slug`, `excerpt`, `categories`
   - **Locations**: `title`, `city`, `state`, `shortDescription`, `streetAddress`

4. Index your data by calling the API routes:

   **Option 1: Use the indexing script (recommended)**

   ```bash
   # Make sure your Next.js dev server is running first
   ./scripts/index-algolia.sh
   ```

   **Option 2: Index manually via curl**

   ```bash
   # Index products
   curl --insecure -X POST https://localhost:3000/api/algolia/index-products

   # Index events
   curl --insecure -X POST https://localhost:3000/api/algolia/index-events

   # Index articles
   curl --insecure -X POST https://localhost:3000/api/algolia/index-articles

   # Index locations
   curl --insecure -X POST https://localhost:3000/api/algolia/index-locations
   ```

   **Check index status:**

   ```bash
   # See how many records are in each index
   curl --insecure https://localhost:3000/api/algolia/check-status
   ```

## How It Works

- The search input in the header dynamically changes based on the current page:

  - Shop/product pages → searches products
  - Events pages → searches events
  - Blog/article pages → searches articles
  - Locations pages → searches locations
  - Default → searches products

- Clicking the search input opens a modal with real-time search results
- Results are displayed with images, titles, and excerpts
- Clicking a result navigates to the corresponding page

## Automatic Sync (Recommended)

The MU-plugin `algolia-sync.php` automatically syncs content to Algolia when saved or deleted in WordPress.

**Supported content types:**
- Locations (`location` CPT)
- Articles (posts)
- Events (`tribe_events` from The Events Calendar)
- Products (WooCommerce)

**How it works:**
1. Editor saves/publishes content in WordPress
2. MU-plugin transforms post to Algolia record
3. Record pushed directly to Algolia via REST API
4. On trash/delete, record removed from Algolia

**No action required** — indexing happens automatically on save.

## Manual Re-indexing

For bulk operations or initial setup, use the API routes:
