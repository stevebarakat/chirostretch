import { Container } from "@/components/UI";
import { EventsSearch } from "@/components/Events";
import styles from "./page.module.css";

export default function EventsPage() {
  return (
    <main className={styles.main}>
      <Container>
        <EventsSearch />
      </Container>
    </main>
  );
}
