import { NextRequest, NextResponse } from "next/server";
import { adminClient } from "@/lib/search/client";
import { algoliaConfig } from "@/config/algolia.config";
import { wpQuery } from "@/lib/cms/graphql";
import { ALL_PRODUCTS_QUERY } from "@/lib/graphql/queries";

const SINGLE_PRODUCT_QUERY = `
  query ProductById($id: ID!) {
    product(id: $id, idType: DATABASE_ID) {
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
      featuredImage {
        node {
          sourceUrl
          altText
        }
      }
      productCategories {
        nodes {
          name
          slug
        }
      }
      productTags {
        nodes {
          name
          slug
        }
      }
      shortDescription
      description
    }
  }
`;

type Product = {
  id?: string;
  databaseId?: number;
  name?: string;
  slug?: string;
  price?: string;
  regularPrice?: string;
  salePrice?: string;
  stockStatus?: string;
  featuredImage?: {
    node?: {
      sourceUrl?: string;
      altText?: string;
    };
  };
  productCategories?: {
    nodes?: Array<{
      name?: string;
      slug?: string;
    }>;
  };
  productTags?: {
    nodes?: Array<{
      name?: string;
      slug?: string;
    }>;
  };
  shortDescription?: string;
  description?: string;
};

type ProductsResponse = {
  products?: {
    nodes?: Product[];
    pageInfo?: {
      hasNextPage?: boolean;
      endCursor?: string;
    };
  };
};

function transformProductToAlgolia(product: Product) {
  const categoryNodes = product.productCategories?.nodes || [];
  const tagNodes = product.productTags?.nodes || [];

  return {
    objectID: product.id || product.databaseId?.toString() || "",
    name: product.name || "",
    slug: product.slug || "",
    price: product.price || product.regularPrice || "",
    regularPrice: product.regularPrice || "",
    salePrice: product.salePrice || "",
    stockStatus: product.stockStatus || "",
    image: product.featuredImage?.node?.sourceUrl || "",
    imageAlt: product.featuredImage?.node?.altText || "",
    categories: categoryNodes.map((cat) => cat.name || "").filter(Boolean),
    categorySlugs: categoryNodes.map((cat) => cat.slug || "").filter(Boolean),
    tags: tagNodes.map((tag) => tag.name || "").filter(Boolean),
    tagSlugs: tagNodes.map((tag) => tag.slug || "").filter(Boolean),
    excerpt:
      product.shortDescription?.replace(/<[^>]*>/g, "").substring(0, 200) || "",
    type: "product" as const,
  };
}

export async function POST(req: NextRequest) {
  if (!adminClient) {
    return NextResponse.json(
      { error: "Algolia admin client not configured" },
      { status: 500 }
    );
  }

  const indexName = algoliaConfig.indices.products;

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
    const objectID = `product_${post_id}`;

    console.log("[Algolia Webhook] Products received:", { post_id, action, objectID });

    if (action === "delete") {
      await adminClient!.deleteObject({ indexName, objectID });
      return NextResponse.json({ deleted: true, objectID });
    }

    const data = await wpQuery<{ product: Product }>(
      SINGLE_PRODUCT_QUERY,
      { id: post_id },
      { revalidate: 0 }
    );

    if (!data?.product) {
      return NextResponse.json({ skipped: true, reason: "not_found" });
    }

    const record = {
      ...transformProductToAlgolia(data.product),
      objectID,
    };

    await adminClient!.saveObject({ indexName, body: record });
    console.log("[Algolia Webhook] Indexed product:", objectID);
    return NextResponse.json({ indexed: true, objectID });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Algolia Webhook] Products error:", errorMessage);
    return NextResponse.json(
      { error: "Webhook failed", message: errorMessage },
      { status: 500 }
    );
  }
}

async function handleBulkReindex(indexName: string) {
  try {
    const allProducts: Product[] = [];
    let hasNextPage = true;
    let cursor: string | null = null;

    while (hasNextPage) {
      const variables: { first: number; after?: string | null } = {
        first: 100,
      };

      if (cursor) {
        variables.after = cursor;
      }

      const data = await wpQuery<ProductsResponse>(
        ALL_PRODUCTS_QUERY,
        variables,
        { revalidate: 0 }
      );

      if (data?.products?.nodes) {
        allProducts.push(...data.products.nodes);
      }

      hasNextPage = data?.products?.pageInfo?.hasNextPage || false;
      cursor = data?.products?.pageInfo?.endCursor || null;
    }

    const algoliaObjects = allProducts
      .filter((product) => product.id && product.slug)
      .map((p) => ({
        ...transformProductToAlgolia(p),
        objectID: `product_${p.databaseId}`,
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
    console.error("Error indexing products:", error);
    return NextResponse.json(
      { error: "Failed to index products", details: String(error) },
      { status: 500 }
    );
  }
}
