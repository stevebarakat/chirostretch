type Dataset = {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
  tension?: number;
  borderWidth?: number;
};

export type ChartData = {
  cId: string;
  type?: "line" | "bar" | "pie" | "doughnut";
  data: {
    labels: string[];
    datasets: Dataset[];
  };
  width?: string;
  height?: string;
  title?: string;
  titleColor?: string;
  titleFontSize?: number;
  isTitle?: boolean;
  textColor?: string;
  isXScale?: boolean;
  isYScale?: boolean;
  isXGridLine?: boolean;
  isYGridLine?: boolean;
  gridLineColor?: string;
};

export function parseChartDataFromContent(content: string): ChartData[] {
  const charts: ChartData[] = [];
  const regex = /data-attributes='([^']*)'/g;
  let match;

  while ((match = regex.exec(content)) !== null) {
    try {
      const decoded = match[1].replace(/&quot;/g, '"');
      const parsed = JSON.parse(decoded);
      if (parsed.data?.labels && parsed.data?.datasets) {
        charts.push(parsed as ChartData);
      }
    } catch {
      // Skip invalid JSON
    }
  }

  return charts;
}
