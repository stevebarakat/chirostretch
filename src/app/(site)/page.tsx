import type { Metadata } from "next";
import { Suspense, cache } from "react";
import { wpQuery } from "@app/_lib/wp/graphql";
import {
  HOMEPAGE_QUERY,
  type HomepageQueryResponse,
} from "@/lib/graphql/queries";
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { CallToAction } from "./homepage/CallToAction";

export const revalidate = 300;

// Cache the homepage query to deduplicate requests between generateMetadata() and the page component
const getHomepageData = cache(async () => {
  return await wpQuery<HomepageQueryResponse>(HOMEPAGE_QUERY, {}, 300);
});

// Below-the-fold sections (dynamically imported for code splitting)
const Introduction = dynamic(() => import("./homepage/Introduction"), {
  ssr: true,
});

const FeaturedProducts = dynamic(() => import("./homepage/FeaturedProducts"), {
  ssr: true,
});

const UpcomingEvents = dynamic(() => import("./homepage/UpcomingEvents"), {
  ssr: true,
});

const LatestInsights = dynamic(() => import("./homepage/LatestInsights"), {
  ssr: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomepageData();

  if (!data?.customSEO?.customSeoSettings) {
    return {
      title: "Home",
    };
  }

  const { canonical, googleVerify, bingVerify } =
    data.customSEO.customSeoSettings;

  return {
    title: data.page?.title || "Home",
    description: "",
    alternates: canonical ? { canonical } : undefined,
    verification: {
      google: googleVerify,
      other: bingVerify
        ? {
            "msvalidate.01": bingVerify,
          }
        : undefined,
    },
  };
}

export default async function HomePage() {
  const data = await getHomepageData();

  if (!data?.page) {
    return <div>Homepage not found in WordPress.</div>;
  }

  const { page } = data;
  const { rightSide, leftSide } = page.homepageIntroduction || {};
  const stats = page.homepageStats?.homepageStats || [];
  const promo = data.currentPromo?.promo;

  const intro =
    leftSide?.headline &&
    leftSide?.text &&
    rightSide?.headline &&
    rightSide?.bulletPoints
      ? {
          leftSide: {
            headline: leftSide.headline,
            text: leftSide.text,
          },
          rightSide: {
            headline: rightSide.headline,
            bulletPoints: rightSide.bulletPoints,
          },
          stats: stats.map((s) => ({
            stat: {
              prefix: s.stat?.prefix || "",
              number: s.stat?.number || 0,
              suffix: s.stat?.suffix || "",
              description: s.stat?.description || "",
            },
          })),
        }
      : null;

  console.log("page.heroUnit", page.heroUnit);

  return (
    <Suspense fallback={<div>Loading...</div>}>
      {page.heroUnit && (
        <Hero heroUnit={page.heroUnit} fallbackTitle={page.title} isHomepage />
      )}
      {page.homepageCta?.headings?.headline && (
        <CallToAction
          cta={{
            headings: {
              headline: page.homepageCta.headings.headline ?? "",
              subheading: page.homepageCta.headings.subheading ?? "",
            },
            button1: {
              button1Text: page.homepageCta.button1?.button1Text ?? "",
              btn1Link: {
                nodes: [{ uri: "" }],
              },
            },
          }}
          promo={
            promo
              ? {
                  price: promo.price ?? 0,
                  topLine: promo.topLine ?? "",
                  middleLine: promo.middleLine ?? "",
                  bottomLine: promo.bottomLine ?? "",
                }
              : {
                  price: 0,
                  topLine: "",
                  middleLine: "",
                  bottomLine: "",
                }
          }
        />
      )}
      {intro && <Introduction intro={intro} />}

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
    </Suspense>
  );
}
