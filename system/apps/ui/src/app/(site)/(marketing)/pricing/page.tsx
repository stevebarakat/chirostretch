import type { Metadata } from "next";
import { cache } from "react";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import {
  PAGE_BY_URI_QUERY,
  type PageByUriResponse,
} from "@/lib/graphql/queries";
import { Hero } from "@/components/Hero";
import {
  InitialConsultation,
  PricingTabs,
  BenefitsSection,
  PricingFAQ,
} from "@/components/Pricing";
import styles from "./page.module.css";

export const revalidate = 300;

const getPricingPageData = cache(async () => {
  return await wpQuery<PageByUriResponse>(
    PAGE_BY_URI_QUERY,
    { uri: "/pricing/" },
    { tags: [CACHE_TAGS.pages] },
  );
});

export const metadata: Metadata = {
  title: "Pricing Plans | ChiroStretch",
  description:
    "Invest in your health with our flexible session rates and wellness packages. No hidden fees, just pure recovery.",
};

export default async function PricingPage() {
  const data = await getPricingPageData();
  const page = data?.page;

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
      <InitialConsultation />
      <PricingTabs />
      <BenefitsSection />
      <PricingFAQ />
    </main>
  );
}
