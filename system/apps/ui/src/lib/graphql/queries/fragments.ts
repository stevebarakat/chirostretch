/**
 * Shared GraphQL Fragments
 *
 * These fragments are reused across multiple query files to ensure consistency
 * and reduce duplication. When adding a new field to a common pattern (like
 * media items or taxonomies), update it here and it will be reflected everywhere.
 */

/**
 * Media item fields for images
 * Used for featuredImage, galleryImages, icons, etc.
 */
export const MEDIA_ITEM_FIELDS = `
  fragment MediaItemFields on MediaItem {
    id
    sourceUrl
    altText
    srcSet
    sizes
    mediaDetails {
      width
      height
    }
  }
`;

/**
 * Basic media fields without srcSet/sizes
 * Used for icons and smaller images that don't need responsive variants
 */
export const MEDIA_ITEM_BASIC_FIELDS = `
  fragment MediaItemBasicFields on MediaItem {
    sourceUrl
    altText
    mediaDetails {
      width
      height
    }
  }
`;

/**
 * Extended media fields with additional metadata
 * Used for hero images and featured images that need title/description
 */
export const MEDIA_ITEM_EXTENDED_FIELDS = `
  fragment MediaItemExtendedFields on MediaItem {
    sourceUrl
    altText
    srcSet
    sizes
    slug
    title
    description
    mediaDetails {
      width
      height
    }
  }
`;

/**
 * Taxonomy term fields for categories, tags, and other taxonomies
 * Works with Category, Tag, EventsCategory, ProductCategory, etc.
 */
export const TAXONOMY_TERM_FIELDS = `
  fragment TaxonomyTermFields on TermNode {
    id
    name
    slug
  }
`;

/**
 * Author/User fields
 */
export const AUTHOR_FIELDS = `
  fragment AuthorFields on User {
    id
    name
    slug
  }
`;

/**
 * Pagination info fields
 * Used for cursor-based pagination
 */
export const PAGE_INFO_FIELDS = `
  fragment PageInfoFields on PageInfo {
    hasNextPage
    endCursor
    hasPreviousPage
    startCursor
  }
`;

/**
 * Product pricing fields
 * Handles all WooCommerce product types
 */
export const PRODUCT_PRICING_FIELDS = `
  fragment ProductPricingFields on Product {
    ... on SimpleProduct {
      price
      regularPrice
      salePrice
      stockStatus
    }
    ... on VariableProduct {
      price
      regularPrice
      salePrice
      stockStatus
    }
    ... on ExternalProduct {
      price
      regularPrice
      salePrice
    }
    ... on GroupProduct {
      price
    }
  }
`;

/**
 * Basic product pricing (price only, for listings)
 */
export const PRODUCT_BASIC_PRICING_FIELDS = `
  fragment ProductBasicPricingFields on Product {
    ... on SimpleProduct {
      price
      stockStatus
    }
    ... on VariableProduct {
      price
      stockStatus
    }
    ... on ExternalProduct {
      price
    }
    ... on GroupProduct {
      price
    }
  }
`;

/**
 * Event venue fields
 */
export const EVENT_VENUE_FIELDS = `
  fragment EventVenueFields on Venue {
    title
    address
    city
    state
    phone
  }
`;

/**
 * Event organizer fields
 */
export const EVENT_ORGANIZER_FIELDS = `
  fragment EventOrganizerFields on Organizer {
    title
    phone
    email
  }
`;

/**
 * Hero unit fields (used on pages and locations)
 */
export const HERO_UNIT_FIELDS = `
  fragment HeroUnitFields on Page_Herounit {
    heading
    subheading
    heroLink {
      target
      title
      url
    }
    heroLinkIcon {
      node {
        sourceUrl
        altText
        slug
        mediaDetails {
          width
          height
        }
      }
    }
    heroLink2 {
      target
      title
      url
    }
    heroLinkIcon2 {
      node {
        sourceUrl
        altText
        slug
        mediaDetails {
          width
          height
        }
      }
    }
  }
`;
