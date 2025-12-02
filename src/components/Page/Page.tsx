import { Sidebar } from "@/components/Sidebar";
import { Masthead } from "@/components/Masthead";
import { Heading } from "@/components/Heading";
import { Container } from "@/components/Container";
import { Blog } from "@/components/Blog";
import { RawHtml } from "@/components/RawHtml";
import { Contact } from "@/components/Contact";

type Props = {
  page: any;
  posts: ExcerptType[];
  promo: Promo;
  slug: string;
};

function Page({ page, posts, promo, slug }: Props) {
  const isWidePage = slug === "contact" || slug === "blog";
  const isBlogPage = slug === "blog";

  const renderContent = () => {
    switch (slug) {
      case "contact":
        return <Contact content={page.content} />;
      case "blog":
        return <Blog posts={posts} />;
      default:
        return <RawHtml>{page.content}</RawHtml>;
    }
  };

  return (
    <div id={slug} className={isBlogPage ? "" : "page"}>
      <Masthead featuredImage={page.featuredImage} className="masthead" />
      <Container className={!isWidePage ? "pageWrap" : ""}>
        <article>
          <Heading level={1}>{!isBlogPage && page.title}</Heading>
          {renderContent()}
        </article>
        {!isWidePage && <Sidebar slug={slug} promo={promo} />}
      </Container>
    </div>
  );
}

export default Page;
