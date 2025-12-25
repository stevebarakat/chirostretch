import ChartBlock from "./ChartBlock";
import { parseChartDataFromContent, type ChartData } from "./parseChartData";

type ContentSegment =
  | { type: "html"; content: string }
  | { type: "chart"; chartData: ChartData };

export function parseContentWithCharts(html: string): ContentSegment[] {
  const segments: ContentSegment[] = [];
  const charts = parseChartDataFromContent(html);

  if (charts.length === 0) {
    return [{ type: "html", content: html }];
  }

  // Create a map of chart cId to chart data for quick lookup
  const chartMap = new Map<string, ChartData>();
  charts.forEach((chart) => {
    if (chart.cId) {
      chartMap.set(chart.cId, chart);
    }
  });

  // Find all chart elements in the HTML
  const chartRegex = /<[^>]*data-attributes='([^']*)'[^>]*>/g;
  let lastIndex = 0;
  let match;

  while ((match = chartRegex.exec(html)) !== null) {
    // Add HTML content before this chart
    if (match.index > lastIndex) {
      const beforeContent = html.substring(lastIndex, match.index);
      if (beforeContent.trim()) {
        segments.push({ type: "html", content: beforeContent });
      }
    }

    // Extract and add the chart
    try {
      const decoded = match[1].replace(/&quot;/g, '"');
      const parsed = JSON.parse(decoded);
      if (parsed.data?.labels && parsed.data?.datasets && parsed.cId) {
        const chartData = chartMap.get(parsed.cId);
        if (chartData) {
          segments.push({ type: "chart", chartData });
        }
      }
    } catch {
      // Skip invalid chart data
    }

    lastIndex = match.index + match[0].length;
  }

  // Add remaining HTML content after the last chart
  if (lastIndex < html.length) {
    const afterContent = html.substring(lastIndex);
    if (afterContent.trim()) {
      segments.push({ type: "html", content: afterContent });
    }
  }

  // If no charts were found in the expected format, return the whole HTML
  if (segments.length === 0) {
    return [{ type: "html", content: html }];
  }

  return segments;
}

type RenderContentWithChartsProps = {
  content: string;
};

export function RenderContentWithCharts({
  content,
}: RenderContentWithChartsProps) {
  const segments = parseContentWithCharts(content);

  return (
    <>
      {segments.map((segment, index) => {
        if (segment.type === "chart") {
          return (
            <ChartBlock
              key={segment.chartData.cId || index}
              chartData={segment.chartData}
            />
          );
        }
        return (
          <div
            key={index}
            dangerouslySetInnerHTML={{ __html: segment.content }}
          />
        );
      })}
    </>
  );
}
