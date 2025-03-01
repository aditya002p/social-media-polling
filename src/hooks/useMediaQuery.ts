import { useState, useEffect } from "react";

/**
 * A hook that returns whether a media query matches
 * Useful for responsive designs and conditional rendering based on screen size
 *
 * @param query The media query to evaluate (e.g. '(max-width: 768px)')
 * @returns Boolean indicating if the media query matches
 */
function useMediaQuery(query: string): boolean {
  // Start with a default value that makes sense before hydration
  // Assume desktop/larger screens as default for SSR
  const getMatches = (): boolean => {
    // Check if we're in a browser environment
    if (typeof window !== "undefined") {
      return window.matchMedia(query).matches;
    }
    return false;
  };

  const [matches, setMatches] = useState<boolean>(getMatches());

  // Listen for changes to media query state
  useEffect(() => {
    const mediaQueryList = window.matchMedia(query);
    const handleChange = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };

    // Set initial value
    setMatches(mediaQueryList.matches);

    // Modern browsers
    if (mediaQueryList.addEventListener) {
      mediaQueryList.addEventListener("change", handleChange);
      return () => {
        mediaQueryList.removeEventListener("change", handleChange);
      };
    }
    // Legacy browsers (e.g. older Safari)
    else if (mediaQueryList.addListener) {
      mediaQueryList.addListener(handleChange);
      return () => {
        mediaQueryList.removeListener(handleChange);
      };
    }
    return undefined;
  }, [query]);

  return matches;
}

export default useMediaQuery;
