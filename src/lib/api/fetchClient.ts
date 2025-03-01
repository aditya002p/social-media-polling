// Enhanced fetch client with error handling and auth token

// Default options for fetch
const DEFAULT_OPTIONS: RequestInit = {
  headers: {
    "Content-Type": "application/json",
  },
};

// Main fetch function with automatic error handling
export const fetchClient = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {
  // Merge default options with provided options
  const mergedOptions: RequestInit = {
    ...DEFAULT_OPTIONS,
    ...options,
    headers: {
      ...DEFAULT_OPTIONS.headers,
      ...options.headers,
    },
  };

  try {
    // Make the request
    const response = await fetch(url, mergedOptions);

    // Check if the response is ok (status in the range 200-299)
    if (!response.ok) {
      // Try to parse error response
      let errorData;
      try {
        errorData = await response.json();
      } catch (e) {
        errorData = { message: response.statusText };
      }

      // Throw an error with details
      throw new Error(
        JSON.stringify({
          status: response.status,
          message: errorData.message || "An unknown error occurred",
          data: errorData,
        })
      );
    }

    // Check if response is empty (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    // Parse JSON response
    const data = await response.json();
    return data as T;
  } catch (error) {
    // Rethrow fetch errors or connection issues
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Network error");
  }
};

// Utility methods for common HTTP methods
export const apiClient = {
  get: <T>(url: string, options?: RequestInit) =>
    fetchClient<T>(url, { ...options, method: "GET" }),

  post: <T>(url: string, data?: any, options?: RequestInit) =>
    fetchClient<T>(url, {
      ...options,
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    }),

  put: <T>(url: string, data?: any, options?: RequestInit) =>
    fetchClient<T>(url, {
      ...options,
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    }),

  patch: <T>(url: string, data?: any, options?: RequestInit) =>
    fetchClient<T>(url, {
      ...options,
      method: "PATCH",
      body: data ? JSON.stringify(data) : undefined,
    }),

  delete: <T>(url: string, options?: RequestInit) =>
    fetchClient<T>(url, { ...options, method: "DELETE" }),
};

export default apiClient;
