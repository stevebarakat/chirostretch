import { NextResponse } from "next/server";
import { adminClient } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { wpQuery } from "@app/_lib/wp/graphql";

const ALL_POSTS_QUERY = `
  query getAllPosts($first: Int, $after: String) {
    posts(first: $first, after: $after) {
      nodes {
        id
        databaseId
        slug
        title
        excerpt
        content
        ... on NodeWithFeaturedImage {
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
        categories {
          nodes {
            name
            slug
          }
        }
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;

type Post = {
  id?: string;
  databaseId?: number;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
  categories?: {
    nodes?: Array<{
      name?: string;
      slug?: string;
    }>;
  };
};

type PostsResponse = {
  posts?: {
    nodes?: Post[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string;
    };
  };
};

function transformPostToAlgolia(post: Post) {
  const excerpt = post.excerpt
    ? post.excerpt.replace(/<[^>]*>/g, "").substring(0, 200)
    : post.content
    ? post.content.replace(/<[^>]*>/g, "").substring(0, 200)
    : "";

  return {
    objectID: post.id || post.databaseId?.toString() || "",
    title: post.title || "",
    slug: post.slug || "",
    excerpt,
    image: post.featuredImage?.node?.sourceUrl || "",
    imageAlt: post.featuredImage?.node?.altText || "",
    categories:
      post.categories?.nodes?.map((cat) => cat.name || "").join(", ") || "",
    type: "article" as const,
  };
}

export async function POST() {
  if (!adminClient) {
    return NextResponse.json(
      { error: "Algolia admin client not configured" },
      { status: 500 }
    );
  }

  try {
    const indexName = algoliaConfig.indices.articles;
    const allPosts: Post[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const variables: { first: number; after?: string | null } = {
        first: 100,
      };

      if (cursor) {
        variables.after = cursor;
      }

      const data = await wpQuery<PostsResponse>(ALL_POSTS_QUERY, variables, 0);

      if (data?.posts?.nodes) {
        allPosts.push(...data.posts.nodes);
      }

      hasNextPage = data?.posts?.pageInfo?.hasNextPage || false;
      cursor = data?.posts?.pageInfo?.endCursor || null;
    }

    const algoliaObjects = allPosts
      .filter((post) => post.id && post.slug)
      .map(transformPostToAlgolia);

    await adminClient.saveObjects({
      indexName,
      objects: algoliaObjects,
    });

    return NextResponse.json({
      success: true,
      indexed: algoliaObjects.length,
    });
  } catch (error) {
    console.error("Error indexing articles:", error);
    return NextResponse.json(
      { error: "Failed to index articles", details: String(error) },
      { status: 500 }
    );
  }
}
