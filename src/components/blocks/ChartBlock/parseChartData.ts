// Normalized chart data (stable application schema)
export type ChartData = {
  type: "line" | "bar" | "pie" | "doughnut";
  labels: string[];
  data: Array<{
    name: string;
    values: number[];
    backgroundColor?: string[];
    borderColor?: string[];
  }>;
};

type RawDataset = {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
};

// Raw WordPress block attributes → stable schema
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normalizeChartBlock(block: any): ChartData {
  return {
    type: block.type || "line",
    labels: block.data?.labels || [],
    data: (block.data?.datasets || []).map((ds: RawDataset) => ({
      name: ds.label,
      values: ds.data,
      backgroundColor: ds.backgroundColor,
      borderColor: ds.borderColor,
    })),
  };
}

export function parseChartDataFromContent(content: string): ChartData[] {
  const charts: ChartData[] = [];
  const regex = /data-attributes='([^']*)'/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    try {
      const decoded = match[1].replace(/&quot;/g, '"');
      const parsed = JSON.parse(decoded);
      if (parsed.data?.labels && parsed.data?.datasets) {
        charts.push(normalizeChartBlock(parsed));
      }
    } catch {
      // Skip invalid JSON
    }
  }

  return charts;
}
