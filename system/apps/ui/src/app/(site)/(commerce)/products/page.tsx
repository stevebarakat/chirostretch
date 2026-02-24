import { Container } from "@/components/Primitives";
import { ProductsSearch } from "@/components/Products";
import styles from "./page.module.css";

export const metadata = {
  title: "Products",
  description: "Browse our full collection",
};

export default function ProductsPage() {
  return (
    <main className={styles.main}>
      <Container>
        <ProductsSearch />
      </Container>
    </main>
  );
}
