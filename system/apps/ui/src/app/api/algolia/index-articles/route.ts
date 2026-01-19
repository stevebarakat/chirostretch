import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { wpQuery } from "@/lib/cms/graphql";
import { ALL_POSTS_QUERY } from "@/lib/graphql/queries";

const SINGLE_POST_QUERY = `
  query PostById($id: ID!) {
    post(id: $id, idType: DATABASE_ID) {
      id
      databaseId
      slug
      title
      excerpt
      content
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      categories {
        nodes {
          name
          slug
        }
      }
      tags {
        nodes {
          name
          slug
        }
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
  tags?: {
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

  const categoryNodes = post.categories?.nodes || [];
  const tagNodes = post.tags?.nodes || [];

  return {
    objectID: post.id || post.databaseId?.toString() || "",
    title: post.title || "",
    slug: post.slug || "",
    excerpt,
    image: post.featuredImage?.node?.sourceUrl || "",
    imageAlt: post.featuredImage?.node?.altText || "",
    categories: categoryNodes.map((cat) => cat.name || "").filter(Boolean),
    categorySlugs: categoryNodes.map((cat) => cat.slug || "").filter(Boolean),
    tags: tagNodes.map((tag) => tag.name || "").filter(Boolean),
    tagSlugs: tagNodes.map((tag) => tag.slug || "").filter(Boolean),
    type: "article" as const,
  };
}

export async function POST(req: NextRequest) {
  if (!adminClient) {
    return NextResponse.json(
      { error: "Algolia admin client not configured" },
      { status: 500 }
    );
  }

  const indexName = algoliaConfig.indices.articles;

  // Check if this is a webhook request
  const webhookSecret = req.headers.get("x-webhook-secret");
  if (webhookSecret) {
    return handleWebhook(req, webhookSecret, indexName);
  }

  // Otherwise, do bulk reindex
  return handleBulkReindex(indexName);
}

async function handleWebhook(
  req: NextRequest,
  secret: string,
  indexName: string
) {
  if (secret !== process.env.WP_WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { post_id, action } = await req.json();
    const objectID = `article_${post_id}`;

    if (action === "delete") {
      await adminClient!.deleteObject({ indexName, objectID });
      return NextResponse.json({ deleted: true, objectID });
    }

    const data = await wpQuery<{ post: Post }>(
      SINGLE_POST_QUERY,
      { id: post_id },
      { revalidate: 0 }
    );

    if (!data?.post) {
      return NextResponse.json({ skipped: true, reason: "not_found" });
    }

    const record = {
      ...transformPostToAlgolia(data.post),
      objectID,
    };

    await adminClient!.saveObject({ indexName, body: record });
    return NextResponse.json({ indexed: true, objectID });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Algolia Webhook] Articles error:", errorMessage);
    return NextResponse.json(
      { error: "Webhook failed", message: errorMessage },
      { status: 500 }
    );
  }
}

async function handleBulkReindex(indexName: string) {
  try {
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

      const data = await wpQuery<PostsResponse>(ALL_POSTS_QUERY, variables, { revalidate: 0 });

      if (data?.posts?.nodes) {
        allPosts.push(...data.posts.nodes);
      }

      hasNextPage = data?.posts?.pageInfo?.hasNextPage || false;
      cursor = data?.posts?.pageInfo?.endCursor || null;
    }

    const algoliaObjects = allPosts
      .filter((post) => post.id && post.slug)
      .map((p) => ({
        ...transformPostToAlgolia(p),
        objectID: `article_${p.databaseId}`,
      }));

    // Clear index before saving to remove stale records with old objectID formats
    await adminClient!.clearObjects({ indexName });

    await adminClient!.saveObjects({
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
