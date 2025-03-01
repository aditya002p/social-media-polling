// src/components/layout/SearchBar.tsx
"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useDebounce } from "@/hooks/useDebounce";

export default function SearchBar() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (debouncedSearchQuery.length < 3) {
        setSearchResults([]);
        return;
      }

      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(debouncedSearchQuery)}`
        );
        const data = await response.json();
        setSearchResults(data.results);
      } catch (error) {
        console.error("Error fetching search results:", error);
        setSearchResults([]);
      }
    };

    fetchSearchResults();
  }, [debouncedSearchQuery]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsFocused(false);
    }
  };

  return (
    <div className="relative w-full max-w-md" ref={searchRef}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <input
            type="text"
            placeholder="Search polls, opinions, forums..."
            className="w-full rounded-full border border-gray-300 bg-gray-50 px-4 py-2 pl-10 pr-4 text-sm focus:border-blue-500 focus:outline-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
          />
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
          <button
            type="submit"
            className="absolute inset-y-0 right-0 flex items-center pr-3"
            aria-label="Search"
          >
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="9 18 15 12 9 6" />
            </svg>
          </button>
        </div>
      </form>

      {isFocused && searchResults.length > 0 && (
        <div className="absolute top-full z-10 mt-1 w-full rounded-md border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-800">
          {searchResults.map((result) => (
            <div
              key={result.id}
              className="cursor-pointer px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={() => {
                router.push(result.url);
                setIsFocused(false);
                setSearchQuery("");
              }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium">{result.title}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {result.type.charAt(0).toUpperCase() + result.type.slice(1)}
                  </p>
                </div>
                {result.type === "poll" && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {result.votes} votes
                  </span>
                )}
                {result.type === "opinion" && (
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {result.likes} likes
                  </span>
                )}
              </div>
            </div>
          ))}
          <div className="border-t border-gray-200 px-4 py-2 text-center dark:border-gray-700">
            <button
              onClick={() => {
                router.push(`/search?q=${encodeURIComponent(searchQuery)}`);
                setIsFocused(false);
              }}
              className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              See all results
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
