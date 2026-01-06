import { Container } from "@/components/UI";
import { ProductsSearch } from "@/components/Products";
import styles from "./page.module.css";

export const metadata = {
  title: "Shop",
  description: "Browse our collection",
};

export default function ShopPage() {
  return (
    <main className={styles.main}>
      <Container>
        <ProductsSearch />
      </Container>
    </main>
  );
}
