import { Container } from "@/components/Primitives";
import { LocationsSearch } from "@/components/Locations/LocationsSearch";
import styles from "./page.module.css";

export const revalidate = 300;

export default function LocationsPage() {
  return (
    <main className={styles.main}>
      <Container>
        <LocationsSearch />
      </Container>
    </main>
  );
}
