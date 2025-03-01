import React from "react";
import Link from "next/link";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { Users, Lock, MessageSquare, Calendar } from "lucide-react";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
}

interface GroupCardProps {
  id: string;
  name: string;
  description: string;
  coverImage?: string;
  isPrivate: boolean;
  memberCount: number;
  topics: string[];
  recentMembers: GroupMember[];
  lastActivity: string;
  currentUserIsMember?: boolean;
  onJoinClick?: () => void;
}

export const GroupCard: React.FC<GroupCardProps> = ({
  id,
  name,
  description,
  coverImage,
  isPrivate,
  memberCount,
  topics,
  recentMembers,
  lastActivity,
  currentUserIsMember = false,
  onJoinClick,
}) => {
  const formattedLastActivity = new Date(lastActivity).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <Card className="mb-4 overflow-hidden">
      {coverImage && (
        <div
          className="h-32 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImage})` }}
        />
      )}
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <Link href={`/groups/${id}`}>
            <h3 className="text-xl font-bold hover:text-blue-600 flex items-center">
              {name}
              {isPrivate && <Lock size={16} className="ml-2 text-gray-500" />}
            </h3>
          </Link>

          {!currentUserIsMember && onJoinClick && (
            <Button onClick={onJoinClick} size="sm">
              Join Group
            </Button>
          )}

          {currentUserIsMember && (
            <Badge className="bg-green-100 text-green-800 border-green-300">
              Member
            </Badge>
          )}
        </div>

        <p className="text-gray-600 mb-4">{description}</p>

        {topics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {topics.map((topic) => (
              <Badge key={topic} variant="outline" className="text-sm">
                {topic}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div className="flex items-center">
            <Users size={16} className="mr-1 text-gray-500" />
            <span className="text-sm text-gray-500">{memberCount} members</span>
          </div>

          <div className="flex items-center text-sm text-gray-500">
            <Calendar size={16} className="mr-1" />
            <span>Active: {formattedLastActivity}</span>
          </div>
        </div>

        {recentMembers.length > 0 && (
          <div className="mt-4">
            <div className="flex -space-x-2 overflow-hidden">
              {recentMembers.map((member) => (
                <Avatar
                  key={member.id}
                  src={member.avatar}
                  alt={member.name}
                  className="border-2 border-white"
                  size="sm"
                />
              ))}
              {memberCount > recentMembers.length && (
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-xs text-gray-600 border-2 border-white">
                  +{memberCount - recentMembers.length}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default GroupCard;
