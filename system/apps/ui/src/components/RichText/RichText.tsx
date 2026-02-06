import { parseHtml } from "@/components/Blocks/parseHtml";

type RichTextProps = {
  content: string;
  as?: "div" | "span" | "p";
  className?: string;
};

export default function RichText({
  content,
  as: Element = "div",
  className,
}: RichTextProps) {
  return <Element className={className}>{parseHtml(content)}</Element>;
}
