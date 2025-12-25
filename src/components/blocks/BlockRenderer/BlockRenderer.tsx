import ParagraphBlock from "../ParagraphBlock";
import HeadingBlock from "../HeadingBlock";
import ImageBlock from "../ImageBlock";
import CoverBlock from "../CoverBlock";
import AccordionBlock from "../AccordionBlock";
import ColumnsBlock, { ColumnBlock } from "../ColumnsBlock";
import ChartBlock from "../ChartBlock";

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

          case "core/cover":
            const coverAttrs = block.attributes as {
              url?: string;
              id?: string | number;
              alt?: string;
              dimRatio?: number;
              overlayColor?: string;
              minHeight?: number;
              contentPosition?: string;
            };
            const coverUrl = coverAttrs?.url || "";
            if (coverUrl && coverUrl.startsWith("IMAGE:")) {
              return (
                <CoverBlock
                  key={key}
                  url=""
                  alt={coverAttrs?.alt || ""}
                  dimRatio={coverAttrs?.dimRatio || 0}
                  overlayColor={coverAttrs?.overlayColor || "black"}
                  minHeight={coverAttrs?.minHeight || 300}
                  contentPosition={
                    coverAttrs?.contentPosition || "center center"
                  }
                  innerBlocks={block.innerBlocks}
                />
              );
            }
            return (
              <CoverBlock
                key={key}
                url={coverUrl}
                alt={coverAttrs?.alt || ""}
                dimRatio={coverAttrs?.dimRatio || 0}
                overlayColor={coverAttrs?.overlayColor || "black"}
                minHeight={coverAttrs?.minHeight || 300}
                contentPosition={coverAttrs?.contentPosition || "center center"}
                innerBlocks={block.innerBlocks}
              />
            );

          case "stackable/accordion":
          case "core/details":
            return <AccordionBlock key={key} block={block} />;

          case "core/columns":
            const columnsAttrs = block.attributes as {
              isStackedOnMobile?: boolean;
            };
            return (
              <ColumnsBlock
                key={key}
                isStackedOnMobile={columnsAttrs?.isStackedOnMobile ?? true}
                columnCount={block.innerBlocks?.length}
              >
                {block.innerBlocks?.map((col, colIndex) => {
                  const colAttrs = col.attributes as { width?: string };
                  return (
                    <ColumnBlock key={`col-${colIndex}`} width={colAttrs?.width}>
                      {col.innerBlocks && col.innerBlocks.length > 0 && (
                        <BlockRenderer blocks={col.innerBlocks} />
                      )}
                    </ColumnBlock>
                  );
                })}
              </ColumnsBlock>
            );

          case "core/column":
            if (block.innerBlocks && block.innerBlocks.length > 0) {
              return <BlockRenderer key={key} blocks={block.innerBlocks} />;
            }
            return null;

          case "core/group":
            if (block.innerBlocks && block.innerBlocks.length > 0) {
              return <BlockRenderer key={key} blocks={block.innerBlocks} />;
            }
            return null;

          case "b-chart/chart":
            const chartAttrs = block.attributes as {
              cId: string;
              type?: "line" | "bar" | "pie" | "doughnut";
              data: {
                labels: string[];
                datasets: {
                  label: string;
                  data: number[];
                  backgroundColor?: string[];
                  borderColor?: string[];
                }[];
              };
              title?: string;
              titleColor?: string;
              titleFontSize?: number;
              isTitle?: boolean;
              height?: string;
              width?: string;
              textColor?: string;
              isXScale?: boolean;
              isYScale?: boolean;
              isXGridLine?: boolean;
              isYGridLine?: boolean;
              gridLineColor?: string;
            };
            if (!chartAttrs?.cId || !chartAttrs?.data) return null;
            return <ChartBlock key={key} chartData={chartAttrs} />;

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
