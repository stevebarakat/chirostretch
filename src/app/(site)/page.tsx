import type { Metadata } from "next";
import { Suspense } from "react";
import { wpQuery } from "@app/_lib/wp/graphql";
import {
  HOMEPAGE_QUERY,
  type HomepageQueryResponse,
} from "@/lib/graphql/queries";
import dynamic from "next/dynamic";
import { Hero } from "@/components/Hero";
import { Introduction } from "@/components/Introduction";
import { Gallery } from "@/components/Gallery";
import { Blocks } from "@/components/blocks";
import { CallToAction } from "@/components/CallToAction";
import { RawHtml } from "@/components/RawHtml";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";
import Promotion from "@/components/Promotion/Promotion";

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

export async function generateMetadata(): Promise<Metadata> {
  const data = await wpQuery<HomepageQueryResponse>(HOMEPAGE_QUERY, {}, 300);

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
  const data = await wpQuery<HomepageQueryResponse>(HOMEPAGE_QUERY, {}, 300);

  if (!data?.page) {
    return <div>Homepage not found in WordPress.</div>;
  }

  const { page } = data;
  const { rightSide, leftSide } = data.intro?.introduction || {};
  const stats = data.intro?.stats?.stats || [];
  const services = data.galleryPage?.services;
  const blocks = data.blox?.blocks;
  const { headings, button1, button2 } = data.cta?.callToAction || {};
  const promo = data.currentPromo?.promo;

  const cta = {
    headings: {
      headline: headings?.headline,
      subheading: headings?.subheading,
    },
    button1: {
      button1Text: button1?.button1Text,
      btn1Link: {
        nodes: [{ uri: button1?.btn1Link?.nodes?.[0]?.uri ?? "" }] as [
          { uri: string }
        ],
      },
    },
    button2: {
      button2Text: button2?.button2Text!,
      btn2Link: {
        nodes: [{ uri: button2?.btn2Link?.nodes?.[0]?.uri }] as [
          { uri: string }
        ],
      },
    },
  };

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

  const galleryImages =
    services?.image?.filter(
      (img) =>
        img?.image?.node?.sourceUrl &&
        img?.image?.node?.altText &&
        img?.image?.node?.caption &&
        img?.image?.node?.slug
    ) || [];

  console.log("promo", promo);
  console.log("cta", cta);

  return (
    <Suspense fallback={<div>Loading...</div>}>
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

      {/* {promo && (
        <Promotion
          promo={{
            price: promo.price ?? 0,
            topLine: promo.topLine ?? "",
            middleLine: promo.middleLine ?? "",
            bottomLine: promo.bottomLine ?? "",
          }}
        />
      )} */}
      {cta &&
        cta.headings &&
        typeof cta.button1?.button1Text === "string" &&
        typeof cta.button2?.button2Text === "string" && (
          <CallToAction
            cta={{
              ...cta,
              headings: {
                headline: cta.headings.headline ?? "",
                subheading: cta.headings.subheading ?? "",
              },
              button1: {
                ...cta.button1,
                button1Text: cta.button1.button1Text,
                btn1Link: cta.button1.btn1Link,
              },
              button2: {
                ...cta.button2,
                button2Text: cta.button2.button2Text,
                btn2Link: cta.button2.btn2Link,
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
      {galleryImages.length > 0 && services?.galleryTitle && (
        <Gallery
          images={galleryImages
            .map((img) => {
              const node = img.image?.node;
              if (
                node?.sourceUrl &&
                node?.altText &&
                node?.caption &&
                node?.slug
              ) {
                return {
                  image: {
                    node: {
                      sourceUrl: node.sourceUrl,
                      altText: node.altText,
                      caption: node.caption,
                      slug: node.slug,
                    },
                  },
                };
              }
              return null;
            })
            .filter(
              (
                img
              ): img is {
                image: {
                  node: {
                    sourceUrl: string;
                    altText: string;
                    caption: string;
                    slug: string;
                  };
                };
              } => img !== null
            )}
          title={services.galleryTitle}
        />
      )}
      {page.content && (
        <Container>
          <RawHtml className="homepage-content">{page.content}</RawHtml>
        </Container>
      )}
      {blocks && <Blocks blocks={blocks} />}
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
    </Suspense>
  );
}
