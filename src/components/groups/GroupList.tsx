import React, { useState, useEffect } from "react";
import { useGroup } from "@/hooks/useGroup";
import GroupCard from "./GroupCard";
import { Group } from "@/types/group";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormElements/Input";
import { Select } from "@/components/ui/FormElements/Select";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface GroupsListProps {
  filter?: "all" | "joined" | "created";
  limit?: number;
  showFilters?: boolean;
  showPagination?: boolean;
  showSearch?: boolean;
}

const GroupsList: React.FC<GroupsListProps> = ({
  filter = "all",
  limit = 12,
  showFilters = true,
  showPagination = true,
  showSearch = true,
}) => {
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState("popular");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState(filter);

  const { groups, loading, error, totalPages, fetchGroups } = useGroup();

  useEffect(() => {
    fetchGroups({
      filter: activeFilter,
      limit,
      page,
      sortBy,
      search: searchQuery,
    });
  }, [activeFilter, limit, page, sortBy, searchQuery, fetchGroups]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSortBy(event.target.value);
    setPage(1); // Reset to first page when changing sort
  };

  const handleFilterChange = (newFilter: "all" | "joined" | "created") => {
    setActiveFilter(newFilter);
    setPage(1); // Reset to first page when changing filter
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  if (loading && page === 1) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading groups"
        description="We encountered an issue while loading groups. Please try again."
        action={
          <Button
            onClick={() =>
              fetchGroups({
                filter: activeFilter,
                limit,
                page,
                sortBy,
                search: searchQuery,
              })
            }
          >
            Retry
          </Button>
        }
      />
    );
  }

  if (!groups || groups.length === 0) {
    return (
      <EmptyState
        title="No groups found"
        description={
          searchQuery
            ? `No groups match "${searchQuery}".`
            : "No groups have been created yet."
        }
        action={<Button href="/groups/create">Create a Group</Button>}
      />
    );
  }

  return (
    <div className="space-y-6">
      {(showFilters || showSearch) && (
        <div className="flex flex-col md:flex-row justify-between gap-4">
          {showFilters && (
            <div className="flex items-center space-x-4">
              <div className="flex space-x-2">
                <Button
                  variant={activeFilter === "all" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("all")}
                >
                  All Groups
                </Button>
                <Button
                  variant={activeFilter === "joined" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("joined")}
                >
                  My Groups
                </Button>
                <Button
                  variant={activeFilter === "created" ? "default" : "outline"}
                  size="sm"
                  onClick={() => handleFilterChange("created")}
                >
                  Created by Me
                </Button>
              </div>

              <div className="flex items-center space-x-2">
                <span className="text-sm">Sort:</span>
                <Select
                  value={sortBy}
                  onChange={handleSortChange}
                  options={[
                    { value: "popular", label: "Most Popular" },
                    { value: "newest", label: "Newest" },
                    { value: "active", label: "Most Active" },
                  ]}
                />
              </div>
            </div>
          )}

          {showSearch && (
            <form onSubmit={handleSearchSubmit} className="flex w-full md:w-64">
              <Input
                type="search"
                placeholder="Search groups..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full"
              />
            </form>
          )}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group: Group) => (
          <GroupCard key={group.id} group={group} />
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

export default GroupsList;
