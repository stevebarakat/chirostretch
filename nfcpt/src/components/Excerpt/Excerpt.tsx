import { RawHtml } from "@/components/RawHtml";
import Link from "next/link";
import { Masthead } from "../Masthead";
import "./excerpt.css";

function Excerpt({ post }: { post: ExcerptType }) {
  const blogUri = `/blog${post?.uri}`;

  return (
    <div className="post-preview">
      <Link href={blogUri}>
        <header>
          <Masthead
            className="mini-masthead"
            featuredImage={{
              node: { ...post.featuredImage?.node, uri: blogUri },
            }}
          />
        </header>
      </Link>
      <div className="ubu">
        <RawHtml>{post.excerpt}</RawHtml>
        <Link style={{ color: "var(--accentColor)" }} href={blogUri}>
          read&nbsp;more&nbsp;&raquo;
        </Link>
      </div>
    </div>
  );
}

export default Excerpt;
