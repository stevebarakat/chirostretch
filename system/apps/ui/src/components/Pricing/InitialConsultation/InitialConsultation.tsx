import { Check } from "lucide-react";
import { Container, Button, Text } from "@/components/Primitives";
import styles from "./InitialConsultation.module.css";

const BENEFITS = [
  "Full Orthopedic & Neurological Exam",
  "Personalized Recovery Roadmap",
  "60 Minutes Total Treatment Time",
];

export function InitialConsultation() {
  return (
    <section className={styles.wrapper}>
      <Container>
        <div className={styles.card}>
          <div className={styles.inner}>
            <div className={styles.content}>
              <span className={styles.badge}>New Patients Only</span>
              <h2 className={styles.title}>
                Initial Consultation &amp; Assessment
              </h2>
              <Text as="p" className={styles.description}>
                Start your recovery journey with a comprehensive 1-hour physical
                evaluation, diagnostic testing, and your first adjustment or
                stretch therapy session.
              </Text>
              <ul className={styles.list}>
                {BENEFITS.map((item) => (
                  <li key={item} className={styles.listItem}>
                    <Check className={styles.checkIcon} size={24} aria-hidden />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className={styles.priceBox}>
              <p className={styles.valueLabel}>Value: $249</p>
              <div className={styles.price}>$149</div>
              <p className={styles.priceNote}>1 Hour Comprehensive</p>
              <Button
                as="Link"
                href="/locations"
                color="secondary"
                fullWidth
                className={styles.ctaButton}
              >
                Claim This Offer
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
