import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import {
  SHOP_DEAL_PRODUCT_QUERY,
  SHOP_POPULAR_PRODUCTS_QUERY,
  SHOP_CATEGORIES_QUERY,
  ALL_PRODUCTS_QUERY,
  type ShopDealProductResponse,
  type ShopPopularProductsResponse,
  type ShopCategoriesResponse,
  type AllProductsResponse,
} from "@/lib/graphql/queries/products";
import { ShopHomepage } from "@/components/Shop";

export const metadata = {
  title: "Shop",
  description: "Curated products for spinal health, recovery, and everyday comfort",
};

export default async function ShopPage() {
  const cacheOpts = { tags: [CACHE_TAGS.products] };

  const [dealRes, popularRes, categoriesRes] = await Promise.all([
    wpQuery<ShopDealProductResponse>(SHOP_DEAL_PRODUCT_QUERY, { first: 1 }, cacheOpts),
    wpQuery<ShopPopularProductsResponse>(SHOP_POPULAR_PRODUCTS_QUERY, { first: 4 }, cacheOpts),
    wpQuery<ShopCategoriesResponse>(SHOP_CATEGORIES_QUERY, { first: 8 }, cacheOpts),
  ]);

  let dealProduct = dealRes.products?.nodes?.[0] ?? null;

  // Fallback: if nothing on sale, use the newest product
  if (!dealProduct) {
    const fallbackRes = await wpQuery<AllProductsResponse>(
      ALL_PRODUCTS_QUERY,
      { first: 1 },
      cacheOpts,
    );
    dealProduct = fallbackRes.products?.nodes?.[0] ?? null;
  }

  return (
    <ShopHomepage
      dealProduct={dealProduct}
      popularProducts={popularRes.products?.nodes ?? []}
      categories={categoriesRes.productCategories?.nodes ?? []}
    />
  );
}
