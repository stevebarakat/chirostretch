import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { wpQuery, CACHE_TAGS } from "@/lib/cms/graphql";
import {
  PAGE_BY_URI_QUERY,
  type PageByUriResponse,
} from "@/lib/graphql/queries";
import { Container } from "@/components/Primitives";
import { BlockRenderer, type Block } from "@/components/CMS";
import { Hero } from "@/components/Hero";
import { getSiteConfig } from "@/config";
import styles from "./page.module.css";

export const revalidate = 300;

const siteConfig = getSiteConfig();

const EXCLUDED_SLUGS = [
  "homepage",
  "products",
  "events",
  "cart",
  "checkout",
  "shop",
  "locations",
];

// Skip static generation - pages are built on-demand with ISR
export async function generateStaticParams() {
  return [];
}

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    return {
      title: "Page Not Found",
    };
  }

  const pageSlug = slug[slug.length - 1];

  if (EXCLUDED_SLUGS.includes(pageSlug)) {
    return {
      title: "Page Not Found",
    };
  }

  try {
    const uri = `/${slug.join("/")}/`;
    const data = await wpQuery<PageByUriResponse>(
      PAGE_BY_URI_QUERY,
      { uri },
      { tags: [CACHE_TAGS.pages] }
    );

    if (!data?.page) {
      return {
        title: "Page Not Found",
      };
    }

    const page = data.page;
    const description = page.content
      ? page.content.replace(/<[^>]*>/g, "").substring(0, 160)
      : undefined;

    return {
      title: `${page.title} | ${siteConfig.name || "ChiroStretch"}`,
      description: description || siteConfig.description || "",
      alternates: {
        canonical: uri,
      },
      openGraph: {
        title: page.title,
        description: description || siteConfig.description,
        images: page.featuredImage?.node?.sourceUrl
          ? [page.featuredImage.node.sourceUrl]
          : undefined,
      },
    };
  } catch (error) {
    console.error("Failed to generate metadata:", error);
    return {
      title: "Page",
    };
  }
}

export default async function WordPressPage({ params }: PageProps) {
  const { slug } = await params;

  if (!slug || slug.length === 0) {
    notFound();
  }

  const pageSlug = slug[slug.length - 1];

  if (EXCLUDED_SLUGS.includes(pageSlug)) {
    notFound();
  }

  const uri = `/${slug.join("/")}/`;
  const data = await wpQuery<PageByUriResponse>(
    PAGE_BY_URI_QUERY,
    { uri },
    { tags: [CACHE_TAGS.pages] }
  );

  if (!data?.page) {
    notFound();
  }

  const page = data.page;

  const blocks = page.blocks && Array.isArray(page.blocks) ? page.blocks : null;

  const heroImage = page.featuredImage ? page.featuredImage : undefined;

  return (
    <>
      {heroImage && (
        <Hero
          featuredImage={heroImage}
          heroUnit={page.heroUnit}
          maxHeight={550}
        />
      )}
      <Container>
        <article className={styles.page}>
          {!heroImage && (
            <header className={styles.header}>
              <h1>{page.title}</h1>
            </header>
          )}

          {blocks && blocks.length > 0 ? (
            <div className={styles.content}>
              <BlockRenderer
                blocks={blocks as Block[]}
                renderedContent={page.content}
              />
            </div>
          ) : page.content ? (
            <div
              className={styles.content}
              dangerouslySetInnerHTML={{ __html: page.content }}
            />
          ) : null}
        </article>
      </Container>
    </>
  );
}
