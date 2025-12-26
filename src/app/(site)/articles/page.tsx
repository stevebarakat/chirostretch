import { Container } from "@/components/UI/Container";
import { ArticlesSearch } from "@/components/Articles";
import styles from "./page.module.css";

export const metadata = {
  title: "Articles",
  description: "Insights, tips, and updates from our team",
};

export default function ArticlesPage() {
  return (
    <main className={styles.main}>
      <Container>
        <ArticlesSearch />
      </Container>
    </main>
  );
}
