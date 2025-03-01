import React, { useState, useEffect } from "react";
import { useForum } from "@/hooks/useForum";
import ThreadCard from "./ThreadCard";
import { Thread } from "@/types/forum";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/FormElements/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface ThreadsListProps {
  forumId: string;
  limit?: number;
  showFilters?: boolean;
  showPagination?: boolean;
}

const ThreadsList: React.FC<ThreadsListProps> = ({
  forumId,
  limit = 10,
  showFilters = true,
  showPagination = true,
}) => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("recent");
  const { threads, loading, error, totalPages, fetchThreads } = useForum();

  useEffect(() => {
    fetchThreads({ forumId, limit, page, sortBy });
  }, [forumId, limit, page, sortBy, fetchThreads]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
    setPage(1); // Reset to first page when changing sort
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading threads"
        description="We encountered an issue while loading threads. Please try again."
        action={
          <Button
            onClick={() => fetchThreads({ forumId, limit, page, sortBy })}
          >
            Retry
          </Button>
        }
      />
    );
  }

  if (!threads || threads.length === 0) {
    return (
      <EmptyState
        title="No threads found"
        description="Be the first to start a discussion in this forum."
        action={
          <Button href={`/forums/${forumId}/threads/create`}>
            Create Thread
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {showFilters && (
        <div className="flex justify-between items-center mb-4">
          <Button href={`/forums/${forumId}/threads/create`}>
            Create Thread
          </Button>
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Sort by:</span>
            <Select
              value={sortBy}
              onChange={handleSortChange}
              options={[
                { value: "recent", label: "Most Recent" },
                { value: "popular", label: "Most Popular" },
                { value: "active", label: "Most Active" },
              ]}
            />
          </div>
        </div>
      )}

      <div className="space-y-4">
        {threads.map((thread: Thread) => (
          <ThreadCard key={thread.id} thread={thread} />
        ))}
      </div>

      {showPagination && totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default ThreadsList;
