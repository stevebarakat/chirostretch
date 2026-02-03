import { Check } from "lucide-react";
import { Button } from "@/components/Primitives";
import { formatPrice } from "@/lib/utils/formatPrice";
import styles from "./ValuePackageCard.module.css";

type ValuePackageCardProps = {
  title: string;
  sessions: number;
  price: number;
  originalPrice: number;
  savingsLabel: string;
  savingsVariant?: "primary" | "secondary" | "muted";
  benefits: string[];
  featured?: boolean;
  badge?: string;
};

export function ValuePackageCard({
  title,
  sessions,
  price,
  originalPrice,
  savingsLabel,
  savingsVariant = "muted",
  benefits,
  featured,
  badge,
}: ValuePackageCardProps) {
  const savingsClass =
    savingsVariant === "primary"
      ? styles.savingsPrimary
      : savingsVariant === "secondary"
      ? styles.savingsSecondary
      : styles.savingsMuted;

  return (
    <article
      className={
        featured ? [styles.card, styles.cardFeatured].join(" ") : styles.card
      }
      style={badge ? { position: "relative" } : undefined}
    >
      {badge && <span className={styles.badge}>{badge}</span>}
      <h3 className={styles.title}>{title}</h3>
      <div className={styles.sessions}>
        {sessions} <span className={styles.sessionsUnit}>Sessions</span>
      </div>
      <p className={`${styles.savings} ${savingsClass}`}>{savingsLabel}</p>
      <ul className={styles.list}>
        {benefits.map((item) => (
          <li key={item} className={styles.listItem}>
            <Check className={styles.checkIcon} size={20} aria-hidden />
            {item}
          </li>
        ))}
      </ul>
      <div className={styles.footer}>
        <p className={styles.priceRow}>
          {formatPrice(price)}{" "}
          <span className={styles.originalPrice}>
            {formatPrice(originalPrice)}
          </span>
        </p>
        <Button
          as="Link"
          href="/locations"
          color={featured ? "secondary" : "neutral"}
          variant={featured ? "inverse" : "inverse"}
          fullWidth
          className={
            featured
              ? [styles.button, styles.buttonPrimary].join(" ")
              : styles.button
          }
        >
          Buy Package
        </Button>
      </div>
    </article>
  );
}
