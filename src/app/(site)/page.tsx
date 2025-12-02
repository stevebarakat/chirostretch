import { wpQuery } from "@app/_lib/wp/graphql";
import {
  HOMEPAGE_QUERY,
  type HomepageQueryResponse,
} from "@/lib/graphql/queries";
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";

export const revalidate = 300;

// Below-the-fold sections (dynamically imported for code splitting)
const FeaturedProducts = dynamic(() => import("./homepage/FeaturedProducts"), {
  ssr: true,
});

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
  const data = await wpQuery<HomepageQueryResponse>(HOMEPAGE_QUERY, {}, 300);

  if (!data?.page) {
    return <div>Homepage not found in WordPress.</div>;
  }

  const { page } = data;

  return (
    <>
      {page.featuredImage?.node && (
        <Hero
          home={{
            title: page.title,
            seo: {
              metaDesc: "",
            },
            featuredImage: {
              node: {
                sourceUrl: page.featuredImage.node.sourceUrl || "",
                altText: page.featuredImage.node.altText || "",
                slug: page.featuredImage.node.slug || "",
                title: page.featuredImage.node.title || "",
                caption: page.featuredImage.node.caption || "",
              },
            },
          }}
        />
      )}
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
        posts={data.latestPosts?.nodes}
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
