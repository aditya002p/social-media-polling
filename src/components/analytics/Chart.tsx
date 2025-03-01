import React, { useRef, useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  ChartData,
  ChartOptions,
  ChartType,
} from "chart.js";
import { Chart as ReactChart } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend
);

export interface ChartProps {
  data: ChartData<any>;
  options?: ChartOptions<any>;
  type: ChartType;
  height?: number;
  width?: number;
  className?: string;
  onDataPointClick?: (dataIndex: number, datasetIndex: number) => void;
}

const Chart: React.FC<ChartProps> = ({
  data,
  options = {},
  type,
  height = 300,
  width = 600,
  className = "",
  onDataPointClick,
}) => {
  const chartRef = useRef<ChartJS>(null);
  const [chartData, setChartData] = useState<ChartData<any>>(data);

  useEffect(() => {
    setChartData(data);
  }, [data]);

  useEffect(() => {
    if (chartRef.current && onDataPointClick) {
      const chart = chartRef.current;

      const clickHandler = (e: any) => {
        const points = chart.getElementsAtEventForMode(
          e,
          "nearest",
          { intersect: true },
          false
        );

        if (points.length) {
          const firstPoint = points[0];
          const datasetIndex = firstPoint.datasetIndex;
          const dataIndex = firstPoint.index;
          onDataPointClick(dataIndex, datasetIndex);
        }
      };

      chart.canvas.addEventListener("click", clickHandler);

      return () => {
        chart.canvas.removeEventListener("click", clickHandler);
      };
    }
  }, [chartRef, onDataPointClick]);

  const defaultOptions: ChartOptions<any> = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        titleColor: "white",
        bodyColor: "white",
        borderColor: "rgba(0, 0, 0, 0.1)",
        borderWidth: 1,
        padding: 10,
        displayColors: true,
      },
    },
    ...options,
  };

  return (
    <div
      className={`chart-container ${className}`}
      style={{
        height: `${height}px`,
        width: `${width}px`,
        maxWidth: "100%",
      }}
    >
      <ReactChart
        ref={chartRef}
        type={type}
        data={chartData}
        options={defaultOptions}
      />
    </div>
  );
};

export default Chart;
