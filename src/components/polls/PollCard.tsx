import React from "react";
import Link from "next/link";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { formatDistanceToNow } from "date-fns";

interface PollCardProps {
  id: string;
  title: string;
  description: string;
  author: {
    id: string;
    name: string;
    image?: string;
  };
  totalVotes: number;
  categories: string[];
  createdAt: Date;
  expiresAt?: Date;
  isPrivate?: boolean;
}

export const PollCard: React.FC<PollCardProps> = ({
  id,
  title,
  description,
  author,
  totalVotes,
  categories,
  createdAt,
  expiresAt,
  isPrivate,
}) => {
  const isExpired = expiresAt ? new Date() > expiresAt : false;
  const timeAgo = formatDistanceToNow(createdAt, { addSuffix: true });

  return (
    <Card className="p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3">
        <Link href={`/polls/${id}`} className="block">
          <h3 className="text-lg font-semibold hover:text-blue-600 transition-colors">
            {title}
          </h3>
        </Link>
        <div className="flex gap-2">
          {isPrivate && (
            <Badge variant="outline" className="text-xs bg-gray-100">
              Private
            </Badge>
          )}
          {isExpired && (
            <Badge
              variant="outline"
              className="text-xs bg-red-100 text-red-800"
            >
              Closed
            </Badge>
          )}
        </div>
      </div>

      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{description}</p>

      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <Badge key={category} className="bg-blue-100 text-blue-800 text-xs">
            {category}
          </Badge>
        ))}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-gray-100">
        <div className="flex items-center gap-2">
          <Avatar src={author.image} alt={author.name} size="sm" />
          <span className="text-sm text-gray-600">
            <Link
              href={`/profile/${author.id}`}
              className="font-medium hover:underline"
            >
              {author.name}
            </Link>
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-gray-500">
          <span>{totalVotes} votes</span>
          <span>{timeAgo}</span>
        </div>
      </div>
    </Card>
  );
};
