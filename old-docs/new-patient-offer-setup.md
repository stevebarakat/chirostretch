# New Patient Offer System Setup

## Overview

When a user submits the "Claim New Patient Offer" form:
1. Gravity Forms User Registration creates a WordPress user with `lead` role
2. The webhook syncs lead data to CRM (HubSpot, etc.)
3. The lead can log in and view their offer/appointment status
4. When they book or purchase, they're upgraded to `customer` role

## WordPress Setup

### Step 1: Create Lead Role

Add this to `wp-content/mu-plugins/lead-role.php`:

```php
<?php
/**
 * Plugin Name: Lead Role
 * Description: Registers the Lead role for new patient offer submissions
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Register the Lead role on activation
 */
function chirostretch_register_lead_role() {
    add_role('lead', 'Lead', [
        'read' => true,
        'edit_posts' => false,
        'delete_posts' => false,
    ]);
}
add_action('init', 'chirostretch_register_lead_role');

/**
 * Upgrade lead to customer when they make a purchase
 */
function chirostretch_upgrade_lead_on_purchase($order_id) {
    $order = wc_get_order($order_id);
    if (!$order) return;

    $user_id = $order->get_user_id();
    if (!$user_id) return;

    $user = get_user_by('id', $user_id);
    if (!$user) return;

    // Check if user is a lead
    if (in_array('lead', $user->roles)) {
        // Remove lead role, add customer role
        $user->remove_role('lead');
        $user->add_role('customer');
    }
}
add_action('woocommerce_order_status_completed', 'chirostretch_upgrade_lead_on_purchase');
add_action('woocommerce_order_status_processing', 'chirostretch_upgrade_lead_on_purchase');
```

### Step 2: Verify Role Exists

After adding the file, verify in WP Admin:
1. Go to **Users → Add New**
2. Check that "Lead" appears in the Role dropdown

## Gravity Forms Configuration

### Step 1: Create the Form

Create a new form with these fields:

| Field | Type | Required |
|-------|------|----------|
| First Name | Text | Yes |
| Last Name | Text | Yes |
| Email | Email | Yes |
| Phone | Phone | Yes |
| Preferred Location | Dropdown (locations) | Yes |
| How did you hear about us? | Dropdown | No |

### Step 2: Enable User Registration

1. Edit your New Patient Offer form
2. Go to **Settings → User Registration**
3. Click **Add New**

**Feed Settings:**
- Feed Name: `Create Lead Account`
- Action: `Create User`
- Username: `{Email:2}` (use email as username)
- Email: `{Email:2}`
- First Name: `{First Name:1}`
- Last Name: `{Last Name:3}`
- Role: `Lead`
- Password: Leave empty (auto-generated)
- Send Email: Yes (sends password reset link)

### Step 3: Configure Webhook

1. Go to **Settings → Webhooks**
2. Click **Add New**

**Webhook Settings:**
- Name: `New Patient Offer → Next.js`
- URL: `https://yoursite.com/api/gravity-forms/webhook/lead`
- Request Method: `POST`
- Request Format: `JSON`
- Request Headers:
  - `X-Webhook-Secret`: (your secret from env vars)

**Request Body (Field Values):**
```json
{
  "form_id": "{form_id}",
  "entry_id": "{entry_id}",
  "date_created": "{date_created}",
  "first_name": "{First Name:1}",
  "last_name": "{Last Name:3}",
  "email": "{Email:2}",
  "phone": "{Phone:4}",
  "preferred_location": "{Preferred Location:5}",
  "lead_source": "{How did you hear about us?:6}",
  "utm_source": "{utm_source}",
  "utm_campaign": "{utm_campaign}",
  "utm_medium": "{utm_medium}"
}
```

*Replace field IDs (`:1`, `:2`, etc.) with your actual form field IDs*

## Next.js Webhook Endpoint

The webhook endpoint is at:
`src/app/api/gravity-forms/webhook/lead/route.ts`

It handles:
- Sending confirmation email to lead
- Syncing to CRM (HubSpot, Salesforce, etc.)
- Logging submission metrics

## Environment Variables

Add to `.env.local`:

```env
# Gravity Forms Webhook
GRAVITY_FORMS_WEBHOOK_SECRET=your-secret-here

# CRM Integration (choose one)
HUBSPOT_API_KEY=your-hubspot-key
# OR
SALESFORCE_CLIENT_ID=your-salesforce-id
SALESFORCE_CLIENT_SECRET=your-salesforce-secret

# Email (Resend)
RESEND_API_KEY=your-resend-key
```

## Lead Dashboard

Leads can log in and access:
- `/dashboard` - Overview with offer details
- `/profile` - Edit their information
- Booking widget to schedule their new patient appointment

## Lead → Customer Flow

```
1. User fills "Claim New Patient Offer" form
   └─→ Creates WP user with 'lead' role
   └─→ Webhook syncs to CRM
   └─→ Confirmation email sent

2. Lead logs in
   └─→ Sees their offer on /dashboard
   └─→ Can book appointment via booking widget

3. Lead makes a purchase (booking, product, etc.)
   └─→ WooCommerce order triggers role upgrade
   └─→ Lead role removed, Customer role added
   └─→ Same user ID preserved (profile data persists)
```

## GraphQL Queries

Check if user is a lead:

```graphql
query GetViewer {
  viewer {
    databaseId
    email
    roles {
      nodes {
        name
      }
    }
  }
}
```

## CRM Integration Notes

### HubSpot

The webhook can create/update HubSpot contacts:
- Creates contact with email as unique identifier
- Maps form fields to HubSpot properties
- Sets lifecycle stage to "Lead"
- Adds to appropriate list based on location

### Salesforce

Similar flow but creates Lead objects instead of Contacts.

## Testing

1. Submit the form with a test email
2. Check WordPress Users for new lead account
3. Check CRM for synced contact
4. Log in as lead and verify dashboard access
5. Complete a purchase and verify role upgrade
