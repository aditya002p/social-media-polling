import { useState, useEffect, useCallback } from "react";
import { fetchClient } from "@/lib/api/fetchClient";
import { endpoints } from "@/lib/api/endpoints";
import {
  AnalyticsData,
  AnalyticsFilter,
  AnalyticsTimeframe,
  AnalyticsMetric,
  TrendData,
  UserEngagementData,
  PollPerformanceData,
  DemographicData,
} from "@/types/analytics";

interface UseAnalyticsReturn {
  analyticsData: AnalyticsData | null;
  trendData: TrendData | null;
  userEngagement: UserEngagementData | null;
  pollPerformance: PollPerformanceData | null;
  demographicData: DemographicData | null;
  isLoading: boolean;
  error: string | null;
  fetchAnalytics: (
    metrics: AnalyticsMetric[],
    timeframe: AnalyticsTimeframe,
    filters?: AnalyticsFilter[]
  ) => Promise<void>;
  fetchTrends: (
    metric: AnalyticsMetric,
    timeframe: AnalyticsTimeframe,
    filters?: AnalyticsFilter[]
  ) => Promise<void>;
  fetchUserEngagement: (
    timeframe: AnalyticsTimeframe,
    filters?: AnalyticsFilter[]
  ) => Promise<void>;
  fetchPollPerformance: (
    pollId?: string,
    timeframe?: AnalyticsTimeframe
  ) => Promise<void>;
  fetchDemographics: (
    segmentBy: string,
    filters?: AnalyticsFilter[]
  ) => Promise<void>;
  exportData: (
    format: "csv" | "json" | "xlsx",
    metrics: AnalyticsMetric[],
    timeframe: AnalyticsTimeframe,
    filters?: AnalyticsFilter[]
  ) => Promise<Blob | null>;
}

export function useAnalytics(): UseAnalyticsReturn {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [trendData, setTrendData] = useState<TrendData | null>(null);
  const [userEngagement, setUserEngagement] =
    useState<UserEngagementData | null>(null);
  const [pollPerformance, setPollPerformance] =
    useState<PollPerformanceData | null>(null);
  const [demographicData, setDemographicData] =
    useState<DemographicData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = useCallback(
    async (
      metrics: AnalyticsMetric[],
      timeframe: AnalyticsTimeframe,
      filters?: AnalyticsFilter[]
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchClient<AnalyticsData>(
          endpoints.analytics.dashboard,
          {
            method: "POST",
            body: JSON.stringify({
              metrics,
              timeframe,
              filters,
            }),
          }
        );
        setAnalyticsData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch analytics data"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchTrends = useCallback(
    async (
      metric: AnalyticsMetric,
      timeframe: AnalyticsTimeframe,
      filters?: AnalyticsFilter[]
    ) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchClient<TrendData>(endpoints.analytics.trends, {
          method: "POST",
          body: JSON.stringify({
            metric,
            timeframe,
            filters,
          }),
        });
        setTrendData(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch trend data"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchUserEngagement = useCallback(
    async (timeframe: AnalyticsTimeframe, filters?: AnalyticsFilter[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchClient<UserEngagementData>(
          endpoints.analytics.userEngagement,
          {
            method: "POST",
            body: JSON.stringify({
              timeframe,
              filters,
            }),
          }
        );
        setUserEngagement(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch user engagement data"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchPollPerformance = useCallback(
    async (pollId?: string, timeframe?: AnalyticsTimeframe) => {
      setIsLoading(true);
      setError(null);
      try {
        const url = pollId
          ? `${endpoints.analytics.pollPerformance}/${pollId}`
          : endpoints.analytics.pollPerformance;

        const data = await fetchClient<PollPerformanceData>(url, {
          method: "POST",
          body: JSON.stringify({
            timeframe,
          }),
        });
        setPollPerformance(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch poll performance data"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const fetchDemographics = useCallback(
    async (segmentBy: string, filters?: AnalyticsFilter[]) => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await fetchClient<DemographicData>(
          endpoints.analytics.demographics,
          {
            method: "POST",
            body: JSON.stringify({
              segmentBy,
              filters,
            }),
          }
        );
        setDemographicData(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch demographic data"
        );
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const exportData = useCallback(
    async (
      format: "csv" | "json" | "xlsx",
      metrics: AnalyticsMetric[],
      timeframe: AnalyticsTimeframe,
      filters?: AnalyticsFilter[]
    ): Promise<Blob | null> => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${endpoints.analytics.export}?format=${format}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              metrics,
              timeframe,
              filters,
            }),
          }
        );

        if (!response.ok) {
          throw new Error("Failed to export analytics data");
        }

        return await response.blob();
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to export analytics data"
        );
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Track page views and events
  const trackPageView = useCallback((path: string) => {
    try {
      // This would typically integrate with your analytics service
      // Example: gtag.pageview(path);
      console.info("Analytics page view:", path);
    } catch (error) {
      console.error("Error tracking page view:", error);
    }
  }, []);

  const trackEvent = useCallback(
    (category: string, action: string, label?: string, value?: number) => {
      try {
        // This would typically integrate with your analytics service
        // Example: gtag.event(category, action, label, value);
        console.info("Analytics event:", { category, action, label, value });
      } catch (error) {
        console.error("Error tracking event:", error);
      }
    },
    []
  );

  // Setup page view tracking
  useEffect(() => {
    // Track initial page view
    const path = window.location.pathname + window.location.search;
    trackPageView(path);

    // Setup listener for route changes if using Next.js
    const handleRouteChange = (url: string) => {
      trackPageView(url);
    };

    // Listen to route changes
    // Example: Router.events.on('routeChangeComplete', handleRouteChange);

    return () => {
      // Cleanup listener
      // Example: Router.events.off('routeChangeComplete', handleRouteChange);
    };
  }, [trackPageView]);

  // Cleanup function
  useEffect(() => {
    return () => {
      setAnalyticsData(null);
      setTrendData(null);
      setUserEngagement(null);
      setPollPerformance(null);
      setDemographicData(null);
      setIsLoading(false);
      setError(null);
    };
  }, []);

  return {
    analyticsData,
    trendData,
    userEngagement,
    pollPerformance,
    demographicData,
    isLoading,
    error,
    fetchAnalytics,
    fetchTrends,
    fetchUserEngagement,
    fetchPollPerformance,
    fetchDemographics,
    exportData,
  };
}
