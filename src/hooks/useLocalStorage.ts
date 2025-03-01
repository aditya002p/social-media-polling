import { useState, useEffect } from "react";

/**
 * A hook for storing and retrieving values from localStorage with automatic JSON parsing/stringifying
 *
 * @param key The key to store the value under in localStorage
 * @param initialValue The initial value to use if no value exists in localStorage
 * @returns A stateful value and a function to update it
 */
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevState: T) => T)) => void] {
  // Get the stored value from localStorage, or use the initialValue if not found
  const readValue = (): T => {
    // Check if we're in a browser environment (localStorage is not available during SSR)
    if (typeof window === "undefined") {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  };

  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(readValue());

  // Function to update both the state and localStorage
  const setValue = (value: T | ((prevState: T) => T)) => {
    try {
      // Allow value to be a function to match useState behavior
      const newValue = value instanceof Function ? value(storedValue) : value;

      // Save to state
      setStoredValue(newValue);

      // Save to localStorage (if we're in a browser environment)
      if (typeof window !== "undefined") {
        window.localStorage.setItem(key, JSON.stringify(newValue));
        // Trigger a custom storage event for other instances of this hook
        window.dispatchEvent(new Event("local-storage"));
      }
    } catch (error) {
      console.warn(`Error setting localStorage key "${key}":`, error);
    }
  };

  // Listen for changes to localStorage from other instances of this hook
  useEffect(() => {
    const handleStorageChange = () => {
      setStoredValue(readValue());
    };

    // Listen for the custom event we dispatch
    window.addEventListener("local-storage", handleStorageChange);

    // Listen for native localStorage changes (from other tabs/windows)
    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("local-storage", handleStorageChange);
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  return [storedValue, setValue];
}

export default useLocalStorage;
