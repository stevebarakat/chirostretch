import type { Block } from "../BlockRenderer";
import { parseHtml } from "../parseHtml";
import styles from "./IconListBlock.module.css";

type IconListBlockProps = {
  block: Block;
  renderedHtml?: string;
};

function extractText(block: Block): string {
  if (block.attributes?.text) return block.attributes.text as string;
  if (block.attributes?.content) return block.attributes.content as string;
  if (block.innerHTML) return block.innerHTML.replace(/<[^>]*>/g, "").trim();

  if (block.innerBlocks?.length) {
    return block.innerBlocks.map(extractText).join(" ");
  }

  return "";
}

function extractItemsFromHtml(html: string): string[] {
  const items: string[] = [];
  const regex =
    /<span[^>]*class="[^"]*stk-block-icon-list-item__text[^"]*"[^>]*>([^<]*)<\/span>/g;
  let match;
  while ((match = regex.exec(html)) !== null) {
    const text = match[1].trim();
    if (text) items.push(text);
  }
  return items;
}

export default function IconListBlock({
  block,
  renderedHtml,
}: IconListBlockProps) {
  const innerBlocks = block.innerBlocks || [];
  const uniqueId = block.attributes?.uniqueId as string | undefined;

  if (renderedHtml) {
    const blockHtml = uniqueId
      ? extractBlockHtml(renderedHtml, uniqueId)
      : renderedHtml;

    if (blockHtml) {
      return (
        <div className={styles.iconList}>{parseHtml(blockHtml)}</div>
      );
    }
  }

  const items = innerBlocks.map((item) => extractText(item)).filter(Boolean);

  if (items.length === 0) {
    return null;
  }

  return (
    <ul className={styles.iconList}>
      {items.map((text, index) => (
        <li key={index} className={styles.iconListItem}>
          <span className={styles.iconWrapper}>
            <CheckIcon />
          </span>
          <span className={styles.text}>{text}</span>
        </li>
      ))}
    </ul>
  );
}

function extractBlockHtml(html: string, uniqueId: string): string | null {
  const startMarker = `data-block-id="${uniqueId}"`;
  const startIndex = html.indexOf(startMarker);
  if (startIndex === -1) return null;

  const blockStart = html.lastIndexOf("<div", startIndex);
  if (blockStart === -1) return null;

  let depth = 0;
  let i = blockStart;
  while (i < html.length) {
    if (html.slice(i, i + 4) === "<div") {
      depth++;
      i += 4;
    } else if (html.slice(i, i + 6) === "</div>") {
      depth--;
      if (depth === 0) {
        return html.slice(blockStart, i + 6);
      }
      i += 6;
    } else {
      i++;
    }
  }
  return null;
}

function CheckIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width="20"
      height="20"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
    </svg>
  );
}
