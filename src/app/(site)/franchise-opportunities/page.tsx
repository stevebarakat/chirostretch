import { wpQuery } from "@app/_lib/wp/graphql";
import {
  FRANCHISE_OPPORTUNITIES_QUERY,
  type FranchiseOpportunitiesQueryResponse,
} from "@/lib/graphql/queries";
import dynamic from "next/dynamic";

export const revalidate = 300;

// Critical above-the-fold sections (server-rendered)
import { Hero } from "@/components/Hero";
import AboutSection from "../homepage/AboutSection";

// Below-the-fold sections (dynamically imported for code splitting)
const WhyUsSection = dynamic(() => import("../homepage/WhyUsSection"), {
  ssr: true,
});

export default async function FranchiseOpportunitiesPage() {
  const data = await wpQuery<FranchiseOpportunitiesQueryResponse>(
    FRANCHISE_OPPORTUNITIES_QUERY,
    {},
    300
  );

  if (!data?.page) {
    return <div>Franchise opportunities page not found in WordPress.</div>;
  }

  const { page } = data;

  return (
    <>
      {page.heroUnit && (
        <Hero heroUnit={page.heroUnit} fallbackTitle={page.title} />
      )}

      <AboutSection
        aboutHeading={page.franchiseOpportunitiesAbout?.aboutHeading}
        aboutSubheading={page.franchiseOpportunitiesAbout?.aboutSubheading}
        aboutImage={page.franchiseOpportunitiesAbout?.aboutImage?.node}
        aboutCtaText={page.franchiseOpportunitiesAbout?.aboutCtaText}
        aboutCtaLink={page.franchiseOpportunitiesAbout?.aboutCtaLink}
        aboutCta2Text={page.franchiseOpportunitiesAbout?.aboutCta2Text}
        aboutCta2Link={page.franchiseOpportunitiesAbout?.aboutCta2Link}
      />

      <WhyUsSection
        whyusHeading={page.franchiseOpportunitiesWhyUs?.whyusHeading}
        whyusDescription={page.franchiseOpportunitiesWhyUs?.whyusDescription}
        whyusImage={page.franchiseOpportunitiesWhyUs?.whyusImage?.node}
        whyusBenefits={page.franchiseOpportunitiesWhyUs?.whyusBenefits?.map(
          (benefit) => ({
            ...benefit,
            benefitIcon: benefit.benefitIcon?.node,
          })
        )}
      />
    </>
  );
}
