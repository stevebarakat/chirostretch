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

const FALLBACK_COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#00C49F", "#FFBB28"];

type ChartBlockProps = {
  chartData: ChartData;
};

// Transform normalized data for Recharts
function toRechartsData(chart: ChartData) {
  return chart.labels.map((label, i) => {
    const point: Record<string, string | number> = { name: label };
    chart.data.forEach((dataset) => {
      point[dataset.name] = dataset.values[i];
    });
    return point;
  });
}

export default function ChartBlock({ chartData }: ChartBlockProps) {
  const data = toRechartsData(chartData);

  const renderChart = () => {
    switch (chartData.type) {
      case "bar":
        return (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {chartData.data.map((dataset, idx) => (
              <Bar
                key={dataset.name}
                dataKey={dataset.name}
                fill={dataset.borderColor?.[0] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length]}
              />
            ))}
          </BarChart>
        );

      case "pie":
      case "doughnut":
        const pieData = chartData.data[0]?.values.map((value, idx) => ({
          name: chartData.labels[idx],
          value,
        }));
        const pieColors = chartData.data[0]?.backgroundColor || FALLBACK_COLORS;
        return (
          <PieChart>
            <Pie
              data={pieData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={chartData.type === "doughnut" ? 60 : 0}
              outerRadius={80}
              label
            >
              {pieData?.map((_, index) => (
                <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
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
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            {chartData.data.map((dataset, idx) => (
              <Line
                key={dataset.name}
                type="monotone"
                dataKey={dataset.name}
                stroke={dataset.borderColor?.[0] || FALLBACK_COLORS[idx % FALLBACK_COLORS.length]}
                strokeWidth={2}
              />
            ))}
          </LineChart>
        );
    }
  };

  return (
    <div className={styles.chartContainer}>
      <ResponsiveContainer width="100%" height={400}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
}
