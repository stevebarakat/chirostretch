import type { Metadata } from "next";
import { cache } from "react";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import {
  PAGE_BY_URI_QUERY,
  type PageByUriResponse,
} from "@/lib/graphql/queries";
import {
  PRICING_BOOKING_PRODUCTS_QUERY,
  type PricingBookingProductsResponse,
} from "@/lib/graphql/queries/bookings";
import { INITIAL_CONSULTATION_SLUG } from "@/components/Pricing/pricingMeta";
import { parsePrice } from "@/lib/utils/formatPrice";
import { Hero } from "@/components/Hero";
import {
  InitialConsultation,
  PricingTabs,
  BenefitsSection,
  PricingFAQ,
} from "@/components/Pricing";
import styles from "./page.module.css";

export const dynamic = "force-dynamic";

const getPricingPageData = cache(async () => {
  return await wpQuery<PageByUriResponse>(
    PAGE_BY_URI_QUERY,
    { uri: "/pricing/" },
    { tags: [CACHE_TAGS.pages] },
  );
});

const getPricingProducts = cache(async () => {
  try {
    return await wpQuery<PricingBookingProductsResponse>(
      PRICING_BOOKING_PRODUCTS_QUERY,
      {},
      { tags: [CACHE_TAGS.products] },
    );
  } catch {
    return null;
  }
});

export const metadata: Metadata = {
  title: "Pricing Plans | ChiroStretch",
  description:
    "Invest in your health with our flexible session rates and wellness packages. No hidden fees, just pure recovery.",
};

export default async function PricingPage() {
  const [data, productsData] = await Promise.all([
    getPricingPageData(),
    getPricingProducts(),
  ]);
  const page = data?.page;
  const allProducts = productsData?.bookingProducts ?? [];

  const consultation = allProducts.find(
    (p) => p.slug === INITIAL_CONSULTATION_SLUG,
  );
  const sessions = allProducts.filter(
    (p) => p.slug !== INITIAL_CONSULTATION_SLUG,
  );

  return (
    <main className={styles.main}>
      {page?.featuredImage && (
        <Hero
          featuredImage={page.featuredImage}
          heroUnit={page.heroUnit}
          height={300}
          backdrop={false}
          align="center"
          descriptionColor="var(--color-text-primary)"
        />
      )}
      <InitialConsultation
        price={consultation ? parsePrice(consultation.price) : undefined}
        regularPrice={consultation ? parsePrice(consultation.regularPrice) : undefined}
        description={consultation?.shortDescription ?? undefined}
      />
      <PricingTabs sessions={sessions} />
      <BenefitsSection />
      <PricingFAQ />
    </main>
  );
}
