"use client";

import { useState } from "react";
import { SingleSessionCard } from "../SingleSessionCard";
import { ValuePackageCard } from "../ValuePackageCard";
import { PRICING_META } from "../pricingMeta";
import { ICON_MAP } from "../SingleSessionCard";
import { Container } from "@/components/Primitives";
import { parsePrice } from "@/lib/utils/formatPrice";
import type { PricingBookingProduct } from "@/lib/graphql/queries/bookings";
import styles from "./PricingTabs.module.css";

const DURATION_UNIT_LABELS: Record<string, string> = {
  minute: "Min",
  hour: "Hour",
  day: "Day",
  month: "Month",
};

function formatDuration(duration: number, unit: string): string {
  const label = DURATION_UNIT_LABELS[unit] ?? unit;
  return `${duration} ${label} Session`;
}

const FALLBACK_SESSIONS = [
  {
    title: "Chiro Adjustment",
    description:
      "Quick and effective spinal alignment for pain relief and mobility.",
    price: 65,
    unit: "15 Min Session",
    icon: "medical_services" as const,
    image: "/images/chiro-adjustment.webp",
    featured: false,
  },
  {
    title: "Signature Massage",
    description:
      "Therapeutic deep tissue or Swedish massage tailored to your needs.",
    price: 125,
    unit: "60 Min Session",
    icon: "self_improvement" as const,
    image: "/images/signature-massage.webp",
    featured: true,
    badge: "Most Popular",
  },
  {
    title: "Chiro + Stretch Combo",
    description:
      "The ultimate reset. Adjustment followed by assisted stretching.",
    price: 110,
    unit: "45 Min Session",
    icon: "dynamic_form" as const,
    image: "/images/combo.webp",
    featured: false,
  },
  {
    title: "Injury Rehab",
    description:
      "Corrective exercise and physical rehab protocols for recovery.",
    price: 135,
    unit: "60 Min Session",
    icon: "rehab" as const,
    image: "/images/injury-rehab.webp",
    featured: false,
  },
  {
    title: "Stretch Therapy",
    description:
      "Assisted stretching to improve range of motion and flexibility.",
    price: 70,
    unit: "30 Min Session",
    icon: "accessibility_new" as const,
    featured: false,
  },
  {
    title: "Targeted Massage",
    description: "Focus on one problem area (neck/back/hips) for rapid relief.",
    price: 75,
    unit: "30 Min Session",
    icon: "wash" as const,
    featured: false,
  },
];

function buildSessionCards(products: PricingBookingProduct[]) {
  return products
    .map((product) => {
      const meta = PRICING_META[product.slug] ?? {};
      return {
        title: product.name,
        description: product.shortDescription?.replace(/<[^>]*>/g, "") ?? "",
        price: parsePrice(product.price),
        unit: formatDuration(product.bookingDuration, product.bookingDurationUnit),
        icon: (meta.icon ?? "medical_services") as keyof typeof ICON_MAP,
        image: undefined,
        featured: !!meta.badge || !!product.featured,
        badge: meta.badge,
        order: meta.order ?? 99,
      };
    })
    .sort((a, b) => a.order - b.order);
}

const VALUE_PACKAGES = [
  {
    title: "The Basic Pack",
    sessions: 5,
    price: 560,
    originalPrice: 625,
    savingsLabel: "Save 10% Overall",
    savingsVariant: "secondary" as const,
    benefits: [
      "Valid for any 60m session",
      "6 Month Expiry",
      "Shareable with Family",
    ],
  },
  {
    title: "The Recovery Pack",
    sessions: 10,
    price: 1000,
    originalPrice: 1250,
    savingsLabel: "Save 20% Overall",
    savingsVariant: "primary" as const,
    benefits: [
      "Valid for any therapy",
      "12 Month Expiry",
      "Free Wellness Tracker",
    ],
    featured: true,
    badge: "Best Value",
  },
  {
    title: "The Pro Member",
    sessions: 20,
    price: 1800,
    originalPrice: 2500,
    savingsLabel: "Deep Discount for Athletes",
    savingsVariant: "muted" as const,
    benefits: ["Priority Booking", "No Expiry", "Free Guest Pass (2x)"],
  },
];

type PricingTabsProps = {
  sessions?: PricingBookingProduct[];
};

export function PricingTabs({ sessions }: PricingTabsProps) {
  const [mode, setMode] = useState<"single" | "packs">("packs");

  const sessionCards =
    sessions && sessions.length > 0
      ? buildSessionCards(sessions)
      : FALLBACK_SESSIONS;

  return (
    <section className={styles.section}>
      <Container className={styles.inner}>
        <div
          className={styles.tabGroup}
          role="tablist"
          aria-label="Pricing view"
        >
          <button
            role="tab"
            aria-selected={mode === "single"}
            aria-controls="grid-single"
            id="tab-single"
            className={
              mode === "single"
                ? [styles.tab, styles.tabActive].join(" ")
                : styles.tab
            }
            onClick={() => setMode("single")}
          >
            Single Sessions
          </button>
          <button
            role="tab"
            aria-selected={mode === "packs"}
            aria-controls="grid-packs"
            id="tab-packs"
            className={
              mode === "packs"
                ? [styles.tab, styles.tabActive].join(" ")
                : styles.tab
            }
            onClick={() => setMode("packs")}
          >
            Value Packages <span className={styles.badge}>Save 20%</span>
          </button>
        </div>

        <div
          id="grid-single"
          role="tabpanel"
          aria-labelledby="tab-single"
          className={
            mode === "single"
              ? styles.gridSingle
              : [styles.gridSingle, styles.hidden].join(" ")
          }
        >
          {sessionCards.map((session) => (
            <SingleSessionCard
              key={session.title}
              title={session.title}
              description={session.description}
              price={session.price}
              unit={session.unit}
              icon={session.icon}
              image={session.image}
              featured={session.featured}
              badge={session.badge}
            />
          ))}
        </div>

        <div
          id="grid-packs"
          role="tabpanel"
          aria-labelledby="tab-packs"
          className={
            mode === "packs"
              ? styles.gridPacks
              : [styles.gridPacks, styles.hidden].join(" ")
          }
        >
          {VALUE_PACKAGES.map((pkg) => (
            <ValuePackageCard
              key={pkg.title}
              title={pkg.title}
              sessions={pkg.sessions}
              price={pkg.price}
              originalPrice={pkg.originalPrice}
              savingsLabel={pkg.savingsLabel}
              savingsVariant={pkg.savingsVariant}
              benefits={pkg.benefits}
              featured={pkg.featured}
              badge={pkg.badge}
            />
          ))}
        </div>
      </Container>
    </section>
  );
}
