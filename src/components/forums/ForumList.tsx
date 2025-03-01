import React, { useState, useEffect } from 'react';
import { useForum } from '@/hooks/useForum';
import ForumCard from './ForumCard';
import { Forum } from '@/types/forum';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { LoadingSpinner } from '@/components/shared/LoadingSpinner';
import { EmptyState } from '@/components/shared/EmptyState';

interface ForumsListProps {
  category?: string;
  limit?: number;
  showPagination?: boolean;
}

const ForumsList: React.FC<ForumsListProps> = ({
  category,
  limit = 10,
  showPagination = true,
}) => {
  const [page, setPage] = useState(1);
  const { forums, loading, error, totalPages, fetchForums } = useForum();

  useEffect(() => {
    fetchForums({ category, limit, page });
  }, [category, limit, page, fetchForums]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading forums"
        description="We encountered an issue while loading forums. Please try again."
        action={<Button onClick={() => fetchForums({ category, limit, page })}>Retry</Button>}
      />
    );
  }

  if (!forums || forums.length === 0) {
    return (
      <EmptyState
        title="No forums found"
        description={category ? `No forums found in the ${category} category.` : "No forums have been created yet."}
        action={<Button href="/forums/create">Create a Forum</Button>}
      />
    );
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {forums.map((forum: Forum) => (
          <ForumCard key={forum.id} forum={forum} />
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

export default ForumsList;