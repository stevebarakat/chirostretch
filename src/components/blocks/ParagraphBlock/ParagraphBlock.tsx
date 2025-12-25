import { parseHtml } from "../parseHtml";

type ParagraphBlockProps = {
  content: string;
  className?: string;
};

export default function ParagraphBlock({
  content,
  className,
}: ParagraphBlockProps) {
  if (!content) return null;

  // Content from WordPress already includes <p> tags, so we use a fragment
  // If className is provided, wrap in a div for styling
  if (className) {
    return <div className={className}>{parseHtml(content)}</div>;
  }

  return <>{parseHtml(content)}</>;
}
