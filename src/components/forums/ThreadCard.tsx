import React from "react";
import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { MessageSquare, Eye } from "lucide-react";

interface ThreadCardProps {
  id: string;
  forumId: string;
  title: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  createdAt: string;
  lastReplyAt: string;
  replyCount: number;
  viewCount: number;
  isPinned?: boolean;
  isLocked?: boolean;
  excerpt?: string;
  tags?: string[];
}

export const ThreadCard: React.FC<ThreadCardProps> = ({
  id,
  forumId,
  title,
  author,
  createdAt,
  lastReplyAt,
  replyCount,
  viewCount,
  isPinned = false,
  isLocked = false,
  excerpt,
  tags = [],
}) => {
  const formattedCreatedAt = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedLastReplyAt = new Date(lastReplyAt).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );

  return (
    <Card className="mb-3 overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <Link href={`/forums/${forumId}/threads/${id}`}>
              <h3 className="text-lg font-bold hover:text-blue-600 mb-1 flex items-center">
                {isPinned && (
                  <Badge className="mr-2 bg-yellow-100 text-yellow-800 border-yellow-300">
                    Pinned
                  </Badge>
                )}
                {isLocked && (
                  <Badge className="mr-2 bg-red-100 text-red-800 border-red-300">
                    Locked
                  </Badge>
                )}
                {title}
              </h3>
            </Link>

            {excerpt && <p className="text-gray-600 text-sm mb-2">{excerpt}</p>}

            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-2">
                {tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}

            <div className="flex items-center text-sm text-gray-500">
              <Link
                href={`/profile/${author.id}`}
                className="flex items-center"
              >
                <Avatar
                  src={author.avatar}
                  alt={author.name}
                  size="sm"
                  className="mr-2"
                />
                <span className="font-medium">{author.name}</span>
              </Link>
              <span className="mx-2">•</span>
              <span>Started {formattedCreatedAt}</span>
            </div>
          </div>

          <div className="text-sm text-gray-500 text-right">
            <div className="flex items-center justify-end mb-1">
              <MessageSquare size={14} className="mr-1" />
              <span>{replyCount} replies</span>
            </div>
            <div className="flex items-center justify-end mb-1">
              <Eye size={14} className="mr-1" />
              <span>{viewCount} views</span>
            </div>
            <div>
              <span>Last reply: {formattedLastReplyAt}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ThreadCard;
