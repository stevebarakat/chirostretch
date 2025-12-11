# WordPress MU Plugin Setup

This folder contains must-use (MU) plugins for your WordPress installation.

## Installation

1. **Copy the MU plugin to WordPress:**

   ```bash
   # Copy the nextjs-revalidation.php file to your WordPress mu-plugins directory
   cp wordpress/mu-plugins/nextjs-revalidation.php /path/to/wordpress/wp-content/mu-plugins/
   ```

2. **Configure the plugin:**

   Open the plugin file and update the configuration:

   ```php
   // Option 1: Use environment variables (recommended)
   $this->nextjs_url = getenv('NEXTJS_REVALIDATE_URL') ?: 'https://your-nextjs-site.com/api/revalidate';
   $this->secret = getenv('NEXTJS_REVALIDATE_SECRET') ?: 'your-secret-key-here';
   ```

   OR edit the defaults directly in the plugin file.

3. **Add environment variables to Next.js:**

   In your `.env.local`:

   ```bash
   # Secret key for revalidation (must match WordPress)
   REVALIDATE_SECRET=your-super-secret-key-here
   ```

4. **For production, set environment variables:**

   In your hosting environment (Vercel, Netlify, etc.), set:
   - `REVALIDATE_SECRET` - Same secret key as WordPress

   In your WordPress environment, set:
   - `NEXTJS_REVALIDATE_URL` - Your Next.js URL (e.g., `https://yoursite.com/api/revalidate`)
   - `NEXTJS_REVALIDATE_SECRET` - Same secret key

## How It Works

The MU plugin automatically triggers Next.js cache revalidation when:

- ✅ Posts/Pages are published or updated
- ✅ Posts/Pages are deleted
- ✅ ACF fields are updated (including ACF Options)
- ✅ Menus are updated
- ✅ Media files are added/edited/deleted (for logo changes, etc.)

## Testing

1. Start your Next.js dev server: `npm run dev`
2. Update content in WordPress
3. Check the WordPress debug log for revalidation messages (if `WP_DEBUG` is enabled)
4. Your Next.js site should show the updated content immediately

## Troubleshooting

- **Not working in development?** Make sure both WordPress and Next.js are running
- **Not working in production?** Check that environment variables are set correctly
- **Check WordPress debug.log** for revalidation trigger messages
- **Test the API manually:**
  ```bash
  curl -X POST "https://yoursite.com/api/revalidate?secret=your-secret-key"
  ```
