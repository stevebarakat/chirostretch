import { wpQuery } from "@app/lib/wp/graphql";
import {
  HOMEPAGE_QUERY,
  type HomepageQueryResponse,
} from "@app/lib/wp/queries/homepage";

// Page-specific sections
import HeroSlider from "./homepage/HeroSlider";
import AboutSection from "./homepage/AboutSection";
import WhyUsSection from "./homepage/WhyUsSection";
import FeaturedProducts from "./homepage/FeaturedProducts";
import UpcomingEvents from "./homepage/UpcomingEvents";
import LatestInsights from "./homepage/LatestInsights";
import CtaSection from "./homepage/CtaSection";

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
