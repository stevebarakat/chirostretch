export const PRODUCT_BY_SLUG_QUERY = `
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
            sourceUrl
            altText
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
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
            sourceUrl
            altText
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
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
            sourceUrl
            altText
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
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
            sourceUrl
            altText
            srcSet
            sizes
            mediaDetails {
              width
              height
            }
          }
        }
      }
      productCategories {
        nodes {
          id
          name
          slug
        }
      }
      productTags {
        nodes {
          id
          name
          slug
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
                sourceUrl
                altText
                mediaDetails {
                  width
                  height
                }
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
  query AllProducts($first: Int, $after: String) {
    products(first: $first, after: $after, where: { typeIn: [SIMPLE, VARIABLE, EXTERNAL, GROUPED] }) {
      nodes {
        id
        databaseId
        name
        slug
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
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              sourceUrl
              altText
              srcSet
              sizes
              mediaDetails {
                width
                height
              }
            }
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const PRODUCTS_BY_CATEGORY_QUERY = `
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
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              sourceUrl
              altText
              srcSet
              sizes
              mediaDetails {
                width
                height
              }
            }
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
      }
    }
  }
`;

export const PRODUCTS_BY_TAG_QUERY = `
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
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              sourceUrl
              altText
              srcSet
              sizes
              mediaDetails {
                width
                height
              }
            }
          }
        }
        productCategories {
          nodes {
            id
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
        hasPreviousPage
        startCursor
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
