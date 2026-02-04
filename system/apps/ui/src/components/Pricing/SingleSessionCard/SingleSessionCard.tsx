import { clsx } from "clsx";
import {
  Stethoscope,
  Sparkles,
  GitMerge,
  Dumbbell,
  Activity,
  BowArrow,
} from "lucide-react";
import { Button, Text } from "@/components/Primitives";
import styles from "./SingleSessionCard.module.css";
import Image from "next/image";

const ICON_MAP = {
  medical_services: Stethoscope,
  self_improvement: Sparkles,
  dynamic_form: GitMerge,
  accessibility_new: Activity,
  wash: BowArrow,
  rehab: Dumbbell,
};

type SingleSessionCardProps = {
  title: string;
  description: string;
  price: number;
  unit: string;
  icon?: keyof typeof ICON_MAP;
  imagePlaceholder?: string;
  image?: string;
  featured?: boolean;
  badge?: string;
};

export function SingleSessionCard({
  title,
  description,
  price,
  unit,
  icon = "medical_services",
  imagePlaceholder,
  image,
  featured,
  badge,
}: SingleSessionCardProps) {
  const Icon = ICON_MAP[icon] ?? Stethoscope;

  return (
    <article
      className={clsx(styles.card, featured && styles.cardFeatured)}
      style={badge ? { position: "relative" } : undefined}
    >
      {badge && <span className={styles.badge}>{badge}</span>}
      <div
        className={`${styles.iconWrapper} ${
          featured ? styles.iconWrapperPrimary : ""
        }`}
      >
        <Icon
          className={featured ? styles.icon : styles.iconSecondary}
          size={28}
          aria-hidden
        />
      </div>
      <h3 className={styles.title}>{title}</h3>
      <Text as="p" className={styles.description}>
        {description}
      </Text>
      <div className={styles.priceRow}>
        <span className={styles.price}>${price}</span>
        <span className={styles.priceUnit}>/ {unit}</span>
      </div>
      {imagePlaceholder ? (
        <div className={styles.imagePlaceholder}>{imagePlaceholder}</div>
      ) : null}

      {image ? (
        <div className={styles.imagePlaceholder}>
          <Image src={image} alt="" fill style={{ objectFit: "cover" }} />
        </div>
      ) : null}

      <Button
        as="Link"
        href="/locations"
        color={featured ? "primary" : undefined}
        variant={featured ? undefined : "outline"}
        fullWidth
        className={featured ? styles.buttonPrimary : styles.button}
      >
        Book Session
      </Button>
    </article>
  );
}
