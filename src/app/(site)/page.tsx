import { wpQuery } from "@app/_lib/wp/graphql";
import {
  HOMEPAGE_QUERY,
  type HomepageQueryResponse,
} from "@app/_lib/wp/queries/homepage";
import dynamic from "next/dynamic";

// Critical above-the-fold sections (server-rendered)
import HeroSlider from "./homepage/HeroSlider";
import AboutSection from "./homepage/AboutSection";

// Below-the-fold sections (dynamically imported for code splitting)
const WhyUsSection = dynamic(() => import("./homepage/WhyUsSection"), {
  ssr: true,
});

const FeaturedProducts = dynamic(
  () => import("./homepage/FeaturedProducts"),
  {
    ssr: true,
  }
);

const UpcomingEvents = dynamic(() => import("./homepage/UpcomingEvents"), {
  ssr: true,
});

const LatestInsights = dynamic(() => import("./homepage/LatestInsights"), {
  ssr: true,
});

const CtaSection = dynamic(() => import("./homepage/CtaSection"), {
  ssr: true,
});

export default async function HomePage() {
  const data = await wpQuery<HomepageQueryResponse>(HOMEPAGE_QUERY);

  if (!data?.page) {
    return <div>Homepage not found in WordPress.</div>;
  }

  const { page } = data;

  return (
    <>
      <HeroSlider slides={page.homepageHero?.heroSlides} />

      <AboutSection
        aboutHeading={page.homepageAbout?.aboutHeading}
        aboutSubheading={page.homepageAbout?.aboutSubheading}
        aboutImage={page.homepageAbout?.aboutImage?.node}
        aboutCtaText={page.homepageAbout?.aboutCtaText}
        aboutCtaLink={page.homepageAbout?.aboutCtaLink}
      />

      <WhyUsSection
        whyusHeading={page.homepageWhyUs?.whyusHeading}
        whyusDescription={page.homepageWhyUs?.whyusDescription}
        whyusImage={page.homepageWhyUs?.whyusImage?.node}
        whyusBenefits={page.homepageWhyUs?.whyusBenefits?.map((benefit) => ({
          ...benefit,
          benefitIcon: benefit.benefitIcon?.node,
        }))}
      />

      <FeaturedProducts
        featuredProductsHeading={
          page.homepageFeaturedProducts?.featuredProductsHeading
        }
        featuredProductsSubheading={
          page.homepageFeaturedProducts?.featuredProductsSubheading
        }
        featuredProductsSource={
          page.homepageFeaturedProducts?.featuredProductsSource
        }
        featuredProductsManual={
          page.homepageFeaturedProducts?.featuredProductsManual
        }
        featuredProductsFromQuery={data.featuredProducts}
      />

      <UpcomingEvents
        eventsHeading={page.homepageUpcomingEvents?.eventsHeading}
        eventsSubheading={page.homepageUpcomingEvents?.eventsSubheading}
        eventsCtaText={page.homepageUpcomingEvents?.eventsCtaText}
        eventsCtaLink={page.homepageUpcomingEvents?.eventsCtaLink}
        events={data.upcomingEvents}
        eventsLimit={page.homepageUpcomingEvents?.eventsLimit}
      />

      <LatestInsights
        insightsHeading={page.homepageLatestInsights?.insightsHeading}
        insightsSubheading={page.homepageLatestInsights?.insightsSubheading}
        insightsCtaText={page.homepageLatestInsights?.insightsCtaText}
        insightsCtaLink={page.homepageLatestInsights?.insightsCtaLink}
      />

      <CtaSection
        ctaBackgroundImage={page.homepageCta?.ctaBackgroundImage?.node}
        ctaHeading={page.homepageCta?.ctaHeading}
        ctaDescription={page.homepageCta?.ctaDescription}
        ctaButtonText={page.homepageCta?.ctaButtonText}
        ctaButtonLink={page.homepageCta?.ctaButtonLink}
      />
    </>
  );
}
