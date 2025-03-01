import React from "react";
import Link from "next/link";
import { Group } from "@/types/group";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { useAuth } from "@/hooks/useAuth";
import { useGroup } from "@/hooks/useGroup";

interface GroupCardProps {
  group: Group;
  compact?: boolean;
}

const GroupCard: React.FC<GroupCardProps> = ({ group, compact = false }) => {
  const { user } = useAuth();
  const { joinGroup, leaveGroup } = useGroup();

  const isGroupMember = group.members?.some(
    (member) => member.userId === user?.id
  );
  const isGroupOwner = group.ownerId === user?.id;

  const handleJoinLeave = async () => {
    if (isGroupMember) {
      await leaveGroup(group.id);
    } else {
      await joinGroup(group.id);
    }
  };

  if (compact) {
    return (
      <Link href={`/groups/${group.id}`} className="block">
        <Card className="p-3 hover:shadow-md transition-shadow duration-200">
          <div className="flex items-center space-x-3">
            <Avatar
              src={group.avatarUrl}
              alt={group.name}
              size="sm"
              fallback={group.name.charAt(0)}
            />
            <div className="flex-1 min-w-0">
              <h3 className="text-sm font-medium truncate">{group.name}</h3>
              <p className="text-xs text-gray-500 truncate">
                {group.memberCount} members
              </p>
            </div>
            {group.isPrivate && <Badge variant="secondary">Private</Badge>}
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Card className="overflow-hidden">
      <div
        className="h-32 bg-gradient-to-r from-blue-500 to-purple-500"
        style={{
          backgroundImage: group.bannerUrl
            ? `url(${group.bannerUrl})`
            : undefined,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />
      <div className="p-4">
        <div className="flex items-start -mt-10">
          <Avatar
            src={group.avatarUrl}
            alt={group.name}
            size="lg"
            className="border-4 border-white"
            fallback={group.name.charAt(0)}
          />
          <div className="ml-4 mt-10 flex-1">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold">{group.name}</h3>
                <div className="flex items-center mt-1 space-x-2">
                  <p className="text-sm text-gray-500">
                    {group.memberCount} members
                  </p>
                  {group.isPrivate && <Badge>Private</Badge>}
                </div>
              </div>
              {!isGroupOwner && (
                <Button
                  variant={isGroupMember ? "outline" : "default"}
                  onClick={handleJoinLeave}
                >
                  {isGroupMember ? "Leave" : "Join"}
                </Button>
              )}
              {isGroupOwner && (
                <Link href={`/groups/${group.id}/edit`}>
                  <Button variant="outline">Manage</Button>
                </Link>
              )}
            </div>
            {!compact && (
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {group.description}
              </p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <Link
            href={`/groups/${group.id}`}
            className="text-sm text-blue-600 hover:underline"
          >
            View Group
          </Link>
        </div>
      </div>
    </Card>
  );
};

export default GroupCard;
