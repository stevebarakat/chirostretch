import type { Metadata } from "next";
import { Suspense } from "react";
import { Hero } from "@/components/Hero";
import { Introduction } from "@/components/Introduction";
import { Gallery } from "@/components/Gallery";
import { Blocks } from "@/components/Blocks";
import { CallToAction } from "@/components/CallToAction";
import fetchQuery from "@/lib/fetch";
import Loading from "./loading";
import { RawHtml } from "@/components/RawHtml";
import { Container } from "@/components/Container";
import { JsonLd } from "@/components/JsonLd";

export async function generateMetadata(): Promise<Metadata> {
  const pageData = await fetchQuery({
    queryType: "getHomepage",
    variables: { slug: "/" },
  });
  const { canonical, googleVerify, bingVerify } =
    pageData.customSEO.customSeoSettings;

  return {
    title: pageData.page.seo.title,
    description: pageData.page.seo.metaDesc,
    alternates: { canonical },
    verification: {
      google: googleVerify,
      other: {
        "msvalidate.01": bingVerify,
      },
    },
  };
}

export default async function HomeRoute() {
  const { page } = await fetchQuery({
    queryType: "getHomepage",
    variables: { slug: "/" },
  });
  const { currentPromo } = await fetchQuery({ queryType: "getCurrentPromo" });
  const homepage = await fetchQuery({ queryType: "getHomepageSettings" });
  const { schema } = homepage.customSEO.customSeoSettings;
  const { rightSide, leftSide } = homepage.intro.introduction;
  const { stats } = homepage.intro.stats;
  const { services } = homepage.galleryPage;
  const { blocks } = homepage.blox;
  const { headings, button1, button2 } = homepage.cta.callToAction;
  const cta = { headings, button1, button2 };
  const intro = { leftSide, rightSide, stats };

  return (
    <Suspense fallback={<Loading />}>
      <JsonLd>{schema}</JsonLd>
      <Hero home={page} />
      <CallToAction cta={cta} promo={currentPromo.promo} />
      <Introduction intro={intro} />
      <Gallery images={services.image} title={services.galleryTitle} />
      <Container>
        <RawHtml className="homepage-content">{page.content}</RawHtml>
      </Container>
      <Blocks blocks={blocks} />
    </Suspense>
  );
}
