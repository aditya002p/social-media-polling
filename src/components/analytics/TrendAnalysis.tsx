import React, { useState, useEffect } from "react";
import LineChart from "./LineChart";
import BarChart from "./BarChart";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/form-elements/Select";
import { Button } from "@/components/ui/Button";

interface TrendData {
  date: string;
  value: number;
  category?: string;
}

interface TrendAnalysisProps {
  data: TrendData[];
  title: string;
  timeRanges?: string[];
  categories?: string[];
  metric?: string;
  onTimeRangeChange?: (timeRange: string) => void;
  onCategoryChange?: (category: string) => void;
}

const TrendAnalysis: React.FC<TrendAnalysisProps> = ({
  data,
  title,
  timeRanges = [
    "1 Week",
    "1 Month",
    "3 Months",
    "6 Months",
    "1 Year",
    "All Time",
  ],
  categories = [],
  metric = "Value",
  onTimeRangeChange,
  onCategoryChange,
}) => {
  const [selectedTimeRange, setSelectedTimeRange] = useState(timeRanges[2]);
  const [selectedCategory, setSelectedCategory] = useState<string | undefined>(
    categories.length > 0 ? "All Categories" : undefined
  );
  const [chartType, setChartType] = useState<"line" | "bar">("line");
  const [filteredData, setFilteredData] = useState<TrendData[]>(data);
  const [aggregatedData, setAggregatedData] = useState<any[]>([]);

  // Filter data based on time range and category
  useEffect(() => {
    let filtered = [...data];

    // Apply time range filter
    if (selectedTimeRange !== "All Time") {
      const currentDate = new Date();
      let pastDate = new Date();

      switch (selectedTimeRange) {
        case "1 Week":
          pastDate.setDate(currentDate.getDate() - 7);
          break;
        case "1 Month":
          pastDate.setMonth(currentDate.getMonth() - 1);
          break;
        case "3 Months":
          pastDate.setMonth(currentDate.getMonth() - 3);
          break;
        case "6 Months":
          pastDate.setMonth(currentDate.getMonth() - 6);
          break;
        case "1 Year":
          pastDate.setFullYear(currentDate.getFullYear() - 1);
          break;
      }

      filtered = filtered.filter((item) => new Date(item.date) >= pastDate);
    }

    // Apply category filter
    if (
      selectedCategory &&
      selectedCategory !== "All Categories" &&
      categories.length > 0
    ) {
      filtered = filtered.filter((item) => item.category === selectedCategory);
    }

    setFilteredData(filtered);

    // For bar chart, aggregate data by date
    const aggregated = filtered.reduce((acc: any, item) => {
      const date = item.date.split("T")[0]; // Get just the date part
      if (!acc[date]) {
        acc[date] = { label: date, value: 0 };
      }
      acc[date].value += item.value;
      return acc;
    }, {});

    setAggregatedData(Object.values(aggregated));
  }, [data, selectedTimeRange, selectedCategory, categories]);

  const handleTimeRangeChange = (value: string) => {
    setSelectedTimeRange(value);
    if (onTimeRangeChange) onTimeRangeChange(value);
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    if (onCategoryChange) onCategoryChange(value);
  };

  // Calculate trend metrics
  const calculateMetrics = () => {
    if (filteredData.length === 0) return { growth: 0, average: 0 };

    const values = filteredData.map((d) => d.value);
    const average = values.reduce((sum, val) => sum + val, 0) / values.length;

    if (filteredData.length < 2) return { growth: 0, average };

    // Calculate growth percentage
    const firstValue = filteredData[0].value;
    const lastValue = filteredData[filteredData.length - 1].value;
    const growth = ((lastValue - firstValue) / firstValue) * 100;

    return { growth, average };
  };

  const metrics = calculateMetrics();

  return (
    <Card className="p-6">
      <div className="mb-6 flex flex-col space-y-4 md:flex-row md:items-center md:justify-between md:space-y-0">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
          {categories.length > 0 && (
            <Select
              value={selectedCategory}
              onValueChange={handleCategoryChange}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Categories">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          <Select
            value={selectedTimeRange}
            onValueChange={handleTimeRangeChange}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select time range" />
            </SelectTrigger>
            <SelectContent>
              {timeRanges.map((range) => (
                <SelectItem key={range} value={range}>
                  {range}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Total Data Points
          </h3>
          <p className="text-2xl font-bold">{filteredData.length}</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Average {metric}
          </h3>
          <p className="text-2xl font-bold">{metrics.average.toFixed(2)}</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-4 dark:bg-gray-800">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            Growth
          </h3>
          <p
            className={`text-2xl font-bold ${
              metrics.growth >= 0 ? "text-green-600" : "text-red-600"
            }`}
          >
            {metrics.growth.toFixed(2)}%
          </p>
        </div>
      </div>

      <Tabs defaultValue="line" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="line" onClick={() => setChartType("line")}>
            Line Chart
          </TabsTrigger>
          <TabsTrigger value="bar" onClick={() => setChartType("bar")}>
            Bar Chart
          </TabsTrigger>
        </TabsList>
        <TabsContent value="line" className="pt-4">
          {filteredData.length > 0 ? (
            <div className="h-80">
              <LineChart
                data={filteredData.map((item) => ({
                  date: item.date,
                  value: item.value,
                }))}
                title=""
                xAxisLabel="Date"
                yAxisLabel={metric}
                showArea={true}
                showPoints={true}
              />
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center">
              <p className="text-gray-500">
                No data available for the selected filters
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="bar" className="pt-4">
          {aggregatedData.length > 0 ? (
            <div className="h-80">
              <BarChart
                data={aggregatedData}
                title=""
                xAxisLabel="Date"
                yAxisLabel={metric}
              />
            </div>
          ) : (
            <div className="flex h-80 items-center justify-center">
              <p className="text-gray-500">
                No data available for the selected filters
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>

      {filteredData.length > 0 && (
        <div className="mt-6">
          <h3 className="mb-2 text-lg font-semibold">Insights</h3>
          <p className="text-gray-700 dark:text-gray-300">
            {metrics.growth >= 0
              ? `There has been a positive trend with a ${metrics.growth.toFixed(
                  2
                )}% increase over the selected time period. The average ${metric.toLowerCase()} is ${metrics.average.toFixed(
                  2
                )}.`
              : `There has been a negative trend with a ${Math.abs(
                  metrics.growth
                ).toFixed(
                  2
                )}% decrease over the selected time period. The average ${metric.toLowerCase()} is ${metrics.average.toFixed(
                  2
                )}.`}
          </p>
        </div>
      )}
    </Card>
  );
};

export default TrendAnalysis;
