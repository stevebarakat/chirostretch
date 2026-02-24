import {
  MEDIA_ITEM_FIELDS,
  MEDIA_ITEM_BASIC_FIELDS,
  TAXONOMY_TERM_FIELDS,
  PRODUCT_PRICING_FIELDS,
  PAGE_INFO_FIELDS,
} from "./fragments";

export const PRODUCT_BY_SLUG_QUERY = `
  ${MEDIA_ITEM_FIELDS}
  ${MEDIA_ITEM_BASIC_FIELDS}
  ${TAXONOMY_TERM_FIELDS}

  query ProductBySlug($slug: ID!) {
    product(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      sku
      description
      shortDescription
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
            ...MediaItemFields
          }
        }
      }
      ... on SimpleProduct {
        price
        regularPrice
        salePrice
        stockStatus
        attributes {
          nodes {
            id
            name
            options
            variation
          }
        }
        galleryImages {
          nodes {
            ...MediaItemFields
          }
        }
      }
      ... on VariableProduct {
        price
        regularPrice
        salePrice
        stockStatus
        attributes {
          nodes {
            id
            name
            options
            variation
          }
        }
        galleryImages {
          nodes {
            ...MediaItemFields
          }
        }
        variations {
          nodes {
            id
            databaseId
            price
            regularPrice
            salePrice
            stockStatus
            attributes {
              nodes {
                name
                value
              }
            }
          }
        }
      }
      ... on ExternalProduct {
        price
        regularPrice
        salePrice
        externalUrl
        buttonText
      }
      ... on GroupProduct {
        price
        galleryImages {
          nodes {
            ...MediaItemFields
          }
        }
      }
      productCategories {
        nodes {
          ...TaxonomyTermFields
        }
      }
      productTags {
        nodes {
          ...TaxonomyTermFields
        }
      }
      related(first: 4) {
        nodes {
          id
          name
          slug
          ... on SimpleProduct {
            price
          }
          ... on VariableProduct {
            price
          }
          ... on NodeWithFeaturedImage {
            featuredImage {
              node {
                ...MediaItemBasicFields
              }
            }
          }
        }
      }
    }
  }
`;

export const ALL_PRODUCT_SLUGS_QUERY = `
  query AllProductSlugs {
    products(first: 1000, where: { typeIn: [SIMPLE, VARIABLE, EXTERNAL, GROUPED] }) {
      nodes {
        id
        slug
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

export const ALL_PRODUCTS_QUERY = `
  ${MEDIA_ITEM_FIELDS}
  ${TAXONOMY_TERM_FIELDS}
  ${PRODUCT_PRICING_FIELDS}
  ${PAGE_INFO_FIELDS}

  query AllProducts($first: Int, $after: String) {
    products(first: $first, after: $after, where: { typeIn: [SIMPLE, VARIABLE, EXTERNAL, GROUPED] }) {
      nodes {
        id
        databaseId
        name
        slug
        ...ProductPricingFields
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...MediaItemFields
            }
          }
        }
        productCategories {
          nodes {
            ...TaxonomyTermFields
          }
        }
        productTags {
          nodes {
            ...TaxonomyTermFields
          }
        }
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
`;

export const PRODUCTS_BY_CATEGORY_QUERY = `
  ${MEDIA_ITEM_FIELDS}
  ${TAXONOMY_TERM_FIELDS}
  ${PRODUCT_PRICING_FIELDS}
  ${PAGE_INFO_FIELDS}

  query ProductsByCategory($slug: ID!, $categorySlug: String!, $first: Int, $after: String) {
    productCategory(id: $slug, idType: SLUG) {
      id
      databaseId
      name
      slug
      description
    }
    products(where: { category: $categorySlug }, first: $first, after: $after) {
      nodes {
        id
        databaseId
        name
        slug
        ...ProductPricingFields
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...MediaItemFields
            }
          }
        }
        productCategories {
          nodes {
            ...TaxonomyTermFields
          }
        }
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
`;

export const PRODUCTS_BY_TAG_QUERY = `
  ${MEDIA_ITEM_FIELDS}
  ${TAXONOMY_TERM_FIELDS}
  ${PRODUCT_PRICING_FIELDS}
  ${PAGE_INFO_FIELDS}

  query ProductsByTag($slug: ID!, $tagId: Int!, $first: Int, $after: String) {
    productTag(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
    }
    products(where: { tagId: $tagId }, first: $first, after: $after) {
      nodes {
        id
        databaseId
        name
        slug
        ...ProductPricingFields
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              ...MediaItemFields
            }
          }
        }
        productCategories {
          nodes {
            ...TaxonomyTermFields
          }
        }
      }
      pageInfo {
        ...PageInfoFields
      }
    }
  }
`;

type ProductImage = {
  sourceUrl?: string;
  altText?: string;
  srcSet?: string;
  sizes?: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
};

type ProductVariation = {
  id?: string;
  databaseId?: number;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  attributes?: {
    nodes?: Array<{
      name?: string;
      value?: string;
    }>;
  };
};

type ProductAttribute = {
  id?: string;
  name?: string;
  options?: string[];
  variation?: boolean;
};

type ProductCategory = {
  id?: string;
  name?: string;
  slug?: string;
};

type RelatedProduct = {
  id?: string;
  name?: string;
  slug?: string;
  price?: string;
  featuredImage?: {
    node?: ProductImage;
  };
};

type BaseProduct = {
  id?: string;
  databaseId?: number;
  name?: string;
  slug?: string;
  sku?: string;
  description?: string;
  shortDescription?: string;
  stockStatus?: string;
  featuredImage?: {
    node?: ProductImage;
  };
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  galleryImages?: {
    nodes?: ProductImage[];
  };
  attributes?: {
    nodes?: ProductAttribute[];
  };
  productCategories?: {
    nodes?: ProductCategory[];
  };
  productTags?: {
    nodes?: Array<{
      id?: string;
      name?: string;
      slug?: string;
    }>;
  };
  related?: {
    nodes?: RelatedProduct[];
  };
};

type SimpleProduct = BaseProduct & {
  __typename?: "SimpleProduct";
};

type VariableProduct = BaseProduct & {
  __typename?: "VariableProduct";
  variations?: {
    nodes?: ProductVariation[];
  };
};

type ExternalProduct = BaseProduct & {
  __typename?: "ExternalProduct";
  externalUrl?: string;
  buttonText?: string;
};

type GroupProduct = BaseProduct & {
  __typename?: "GroupProduct";
};

export type ProductBySlugResponse = {
  product?:
    | SimpleProduct
    | VariableProduct
    | ExternalProduct
    | GroupProduct
    | null;
};

export type AllProductSlugsResponse = {
  products?: {
    nodes?: Array<{
      id?: string;
      slug?: string;
    }>;
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string;
    };
  };
};

type ShopProduct = {
  id?: string;
  databaseId?: number;
  name?: string;
  slug?: string;
  shortDescription?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  featuredImage?: {
    node?: ProductImage;
  };
  productCategories?: {
    nodes?: ProductCategory[];
  };
};

export type AllProductsResponse = {
  products?: {
    nodes?: ShopProduct[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string;
      hasPreviousPage?: boolean;
      startCursor?: string;
    };
  };
};
export type ProductsByCategoryResponse = {
  productCategory?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  } | null;
  products?: {
    nodes?: ShopProduct[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
      hasPreviousPage?: boolean;
      startCursor?: string | null;
    };
  };
};
export type ProductsByTagResponse = {
  productTag?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  } | null;
  products?: {
    nodes?: ShopProduct[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
      hasPreviousPage?: boolean;
      startCursor?: string | null;
    };
  };
};

export const SHOP_DEAL_PRODUCT_QUERY = `
  ${MEDIA_ITEM_BASIC_FIELDS}
  ${PRODUCT_PRICING_FIELDS}

  query ShopDealProduct($first: Int) {
    products(
      first: $first,
      where: {
        typeIn: [SIMPLE, VARIABLE],
        onSale: true,
        orderby: [{ field: DATE, order: DESC }]
      }
    ) {
      nodes {
        id
        databaseId
        name
        slug
        shortDescription
        ...ProductPricingFields
        ... on NodeWithFeaturedImage {
          featuredImage { node { ...MediaItemBasicFields } }
        }
      }
    }
  }
`;

export const SHOP_POPULAR_PRODUCTS_QUERY = `
  ${MEDIA_ITEM_BASIC_FIELDS}
  ${PRODUCT_PRICING_FIELDS}

  query ShopPopularProducts($first: Int) {
    products(
      first: $first,
      where: {
        typeIn: [SIMPLE, VARIABLE],
        orderby: [{ field: TOTAL_SALES, order: DESC }]
      }
    ) {
      nodes {
        id
        databaseId
        name
        slug
        ...ProductPricingFields
        ... on NodeWithFeaturedImage {
          featuredImage { node { ...MediaItemBasicFields } }
        }
      }
    }
  }
`;

export const SHOP_CATEGORIES_QUERY = `
  query ShopCategories($first: Int) {
    productCategories(
      first: $first,
      where: { orderby: COUNT, order: DESC, hideEmpty: true }
    ) {
      nodes {
        id
        name
        slug
        count
      }
    }
  }
`;

export type ShopCategoryNode = {
  id?: string;
  name?: string;
  slug?: string;
  count?: number;
};

export type ShopDealProductResponse = {
  products?: { nodes?: ShopProduct[] };
};

export type ShopPopularProductsResponse = {
  products?: { nodes?: ShopProduct[] };
};

export type ShopCategoriesResponse = {
  productCategories?: { nodes?: ShopCategoryNode[] };
};
