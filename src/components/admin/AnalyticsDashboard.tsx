import React, { useState, useEffect } from "react";
import { useAnalytics } from "@/hooks/useAnalytics";
import BarChart from "@/components/analytics/BarChart";
import LineChart from "@/components/analytics/LineChart";
import PieChart from "@/components/analytics/PieChart";
import HeatMap from "@/components/analytics/HeatMap";
import TrendAnalysis from "@/components/analytics/TrendAnalysis";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/FormElements/Select";
import { DatePicker } from "@/components/ui/FormElements/DatePicker";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

type TimeFrame = "day" | "week" | "month" | "year";

const AnalyticsDashboard: React.FC = () => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("week");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([
    "users",
    "polls",
    "votes",
  ]);
  const [activeTab, setActiveTab] = useState<string>("overview");

  const {
    isLoading,
    error,
    data,
    fetchAnalytics,
    fetchUserDemographics,
    fetchPollPerformance,
    fetchEngagementMetrics,
    fetchTrendingTopics,
  } = useAnalytics();

  // Initialize date range based on timeFrame
  useEffect(() => {
    const end = new Date();
    let start = new Date();

    switch (timeFrame) {
      case "day":
        start.setDate(end.getDate() - 1);
        break;
      case "week":
        start.setDate(end.getDate() - 7);
        break;
      case "month":
        start.setMonth(end.getMonth() - 1);
        break;
      case "year":
        start.setFullYear(end.getFullYear() - 1);
        break;
    }

    setStartDate(start);
    setEndDate(end);
  }, [timeFrame]);

  // Fetch analytics data when date range or selected metrics change
  useEffect(() => {
    if (startDate && endDate) {
      fetchAnalytics({
        startDate,
        endDate,
        metrics: selectedMetrics,
      });

      // Fetch specific data for current tab
      switch (activeTab) {
        case "demographics":
          fetchUserDemographics({ startDate, endDate });
          break;
        case "polls":
          fetchPollPerformance({ startDate, endDate });
          break;
        case "engagement":
          fetchEngagementMetrics({ startDate, endDate });
          break;
        case "trends":
          fetchTrendingTopics({ startDate, endDate });
          break;
      }
    }
  }, [
    startDate,
    endDate,
    selectedMetrics,
    activeTab,
    fetchAnalytics,
    fetchUserDemographics,
    fetchPollPerformance,
    fetchEngagementMetrics,
    fetchTrendingTopics,
  ]);

  // Handle metric selection
  const handleMetricSelection = (metric: string) => {
    if (selectedMetrics.includes(metric)) {
      setSelectedMetrics(selectedMetrics.filter((m) => m !== metric));
    } else {
      setSelectedMetrics([...selectedMetrics, metric]);
    }
  };

  const renderOverview = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">User Growth</h3>
        <LineChart
          data={data?.userGrowth || []}
          xKey="date"
          yKey="count"
          title="New Users Over Time"
        />
        <div className="mt-2 text-sm">
          <span className="font-medium">
            {data?.totalUsers?.toLocaleString()}
          </span>{" "}
          total users
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Poll Activity</h3>
        <BarChart
          data={data?.pollActivity || []}
          xKey="date"
          yKey="count"
          title="Polls Created"
        />
        <div className="mt-2 text-sm">
          <span className="font-medium">
            {data?.totalPolls?.toLocaleString()}
          </span>{" "}
          total polls
        </div>
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Engagement</h3>
        <LineChart
          data={data?.engagement || []}
          xKey="date"
          yKey="count"
          title="Daily Active Users"
        />
        <div className="mt-2 text-sm">
          <span className="font-medium">
            {data?.averageDailyUsers?.toLocaleString()}
          </span>{" "}
          avg. daily users
        </div>
      </Card>

      <Card className="p-4 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Platform Activity</h3>
        <HeatMap
          data={data?.activityHeatmap || []}
          xKey="hour"
          yKey="day"
          valueKey="count"
          title="Activity by Day and Hour"
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Content Distribution</h3>
        <PieChart
          data={data?.contentDistribution || []}
          nameKey="type"
          valueKey="count"
          title="Content by Type"
        />
      </Card>
    </div>
  );

  const renderDemographics = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Age Distribution</h3>
        <BarChart
          data={data?.ageDistribution || []}
          xKey="ageGroup"
          yKey="count"
          title="Users by Age Group"
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Geographic Distribution</h3>
        <PieChart
          data={data?.geoDistribution || []}
          nameKey="region"
          valueKey="count"
          title="Users by Region"
        />
      </Card>

      <Card className="p-4 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">User Interests</h3>
        <HeatMap
          data={data?.interestHeatmap || []}
          xKey="category"
          yKey="ageGroup"
          valueKey="score"
          title="Interest by Age Group and Category"
        />
      </Card>
    </div>
  );

  const renderPollsAnalysis = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Top Performing Polls</h3>
        <BarChart
          data={data?.topPolls || []}
          xKey="title"
          yKey="votes"
          title="Most Voted Polls"
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Poll Categories</h3>
        <PieChart
          data={data?.pollCategories || []}
          nameKey="category"
          valueKey="count"
          title="Polls by Category"
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Poll Completion Rate</h3>
        <LineChart
          data={data?.pollCompletionRate || []}
          xKey="date"
          yKey="rate"
          title="Average Completion Rate (%)"
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Poll Duration</h3>
        <BarChart
          data={data?.pollDuration || []}
          xKey="duration"
          yKey="count"
          title="Time Spent on Polls"
        />
      </Card>
    </div>
  );

  const renderEngagementAnalysis = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">User Retention</h3>
        <LineChart
          data={data?.retention || []}
          xKey="date"
          yKey="rate"
          title="7-Day Retention Rate (%)"
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Session Metrics</h3>
        <BarChart
          data={data?.sessionMetrics || []}
          xKey="date"
          yKey="duration"
          title="Avg. Session Duration (minutes)"
        />
        <div className="mt-2 text-sm">
          <span className="font-medium">{data?.avgPageViews?.toFixed(1)}</span>{" "}
          average pages per session
        </div>
      </Card>

      <Card className="p-4 md:col-span-2">
        <h3 className="text-lg font-semibold mb-2">Activity Timeline</h3>
        <LineChart
          data={data?.activityTimeline || []}
          xKey="hour"
          yKey="count"
          title="Hourly Activity"
        />
      </Card>
    </div>
  );

  const renderTrendsAnalysis = () => (
    <div className="grid grid-cols-1 gap-4">
      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Trending Topics</h3>
        <TrendAnalysis
          data={data?.trendingTopics || []}
          title="Topic Momentum Over Time"
        />
      </Card>

      <Card className="p-4">
        <h3 className="text-lg font-semibold mb-2">Sentiment Analysis</h3>
        <LineChart
          data={data?.sentimentTrend || []}
          xKey="date"
          yKey="score"
          title="Average Sentiment Score"
        />
      </Card>
    </div>
  );

  const renderTabContent = () => {
    if (isLoading) return <LoadingSpinner />;

    if (error)
      return (
        <EmptyState
          icon="alert-triangle"
          title="Error loading analytics"
          description={error}
        />
      );

    if (!data)
      return (
        <EmptyState
          icon="bar-chart"
          title="No data available"
          description="Try adjusting your filters or date range"
        />
      );

    switch (activeTab) {
      case "overview":
        return renderOverview();
      case "demographics":
        return renderDemographics();
      case "polls":
        return renderPollsAnalysis();
      case "engagement":
        return renderEngagementAnalysis();
      case "trends":
        return renderTrendsAnalysis();
      default:
        return renderOverview();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center space-y-4 md:space-y-0">
        <h1 className="text-2xl font-bold">Analytics Dashboard</h1>

        <div className="flex flex-wrap gap-3">
          <Select
            label="Time Period"
            value={timeFrame}
            onChange={(e) => setTimeFrame(e.target.value as TimeFrame)}
            options={[
              { value: "day", label: "Last 24 Hours" },
              { value: "week", label: "Last 7 Days" },
              { value: "month", label: "Last 30 Days" },
              { value: "year", label: "Last 12 Months" },
            ]}
          />

          <div className="flex gap-2">
            <DatePicker
              label="From"
              value={startDate}
              onChange={setStartDate}
              maxDate={endDate || undefined}
            />
            <DatePicker
              label="To"
              value={endDate}
              onChange={setEndDate}
              minDate={startDate || undefined}
              maxDate={new Date()}
            />
          </div>
        </div>
      </div>

      <Tabs
        tabs={[
          { id: "overview", label: "Overview" },
          { id: "demographics", label: "User Demographics" },
          { id: "polls", label: "Polls Analysis" },
          { id: "engagement", label: "Engagement" },
          { id: "trends", label: "Trends" },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
        {renderTabContent()}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
