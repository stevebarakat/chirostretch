export const ALL_POSTS_QUERY = `
  query AllPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        excerpt
        content
        date
        modified
        author {
          node {
            id
            name
            slug
          }
        }
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
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
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        tags {
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

export const POST_BY_SLUG_QUERY = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      id
      databaseId
      slug
      title
      excerpt
      content
      date
      modified
      author {
        node {
          id
          name
          slug
        }
      }
      ... on NodeWithFeaturedImage {
        featuredImage {
          node {
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
        }
      }
      categories {
        nodes {
          id
          name
          slug
        }
      }
      tags {
        nodes {
          id
          name
          slug
        }
      }
      blocks
    }
  }
`;

export const ALL_POST_SLUGS_QUERY = `
  query AllPostSlugs {
    posts(first: 1000) {
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

export const POSTS_BY_CATEGORY_QUERY = `
  query PostsByCategory($slug: ID!, $categoryName: String!, $first: Int, $after: String) {
    category(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
    }
    posts(where: { categoryName: $categoryName }, first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        excerpt
        content
        date
        modified
        author {
          node {
            id
            name
            slug
          }
        }
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
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
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        tags {
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

export const POSTS_BY_TAG_QUERY = `
  query PostsByTag($slug: ID!, $tagName: String!, $first: Int, $after: String) {
    tag(id: $slug, idType: SLUG) {
      id
      name
      slug
      description
    }
    posts(where: { tag: $tagName }, first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        excerpt
        content
        date
        modified
        author {
          node {
            id
            name
            slug
          }
        }
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
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
          }
        }
        categories {
          nodes {
            id
            name
            slug
          }
        }
        tags {
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

type PostImage = {
  id?: string;
  sourceUrl?: string;
  altText?: string;
  srcSet?: string;
  sizes?: string;
  mediaDetails?: {
    width?: number;
    height?: number;
  };
};

type PostAuthor = {
  id?: string;
  name?: string;
  slug?: string;
};

type PostCategory = {
  id?: string;
  name?: string;
  slug?: string;
};

type PostTag = {
  id?: string;
  name?: string;
  slug?: string;
};

type Post = {
  id?: string;
  databaseId?: number;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  date?: string;
  modified?: string;
  author?: {
    node?: PostAuthor;
  };
  featuredImage?: {
    node?: PostImage;
  };
  categories?: {
    nodes?: PostCategory[];
  };
  tags?: {
    nodes?: PostTag[];
  };
};

export type AllPostsResponse = {
  posts?: {
    nodes?: Post[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
      hasPreviousPage?: boolean;
      startCursor?: string | null;
    };
  };
};

export type PostBySlugResponse = {
  post?:
    | (Post & {
        blocks?: Array<{
          name: string;
          attributes?: Record<string, unknown>;
          innerBlocks?: unknown[];
          innerHTML?: string;
          innerContent?: string[];
        }>;
      })
    | null;
};

export type AllPostSlugsResponse = {
  posts?: {
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

export type PostsByCategoryResponse = {
  category?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  } | null;
  posts?: {
    nodes?: Post[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
      hasPreviousPage?: boolean;
      startCursor?: string | null;
    };
  };
};
export type PostsByTagResponse = {
  tag?: {
    id?: string;
    name?: string;
    slug?: string;
    description?: string;
  } | null;
  posts?: {
    nodes?: Post[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string | null;
      hasPreviousPage?: boolean;
      startCursor?: string | null;
    };
  };
};
