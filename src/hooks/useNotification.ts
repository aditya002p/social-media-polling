import { useState, useEffect, useCallback } from "react";
import { fetchClient } from "@/lib/api/fetchClient";
import { endpoints } from "@/lib/api/endpoints";
import { Notification, NotificationPreferences } from "@/types/notification";

interface UseNotificationReturn {
  notifications: Notification[];
  unreadCount: number;
  preferences: NotificationPreferences | null;
  isLoading: boolean;
  error: string | null;
  fetchNotifications: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: string) => Promise<boolean>;
  markAllAsRead: () => Promise<boolean>;
  deleteNotification: (id: string) => Promise<boolean>;
  fetchPreferences: () => Promise<void>;
  updatePreferences: (
    prefs: Partial<NotificationPreferences>
  ) => Promise<boolean>;
}

export function useNotification(): UseNotificationReturn {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [preferences, setPreferences] =
    useState<NotificationPreferences | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchNotifications = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchClient<Notification[]>(
        endpoints.notifications.list
      );
      setNotifications(data);

      // Update unread count based on fetched notifications
      const unread = data.filter((notification) => !notification.read).length;
      setUnreadCount(unread);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch notifications"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchUnreadCount = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchClient<{ count: number }>(
        endpoints.notifications.unreadCount
      );
      setUnreadCount(data.count);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch unread count"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAsRead = useCallback(async (id: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchClient(`${endpoints.notifications.markAsRead}/${id}`, {
        method: "PUT",
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) =>
          notification.id === id
            ? { ...notification, read: true }
            : notification
        )
      );

      setUnreadCount((prev) => Math.max(0, prev - 1));

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark notification as read"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const markAllAsRead = useCallback(async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    try {
      await fetchClient(endpoints.notifications.markAllAsRead, {
        method: "PUT",
      });

      // Update local state
      setNotifications((prev) =>
        prev.map((notification) => ({ ...notification, read: true }))
      );

      setUnreadCount(0);

      return true;
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to mark all notifications as read"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const deleteNotification = useCallback(
    async (id: string): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        await fetchClient(`${endpoints.notifications.delete}/${id}`, {
          method: "DELETE",
        });

        // Update local state
        const removedNotification = notifications.find((n) => n.id === id);
        setNotifications((prev) =>
          prev.filter((notification) => notification.id !== id)
        );

        // Update unread count if the removed notification was unread
        if (removedNotification && !removedNotification.read) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        return true;
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to delete notification"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [notifications]
  );

  const fetchPreferences = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchClient<NotificationPreferences>(
        endpoints.notifications.preferences
      );
      setPreferences(data);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to fetch notification preferences"
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updatePreferences = useCallback(
    async (prefs: Partial<NotificationPreferences>): Promise<boolean> => {
      setIsLoading(true);
      setError(null);
      try {
        const updatedPreferences = await fetchClient<NotificationPreferences>(
          endpoints.notifications.updatePreferences,
          {
            method: "PUT",
            body: JSON.stringify(prefs),
          }
        );

        setPreferences(updatedPreferences);
        return true;
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to update notification preferences"
        );
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  // Setup WebSocket connection for real-time notifications
  useEffect(() => {
    // This is a placeholder for WebSocket implementation
    // You would typically connect to a WebSocket server here
    // and update the notifications state when new notifications arrive
    // const socket = new WebSocket(process.env.NEXT_PUBLIC_WEBSOCKET_URL);
    // socket.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'notification') {
    //     setNotifications(prev => [data.notification, ...prev]);
    //     setUnreadCount(prev => prev + 1);
    //   }
    // };
    // return () => {
    //   socket.close();
    // };
  }, []);

  // Cleanup function
  useEffect(() => {
    return () => {
      setNotifications([]);
      setUnreadCount(0);
      setPreferences(null);
      setIsLoading(false);
      setError(null);
    };
  }, []);

  return {
    notifications,
    unreadCount,
    preferences,
    isLoading,
    error,
    fetchNotifications,
    fetchUnreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    fetchPreferences,
    updatePreferences,
  };
}
