import React from "react";
import Link from "next/link";
import { Avatar } from "../ui/Avatar";
import { Button } from "../ui/Button";
import { Card } from "../ui/Card";
import { Badge } from "../ui/Badge";
import { ThumbsUp, ThumbsDown, MessageSquare, Share2 } from "lucide-react";

interface OpinionCardProps {
  id: string;
  title: string;
  content: string;
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  tags: string[];
  upvotes: number;
  downvotes: number;
  commentCount: number;
  createdAt: string;
  isDetailed?: boolean;
}

export const OpinionCard: React.FC<OpinionCardProps> = ({
  id,
  title,
  content,
  author,
  tags,
  upvotes,
  downvotes,
  commentCount,
  createdAt,
  isDetailed = false,
}) => {
  const formattedDate = new Date(createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const truncatedContent = isDetailed
    ? content
    : content.slice(0, 200) + (content.length > 200 ? "..." : "");

  return (
    <Card className="mb-4 overflow-hidden">
      <div className="p-4">
        <div className="flex items-center mb-3">
          <Avatar src={author.avatar} alt={author.name} className="mr-3" />
          <div>
            <Link
              href={`/profile/${author.id}`}
              className="font-medium text-blue-600 hover:text-blue-800"
            >
              {author.name}
            </Link>
            <p className="text-sm text-gray-500">{formattedDate}</p>
          </div>
        </div>

        <Link href={`/opinions/${id}`}>
          <h3 className="text-xl font-bold mb-2 hover:text-blue-600">
            {title}
          </h3>
        </Link>

        <div className="mb-4">
          <p className="text-gray-700">{truncatedContent}</p>
          {!isDetailed && content.length > 200 && (
            <Link
              href={`/opinions/${id}`}
              className="text-blue-600 hover:text-blue-800 font-medium"
            >
              Read more
            </Link>
          )}
        </div>

        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-sm">
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-200">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-600"
            >
              <ThumbsUp size={18} />
              <span>{upvotes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-600"
            >
              <ThumbsDown size={18} />
              <span>{downvotes}</span>
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="flex items-center gap-1 text-gray-600"
            >
              <MessageSquare size={18} />
              <span>{commentCount}</span>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center gap-1 text-gray-600"
          >
            <Share2 size={18} />
            <span>Share</span>
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default OpinionCard;
