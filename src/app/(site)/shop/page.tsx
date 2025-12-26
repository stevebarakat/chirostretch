import { Container } from "@/components/UI/Container";
import { PageHeader } from "@/components/UI/PageHeader";
import { ProductCard } from "@/components/ProductCard";
import { wpQuery } from "@/app/_lib/wp/graphql";
import {
  ALL_PRODUCTS_QUERY,
  type AllProductsResponse,
} from "@/lib/graphql/queries";
import styles from "./page.module.css";

export const revalidate = 300;

export default async function ShopPage() {
  const data = await wpQuery<AllProductsResponse>(
    ALL_PRODUCTS_QUERY,
    { first: 100 },
    300
  );

  const products = data?.products?.nodes || [];

  return (
    <main className={styles.main}>
      <Container>
        <PageHeader title="Shop" subtitle="Browse our collection" showCart />
        {products.length > 0 ? (
          <div className={styles.grid}>
            {products.map((product) => {
              if (!product.slug) return null;

              return (
                <ProductCard
                  key={product.id || product.slug}
                  id={product.id}
                  databaseId={product.databaseId}
                  name={product.name}
                  slug={product.slug}
                  price={product.price}
                  regularPrice={product.regularPrice}
                  salePrice={product.salePrice}
                  featuredImage={product.featuredImage}
                  stockStatus={product.stockStatus}
                />
              );
            })}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>No products available at this time.</p>
          </div>
        )}
      </Container>
    </main>
  );
}
