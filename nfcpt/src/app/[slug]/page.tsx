import { Suspense } from "react";
import { GetStaticPropsContext } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { JsonLd } from "@/components/JsonLd";
import fetchQuery from "@/lib/fetch";
import Loading from "@/app/loading";
import { Page } from "@/components/Page";

type Props = {
  params: GetStaticPropsContext["params"];
};

async function fetchPageData(slug: string) {
  return await fetchQuery({
    queryType: "getPageBySlug",
    variables: { slug },
  });
}

function handleRedirects(
  redirects: { origin: string; target: string }[],
  pageUri: string
) {
  redirects?.forEach((item) => {
    if (item.origin === pageUri) {
      revalidatePath("/");
      redirect(item.target);
    }
  });
}

export async function generateMetadata({ params }: Props) {
  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug || "";
  const {
    page,
    customSEO,
    redirection: { redirects },
  } = await fetchPageData(slug);

  if (!page) return null;

  handleRedirects(redirects, page.uri);

  const { canonical } = customSEO.customSeoSettings;

  return {
    title: page.seo.title,
    description: page.seo.metaDesc,
    alternates: {
      canonical: `${canonical}/${slug}`,
    },
  };
}

export default async function PageRoute({ params }: Props) {
  const slug = params?.slug?.toString();
  if (!slug) return null;

  const { page } = await fetchQuery({
    queryType: "getPageBySlug",
    variables: { slug },
  });
  if (!page) return null;

  const {
    currentPromo: { promo },
  } = await fetchQuery({ queryType: "getCurrentPromo" });

  const {
    posts: { nodes },
  } = await fetchQuery({
    queryType: "getAllPosts",
  });

  const posts: ExcerptType[] = nodes.map((post: ExcerptType) => ({
    featuredImage: post.featuredImage,
    excerpt: post.excerpt,
    title: post.title,
    uri: post.uri,
  }));

  return (
    <Suspense fallback={<Loading />}>
      <Page page={page} posts={posts} promo={promo} slug={slug} />
      <JsonLd>{page.seo.schema.raw}</JsonLd>
    </Suspense>
  );
}
