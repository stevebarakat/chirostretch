import { NextResponse } from "next/server";
import { adminClient } from "@/lib/algolia/client";
import { algoliaConfig } from "@/config/algolia.config";
import { wpQuery } from "@app/_lib/wp/graphql";
import { ALL_PRODUCTS_QUERY } from "@/lib/graphql/queries";

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
    categories:
      product.productCategories?.nodes
        ?.map((cat) => cat.name || "")
        .join(", ") || "",
    excerpt:
      product.shortDescription?.replace(/<[^>]*>/g, "").substring(0, 200) || "",
    type: "product" as const,
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
    const indexName = algoliaConfig.indices.products;
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
        0
      );

      if (data?.products?.nodes) {
        allProducts.push(...data.products.nodes);
      }

      hasNextPage = data?.products?.pageInfo?.hasNextPage || false;
      cursor = data?.products?.pageInfo?.endCursor || null;
    }

    const algoliaObjects = allProducts
      .filter((product) => product.id && product.slug)
      .map(transformProductToAlgolia);

    await adminClient.saveObjects({
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
