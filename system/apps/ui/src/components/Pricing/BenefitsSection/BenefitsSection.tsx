import Image from "next/image";
import { CreditCard, CalendarCheck, Users } from "lucide-react";
import { Text } from "@/components/Primitives";
import styles from "./BenefitsSection.module.css";

const BENEFITS = [
  {
    icon: CreditCard,
    iconVariant: "primary" as const,
    title: "Insurance Accepted",
    description:
      "We work with major providers and can provide superbills for out-of-network reimbursement.",
  },
  {
    icon: CalendarCheck,
    iconVariant: "secondary" as const,
    title: "Flexible Cancellation",
    description:
      "Reschedule your session up to 24 hours in advance with no penalty fee.",
  },
  {
    icon: Users,
    iconVariant: "neutral" as const,
    title: "Referral Bonus",
    description: "Refer a friend and both receive 20% off your next session.",
  },
];

export function BenefitsSection() {
  return (
    <section className={styles.section}>
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.content}>
            <h2 className={styles.title}>
              Why Choose Our{" "}
              <span className={styles.accent}>Wellness Model?</span>
            </h2>
            <Text as="p" className={styles.intro}>
              We believe in maintenance, not just repair. Our pricing plans are
              designed to encourage regular visits so you can stay active and
              pain-free year-round.
            </Text>
            <div className={styles.benefitList}>
              {BENEFITS.map(
                ({ icon: Icon, iconVariant, title, description }) => (
                  <div key={title} className={styles.benefitItem}>
                    <div
                      className={`${styles.iconWrapper} ${
                        styles[
                          `iconWrapper${
                            iconVariant.charAt(0).toUpperCase() +
                            iconVariant.slice(1)
                          }`
                        ]
                      }`}
                    >
                      <Icon size={24} aria-hidden />
                    </div>
                    <div>
                      <h4 className={styles.benefitTitle}>{title}</h4>
                      <Text as="p" className={styles.benefitDescription}>
                        {description}
                      </Text>
                    </div>
                  </div>
                ),
              )}
            </div>
          </div>
          <div className={styles.imageWrapper}>
            <div
              className={`${styles.decorativeBlur} ${styles.decorativeBlurTop}`}
            />
            <div
              className={`${styles.decorativeBlur} ${styles.decorativeBlurBottom}`}
            />
            <Image
              src="/images/chiro-branding.webp"
              alt="ChiroStretch wellness center with modern minimalist design"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className={styles.image}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
