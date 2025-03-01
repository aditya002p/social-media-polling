export interface AnalyticsTimeRange {
  startDate: Date;
  endDate: Date;
}

export interface AnalyticsFilter {
  timeRange?: AnalyticsTimeRange;
  demographic?: string[];
  region?: string[];
  ageGroup?: string[];
  gender?: string[];
  tags?: string[];
  categories?: string[];
}

export interface DataPoint {
  label: string;
  value: number;
  date?: Date;
  percentage?: number;
}

export interface TimeSeriesDataPoint extends DataPoint {
  date: Date;
}

export interface ChartData {
  title: string;
  description?: string;
  dataPoints: DataPoint[];
  labels?: string[];
}

export interface TimeSeriesData extends ChartData {
  dataPoints: TimeSeriesDataPoint[];
}

export interface PollAnalytics {
  id: string;
  pollId: string;
  totalVotes: number;
  uniqueVoters: number;
  optionBreakdown: {
    optionId: string;
    optionText: string;
    votes: number;
    percentage: number;
  }[];
  demographicData?: {
    [key: string]: ChartData;
  };
  timeSeriesData?: TimeSeriesData;
  engagementRate: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserEngagementAnalytics {
  totalUsers: number;
  activeUsers: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  newUsersByPeriod: {
    daily: TimeSeriesData;
    weekly: TimeSeriesData;
    monthly: TimeSeriesData;
  };
  userRetention: {
    daily: number;
    weekly: number;
    monthly: number;
  };
  averageSessionDuration: number;
  averageActionPerSession: number;
}

export interface ContentAnalytics {
  totalPolls: number;
  totalOpinions: number;
  totalComments: number;
  totalForumPosts: number;
  popularTags: DataPoint[];
  popularCategories: DataPoint[];
  contentCreationTrends: TimeSeriesData;
  contentEngagementTrends: TimeSeriesData;
}

export interface TrendAnalysis {
  id: string;
  title: string;
  description: string;
  trendType: "rising" | "falling" | "stable" | "volatile";
  startDate: Date;
  endDate: Date;
  dataPoints: TimeSeriesDataPoint[];
  relatedTopics: string[];
  confidence: number;
  createdAt: Date;
}

export interface AnalyticsDashboardData {
  userEngagement: UserEngagementAnalytics;
  contentMetrics: ContentAnalytics;
  platformOverview: {
    totalVisits: number;
    bounceRate: number;
    avgTimeOnSite: number;
    peakUsageTimes: TimeSeriesData;
  };
  trendingPolls: {
    pollId: string;
    pollTitle: string;
    engagement: number;
    trend: "up" | "down" | "stable";
  }[];
  trendingTopics: {
    topic: string;
    volume: number;
    trend: "up" | "down" | "stable";
  }[];
}

export interface ExportOptions {
  format: "csv" | "json" | "xlsx" | "pdf";
  includeCharts: boolean;
  timeRange: AnalyticsTimeRange;
  filters?: AnalyticsFilter;
  sections?: string[];
}

export type ChartType =
  | "bar"
  | "line"
  | "pie"
  | "doughnut"
  | "radar"
  | "scatter"
  | "bubble"
  | "heatmap";

export interface ChartOptions {
  type: ChartType;
  colors?: string[];
  showLegend?: boolean;
  showLabels?: boolean;
  showGrid?: boolean;
  stacked?: boolean;
  animations?: boolean;
  responsive?: boolean;
}
