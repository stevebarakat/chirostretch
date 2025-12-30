# ACF Field Groups Refactor Plan

## Objective

Re-categorize ACF field groups by **what the data is**, not where it appears.

**Goals:**
- Preserve all existing data
- Clarify ownership (content vs config vs entity)
- Align with the wordpress-admin-structure.md contract

---

## Current State

| Current Group | Key | Category |
|---------------|-----|----------|
| Business Information | `group_business_info` | Options ✓ |
| Component - Description List | `group_693c5d767ee3a` | UI (smell) |
| Custom SEO Settings | `group_669b00e640c90` | Mixed |
| Franchise Opportunities - Why Us | `group_homepage_whyus` | Page-specific (smell) |
| Franchise Opportunities – About | `group_homepage_about` | Page-specific (smell) |
| Hero Unit | `group_693a68da804ba` | Content Schema ✓ |
| Homepage - CTA | `group_66d1c39425156` | Page-specific (smell) |
| Homepage - Introduction | `group_66d1ba8e3ea5c` | Page-specific (smell) |
| Homepage – Featured Products | `group_homepage_featured_products` | Page-specific (smell) |
| Homepage – Latest Insights | `group_homepage_latest_insights` | Page-specific (smell) |
| Homepage – Upcoming Events | `group_homepage_events` | Page-specific (smell) |
| Location Details | `group_chiro_location` | Entity ✓ |
| Promo | `group_66d16c436373d` | Content Schema ✓ |
| Services | `group_services_settings` | Options ✓ |
| Staff Details | `group_staff_details` | Entity ✓ |
| Stats | `group_66d2bcf9c3b63` | Content Schema ✓ |
| Testimonial Details | `group_testimonial` | Entity ✓ |
| Value Propositions | `group_value_propositions` | Options ✓ |

**Smell count:** 7 page-specific groups, 1 UI-named group

---

## Target State

### Content Schemas (Reusable, Semantic)

Content shapes that don't know what page they appear on.

| New Name | Old Name | Key | Action |
|----------|----------|-----|--------|
| Hero – Content | Hero Unit | `group_693a68da804ba` | Rename |
| CTA – Primary | Homepage - CTA | `group_66d1c39425156` | Rename, remove page location rule |
| Promotion – Highlight | Promo | `group_66d16c436373d` | Rename |
| Metrics – Key Stats | Stats | `group_66d2bcf9c3b63` | Rename |
| Feature List | Component - Description List | `group_693c5d767ee3a` | Rename |
| SEO – Page Metadata | Custom SEO Settings | `group_669b00e640c90` | Rename (page-level only) |

### Entities (Canonical Business Objects)

Already correct — minimal changes.

| New Name | Old Name | Key | Action |
|----------|----------|-----|--------|
| Location – Details | Location Details | `group_chiro_location` | Keep (maybe minor field cleanup) |
| Staff – Profile | Staff Details | `group_staff_details` | Keep |
| Testimonial – Details | Testimonial Details | `group_testimonial` | Keep |

### Options Pages (Global Configuration)

Tier-2 decisions.

| New Name | Old Name | Key | Action |
|----------|----------|-----|--------|
| Business Information | Business Information | `group_business_info` | Keep |
| Services | Services | `group_services_settings` | Keep |
| Value Propositions | Value Propositions | `group_value_propositions` | Keep |
| SEO – Defaults | (split from Custom SEO) | NEW | Create for site-wide defaults |

### Groups to Delete (After Migration)

These become queries + templates, not ACF sections.

| Group | Reason | Migration Path |
|-------|--------|----------------|
| Homepage - Introduction | Page-specific | Content lives in page content or reusable schema |
| Homepage – Featured Products | Query, not content | ProductsQuery in Next.js |
| Homepage – Latest Insights | Query, not content | ArticlesQuery in Next.js |
| Homepage – Upcoming Events | Query, not content | EventsQuery in Next.js |
| Franchise Opportunities - Why Us | Page-specific | Move to Value Propositions or page content |
| Franchise Opportunities – About | Page-specific | Move to page content block |

---

## Migration Steps

### Phase 1: Rename Without Breaking (Week 1)

1. **Rename Content Schema groups** in ACF UI
   - Hero Unit → Hero – Content
   - Homepage - CTA → CTA – Primary
   - Promo → Promotion – Highlight
   - Stats → Metrics – Key Stats
   - Component - Description List → Feature List

2. **Update location rules** — remove page-specific assignments, use "Page Template" or "Post Type" instead

3. **Update GraphQL queries** in Next.js to match new field group names (if names changed)

4. **Test:** Ensure all pages still render correctly

### Phase 2: Consolidate Page-Specific Content (Week 2)

1. **Audit Homepage fields:**
   - Introduction → Move to page body content or Hero – Content
   - Featured Products → Delete (query-based)
   - Latest Insights → Delete (query-based)
   - Upcoming Events → Delete (query-based)

2. **Audit Franchise Opportunities fields:**
   - Why Us → Merge into Value Propositions (Options)
   - About → Move to page body content

3. **Update Next.js templates** to fetch from new locations

4. **Test:** Full page regression

### Phase 3: Create SEO Split (Week 2)

1. **Create new Options page:** SEO – Defaults
   - `default_meta_title`
   - `default_meta_description`
   - `default_social_image`

2. **Keep page-level:** SEO – Page Metadata
   - `meta_title` (override)
   - `meta_description` (override)
   - `social_image` (override)

3. **Update Next.js metadata** logic to merge defaults + overrides

### Phase 4: Delete Old Groups (Week 3)

Only after confirming:
- [ ] No GraphQL queries reference old field names
- [ ] No pages depend on deleted groups
- [ ] All data migrated or confirmed unnecessary

Delete in this order:
1. Homepage – Featured Products
2. Homepage – Latest Insights
3. Homepage – Upcoming Events
4. Homepage - Introduction
5. Franchise Opportunities - Why Us
6. Franchise Opportunities – About

---

## GraphQL Fragment Mapping

After refactor, fragments should look like:

```graphql
# Content Schemas
fragment HeroContent on Page_Herocontent {
  headline
  subheadline
  media {
    sourceUrl
    altText
  }
  cta {
    label
    url
  }
}

fragment CtaPrimary on Page_Ctaprimary {
  headline
  body
  ctaLabel
  ctaUrl
}

fragment MetricsKeyStats on Page_Metricskeystats {
  metrics {
    value
    label
    description
  }
}

# Entities
fragment LocationDetails on Location {
  locationDetails {
    address
    city
    state
    zip
    phone
    email
    coordinates {
      latitude
      longitude
    }
  }
}

# Options
fragment BusinessInfo on BusinessInformation {
  companyName
  supportEmail
  phone
  address {
    street
    city
    state
    zip
  }
}
```

---

## Checklist Before Deleting Old Groups

- [ ] All data exported/backed up
- [ ] New groups created with correct location rules
- [ ] Data migrated (if moving between groups)
- [ ] GraphQL queries updated in Next.js
- [ ] All affected pages tested locally
- [ ] Build passes (`npm run build`)
- [ ] Staging deployment verified
- [ ] Old group has zero active usages

---

## The Smell Test (Daily Use)

When creating a new ACF group, ask:

> "Could this content appear on more than one page in the future?"

- **Yes** → Content Schema
- **No, it's a business object** → Entity
- **Global decision** → Options Page
- **Layout/UI** → Not ACF (belongs in Next.js)

---

## Document Status

- **Created:** 2025-12-30
- **Status:** Planning
- **Next:** Review with team, begin Phase 1
