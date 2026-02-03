import type { Metadata } from "next";
import {
  PricingHero,
  InitialConsultation,
  PricingTabs,
  BenefitsSection,
  PricingFAQ,
} from "@/components/Pricing";
import styles from "./page.module.css";

export const metadata: Metadata = {
  title: "Pricing Plans | ChiroStretch",
  description:
    "Invest in your health with our flexible session rates and wellness packages. No hidden fees, just pure recovery.",
};

export default function PricingPage() {
  return (
    <main className={styles.main}>
      <PricingHero />
      <InitialConsultation />
      <PricingTabs />
      <BenefitsSection />
      <PricingFAQ />
    </main>
  );
}
