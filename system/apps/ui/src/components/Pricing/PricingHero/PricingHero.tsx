import { Container, Text } from "@/components/Primitives";
import styles from "./PricingHero.module.css";

export function PricingHero() {
  return (
    <section className={styles.hero}>
      <Container className={styles.content}>
        <h1 className={styles.headline}>
          Simple, Transparent <span className={styles.accent}>Pricing</span>
        </h1>
        <Text as="p" className={styles.description}>
          Invest in your health with our flexible session rates and wellness
          packages. No hidden fees, just pure recovery.
        </Text>
      </Container>
    </section>
  );
}
