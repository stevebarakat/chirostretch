import { Suspense } from "react";
import { GetStaticPropsContext } from "next";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { Sidebar } from "@/components/Sidebar";
import { Masthead } from "@/components/Masthead";
import { RawHtml } from "@/components/RawHtml";
import fetchQuery from "@/lib/fetch";
import Loading from "@/app/loading";
import { Heading } from "@/components/Heading";

type Props = {
  params: GetStaticPropsContext["params"];
};

export async function generateMetadata({ params }: Props) {
  const slug = params?.slug || "";
  const {
    post,
    customSEO,
    redirection: { redirects },
  } = await fetchQuery({
    queryType: "getPostBySlug",
    variables: { slug },
  });
  const { canonical } = customSEO.customSeoSettings;

  redirects?.forEach((item: { origin: string; target: string }) => {
    if (item.origin === post.uri) {
      revalidatePath("/");
      redirect(item.target);
    }
  });

  return {
    title: post?.seo?.title,
    description: post?.seo?.metaDesc,
    alternates: {
      canonical: `${canonical}/blog${post.uri}`,
    },
  };
}

export default async function PostRoute({ params }: Props) {
  const slug = params?.slug?.toString() || "";
  const {
    currentPromo: { promo },
  } = await fetchQuery({ queryType: "getCurrentPromo" });
  const { post } = await fetchQuery({
    queryType: "getPostBySlug",
    variables: { slug },
  });

  return (
    <Suspense fallback={<Loading />}>
      <div className="page">
        <Masthead featuredImage={post.featuredImage} className="masthead" />
        <main className="container pageWrap">
          <article>
            <Heading level={1}>{post?.title}</Heading>
            <RawHtml>{post?.content}</RawHtml>
          </article>
          <Sidebar promo={promo} />
        </main>
      </div>
    </Suspense>
  );
}
