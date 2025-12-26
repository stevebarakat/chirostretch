import ParagraphBlock from "../ParagraphBlock";
import HeadingBlock from "../HeadingBlock";
import ImageBlock from "../ImageBlock";
import ChartBlock from "../ChartBlock";
import { normalizeChartBlock } from "../ChartBlock/parseChartData";
import GravityFormBlock from "../GravityFormBlock";

export type Block = {
  name: string;
  attributes?: Record<string, unknown>;
  innerBlocks?: Block[];
  innerHTML?: string;
  innerContent?: string[];
};

type BlockRendererProps = {
  blocks: Block[];
  className?: string;
  renderedContent?: string;
};

export default function BlockRenderer({
  blocks,
  className,
}: BlockRendererProps) {
  if (!blocks || blocks.length === 0) return null;

  return (
    <div className={className}>
      {blocks.map((block, index) => {
        const key = `block-${index}-${block.name}`;

        switch (block.name) {
          case "core/paragraph":
            return (
              <ParagraphBlock
                key={key}
                content={
                  block.innerHTML || (block.attributes?.content as string) || ""
                }
              />
            );

          case "core/heading":
            return (
              <HeadingBlock
                key={key}
                level={(block.attributes?.level as number) || 2}
                content={
                  block.innerHTML || (block.attributes?.content as string) || ""
                }
              />
            );

          case "core/image":
            const imageAttrs = block.attributes as {
              url?: string;
              id?: string | number;
              alt?: string;
              width?: number;
              height?: number;
              caption?: string;
              align?: "left" | "center" | "right" | "wide" | "full";
              sizeSlug?: string;
              className?: string;
              style?: {
                border?: {
                  radius?: string;
                };
                borderRadius?: string;
                aspectRatio?: string;
                objectFit?: string;
              };
              borderRadius?: string;
              aspectRatio?: string;
              scale?: "cover" | "contain";
              objectFit?: "cover" | "contain" | "fill" | "none" | "scale-down";
            };
            const imageUrl = imageAttrs?.url || "";
            if (!imageUrl || imageUrl.startsWith("IMAGE:")) {
              return null;
            }

            const aspectRatio =
              imageAttrs?.aspectRatio ||
              (imageAttrs?.style?.aspectRatio as string | undefined) ||
              ((imageAttrs as Record<string, unknown>)?.["aspect-ratio"] as
                | string
                | undefined) ||
              undefined;

            const scale =
              imageAttrs?.scale ||
              (imageAttrs?.style?.objectFit as
                | "cover"
                | "contain"
                | undefined) ||
              undefined;

            const objectFit =
              imageAttrs?.objectFit ||
              (imageAttrs?.style?.objectFit as
                | "cover"
                | "contain"
                | "fill"
                | "none"
                | "scale-down"
                | undefined) ||
              undefined;

            if (process.env.NODE_ENV === "development") {
              console.log("Image block attributes:", {
                aspectRatio: aspectRatio || "NOT FOUND",
                scale: scale || "NOT FOUND",
                objectFit: objectFit || "NOT FOUND",
                rawAspectRatio: imageAttrs?.aspectRatio,
                rawScale: imageAttrs?.scale,
                rawObjectFit: imageAttrs?.objectFit,
                styleAspectRatio: imageAttrs?.style?.aspectRatio,
                styleObjectFit: imageAttrs?.style?.objectFit,
                allAttrsKeys: Object.keys(imageAttrs || {}),
              });
            }

            return (
              <ImageBlock
                key={key}
                url={imageUrl}
                alt={imageAttrs?.alt || ""}
                width={imageAttrs?.width}
                height={imageAttrs?.height}
                caption={imageAttrs?.caption}
                align={imageAttrs?.align}
                sizeSlug={imageAttrs?.sizeSlug}
                className={imageAttrs?.className || ""}
                style={imageAttrs?.style}
                borderRadius={imageAttrs?.borderRadius}
                aspectRatio={aspectRatio}
                scale={scale}
                objectFit={objectFit}
              />
            );

          case "core/group":
          case "core/column":
            if (block.innerBlocks && block.innerBlocks.length > 0) {
              return <BlockRenderer key={key} blocks={block.innerBlocks} />;
            }
            return null;

          case "core/columns":
            return (
              <div key={key} style={{ display: "flex", gap: "1rem" }}>
                {block.innerBlocks?.map((col, colIndex) => (
                  <div key={`col-${colIndex}`} style={{ flex: 1 }}>
                    {col.innerBlocks && col.innerBlocks.length > 0 && (
                      <BlockRenderer blocks={col.innerBlocks} />
                    )}
                  </div>
                ))}
              </div>
            );

          case "b-chart/chart":
            if (!block.attributes) return null;
            const chartData = normalizeChartBlock(block.attributes);
            if (!chartData.labels.length) return null;
            return <ChartBlock key={key} chartData={chartData} />;

          case "gravityforms/form":
            return <GravityFormBlock key={key} block={block} />;

          default:
            if (block.innerHTML) {
              return (
                <div
                  key={key}
                  dangerouslySetInnerHTML={{ __html: block.innerHTML }}
                />
              );
            }
            if (block.innerBlocks && block.innerBlocks.length > 0) {
              return <BlockRenderer key={key} blocks={block.innerBlocks} />;
            }
            return null;
        }
      })}
    </div>
  );
}
