import type { Metadata } from "next";
import { Suspense, cache } from "react";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import {
  HOMEPAGE_QUERY,
  type HomepageQueryResponse,
} from "@/lib/graphql/queries";
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { CallToAction } from "@/components/Homepage";
import {
  IntroductionSkeleton,
  FeaturedProductsSkeleton,
  UpcomingEventsSkeleton,
  LatestInsightsSkeleton,
} from "@/components/Homepage/Skeletons";

export const revalidate = 300;

// Cache the homepage query to deduplicate requests between generateMetadata() and the page component
const getHomepageData = cache(async () => {
  return await wpQuery<HomepageQueryResponse>(HOMEPAGE_QUERY, {}, {
    tags: [CACHE_TAGS.pages, CACHE_TAGS.products, CACHE_TAGS.events],
  });
});

// Below-the-fold sections (dynamically imported for code splitting)
const Introduction = dynamic(() => import("@/components/Homepage").then(mod => ({ default: mod.Introduction })), {
  ssr: true,
});

const FeaturedProducts = dynamic(() => import("@/components/Homepage").then(mod => ({ default: mod.FeaturedProducts })), {
  ssr: true,
});

const UpcomingEvents = dynamic(() => import("@/components/Homepage").then(mod => ({ default: mod.UpcomingEvents })), {
  ssr: true,
});

const LatestInsights = dynamic(() => import("@/components/Homepage").then(mod => ({ default: mod.LatestInsights })), {
  ssr: true,
});

export async function generateMetadata(): Promise<Metadata> {
  const data = await getHomepageData();

  if (!data?.customSEO?.customSeoSettings) {
    return {
      title: "ChiroStretch",
    };
  }

  const { canonical, googleVerify, bingVerify } =
    data.customSEO.customSeoSettings;

  return {
    title: data.page?.title,
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
  const stats = (page.stats?.stats || []).filter(Boolean);
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
          stats: stats
            .filter((s) => s?.stat)
            .map((s) => ({
              stat: {
                prefix: s.stat?.prefix || "",
                number: s.stat?.number || 0,
                suffix: s.stat?.suffix || "",
                description: s.stat?.description || "",
              },
            })),
        }
      : null;

  return (
    <>
      {page.featuredImage && (
        <Hero
          featuredImage={page.featuredImage}
          heroUnit={page.heroUnit}
        />
      )}
      {page.homepageCta?.headings?.headline && (
        <CallToAction
          cta={{
            headings: {
              headline: page.homepageCta.headings.headline ?? "",
              subheading: page.homepageCta.headings.subheading ?? "",
            },
            button1: {
              btn1Link: page.homepageCta.button1?.btn1Link?.nodes?.[0]
                ? {
                    url: page.homepageCta.button1.btn1Link.nodes[0].uri,
                    title: page.homepageCta.button1.btn1Link.nodes[0].title,
                  }
                : undefined,
              btn1Icon: page.homepageCta.button1?.btn1Icon,
            },
            button2: page.homepageCta.button2,
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
      {intro && (
        <Suspense fallback={<IntroductionSkeleton />}>
          <Introduction intro={intro} />
        </Suspense>
      )}

      <Suspense fallback={<FeaturedProductsSkeleton />}>
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
      </Suspense>

      <Suspense fallback={<UpcomingEventsSkeleton />}>
        <UpcomingEvents
          eventsHeading={page.homepageUpcomingEvents?.eventsHeading}
          eventsSubheading={page.homepageUpcomingEvents?.eventsSubheading}
          eventsCtaText={page.homepageUpcomingEvents?.eventsCtaText}
          eventsCtaLink={page.homepageUpcomingEvents?.eventsCtaLink}
          events={data.upcomingEvents}
          eventsLimit={page.homepageUpcomingEvents?.eventsLimit}
        />
      </Suspense>

      <Suspense fallback={<LatestInsightsSkeleton />}>
        <LatestInsights
          insightsHeading={page.homepageLatestInsights?.insightsHeading}
          insightsSubheading={page.homepageLatestInsights?.insightsSubheading}
          insightsCtaText={page.homepageLatestInsights?.insightsCtaText}
          insightsCtaLink={page.homepageLatestInsights?.insightsCtaLink}
          posts={data.latestPosts?.nodes}
        />
      </Suspense>
    </>
  );
}
