import React, { useState, useMemo } from "react";
import { Card } from "@/components/ui/Card";
import { Tabs } from "@/components/ui/Tabs";
import { Select } from "@/components/ui/FormElements/Select";
import { BarChart } from "@/components/analytics/BarChart";
import { PieChart } from "@/components/analytics/PieChart";
import { LineChart } from "@/components/analytics/LineChart";
import { formatDistanceToNow } from "date-fns";

interface Option {
  id: string;
  value: string;
  count: number;
}

interface Question {
  id: string;
  question: string;
  type: "single" | "multiple" | "ranking" | "open";
  options: Option[];
  responseCount: number;
}

interface VoteTimeSeries {
  date: string;
  count: number;
}

interface DemographicData {
  label: string;
  value: number;
}

interface PollResultsProps {
  pollId: string;
  pollTitle: string;
  questions: Question[];
  totalVotes: number;
  createdAt: Date;
  voteHistory: VoteTimeSeries[];
  demographics?: {
    age?: DemographicData[];
    gender?: DemographicData[];
    location?: DemographicData[];
  };
}

export const PollResults: React.FC<PollResultsProps> = ({
  pollId,
  pollTitle,
  questions,
  totalVotes,
  createdAt,
  voteHistory,
  demographics,
}) => {
  const [activeQuestion, setActiveQuestion] = useState<string>(
    questions[0]?.id || ""
  );
  const [chartType, setChartType] = useState<"bar" | "pie">("bar");
  const [demographicFilter, setDemographicFilter] = useState<
    "none" | "age" | "gender" | "location"
  >("none");

  const activePoll = useMemo(
    () => questions.find((q) => q.id === activeQuestion),
    [questions, activeQuestion]
  );

  // Prepare data for charts
  const chartData = useMemo(() => {
    if (!activePoll) return [];

    return activePoll.options.map((option) => ({
      name: option.value,
      value: option.count,
      percentage:
        totalVotes > 0
          ? Math.round((option.count / activePoll.responseCount) * 100)
          : 0,
    }));
  }, [activePoll, totalVotes]);

  // Format time series data for the line chart
  const timeSeriesData = useMemo(() => {
    return voteHistory.map((entry) => ({
      date: entry.date,
      votes: entry.count,
    }));
  }, [voteHistory]);

  const activeDemographicData = useMemo(() => {
    if (demographicFilter === "none" || !demographics) return null;
    return demographics[demographicFilter as keyof typeof demographics] || null;
  }, [demographics, demographicFilter]);

  return (
    <div className="space-y-6">
      <Card className="p-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">{pollTitle} - Results</h2>
            <p className="text-gray-600 text-sm">
              {totalVotes} total votes • Created{" "}
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </p>
          </div>

          <div className="mt-2 md:mt-0 flex flex-col sm:flex-row gap-2">
            <Select
              value={chartType}
              onChange={(e) => setChartType(e.target.value as "bar" | "pie")}
              options={[
                { value: "bar", label: "Bar Chart" },
                { value: "pie", label: "Pie Chart" },
              ]}
              className="w-32"
            />

            {demographics && (
              <Select
                value={demographicFilter}
                onChange={(e) =>
                  setDemographicFilter(
                    e.target.value as "none" | "age" | "gender" | "location"
                  )
                }
                options={[
                  { value: "none", label: "No Filter" },
                  { value: "age", label: "By Age" },
                  { value: "gender", label: "By Gender" },
                  { value: "location", label: "By Location" },
                ]}
                className="w-40"
              />
            )}
          </div>
        </div>

        {questions.length > 1 && (
          <div className="mb-6">
            <Tabs
              tabs={questions.map((q) => ({
                id: q.id,
                label: q.question,
              }))}
              activeTab={activeQuestion}
              onChange={setActiveQuestion}
            />
          </div>
        )}

        {activePoll && (
          <div className="h-80">
            {chartType === "bar" ? (
              <BarChart
                data={chartData}
                xKey="name"
                yKey="value"
                labelKey="percentage"
                labelSuffix="%"
                title={activePoll.question}
              />
            ) : (
              <PieChart
                data={chartData}
                nameKey="name"
                valueKey="value"
                labelKey="percentage"
                labelSuffix="%"
                title={activePoll.question}
              />
            )}
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">
            Vote Activity Over Time
          </h3>
          <div className="h-64">
            <LineChart
              data={timeSeriesData}
              xKey="date"
              yKey="votes"
              title="Votes"
            />
          </div>
        </Card>

        {activeDemographicData && (
          <Card className="p-4">
            <h3 className="text-lg font-semibold mb-4">
              Results by{" "}
              {demographicFilter.charAt(0).toUpperCase() +
                demographicFilter.slice(1)}
            </h3>
            <div className="h-64">
              <BarChart
                data={activeDemographicData.map((d) => ({
                  name: d.label,
                  value: d.value,
                  percentage:
                    totalVotes > 0
                      ? Math.round((d.value / totalVotes) * 100)
                      : 0,
                }))}
                xKey="name"
                yKey="value"
                labelKey="percentage"
                labelSuffix="%"
                horizontal
              />
            </div>
          </Card>
        )}
      </div>

      {activePoll?.type === "open" && (
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Open-ended Responses</h3>
          <div className="max-h-96 overflow-y-auto">
            <ul className="divide-y">
              {activePoll.options.map((option) => (
                <li key={option.id} className="py-3">
                  <p className="text-gray-900">{option.value}</p>
                </li>
              ))}
            </ul>
          </div>
        </Card>
      )}
    </div>
  );
};
