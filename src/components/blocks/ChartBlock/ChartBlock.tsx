"use client";

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import styles from "./ChartBlock.module.css";
import type { ChartData } from "./parseChartData";

type Dataset = {
  label: string;
  data: number[];
  backgroundColor?: string[];
  borderColor?: string[];
};

type ChartBlockProps = {
  chartData: ChartData;
};

function transformData(chartData: ChartData) {
  const { labels, datasets } = chartData.data;
  return labels.map((label, index) => {
    const point: Record<string, string | number> = { name: label };
    datasets.forEach((dataset) => {
      point[dataset.label] = dataset.data[index];
    });
    return point;
  });
}

function getColor(dataset: Dataset, index: number): string {
  if (dataset.borderColor?.[index]) {
    return dataset.borderColor[index];
  }
  if (dataset.borderColor?.[0]) {
    return dataset.borderColor[0];
  }
  const defaultColors = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff7300",
    "#00C49F",
    "#FFBB28",
  ];
  return defaultColors[index % defaultColors.length];
}

export default function ChartBlock({ chartData }: ChartBlockProps) {
  const data = transformData(chartData);
  const { datasets } = chartData.data;
  const chartType = chartData.type || "line";
  const height = parseInt(chartData.height || "400", 10);

  // Default settings when not specified
  const showXGridLine = chartData.isXGridLine ?? true;
  const showYGridLine = chartData.isYGridLine ?? true;
  const gridColor = chartData.gridLineColor || "#e5e5e5";
  const showTitle = chartData.isTitle ?? !!chartData.title;
  const showXScale = chartData.isXScale ?? true;
  const showYScale = chartData.isYScale ?? true;

  const renderChart = () => {
    switch (chartType) {
      case "bar":
        return (
          <BarChart data={data}>
            {(showXGridLine || showYGridLine) && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                horizontal={showYGridLine}
                vertical={showXGridLine}
              />
            )}
            {showXScale && (
              <XAxis dataKey="name" stroke={chartData.textColor} />
            )}
            {showYScale && <YAxis stroke={chartData.textColor} />}
            <Tooltip />
            <Legend />
            {datasets.map((dataset, idx) => (
              <Bar
                key={dataset.label}
                dataKey={dataset.label}
                fill={getColor(dataset, idx)}
              />
            ))}
          </BarChart>
        );

      case "pie":
      case "doughnut":
        const pieData = datasets[0]?.data.map((value, idx) => ({
          name: chartData.data.labels[idx],
          value,
          color:
            datasets[0]?.backgroundColor?.[idx] || getColor(datasets[0], idx),
        }));
        return (
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={chartType === "doughnut" ? 60 : 0}
              outerRadius={80}
              label
            >
              {pieData?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        );

      case "line":
      default:
        return (
          <LineChart data={data}>
            {(showXGridLine || showYGridLine) && (
              <CartesianGrid
                strokeDasharray="3 3"
                stroke={gridColor}
                horizontal={showYGridLine}
                vertical={showXGridLine}
              />
            )}
            {showXScale && (
              <XAxis dataKey="name" stroke={chartData.textColor} />
            )}
            {showYScale && <YAxis stroke={chartData.textColor} />}
            <Tooltip />
            <Legend />
            {datasets.map((dataset, idx) => (
              <Line
                key={dataset.label}
                type="monotone"
                dataKey={dataset.label}
                stroke={getColor(dataset, idx)}
                strokeWidth={dataset.borderWidth || 2}
                dot={{ r: 3 }}
                activeDot={{ r: 5 }}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className={styles.chartContainer}>
      {showTitle && chartData.title && (
        <h3
          className={styles.title}
          style={{
            color: chartData.titleColor,
            fontSize: chartData.titleFontSize,
          }}
        >
          {chartData.title}
        </h3>
      )}
      <ResponsiveContainer width="100%" height={height}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
