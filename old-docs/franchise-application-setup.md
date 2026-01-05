# Franchise Application System Setup

## Overview

When a user submits the franchise application form:
1. Gravity Forms User Registration creates a WordPress user with `franchise_applicant` role
2. Gravity Forms Advanced Post Creation creates a `franchise_app` CPT post linked to that user
3. The applicant can log in and view their application status

## CPT Registration

The `franchise_app` CPT is registered in:
`wp-content/mu-plugins/franchise-application-cpt.php`

Note: WordPress limits CPT names to 20 characters, hence `franchise_app` instead of `franchise_application`.

## Gravity Forms Configuration

### Step 1: Enable Advanced Post Creation Feed

1. Edit your Franchise Application form
2. Go to **Settings → Advanced Post Creation**
3. Click **Add New**

### Step 2: Configure the Feed

**Post Settings:**
- Post Type: `Franchise Application`
- Post Status: `Published`
- Post Author: `{Created User}` (from User Registration feed)
- Post Title: Map to applicant name field, e.g., `{Name (First):1.3} {Name (Last):1.6} - Franchise Application`

**Field Mappings (Custom Fields):**

| ACF Field             | GF Field Merge Tag                |
|-----------------------|-----------------------------------|
| `application_status`  | Leave empty (defaults to "pending") |
| `submitted_date`      | `{date_created:Y-m-d}`           |
| `gf_entry_id`         | `{entry_id}`                     |
| `applicant_phone`     | `{Phone:3}`                      |
| `applicant_location`  | `{Desired Territory:5}`          |
| `investment_range`    | `{Investment Range:6}`           |
| `experience`          | `{Relevant Experience:7}`        |

*Replace field IDs (e.g., `:3`, `:5`) with your actual form field IDs*

### Step 3: Feed Order (Critical)

The **User Registration feed must run BEFORE** the Advanced Post Creation feed.

1. Go to **Settings → User Registration**
2. Note the feed's conditional logic (if any)
3. Go to **Settings → Advanced Post Creation**
4. Ensure the Post Creation feed is set to run **after** User Registration

Or use feed ordering:
1. Go to **Forms → Settings → Confirmations & Notifications** (or feed ordering if available)
2. Drag User Registration feed above Post Creation feed

### Step 4: Set Post Author to Created User

In Advanced Post Creation feed:
- Post Author: Select **"Created User"** option
- This links the application post to the user created by User Registration

## GraphQL Query

Franchise applicants can query their own applications:

```graphql
query MyApplications {
  viewer {
    franchiseApplications {
      nodes {
        title
        applicationStatus
        submittedDate
        applicantLocation
      }
    }
  }
}
```

Or query by author:

```graphql
query GetUserApplications($authorId: Int!) {
  franchiseApplications(where: { author: $authorId }) {
    nodes {
      databaseId
      title
      applicationStatus
      submittedDate
      applicantLocation
    }
  }
}
```

## Status Flow

| Status      | Meaning                                    |
|-------------|--------------------------------------------|
| `pending`   | Just submitted, awaiting review            |
| `reviewing` | Staff is actively reviewing                |
| `approved`  | Application approved, next steps to follow |
| `rejected`  | Application denied                         |
| `withdrawn` | Applicant withdrew their application       |

## Admin Workflow

1. New applications appear in **WP Admin → Franchise Apps**
2. Staff reviews application details and GF entry (via `gf_entry_id`)
3. Update `application_status` field
4. Optionally add `internal_notes` (not visible to applicant)

## Next.js Integration

To display application status on the headless frontend:

```typescript
// src/lib/graphql/queries/franchise.ts
export const GET_MY_APPLICATION = `
  query GetMyApplication {
    viewer {
      franchiseApplications(first: 1) {
        nodes {
          databaseId
          title
          applicationStatus
          submittedDate
          applicantLocation
        }
      }
    }
  }
`;
```
