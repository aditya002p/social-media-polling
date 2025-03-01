import React, { useState, useEffect } from "react";
import { useGroup } from "@/hooks/useGroup";
import { useAuth } from "@/hooks/useAuth";
import { GroupMember } from "@/types/group";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/FormElements/Input";
import { Dropdown } from "@/components/ui/Dropdown";
import { Pagination } from "@/components/ui/Pagination";
import { LoadingSpinner } from "@/components/shared/LoadingSpinner";
import { EmptyState } from "@/components/shared/EmptyState";

interface MembersListProps {
  groupId: string;
  isAdmin?: boolean;
  limit?: number;
  showSearch?: boolean;
  showPagination?: boolean;
}

const MembersList: React.FC<MembersListProps> = ({
  groupId,
  isAdmin = false,
  limit = 20,
  showSearch = true,
  showPagination = true,
}) => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const {
    groupMembers,
    loading,
    error,
    totalPages,
    fetchGroupMembers,
    removeGroupMember,
    updateMemberRole,
  } = useGroup();

  useEffect(() => {
    fetchGroupMembers({ groupId, limit, page, search: searchQuery });
  }, [groupId, limit, page, searchQuery, fetchGroupMembers]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSearchSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    setPage(1); // Reset to first page when searching
  };

  const handleRemoveMember = async (memberId: string) => {
    if (window.confirm("Are you sure you want to remove this member?")) {
      await removeGroupMember(groupId, memberId);
    }
  };

  const handleRoleChange = async (
    memberId: string,
    newRole: "member" | "moderator" | "admin"
  ) => {
    await updateMemberRole(groupId, memberId, newRole);
  };

  if (loading && page === 1) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <EmptyState
        title="Error loading members"
        description="We encountered an issue while loading group members. Please try again."
        action={
          <Button
            onClick={() =>
              fetchGroupMembers({ groupId, limit, page, search: searchQuery })
            }
          >
            Retry
          </Button>
        }
      />
    );
  }

  if (!groupMembers || groupMembers.length === 0) {
    return (
      <EmptyState
        title="No members found"
        description={
          searchQuery
            ? `No members match "${searchQuery}".`
            : "This group has no members yet."
        }
      />
    );
  }

  return (
    <div className="space-y-4">
      {showSearch && (
        <form onSubmit={handleSearchSubmit} className="flex">
          <Input
            type="search"
            placeholder="Search members..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full md:w-64"
          />
        </form>
      )}

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="text-left p-3 text-sm font-medium text-gray-500">
                Member
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">
                Role
              </th>
              <th className="text-left p-3 text-sm font-medium text-gray-500">
                Joined
              </th>
              {isAdmin && (
                <th className="text-right p-3 text-sm font-medium text-gray-500">
                  Actions
                </th>
              )}
            </tr>
          </thead>
          <tbody>
            {groupMembers.map((member: GroupMember) => (
              <tr key={member.id} className="border-b">
                <td className="p-3">
                  <div className="flex items-center space-x-3">
                    <Avatar
                      src={member.user.avatarUrl}
                      alt={member.user.name}
                      fallback={member.user.name?.charAt(0) || "?"}
                      size="sm"
                    />
                    <div>
                      <div className="font-medium">{member.user.name}</div>
                      <div className="text-sm text-gray-500">
                        {member.user.username}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="p-3">
                  {member.role === "admin" && (
                    <Badge variant="default">Admin</Badge>
                  )}
                  {member.role === "moderator" && (
                    <Badge variant="outline">Moderator</Badge>
                  )}
                  {member.role === "member" && (
                    <span className="text-sm">Member</span>
                  )}
                </td>
                <td className="p-3 text-sm text-gray-500">
                  {new Date(member.joinedAt).toLocaleDateString()}
                </td>
                {isAdmin && (
                  <td className="p-3 text-right">
                    {member.user.id !== user?.id && (
                      <Dropdown
                        trigger={
                          <Button variant="ghost" size="sm">
                            •••
                          </Button>
                        }
                        items={[
                          {
                            label: "Make Admin",
                            onClick: () => handleRoleChange(member.id, "admin"),
                            disabled: member.role === "admin",
                          },
                          {
                            label: "Make Moderator",
                            onClick: () =>
                              handleRoleChange(member.id, "moderator"),
                            disabled: member.role === "moderator",
                          },
                          {
                            label: "Make Member",
                            onClick: () =>
                              handleRoleChange(member.id, "member"),
                            disabled: member.role === "member",
                          },
                          { divider: true },
                          {
                            label: "Remove from Group",
                            onClick: () => handleRemoveMember(member.id),
                            variant: "destructive",
                          },
                        ]}
                      />
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
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

export default MembersList;
