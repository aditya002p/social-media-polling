import React, { useState, useEffect } from "react";
import OpinionCard from "./OpinionCard";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/FormElements/Select";
import Link from "next/link";

interface Opinion {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  upvotes: number;
  downvotes: number;
  commentCount: number;
  tags: string[];
  userVote?: "up" | "down" | null;
}

interface OpinionsListProps {
  topicId?: string;
  categoryId?: string;
  userId?: string;
  searchQuery?: string;
}

const OpinionsList: React.FC<OpinionsListProps> = ({
  topicId,
  categoryId,
  userId,
  searchQuery,
}) => {
  const [opinions, setOpinions] = useState<Opinion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortBy, setSortBy] = useState("newest");
  const pageSize = 10;

  useEffect(() => {
    const fetchOpinions = async () => {
      try {
        setLoading(true);
        setError(null);

        // In a real app, you would fetch from your API
        const url = `/api/opinions?page=${currentPage}&pageSize=${pageSize}&sortBy=${sortBy}${
          topicId ? `&topicId=${topicId}` : ""
        }${categoryId ? `&categoryId=${categoryId}` : ""}${
          userId ? `&userId=${userId}` : ""
        }${searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : ""}`;

        // For now, simulate a delay and return mock data
        await new Promise((resolve) => setTimeout(resolve, 600));

        // Mock data
        const mockOpinions: Opinion[] = Array.from({ length: 10 }, (_, i) => ({
          id: `opinion-${i + 1 + (currentPage - 1) * pageSize}`,
          title: `Opinion Title ${i + 1 + (currentPage - 1) * pageSize}`,
          content: `This is the content of opinion ${
            i + 1 + (currentPage - 1) * pageSize
          }. It contains the author's thoughts and analysis.`,
          author: {
            id: `user-${(i % 5) + 1}`,
            name: `User ${(i % 5) + 1}`,
            avatar: `/api/placeholder/50/50`,
          },
          createdAt: new Date(Date.now() - i * 86400000).toISOString(),
          upvotes: Math.floor(Math.random() * 100),
          downvotes: Math.floor(Math.random() * 30),
          commentCount: Math.floor(Math.random() * 25),
          tags: [`Tag ${(i % 5) + 1}`, `Tag ${((i + 2) % 5) + 1}`],
          userVote:
            Math.random() > 0.7 ? (Math.random() > 0.5 ? "up" : "down") : null,
        }));

        setOpinions(mockOpinions);
        setTotalPages(5); // Mock total pages
      } catch (err) {
        console.error("Error fetching opinions:", err);
        setError("Failed to load opinions. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOpinions();
  }, [topicId, categoryId, userId, searchQuery, currentPage, sortBy]);

  const handleVote = async (opinionId: string, voteType: "up" | "down") => {
    // In a real app, you would send a request to your API
    setOpinions((prevOpinions) =>
      prevOpinions.map((opinion) => {
        if (opinion.id === opinionId) {
          const currentVote = opinion.userVote;
          let newUpvotes = opinion.upvotes;
          let newDownvotes = opinion.downvotes;

          // Remove previous vote if any
          if (currentVote === "up") newUpvotes--;
          if (currentVote === "down") newDownvotes--;

          // Add new vote if not toggling off
          if (currentVote !== voteType) {
            if (voteType === "up") newUpvotes++;
            if (voteType === "down") newDownvotes++;
          }

          return {
            ...opinion,
            upvotes: newUpvotes,
            downvotes: newDownvotes,
            userVote: currentVote === voteType ? null : voteType,
          };
        }
        return opinion;
      })
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(e.target.value);
    setCurrentPage(1);
  };

  if (loading && opinions.length === 0) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-md">
        <p>{error}</p>
        <Button onClick={() => setCurrentPage(1)} className="mt-2">
          Try Again
        </Button>
      </div>
    );
  }

  if (opinions.length === 0) {
    return (
      <EmptyState
        title="No opinions found"
        description="Be the first to share your thoughts on this topic."
        action={
          <Link href="/opinions/create">
            <Button>Share Your Opinion</Button>
          </Link>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Opinions</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Sort by:</span>
          <Select
            value={sortBy}
            onChange={handleSortChange}
            options={[
              { value: "newest", label: "Newest" },
              { value: "oldest", label: "Oldest" },
              { value: "popular", label: "Most Popular" },
              { value: "controversial", label: "Controversial" },
            ]}
          />
        </div>
      </div>

      <div className="space-y-4">
        {opinions.map((opinion) => (
          <OpinionCard key={opinion.id} opinion={opinion} onVote={handleVote} />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  );
};

export default OpinionsList;
