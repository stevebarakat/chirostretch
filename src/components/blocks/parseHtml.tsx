import parse, {
  domToReact,
  type HTMLReactParserOptions,
  Element,
  type DOMNode,
} from "html-react-parser";
import Link from "next/link";

const isInternalUrl = (href: string): boolean => {
  if (href.startsWith("/")) return true;
  if (href.startsWith("#")) return true;
  try {
    const url = new URL(href);
    return (
      url.hostname.includes("chirostretch") ||
      url.hostname === "localhost" ||
      url.hostname.endsWith(".local")
    );
  } catch {
    return false;
  }
};

const options: HTMLReactParserOptions = {
  replace: (domNode: DOMNode) => {
    if (!(domNode instanceof Element)) return;

    if (domNode.name === "a") {
      const href = domNode.attribs.href || "";
      const className = domNode.attribs.class;
      const target = domNode.attribs.target;
      const rel = domNode.attribs.rel;

      if (isInternalUrl(href)) {
        return (
          <Link href={href} className={className}>
            {domToReact(domNode.children as DOMNode[], options)}
          </Link>
        );
      }

      return (
        <a
          href={href}
          className={className}
          target={target || "_blank"}
          rel={rel || "noopener noreferrer"}
        >
          {domToReact(domNode.children as DOMNode[], options)}
        </a>
      );
    }
  },
};

export function parseHtml(html: string) {
  return parse(html, options);
}
