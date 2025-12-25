import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { wpQuery } from "@app/_lib/wp/graphql";
import {
  PAGE_BY_URI_QUERY,
  ALL_PAGE_SLUGS_QUERY,
  type PageByUriResponse,
  type AllPageSlugsResponse,
} from "@/lib/graphql/queries";
import { Container } from "@/components/UI/Container";
import { BlockRenderer, type Block } from "@/components/Blocks";
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

export async function generateStaticParams() {
  try {
    const data = await wpQuery<AllPageSlugsResponse>(
      ALL_PAGE_SLUGS_QUERY,
      {},
      300
    );

    const pages = data?.pages?.nodes || [];

    return pages
      .filter((page) => {
        if (!page.slug) return false;
        if (EXCLUDED_SLUGS.includes(page.slug)) return false;
        if (page.uri === "/" || page.uri === "/homepage/") return false;
        return true;
      })
      .map((page) => {
        if (!page.uri) return null;
        const uri = page.uri;
        const slugPath = uri
          .replace(/^\//, "")
          .replace(/\/$/, "")
          .split("/")
          .filter(Boolean);

        return {
          slug: slugPath,
        };
      })
      .filter((param): param is { slug: string[] } => param !== null);
  } catch (error) {
    console.error("Failed to generate static params for pages:", error);
    return [];
  }
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
      300
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
    300
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
              <BlockRenderer blocks={blocks as Block[]} />
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
